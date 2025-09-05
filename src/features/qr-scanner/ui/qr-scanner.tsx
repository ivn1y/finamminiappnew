'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, Type } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Alert, AlertDescription } from '@/shared/ui/alert';

interface QRScannerProps {
  onSuccess: (code: string) => void;
  onClose: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onSuccess, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [manualCode, setManualCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.log('Camera access denied or not available');
        setShowManualInput(true);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      onSuccess(manualCode.trim());
      setError('');
    } else {
      setError('Введите код');
    }
  };

  const handleDemoQR = () => {
    const demoCodes = ['FINAM_A_2024', 'FINAM_B_2024', 'STARTUP_ZONE_2024'];
    const randomCode = demoCodes[Math.floor(Math.random() * demoCodes.length)];
    onSuccess(randomCode);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/80 text-white">
        <h2 className="text-lg font-semibold">Сканер QR-кода</h2>
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative">
        {!showManualInput ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-white rounded-lg relative">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />
              </div>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-20 left-0 right-0 text-center text-white px-4">
              <p className="text-lg font-medium mb-2">Наведите камеру на QR-код</p>
              <p className="text-sm opacity-80">QR-код должен быть в рамке</p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-sm">
              <div className="text-center text-white mb-6">
                <Type className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Введите код вручную</h3>
                <p className="text-sm opacity-80">
                  Если камера недоступна, введите код с QR-кода
                </p>
              </div>
              
              <div className="space-y-4">
                <Input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Введите код QR"
                  className="text-center font-mono bg-white text-gray-900"
                  autoFocus
                />
                
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <Button
                  onClick={handleManualSubmit}
                  className="w-full"
                >
                  Подтвердить
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="p-4 bg-black/80">
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowManualInput(!showManualInput)}
            variant="outline"
            className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            {showManualInput ? (
              <>
                <Camera className="w-5 h-5 mr-2" />
                Камера
              </>
            ) : (
              <>
                <Type className="w-5 h-5 mr-2" />
                Вручную
              </>
            )}
          </Button>
          
          <Button
            onClick={handleDemoQR}
            className="flex-1"
          >
            Демо QR
          </Button>
        </div>
      </div>
    </div>
  );
};
