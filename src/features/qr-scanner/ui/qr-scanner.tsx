'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Button } from '@/shared/ui/button'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { QRScanResult } from '@/shared/types/qr'
import jsQR from 'jsqr'

interface QRScannerProps {
  onSuccess: (result: QRScanResult) => void
  onClose: () => void
  userId: string
}

export const QRScanner: React.FC<QRScannerProps> = ({ onSuccess, onClose, userId }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  const [isScanning, setIsScanning] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null)
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'found' | 'invalid'>('idle')

  // Очистка ресурсов
  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsCameraActive(false)
    setIsScanning(false)
  }, [])

  // Запуск камеры
  const startCamera = useCallback(async () => {
    try {
      setIsInitializing(true)
      setError(null)
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Браузер не поддерживает доступ к камере')
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 640, min: 320 },
          height: { ideal: 480, min: 240 }
        }
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        
        videoRef.current.onloadedmetadata = () => {
          setIsCameraActive(true)
          setIsInitializing(false)
        }

        videoRef.current.onerror = () => {
          setError('Ошибка воспроизведения видео')
          setIsInitializing(false)
        }

        try {
          await videoRef.current.play()
        } catch (playError) {
          setError('Ошибка запуска воспроизведения видео')
          setIsInitializing(false)
        }
      } else {
        setError('Ошибка инициализации видео элемента')
        setIsInitializing(false)
      }
    } catch (err: any) {
      let errorMessage = 'Не удалось получить доступ к камере'
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Доступ к камере запрещен. Разрешите доступ в настройках браузера'
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'Камера не найдена'
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Камера используется другим приложением'
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Камера не поддерживает требуемые параметры'
      } else if (err.name === 'SecurityError') {
        errorMessage = 'Ошибка безопасности при доступе к камере'
      }
      
      setError(errorMessage)
      setIsInitializing(false)
    }
  }, [])

  // Остановка камеры
  const stopCamera = useCallback(() => {
    cleanup()
  }, [cleanup])

  // Запуск сканирования
  const startScan = useCallback(() => {
    setError(null)
    setLastScannedCode(null)
    setScanStatus('idle')
    
    if (!isCameraActive) {
      startCamera()
    }
    
    setIsScanning(true)
    setScanStatus('scanning')
  }, [isCameraActive, startCamera])

  // Остановка сканирования
  const stopScan = useCallback(() => {
    setIsScanning(false)
    stopCamera()
  }, [stopCamera])

  // Обработка успешного сканирования
  const handleQRSuccess = useCallback((code: string) => {
    console.log('🎯 handleQRSuccess вызвана с кодом:', code)
    console.log('🎯 Источник вызова:', new Error().stack)
    
    const result: QRScanResult = {
      success: code.startsWith('FINAM:'),
      code,
      reward: code.startsWith('FINAM:') ? {
        xp: 50,
        badge: 'qr_scanner_badge',
        message: `QR-код отсканирован! (+50 XP)`,
        isNewBadge: true
      } : undefined,
      error: code.startsWith('FINAM:') ? undefined : `Неверный формат QR-кода: ${code}. Ожидается код, начинающийся с "FINAM:"`
    }

    console.log('🎯 Результат для onSuccess:', result)
    onSuccess(result)
    stopScan()
  }, [onSuccess, stopScan])

  // Сканирование кадров
  const scanFrame = useCallback(() => {
    try {
      if (!isScanning || !isCameraActive || !videoRef.current || !canvasRef.current) {
        return
      }

      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      if (!ctx) return

      // Проверяем, что видео имеет корректные размеры
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        requestAnimationFrame(scanFrame)
        return
      }

      // Устанавливаем размеры canvas
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Рисуем кадр на canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Распознавание QR-кода с помощью jsQR
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)
      
      // Логируем каждый кадр для отладки
      if (code) {
        console.log('🔍 QR-код найден:', code.data)
        setLastScannedCode(code.data)
        
        // Проверяем, что код начинается с FINAM:
        if (code.data.startsWith('FINAM:')) {
          console.log('✅ Валидный FINAM код:', code.data)
          setScanStatus('found')
          setError(null)
          
          // Останавливаем сканирование
          setIsScanning(false)
          
          // Добавляем задержку 2 секунды для показа зеленой рамки
          setTimeout(() => {
            handleQRSuccess(code.data)
          }, 2000)
        } else {
          console.log('❌ Неверный формат кода:', code.data)
          setScanStatus('invalid')
          setError(`Неверный формат QR-кода: ${code.data}. Ожидается код, начинающийся с "FINAM:"`)
          
          // Останавливаем сканирование
          setIsScanning(false)
          
          // Добавляем задержку 2 секунды для показа красной рамки
          setTimeout(() => {
            handleQRSuccess(code.data)
          }, 2000)
        }
      } else {
        // Нет QR-кода в кадре - логируем только каждые 30 кадров чтобы не засорять консоль
        if (Math.random() < 0.03) {
          console.log('🔍 Сканирование... QR-код не найден в кадре')
        }
        setScanStatus('scanning')
        setLastScannedCode(null)
      }

      // Планируем следующий кадр
      requestAnimationFrame(scanFrame)
    } catch (error) {
      console.error('❌ Ошибка в scanFrame:', error)
      setError('Ошибка сканирования: ' + (error instanceof Error ? error.message : String(error)))
    }
  }, [isScanning, isCameraActive, handleQRSuccess])

  // Эффект для автоматического запуска камеры при открытии
  useEffect(() => {
    console.log('🔧 QRScanner: useEffect для автоматического запуска', { isScanning, isCameraActive })
    if (!isCameraActive && !isInitializing) {
      console.log('🔧 QRScanner: Запускаем камеру автоматически')
      startCamera()
    }
  }, [isCameraActive, isInitializing, startCamera])

  // Эффект для автоматического запуска сканирования после активации камеры
  useEffect(() => {
    console.log('🔧 QRScanner: useEffect для автоматического запуска сканирования', { isCameraActive, isScanning })
    if (isCameraActive && !isScanning) {
      console.log('🔧 QRScanner: Камера активна, запускаем сканирование автоматически')
      setIsScanning(true)
      setScanStatus('scanning')
    }
  }, [isCameraActive, isScanning])

  // Эффект для сканирования
  useEffect(() => {
    if (isScanning && isCameraActive) {
      scanFrame()
    }
  }, [isScanning, isCameraActive, scanFrame])

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Заголовок */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2 className="text-white text-lg font-semibold">Сканер QR-кода</h2>
            <p className="text-gray-300 text-sm">
              Отсканировано: 0 • XP: 0
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              isCameraActive 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {isCameraActive ? 'Камера активна' : 'Камера неактивна'}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-white border-white hover:bg-white hover:text-black"
            >
              ✕
            </Button>
          </div>
        </div>
      </div>

      {/* Видео */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
          autoPlay
        />
        
        {/* Скрытый canvas для обработки кадров */}
        <canvas
          ref={canvasRef}
          className="hidden"
        />

        {/* Рамка для сканирования */}
        {isScanning && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-64 h-64 border-2 rounded-lg relative ${
              scanStatus === 'found' ? 'border-green-500 bg-green-500/20' :
              scanStatus === 'invalid' ? 'border-red-500 bg-red-500/20' :
              'border-white'
            }`}>
              <div className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 rounded-tl-lg ${
                scanStatus === 'found' ? 'border-green-500' :
                scanStatus === 'invalid' ? 'border-red-500' :
                'border-white'
              }`}></div>
              <div className={`absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 rounded-tr-lg ${
                scanStatus === 'found' ? 'border-green-500' :
                scanStatus === 'invalid' ? 'border-red-500' :
                'border-white'
              }`}></div>
              <div className={`absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 rounded-bl-lg ${
                scanStatus === 'found' ? 'border-green-500' :
                scanStatus === 'invalid' ? 'border-red-500' :
                'border-white'
              }`}></div>
              <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 rounded-br-lg ${
                scanStatus === 'found' ? 'border-green-500' :
                scanStatus === 'invalid' ? 'border-red-500' :
                'border-white'
              }`}></div>
              
              {/* Статус сканирования */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  {scanStatus === 'scanning' && (
                    <div className="text-white text-sm">
                      <div className="animate-pulse">🔍 Сканирование...</div>
                    </div>
                  )}
                  {scanStatus === 'found' && (
                    <div className="text-green-400 text-sm font-bold">
                      <div className="animate-pulse">✅ QR-код найден!</div>
                    </div>
                  )}
                  {scanStatus === 'invalid' && (
                    <div className="text-red-400 text-sm font-bold">
                      <div className="animate-pulse">❌ Неверный код</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Панель управления */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          {/* Статус сканирования */}
          {lastScannedCode && (
            <Alert className={`${
              scanStatus === 'found' ? 'bg-green-500/20 border-green-500 text-green-100' :
              scanStatus === 'invalid' ? 'bg-red-500/20 border-red-500 text-red-100' :
              'bg-blue-500/20 border-blue-500 text-blue-100'
            }`}>
              <AlertDescription>
                <div className="flex items-center gap-2">
                  <span>
                    {scanStatus === 'found' ? '✅' : 
                     scanStatus === 'invalid' ? '❌' : '🔍'}
                  </span>
                  <span className="font-mono text-xs break-all">
                    {lastScannedCode}
                  </span>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="bg-red-500/20 border-red-500 text-red-100">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-4">
            {!isScanning ? (
              <Button
                onClick={startScan}
                disabled={isInitializing}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isInitializing ? 'Инициализация...' : 'Начать сканирование'}
              </Button>
            ) : (
              <>
                <Button
                  onClick={stopScan}
                  variant="outline"
                  className="flex-1 border-white text-white hover:bg-white hover:text-black"
                >
                  Остановить сканирование
                </Button>
                <Button
                  onClick={() => {
                    const testCode = 'FINAM:TEST_' + Math.random().toString(36).substr(2, 9)
                    console.log('🧪 Кнопка "Тест QR-кода" нажата, генерируем код:', testCode)
                    handleQRSuccess(testCode)
                  }}
                  variant="secondary"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Тест QR-кода
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}