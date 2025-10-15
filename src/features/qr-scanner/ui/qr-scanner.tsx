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

export const QRScanner: React.FC<QRScannerProps> = ({ onSuccess, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameId = useRef<number | null>(null)

  const [error, setError] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')

  const stopCameraAndScan = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
      animationFrameId.current = null
    }
  }, [])

  const handleSuccess = useCallback((code: string) => {
    stopCameraAndScan()
    onSuccess({
      success: true,
      code,
      reward: {
        xp: 50,
        badge: 'qr_scanner_badge',
        message: `Код принят! (+50 XP)`,
        isNewBadge: true
      }
    })
  }, [onSuccess, stopCameraAndScan])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value === '123help') {
      handleSuccess('FINAM:123help');
    }
  }

  const scanFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.readyState < 2) {
      animationFrameId.current = requestAnimationFrame(scanFrame)
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d', { willReadFrequently: true })

    if (context) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)

      if (code?.data?.startsWith('FINAM:')) {
        setTimeout(() => handleSuccess(code.data), 500)
      } else {
        animationFrameId.current = requestAnimationFrame(scanFrame)
      }
    }
  }, [handleSuccess])

  const startCamera = useCallback(async () => {
    setError(null)
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Ваш браузер не поддерживает доступ к камере.')
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        await videoRef.current.play().catch(console.error)
        animationFrameId.current = requestAnimationFrame(scanFrame)
      }
    } catch (err: any) {
      let errorMessage = 'Не удалось получить доступ к камере. Попробуйте обновить страницу или проверить настройки.'
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Доступ к камере запрещен. Пожалуйста, разрешите доступ в настройках вашего браузера.'
      }
      setError(errorMessage)
    }
  }, [scanFrame])

  useEffect(() => {
    startCamera()
    return () => stopCameraAndScan()
  }, [startCamera, stopCameraAndScan])

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" style={{ width: 393, height: 903, background: '#000' }}>
      <canvas ref={canvasRef} className="hidden" />

      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
          <Alert variant="destructive" className="bg-red-900/50 border-red-700 max-w-sm">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button
            variant="outline"
            size="lg"
            onClick={onClose}
            className="mt-4 bg-black/50 text-white border-white/50 hover:bg-white hover:text-black"
          >
            Закрыть
          </Button>
        </div>
      ) : (
        <div className="absolute inset-0">
          <h1 className="absolute text-center text-white font-inter-tight text-[30px] font-normal leading-[110%] tracking-[-0.6px] whitespace-pre-line"
              style={{ top: 40, left: 19, width: 354 }}>
            {`Наведите камеру\nна QR-код\nили введи код ниже`}
          </h1>

          <p className="absolute text-center text-[rgba(255,255,255,0.72)] font-inter text-[17px] font-normal leading-[24px] tracking-[-0.17px]"
             style={{ top: 153, left: 28, width: 336 }}>
            QR-код должен быть в рамке
          </p>
          
          <div className="absolute rounded-[25px] overflow-hidden" style={{ top: 243, left: 75, width: 241, height: 244 }}>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
              autoPlay
            />
          </div>
          <div className="absolute rounded-[25px] border border-solid border-white opacity-50 pointer-events-none"
               style={{ top: 243, left: 75, width: 241, height: 244 }} />

          <div className="absolute rounded-full"
               style={{
                 top: 472,
                 left: 52,
                 width: 284,
                 height: 205,
                 opacity: 0.17,
                 background: 'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)',
                 filter: 'blur(80px)',
               }} />

          <div className="absolute flex items-center gap-x-2 rounded-lg border border-solid border-[#373740] bg-[rgba(79,79,89,0.16)]"
               style={{ top: 537, left: 20, width: 353, padding: '8px 16px' }}>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Введите код"
              className="w-full bg-transparent text-white placeholder:text-[#6F6F7C] font-inter text-[16px] leading-[24px] tracking-[-0.128px] focus:outline-none"
            />
            <Button
              onClick={() => handleSuccess(`FINAM:${inputValue}`)}
              disabled={inputValue.length === 0}
              size="sm"
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              Подтвердить
            </Button>
          </div>
          
        </div>
      )}
    </div>
  )
}