'use client'

// Telegram WebApp utilities

export function isTelegramWebApp(): boolean {
  if (typeof window === 'undefined') return false
  return !!(window.Telegram?.WebApp)
}

export function getTelegramUser() {
  if (!isTelegramWebApp()) return null
  return window.Telegram?.WebApp?.initDataUnsafe?.user || null
}

export function getTelegramInitData(): string {
  if (!isTelegramWebApp()) return ''
  return window.Telegram?.WebApp?.initData || ''
}

export function waitForInitDataUnsafe(): Promise<any> {
  return new Promise((resolve) => {
    if (isTelegramWebApp() && window.Telegram?.WebApp?.initDataUnsafe) {
      resolve(window.Telegram.WebApp.initDataUnsafe)
      return
    }

    const checkInterval = setInterval(() => {
      if (isTelegramWebApp() && window.Telegram?.WebApp?.initDataUnsafe) {
        clearInterval(checkInterval)
        resolve(window.Telegram.WebApp.initDataUnsafe)
      }
    }, 100)

    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkInterval)
      resolve(null)
    }, 5000)
  })
}

export function getTelegramInitDataWithRetry(maxRetries = 10): Promise<string> {
  return new Promise((resolve) => {
    let retries = 0

    const checkInterval = setInterval(() => {
      if (isTelegramWebApp() && window.Telegram?.WebApp?.initData) {
        clearInterval(checkInterval)
        resolve(window.Telegram.WebApp.initData)
        return
      }

      retries++
      if (retries >= maxRetries) {
        clearInterval(checkInterval)
        resolve('')
      }
    }, 100)
  })
}