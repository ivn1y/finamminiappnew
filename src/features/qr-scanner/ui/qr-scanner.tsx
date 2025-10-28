'use client'

import React, { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { QRScanResult } from '@/shared/types/qr'
import { X } from 'lucide-react'

interface QRScannerProps {
  onSuccess: (result: QRScanResult) => void
  onClose: () => void
  userId: string
}

export const QRScanner: React.FC<QRScannerProps> = ({ onSuccess, onClose }) => {
  const [inputValue, setInputValue] = useState('')

  const handleSuccess = (code: string) => {
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
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  }

  const SECRET_PHRASE = 'Финам Collab твои возможности'
  
  const handleConfirm = () => {
    const userInput = inputValue.trim()
    if (userInput.length > 0) {
      // Проверяем, совпадает ли введенная фраза с секретной (без учета регистра)
      if (userInput.toLowerCase() === SECRET_PHRASE.toLowerCase()) {
        handleSuccess(`FINAM:${SECRET_PHRASE}`)
      } else {
        // Неправильная фраза - можно показать ошибку или просто не подтверждать
        alert('Неверная секретная фраза')
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" style={{ width: 393, height: 903, background: '#000' }}>
      <div className="absolute inset-0">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Закрыть"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <h1 className="absolute text-center text-white font-inter-tight text-[30px] font-normal leading-[110%] tracking-[-0.6px] whitespace-pre-line"
            style={{ top: 80, left: 19, width: 354 }}>
          Введи секретную фразу
        </h1>

        <p className="absolute text-center text-[rgba(255,255,255,0.72)] font-inter text-[17px] font-normal leading-[24px] tracking-[-0.17px]"
           style={{ top: 170, left: 28, width: 336 }}>
          Секретная фраза будет отправлена после подтверждения
        </p>

        {/* Gradient background */}
        <div className="absolute rounded-full"
             style={{
               top: 300,
               left: 52,
               width: 284,
               height: 205,
               opacity: 0.17,
               background: 'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)',
               filter: 'blur(80px)',
             }} />

        {/* Input field */}
        <div className="absolute flex items-center gap-x-2 rounded-lg border border-solid border-[#373740] bg-[rgba(79,79,89,0.16)]"
             style={{ top: 500, left: 20, width: 353, padding: '12px 16px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Секретная фраза"
            className="w-full bg-transparent text-white placeholder:text-[#6F6F7C] font-inter text-[16px] leading-[24px] tracking-[-0.128px] focus:outline-none"
            autoFocus
          />
          <Button
            onClick={handleConfirm}
            disabled={inputValue.trim().length === 0}
            size="sm"
            className="bg-[rgba(79,79,89,0.8)] hover:bg-[rgba(79,79,89,1)] text-white disabled:opacity-50"
          >
            Подтвердить
          </Button>
        </div>
      </div>
    </div>
  )
}
