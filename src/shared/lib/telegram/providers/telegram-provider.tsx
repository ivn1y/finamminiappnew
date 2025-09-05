'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  added_to_attachment_menu?: boolean
  allows_write_to_pm?: boolean
  photo_url?: string
}

interface TelegramContextType {
  isTelegramWebApp: boolean
  telegramUser: TelegramUser | null
  isReady: boolean
  webApp: any
}

const TelegramContext = createContext<TelegramContextType>({
  isTelegramWebApp: false,
  telegramUser: null,
  isReady: false,
  webApp: null,
})

export function useTelegram() {
  const context = useContext(TelegramContext)
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider')
  }
  return context
}

interface TelegramProviderProps {
  children: ReactNode
}

export function TelegramProvider({ children }: TelegramProviderProps) {
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false)
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [webApp, setWebApp] = useState<any>(null)

  useEffect(() => {
    const checkTelegramWebApp = () => {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        setIsTelegramWebApp(true)
        setWebApp(window.Telegram.WebApp)
        
        const user = window.Telegram.WebApp.initDataUnsafe.user
        if (user) {
          setTelegramUser(user)
        }
        
        setIsReady(true)
        window.Telegram.WebApp.ready()
        window.Telegram.WebApp.expand()
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('telegram-ready'))
      } else {
        setIsTelegramWebApp(false)
        setIsReady(false)
      }
    }

    // Check immediately
    checkTelegramWebApp()

    // Check periodically in case Telegram WebApp loads later
    const interval = setInterval(checkTelegramWebApp, 100)

    // Cleanup
    return () => {
      clearInterval(interval)
    }
  }, [])

  const value: TelegramContextType = {
    isTelegramWebApp,
    telegramUser,
    isReady,
    webApp,
  }

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  )
}