'use client'

import Script from 'next/script'
import { useEffect } from 'react'

export function WebAppLoader() {
  useEffect(() => {
    console.log('[TelegramScriptLoader] useEffect triggered')
    
    // Уведомляем о готовности Telegram WebApp
    const checkTelegramReady = () => {
      console.log('[TelegramScriptLoader] checkTelegramReady called')
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        console.log('[TelegramScriptLoader] Telegram WebApp found, dispatching telegram-ready event')
        // Отправляем событие о готовности
        window.dispatchEvent(new CustomEvent('telegram-ready'))
      } else {
        console.log('[TelegramScriptLoader] Telegram WebApp not ready yet')
      }
    }

    // Проверяем сразу
    checkTelegramReady()

    // Если не готов, ждем загрузки
    const interval = setInterval(checkTelegramReady, 100)
    console.log('[TelegramScriptLoader] Started interval check')
    
    return () => {
      console.log('[TelegramScriptLoader] cleanup: clearing interval')
      clearInterval(interval)
    }
  }, [])

  return (
    <Script
      src="https://telegram.org/js/telegram-web-app.js?58"
      strategy="beforeInteractive"
      onLoad={() => {
        console.log('[TelegramScriptLoader] Script loaded')
        // Дополнительная проверка после загрузки скрипта
        setTimeout(() => {
          console.log('[TelegramScriptLoader] Post-load check')
          if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            console.log('[TelegramScriptLoader] Post-load: Telegram WebApp found, dispatching telegram-ready event')
            window.dispatchEvent(new CustomEvent('telegram-ready'))
          } else {
            console.log('[TelegramScriptLoader] Post-load: Telegram WebApp still not ready')
          }
        }, 100)
      }}
      onError={(error) => {
        console.error('[TelegramScriptLoader] Script load error:', error)
      }}
    />
  )
} 