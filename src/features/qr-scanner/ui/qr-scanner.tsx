'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { QRScanResult } from '@/shared/types/qr'

interface QRScannerProps {
  onSuccess: (result: QRScanResult) => void
  onClose: () => void
  userId: string
}

export const QRScanner: React.FC<QRScannerProps> = ({ onSuccess, onClose }) => {
  const [inputValue, setInputValue] = useState('')
  const [isInputFocused, setIsInputFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

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

  const SECRET_PHRASE = 'Финам Коллаб твои возможности'
  
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

  // Функция для прокрутки к полю ввода при фокусе (для мобильных устройств)
  const handleInputFocus = () => {
    setIsInputFocused(true);
    // Используем requestAnimationFrame для того, чтобы скролл произошел после появления клавиатуры
    requestAnimationFrame(() => {
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }, 300); // Небольшая задержка для появления клавиатуры
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black p-5 overflow-y-auto">
      <div
        className="absolute rounded-full"
        style={{
          top: '261px',
          left: '52px',
          width: '284px',
          height: '205px',
          borderRadius: '284px',
          opacity: 0.55,
          background: 'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="flex flex-col items-center w-full max-w-[393px] mx-auto py-8">
        <h1 
          className="text-white text-center font-inter-tight text-[30px] font-normal leading-[1.1] tracking-[-0.6px]"
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
        
        <div className="mt-[32px] w-[240px] h-[240px] aspect-square flex-shrink-0">
          <Image
            src="/assets/gifts/gift.png"
            alt="Подарок"
            width={240}
            height={240}
            className="object-cover"
          />
        </div>

        <div 
          className="relative w-[353px] h-[56px] mt-[52px]"
        >
          {isInputFocused && (
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)',
                borderRadius: '8px',
                padding: '2px',
              }}
            >
              <div 
                className="w-full h-full"
                style={{
                  backgroundColor: '#000',
                  borderRadius: '6px',
                }}
              />
            </div>
          )}
          <div 
            className={`relative flex w-full h-full p-[8px_12px_8px_16px] items-center gap-x-2 rounded-lg border border-solid ${isInputFocused ? 'border-transparent bg-transparent' : 'border-[#373740] bg-[rgba(79,79,89,0.16)]'}`}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onFocus={handleInputFocus}
              onBlur={() => setIsInputFocused(false)}
              placeholder="Введи фразу"
              className="w-full h-full bg-transparent text-white placeholder:text-[#6F6F7C] font-inter text-[16px] leading-[24px] tracking-[-0.128px] focus:outline-none relative z-10"
              autoFocus
            />
          </div>
        </div>

        <button
          onClick={handleConfirm}
          className="flex w-full max-w-[353px] h-[56px] justify-center items-center rounded-[8px] text-center font-inter text-[17px] font-semibold leading-[24px] tracking-[-0.204px] text-white mt-[10px] mb-[20px]"
          style={{
            padding: '16px 24px',
            background: inputValue.trim().length > 0
              ? 'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)'
              : 'rgba(79, 79, 89, 0.24)'
          }}
        >
          Отправить
        </button>

        <button
          onClick={onClose}
          className="flex w-full max-w-[353px] h-[56px] p-[16px_24px] justify-center items-center rounded-lg text-white font-inter text-[17px] font-semibold leading-[24px] tracking-[-0.204px] mb-[50px]"
          style={{
            borderRadius: '8px',
            background: 'rgba(79, 79, 89, 0.24)'
          }}
        >
          Назад
        </button>
      </div>
    </div>
  )
}
