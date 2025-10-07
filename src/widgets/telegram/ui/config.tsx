'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import { isTelegramWebApp } from '@/shared/lib/telegram/utils'

export function WebAppConfigurator() {
  const { setTheme } = useTheme()

  useEffect(() => {
    // Ждем загрузки Telegram WebApp скрипта
    const waitForTelegramScript = () => {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        initializeTelegramWebApp()
      } else {
        // Повторяем попытку через 100мс
        setTimeout(waitForTelegramScript, 100)
      }
    }

    const initializeTelegramWebApp = () => {
      if (!isTelegramWebApp()) {
        return
      }

      const webApp = window.Telegram?.WebApp
      if (!webApp) {
        return
      }

      // Инициализация Telegram WebApp
      webApp.ready()
      
      // Настройка темы
      webApp.expand()
      
      // Включение подтверждения закрытия
      webApp.enableClosingConfirmation()
      
      // Определяем тему на основе Telegram WebApp
      const isDarkTheme = webApp.themeParams.bg_color === '#1c1c1c' || 
                         webApp.themeParams.bg_color === '#000000' ||
                         webApp.themeParams.bg_color === '#212121'
      
      // Устанавливаем тему через next-themes
      setTheme(isDarkTheme ? 'dark' : 'light')
      
      console.log('[TelegramWebApp] Initialized successfully')
      console.log('[TelegramWebApp] User:', webApp.initDataUnsafe.user)
      console.log('[TelegramWebApp] Theme:', webApp.themeParams)
      console.log('[TelegramWebApp] Is Dark Theme:', isDarkTheme)
      
      // Проверяем, является ли это новым пользователем Telegram
      const telegramUser = webApp.initDataUnsafe.user
      if (telegramUser) {
        // Проверяем localStorage на наличие данных предыдущего пользователя
        const existingStorage = localStorage.getItem('finam-collab-storage')
        if (existingStorage) {
          try {
            const parsedStorage = JSON.parse(existingStorage)
            const existingUserId = parsedStorage.state?.user?.id
            
            // Если ID пользователя изменился, очищаем localStorage
            if (existingUserId && !existingUserId.includes(telegramUser.id.toString())) {
              console.log('[TelegramWebApp] New Telegram user detected, clearing localStorage')
              localStorage.removeItem('finam-collab-storage')
            }
          } catch (error) {
            console.error('[TelegramWebApp] Error parsing existing storage:', error)
            localStorage.removeItem('finam-collab-storage')
          }
        }
      }
      
      // Обработчик изменения viewport
      webApp.onEvent('viewportChanged', () => {
        console.log('[TelegramWebApp] Viewport changed')
      })
      
    }

    // Запускаем ожидание загрузки скрипта
    waitForTelegramScript()
  }, [setTheme])

  return null
} 