'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { isTelegramWebApp, getTelegramUser } from '@/shared/lib/telegram/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Loader2, CheckCircle, XCircle, User } from 'lucide-react'

interface TelegramAuthStatusProps {
  className?: string
}

export function TelegramAuthStatus({ className }: TelegramAuthStatusProps) {
  const { data: session, status } = useSession()
  const [telegramUser, setTelegramUser] = useState<any>(null)
  const [isTelegramReady, setIsTelegramReady] = useState(false)

  useEffect(() => {
    const checkTelegramReady = () => {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        setIsTelegramReady(true)
        const user = getTelegramUser()
        setTelegramUser(user)
      }
    }

    const handleTelegramReady = () => {
      setIsTelegramReady(true)
      const user = getTelegramUser()
      setTelegramUser(user)
    }

    checkTelegramReady()
    window.addEventListener('telegram-ready', handleTelegramReady)

    const interval = setInterval(checkTelegramReady, 100)
    return () => {
      clearInterval(interval)
      window.removeEventListener('telegram-ready', handleTelegramReady)
    }
  }, [])

  if (!isTelegramWebApp()) {
    return null
  }

  const getStatusIcon = () => {
    if (status === 'loading') {
      return <Loader2 className="h-4 w-4 animate-spin" />
    }
    if (status === 'authenticated') {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    return <XCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusText = () => {
    if (status === 'loading') {
      return 'Проверка авторизации...'
    }
    if (status === 'authenticated') {
      return 'Авторизован'
    }
    return 'Не авторизован'
  }

  const getStatusBadge = () => {
    if (status === 'loading') {
      return <Badge variant="secondary">Загрузка</Badge>
    }
    if (status === 'authenticated') {
      return <Badge variant="default" className="bg-green-500">Авторизован</Badge>
    }
    return <Badge variant="destructive">Не авторизован</Badge>
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Статус Telegram WebApp
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Telegram WebApp:</span>
          <Badge variant={isTelegramReady ? "default" : "secondary"}>
            {isTelegramReady ? "Готов" : "Загрузка..."}
          </Badge>
        </div>

        {telegramUser && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Пользователь Telegram:</span>
            <div className="text-right">
              <div className="text-sm font-medium">
                {telegramUser.first_name} {telegramUser.last_name}
              </div>
              {telegramUser.username && (
                <div className="text-xs text-muted-foreground">
                  @{telegramUser.username}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Авторизация в приложении:</span>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            {getStatusBadge()}
          </div>
        </div>

        {status === 'unauthenticated' && isTelegramReady && (
          <div className="text-sm text-muted-foreground">
            Выполняется автоматическая авторизация...
          </div>
        )}

        {session?.user && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Пользователь приложения:</span>
            <div className="text-right">
              <div className="text-sm font-medium">
                {session.user.name || session.user.email}
              </div>
              {session.user.email && (
                <div className="text-xs text-muted-foreground">
                  {session.user.email}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 