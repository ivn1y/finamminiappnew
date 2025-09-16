'use client';

import { 
  QRScanResult, 
  QRCodeData, 
  QRValidationResult,
  QRReward 
} from '../types/qr';
import { User } from '../types/app';
import { 
  validateQRCode, 
  generateQRReward, 
  isDuplicateCode 
} from './qr-utils';

export interface QRScanRequest {
  code: string;
  userId: string;
}

export interface QRScanResponse {
  success: boolean;
  result?: QRScanResult;
  error?: string;
}

export interface QRHistoryResponse {
  success: boolean;
  history?: QRScanResult[];
  error?: string;
}

// Локальное хранилище для истории сканирования
const scanHistory: Map<string, QRScanResult[]> = new Map();

class QRApiService {
  private delay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Сканирование QR-кода
   */
  async scanQRCode(request: QRScanRequest): Promise<QRScanResponse> {
    await this.delay(200);

    try {
      // Валидация кода
      const validation: QRValidationResult = validateQRCode(request.code);
      
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error,
          result: {
            success: false,
            error: validation.error
          }
        };
      }

      const qrData = validation.data!;
      
      // Получение истории пользователя
      const userHistory = scanHistory.get(request.userId) || [];
      const userScannedCodes = userHistory.map(scan => scan.code).filter(Boolean);
      
      // Проверка на дубликат
      const isDuplicate = isDuplicateCode(request.code, userScannedCodes);
      
      // Генерация награды
      const reward = generateQRReward(qrData, isDuplicate);
      
      // Создание результата сканирования
      const scanResult: QRScanResult = {
        success: true,
        code: request.code,
        reward,
        isDuplicate
      };

      // Сохранение в историю
      userHistory.push(scanResult);
      scanHistory.set(request.userId, userHistory);

      return {
        success: true,
        result: scanResult
      };

    } catch (error) {
      console.error('QR scan error:', error);
      return {
        success: false,
        error: 'Ошибка при обработке QR-кода',
        result: {
          success: false,
          error: 'Ошибка при обработке QR-кода'
        }
      };
    }
  }

  /**
   * Получение истории сканирования пользователя
   */
  async getScanHistory(userId: string): Promise<QRHistoryResponse> {
    await this.delay(100);

    try {
      const history = scanHistory.get(userId) || [];
      
      return {
        success: true,
        history: [...history].reverse() // Новые сканирования сверху
      };
    } catch (error) {
      console.error('Get scan history error:', error);
      return {
        success: false,
        error: 'Ошибка при получении истории сканирования'
      };
    }
  }

  /**
   * Очистка истории сканирования
   */
  async clearScanHistory(userId: string): Promise<{ success: boolean; error?: string }> {
    await this.delay(100);

    try {
      scanHistory.delete(userId);
      return { success: true };
    } catch (error) {
      console.error('Clear scan history error:', error);
      return {
        success: false,
        error: 'Ошибка при очистке истории'
      };
    }
  }

  /**
   * Получение статистики сканирования
   */
  async getScanStats(userId: string): Promise<{
    success: boolean;
    stats?: {
      totalScanned: number;
      totalXP: number;
      badgesEarned: string[];
      lastScanDate?: string;
    };
    error?: string;
  }> {
    await this.delay(100);

    try {
      const history = scanHistory.get(userId) || [];
      
      const stats = {
        totalScanned: history.length,
        totalXP: history.reduce((sum, scan) => sum + (scan.reward?.xp || 0), 0),
        badgesEarned: history
          .map(scan => scan.reward?.badge)
          .filter(Boolean)
          .filter((badge, index, arr) => arr.indexOf(badge) === index), // Уникальные бейджи
        lastScanDate: history.length > 0 ? history[history.length - 1].code : undefined
      };

      return {
        success: true,
        stats
      };
    } catch (error) {
      console.error('Get scan stats error:', error);
      return {
        success: false,
        error: 'Ошибка при получении статистики'
      };
    }
  }

  /**
   * Проверка доступности камеры
   */
  async checkCameraAvailability(): Promise<{
    success: boolean;
    available: boolean;
    error?: string;
  }> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return {
          success: true,
          available: false,
          error: 'Камера не поддерживается в этом браузере'
        };
      }

      // Попытка получить доступ к камере
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Останавливаем поток сразу после проверки
      stream.getTracks().forEach(track => track.stop());
      
      return {
        success: true,
        available: true
      };
    } catch (error) {
      return {
        success: true,
        available: false,
        error: 'Нет доступа к камере или камера занята'
      };
    }
  }

  /**
   * Генерация тестовых QR-кодов
   */
  async generateTestCodes(): Promise<{
    success: boolean;
    codes?: string[];
    error?: string;
  }> {
    await this.delay(100);

    try {
      const testCodes = [
        'FINAM:TRADER_2024',
        'FINAM:STARTUP_ZONE_A',
        'FINAM:EXPERT_MENTOR_2024',
        'FINAM:PARTNER_BUSINESS',
        'FINAM:EVENT_MAIN_STAGE',
        'FINAM:ZONE_NETWORKING',
        'FINAM:DEMO_PITCH_2024'
      ];

      return {
        success: true,
        codes: testCodes
      };
    } catch (error) {
      console.error('Generate test codes error:', error);
      return {
        success: false,
        error: 'Ошибка при генерации тестовых кодов'
      };
    }
  }
}

export const qrApiService = new QRApiService();
