'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { isTelegramWebApp, getTelegramInitData, waitForInitDataUnsafe, getTelegramInitDataWithRetry } from '@/shared/lib/telegram/utils'
import { signIn } from 'next-auth/react'

interface AutoAuthProps {
  redirectTo?: string
  onAuthSuccess?: () => void
  onAuthError?: (error: string) => void
  maxAttempts?: number
  retryDelay?: number
  autoRetryDuration?: number
  autoRetryInterval?: number
}

export function AutoAuth({ 
  redirectTo = '/dashboard',
  onAuthSuccess,
  onAuthError,
  maxAttempts = 5,
  retryDelay = 2000,
  autoRetryDuration = 10000, // 10 секунд для автоматических попыток
  autoRetryInterval = 1000   // 1 секунда между попытками
}: AutoAuthProps = {}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isAutoAuthing, setIsAutoAuthing] = useState(false)
  const [authAttempts, setAuthAttempts] = useState(0)
  const [lastError, setLastError] = useState<string | null>(null)
  const [isAutoRetrying, setIsAutoRetrying] = useState(false)
  const autoRetryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const autoRetryIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const performAutoAuth = useCallback(async () => {
    // Если уже авторизованы, не делаем ничего
    if (status === 'authenticated') {
      console.log('[AutoAuth] Already authenticated')
      if (onAuthSuccess) {
        onAuthSuccess()
      }
      return
    }

    // Если статус загрузки, ждем
    if (status === 'loading') {
      console.log('[AutoAuth] Session loading, waiting...')
      return
    }

    // Если не в Telegram WebApp, не делаем ничего
    if (!isTelegramWebApp()) {
      console.log('[AutoAuth] Not in Telegram WebApp')
      return
    }

    // Если превышено количество попыток, останавливаемся
    if (authAttempts >= maxAttempts) {
      console.log('[AutoAuth] Max attempts reached:', authAttempts)
      if (onAuthError) {
        onAuthError(`Превышено количество попыток авторизации (${maxAttempts}). Попробуйте перезайти в приложение.`)
      }
      return
    }

    console.log('[AutoAuth] Attempting auto-auth, attempt:', authAttempts + 1)
    setIsAutoAuthing(true)
    setAuthAttempts(prev => prev + 1)

    try {
      // Ждем готовности initDataUnsafe
      console.log('[AutoAuth] Waiting for initDataUnsafe to be ready...')
      const isReady = await waitForInitDataUnsafe() // 5 секунд максимум
      
      if (!isReady) {
        console.log('[AutoAuth] initDataUnsafe not ready, trying to get initData with retry...')
        const initData = await getTelegramInitDataWithRetry(10) // 10 попыток, 300мс между попытками
        
        if (!initData) {
          console.log('[AutoAuth] No initData available after retry, will retry later...')
          setTimeout(() => {
            setIsAutoAuthing(false)
          }, retryDelay)
          return
        }
        
        console.log('[AutoAuth] Got initData with retry, proceeding with auth...')
        await performSignIn(initData)
      } else {
        console.log('[AutoAuth] initDataUnsafe is ready, getting initData...')
        const initData = getTelegramInitData()
        
        if (!initData) {
          console.log('[AutoAuth] No initData available, will retry...')
          setTimeout(() => {
            setIsAutoAuthing(false)
          }, retryDelay)
          return
        }
        
        console.log('[AutoAuth] Got initData, proceeding with auth...')
        await performSignIn(initData)
      }
    } catch (error) {
      console.error('[AutoAuth] Auto-auth error:', error)
      setLastError(error instanceof Error ? error.message : 'Unknown error')
      
      // Повторяем попытку при ошибках сети
      if (error instanceof Error && error.message.includes('network')) {
        if (!isAutoRetrying) {
          startAutoRetry()
        }
        return
      }
      
      if (onAuthError) {
        onAuthError(error instanceof Error ? error.message : 'Unknown error')
      }
    } finally {
      setIsAutoAuthing(false)
    }
  }, [status, authAttempts, maxAttempts, retryDelay, redirectTo, router, onAuthSuccess, onAuthError, isAutoRetrying])

  const startAutoRetry = useCallback(() => {
    console.log('[AutoAuth] Starting auto-retry for 10 seconds')
    setIsAutoRetrying(true)
    
    // Очищаем предыдущие таймеры
    if (autoRetryTimeoutRef.current) {
      clearTimeout(autoRetryTimeoutRef.current)
    }
    if (autoRetryIntervalRef.current) {
      clearInterval(autoRetryIntervalRef.current)
    }

    // Запускаем интервал попыток каждую секунду
    autoRetryIntervalRef.current = setInterval(() => {
      console.log('[AutoAuth] Auto-retry attempt')
      performAutoAuth()
    }, autoRetryInterval)

    // Останавливаем через 10 секунд
    autoRetryTimeoutRef.current = setTimeout(() => {
      stopAutoRetry()
      console.log('[AutoAuth] Auto-retry timeout reached')
      if (onAuthError) {
        onAuthError('Автоматические попытки авторизации завершены. Попробуйте перезайти в приложение.')
      }
    }, autoRetryDuration)
  }, [performAutoAuth, autoRetryInterval, autoRetryDuration, onAuthError])

  const stopAutoRetry = useCallback(() => {
    console.log('[AutoAuth] Stopping auto-retry')
    setIsAutoRetrying(false)
    
    if (autoRetryTimeoutRef.current) {
      clearTimeout(autoRetryTimeoutRef.current)
      autoRetryTimeoutRef.current = null
    }
    if (autoRetryIntervalRef.current) {
      clearInterval(autoRetryIntervalRef.current)
      autoRetryIntervalRef.current = null
    }
  }, [])

  // Выносим логику signIn в отдельную функцию
  const performSignIn = useCallback(async (initData: string) => {
    console.log('[AutoAuth] Performing signIn with initData length:', initData.length)
    
    const result = await signIn('telegram', {
      initData,
      redirect: false,
    })

    console.log('[AutoAuth] Auto-auth result:', result)

    if (result?.error) {
      console.error('[AutoAuth] Auto-auth error:', result.error)
      setLastError(result.error)
      
      // Если ошибка связана с данными или превышением лимитов, запускаем автоматические попытки
      if (result.error.includes('initData') || 
          result.error.includes('signature') || 
          result.error.includes('rate limit') ||
          result.error.includes('Превышено количество попыток')) {
        
        // Запускаем автоматические попытки
        if (!isAutoRetrying) {
          startAutoRetry()
        }
        return
      }
      
      if (onAuthError) {
        onAuthError(result.error)
      }
    } else if (result?.ok) {
      console.log('[AutoAuth] Auto-auth successful')
      setLastError(null)
      stopAutoRetry()
      if (onAuthSuccess) {
        onAuthSuccess()
      }
      // Редиректим на указанную страницу
      if (redirectTo) {
        router.push(redirectTo)
      }
    }
  }, [redirectTo, router, onAuthSuccess, onAuthError, isAutoRetrying, startAutoRetry, stopAutoRetry])

  useEffect(() => {
    // Выполняем авто-авторизацию при изменении статуса или количества попыток
    performAutoAuth()
  }, [performAutoAuth])

  // Очищаем таймеры при размонтировании
  useEffect(() => {
    return () => {
      if (autoRetryTimeoutRef.current) {
        clearTimeout(autoRetryTimeoutRef.current)
      }
      if (autoRetryIntervalRef.current) {
        clearInterval(autoRetryIntervalRef.current)
      }
    }
  }, [])

  // Компонент не рендерит ничего, только выполняет логику
  return null
} 