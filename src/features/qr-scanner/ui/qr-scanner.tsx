'use client'

import React, { useState } from 'react'
import Image from 'next/image'
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
    <div className="fixed inset-0 z-50 flex flex-col items-center bg-black p-5 overflow-y-auto">
      <div
        className="absolute rounded-full"
        style={{
          top: '301px',
          left: '52px',
          width: '284px',
          height: '205px',
          borderRadius: '284px',
          opacity: 0.55,
          background: 'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)',
          filter: 'blur(80px)',
        }}
      />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
        aria-label="Закрыть"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="flex flex-col items-center w-full max-w-[393px] mx-auto">
        <h1 
          className="text-white text-center font-inter-tight text-[30px] font-normal leading-[1.1] tracking-[-0.6px] mt-[80px]"
          style={{ lineHeight: '110%' }}
        >
          Введи секретную фразу
        </h1>

        <p 
          className="text-[rgba(255,255,255,0.72)] text-center font-inter text-[17px] font-normal leading-[24px] tracking-[-0.17px] mt-[14px] max-w-[336px]"
          style={{ letterSpacing: '-0.17px' }}
        >
          Секретная фраза спрятана в одной из локаций на конференции. Найди ее и введи ниже
        </p>
        
        <div className="mt-[43px] w-[250px] h-[250px] aspect-square flex-shrink-0">
          <Image
            src="/assets/gifts/gift.png"
            alt="Подарок"
            width={250}
            height={250}
            className="object-cover"
          />
        </div>

        <div 
          className="flex w-full max-w-[353px] p-[8px_12px_8px_16px] items-center gap-x-2 rounded-lg border border-solid border-[#373740] bg-[rgba(79,79,89,0.16)] mt-[70px]"
        >
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Введи фразу"
            className="w-full bg-transparent text-white placeholder:text-[#6F6F7C] font-inter text-[16px] leading-[24px] tracking-[-0.128px] focus:outline-none"
            autoFocus
          />
        </div>

        <button
          onClick={handleConfirm}
          disabled={inputValue.trim().length === 0}
          className="flex w-full max-w-[353px] p-[16px_24px] justify-center items-center rounded-lg mt-[20px] text-white font-semibold text-[17px] leading-[24px] tracking-[-0.204px] disabled:opacity-50"
          style={{
            background: 'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)'
          }}
        >
          Отправить
        </button>
      </div>
    </div>
  )
}
