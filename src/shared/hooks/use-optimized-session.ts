import { useSession } from 'next-auth/react'
import { useMemo, useState, useEffect } from 'react'

interface UseOptimizedSessionOptions {
  skipLoading?: boolean
}

export function useOptimizedSession(options: UseOptimizedSessionOptions = {}) {
  const { data: session, status } = useSession()
  const [hasInitialized, setHasInitialized] = useState(false)
  const { skipLoading = false } = options

  // Отмечаем что инициализировались после первого рендера
  useEffect(() => {
    if (status !== 'loading') {
      setHasInitialized(true)
    }
  }, [status])

  // Оптимизированный статус
  const optimizedStatus = useMemo(() => {
    // Если пропускаем загрузку и есть сессия, считаем авторизованным
    if (skipLoading && hasInitialized && session) {
      return 'authenticated' as const
    }
    return status
  }, [status, session, hasInitialized, skipLoading])

  // Показываем loading только при первой загрузке
  const isLoading = optimizedStatus === 'loading' && !hasInitialized

  return {
    data: session,
    status: optimizedStatus,
    isLoading,
    isAuthenticated: optimizedStatus === 'authenticated',
    isUnauthenticated: optimizedStatus === 'unauthenticated'
  }
} 