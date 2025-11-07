'use client'

import { useState, useEffect, useCallback } from 'react'
import { getTelegramUser } from '@/shared/lib/telegram/utils'

interface SubscriptionCheckResult {
  isSubscribed: boolean
  status?: string
  isLoading: boolean
  error: string | null
}

interface CheckSubscriptionResponse {
  isSubscribed: boolean
  status?: string
  error?: string
}

/**
 * Хук для проверки подписки пользователя на Telegram канал
 * 
 * @param channelUsername - Username канала (например, 'finam_collab')
 * @param channelId - ID канала (опционально, приоритетнее чем username)
 * @param autoCheck - Автоматически проверять при монтировании компонента
 * @param checkInterval - Интервал автоматической проверки в мс (0 = отключено)
 */
export function useSubscriptionCheck(
  channelUsername: string = 'finam_collab',
  channelId?: string,
  autoCheck: boolean = true,
  checkInterval: number = 0
): SubscriptionCheckResult & { checkSubscription: () => Promise<void> } {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [status, setStatus] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkSubscription = useCallback(async () => {
    const telegramUser = getTelegramUser()
    
    if (!telegramUser?.id) {
      setError('Telegram user not found')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/telegram/check-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: telegramUser.id,
          channelUsername: channelUsername ? `@${channelUsername.replace('@', '')}` : undefined,
          channelId,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: CheckSubscriptionResponse = await response.json()

      if (data.error) {
        setError(data.error)
        setIsSubscribed(false)
      } else {
        setIsSubscribed(data.isSubscribed ?? false)
        setStatus(data.status)
        setError(null)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check subscription'
      setError(errorMessage)
      setIsSubscribed(false)
      console.error('[useSubscriptionCheck] Error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [channelUsername, channelId])

  useEffect(() => {
    if (autoCheck) {
      checkSubscription()
    }
  }, [autoCheck, checkSubscription])

  useEffect(() => {
    if (checkInterval > 0 && autoCheck) {
      const interval = setInterval(() => {
        checkSubscription()
      }, checkInterval)

      return () => clearInterval(interval)
    }
  }, [checkInterval, autoCheck, checkSubscription])

  return {
    isSubscribed,
    status,
    isLoading,
    error,
    checkSubscription,
  }
}

