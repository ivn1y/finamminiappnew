'use client';

import { useState, useEffect, useCallback } from 'react';
import { QRScanResult, QRScannerState, QRScannerConfig } from '../types/qr';
import { qrApiService } from '../lib/qr-api';

const defaultConfig: QRScannerConfig = {
  enableCamera: true,
  enableManualInput: true,
  enableDemoMode: true,
  autoCloseOnSuccess: true,
  showRewards: true
};

export function useQRScanner(userId: string, config: Partial<QRScannerConfig> = {}) {
  const [state, setState] = useState<QRScannerState>({
    isScanning: false,
    isCameraActive: false,
    scanHistory: [],
    totalScanned: 0,
    totalXP: 0,
    badgesEarned: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mergedConfig = { ...defaultConfig, ...config };

  // Загрузка истории сканирования при инициализации
  useEffect(() => {
    loadScanHistory();
  }, [userId]);

  const loadScanHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await qrApiService.getScanHistory(userId);
      
      if (response.success && response.history) {
        const history = response.history;
        const totalXP = history.reduce((sum, scan) => sum + (scan.reward?.xp || 0), 0);
        const badgesEarned = history
          .map(scan => scan.reward?.badge)
          .filter((badge): badge is string => Boolean(badge))
          .filter((badge, index, arr) => arr.indexOf(badge) === index);

        setState(prev => ({
          ...prev,
          scanHistory: history,
          totalScanned: history.length,
          totalXP,
          badgesEarned
        }));
      }
    } catch (err) {
      console.error('Failed to load scan history:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const scanQRCode = useCallback(async (code: string): Promise<QRScanResult> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await qrApiService.scanQRCode({
        code,
        userId
      });

      if (response.success && response.result) {
        const result = response.result;
        
        // Обновляем состояние
        setState(prev => {
          const newHistory = [...prev.scanHistory, result];
          const newTotalXP = prev.totalXP + (result.reward?.xp || 0);
          const newBadges = result.reward?.badge 
            ? [...prev.badgesEarned, result.reward.badge]
            : prev.badgesEarned;

          return {
            ...prev,
            scanHistory: newHistory,
            totalScanned: newHistory.length,
            totalXP: newTotalXP,
            badgesEarned: newBadges,
            lastScannedCode: code
          };
        });

        return result;
      } else {
        const errorResult: QRScanResult = {
          success: false,
          error: response.error || 'Неизвестная ошибка'
        };
        setError(response.error || 'Неизвестная ошибка');
        return errorResult;
      }
    } catch (err) {
      const errorMessage = 'Ошибка при сканировании QR-кода';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const startScanning = useCallback(() => {
    setState(prev => ({ ...prev, isScanning: true }));
    setError(null);
  }, []);

  const stopScanning = useCallback(() => {
    setState(prev => ({ ...prev, isScanning: false, isCameraActive: false }));
  }, []);

  const setCameraActive = useCallback((active: boolean) => {
    setState(prev => ({ ...prev, isCameraActive: active }));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await qrApiService.clearScanHistory(userId);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          scanHistory: [],
          totalScanned: 0,
          totalXP: 0,
          badgesEarned: []
        }));
      } else {
        setError(response.error || 'Ошибка при очистке истории');
      }
    } catch (err) {
      setError('Ошибка при очистке истории');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const checkCameraAvailability = useCallback(async () => {
    try {
      console.log('🔍 Проверка доступности камеры...');
      
      // Проверяем, поддерживает ли браузер getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log('❌ Браузер не поддерживает getUserMedia');
        return {
          success: false,
          available: false,
          error: 'Браузер не поддерживает доступ к камере'
        };
      }

      // Проверяем доступные устройства
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      console.log('📹 Найдено видеоустройств:', videoDevices.length);
      console.log('Устройства:', videoDevices.map(d => ({ label: d.label, deviceId: d.deviceId })));

      if (videoDevices.length === 0) {
        console.log('❌ Видеокамеры не найдены');
        return {
          success: false,
          available: false,
          error: 'Видеокамеры не найдены'
        };
      }

      // Пробуем получить доступ к камере с минимальными требованиями
      console.log('🎥 Тестируем доступ к камере...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { min: 320, ideal: 640 },
          height: { min: 240, ideal: 480 }
        }
      });

      console.log('✅ Доступ к камере получен успешно');
      
      // Останавливаем тестовый поток
      stream.getTracks().forEach(track => track.stop());
      
      return {
        success: true,
        available: true,
        devices: videoDevices.length
      };
    } catch (err: any) {
      console.error('❌ Ошибка при проверке камеры:', err);
      
      let errorMessage = 'Неизвестная ошибка';
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Доступ к камере запрещен. Разрешите доступ в настройках браузера';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'Камера не найдена';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Камера используется другим приложением';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Камера не поддерживает требуемые параметры';
      } else if (err.name === 'SecurityError') {
        errorMessage = 'Ошибка безопасности при доступе к камере';
      }
      
      return {
        success: false,
        available: false,
        error: errorMessage
      };
    }
  }, []);

  const generateTestCodes = useCallback(async () => {
    try {
      const response = await qrApiService.generateTestCodes();
      return response;
    } catch (err) {
      return {
        success: false,
        error: 'Ошибка при генерации тестовых кодов'
      };
    }
  }, []);

  return {
    // Состояние
    state,
    isLoading,
    error,
    config: mergedConfig,
    
    // Действия
    scanQRCode,
    startScanning,
    stopScanning,
    setCameraActive,
    clearError,
    clearHistory,
    loadScanHistory,
    checkCameraAvailability,
    generateTestCodes
  };
}
