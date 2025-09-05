'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/shared/ui/button'
import { isTelegramWebApp, getTelegramInitData } from '@/shared/lib/telegram/utils'
import { useState } from 'react'

export function TelegramAuthButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleTelegramAuth = async () => {
    if (!isTelegramWebApp()) {
      alert('Это приложение должно быть открыто в Telegram WebApp')
      return
    }

    const initData = getTelegramInitData()
    if (!initData) {
      alert('Не удалось получить данные инициализации Telegram')
      return
    }

    setIsLoading(true)
    try {
      const result = await signIn('telegram', {
        initData,
        callbackUrl: '/dashboard',
        redirect: true,
      })

      if (result?.error) {
        console.error('Auth error:', result.error)
        alert('Ошибка авторизации')
      }
    } catch (error) {
      console.error('Telegram auth error:', error)
      alert('Ошибка авторизации')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleTelegramAuth} 
      disabled={isLoading}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
    >
      {isLoading ? 'Авторизация...' : 'Войти через Telegram'}
    </Button>
  )
} 