'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'
import { AutoAuth } from '@/features/telegram-auth/ui/auto-auth'
import { AuthError } from '@/widgets/auth-wrapper/ui/auth-error'
import { isTelegramWebApp } from '@/shared/lib/telegram/utils'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ 
  children, 
  fallback,
  requireAuth = true 
}: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isTelegramReady, setIsTelegramReady] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false)
  
  // Мемоизируем статус авторизации для уменьшения ререндеров
  const authStatus = useMemo(() => {
    if (status === 'loading' && !hasCheckedAuth) {
      return 'loading'
    }
    return status
  }, [status, hasCheckedAuth])

  useEffect(() => {
    // Проверяем готовность Telegram WebApp
    const checkTelegramReady = () => {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        setIsTelegramReady(true)
      }
    }

    // Слушаем событие готовности от TelegramScriptLoader
    const handleTelegramReady = () => {
      setIsTelegramReady(true)
    }

    // Проверяем сразу
    checkTelegramReady()

    // Добавляем слушатель события
    window.addEventListener('telegram-ready', handleTelegramReady)

    // Если не готов, ждем загрузки
    let interval: NodeJS.Timeout | undefined
    if (!isTelegramReady) {
      interval = setInterval(checkTelegramReady, 100)
    }
    return () => {
      if (interval) clearInterval(interval)
      window.removeEventListener('telegram-ready', handleTelegramReady)
    }
  }, [isTelegramReady])

  useEffect(() => {
    // Если не требуется авторизация, пропускаем
    if (!requireAuth) {
      setHasCheckedAuth(true)
      return
    }

    // Если статус загрузки, ждем
    if (authStatus === 'loading') return

    // Отмечаем что проверили авторизацию
    setHasCheckedAuth(true)

    // Если не авторизованы и не в Telegram WebApp, редиректим на auth
    if (authStatus === 'unauthenticated' && !isTelegramWebApp()) {
      router.push('/auth')
      return
    }

    // Если не авторизованы в Telegram WebApp, AutoAuth обработает авторизацию
    if (authStatus === 'unauthenticated' && isTelegramWebApp()) {
      return
    }
  }, [authStatus, requireAuth, router])

  const handleAuthSuccess = () => {
    setAuthError(null)
    console.log('[AuthGuard] Auto-auth successful')
  }

  const handleAuthError = (error: string) => {
    setAuthError(error)
    console.error('[AuthGuard] Auto-auth error:', error)
  }

  // Показываем fallback только при первой загрузке
  if (authStatus === 'loading' && !hasCheckedAuth) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Если не авторизованы и не в Telegram WebApp, показываем fallback
  if (authStatus === 'unauthenticated' && !isTelegramWebApp()) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Требуется авторизация</h1>
          <p className="text-muted-foreground mb-4">Это приложение должно быть открыто в Telegram</p>
          <button 
            onClick={() => router.push('/auth')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Перейти к авторизации
          </button>
        </div>
      </div>
    )
  }

  // Если не авторизованы в Telegram WebApp, показываем AutoAuth
  if (authStatus === 'unauthenticated' && isTelegramWebApp()) {
    return (
      <>
        <AutoAuth 
          onAuthSuccess={handleAuthSuccess}
          onAuthError={handleAuthError}
          maxAttempts={5}
          retryDelay={2000}
        />
        {fallback || (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground mb-2">Авторизация в Telegram...</p>
              {authError && (
                <AuthError 
                  error={authError}
                  onRefresh={() => window.location.reload()}
                />
              )}
            </div>
          </div>
        )}
      </>
    )
  }

  // Если авторизованы, показываем контент
  return <>{children}</>
} 