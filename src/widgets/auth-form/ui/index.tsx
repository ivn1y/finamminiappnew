'use client'
import { Button } from '@/shared/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import { TelegramAuthButton } from '@/features/telegram-auth/ui/telegram-auth-button'
import { isTelegramWebApp } from '@/shared/lib/telegram/utils'

interface AuthFormProps {
  className?: string
  title?: string
  description?: string
  telegramOnly?: boolean
}

export function AuthForm({
  className,
  title = "Nutriya - Бот Нутрициолог",
  description,
  telegramOnly = true,
  ...props
}: AuthFormProps & React.ComponentPropsWithoutRef<"div">) {
  const isTelegram = isTelegramWebApp()
  const defaultDescription = isTelegram 
    ? "Авторизуйтесь через Telegram для доступа к приложению"
    : "Это приложение должно быть открыто в Telegram WebApp"

  return (
    <div className={`flex flex-col gap-6 min-w-[400px] ${className || ''}`} {...props}>
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>
            {description || defaultDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {isTelegram ? (
              <TelegramAuthButton />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  Для использования приложения откройте его в Telegram
                </p>
                <Button variant="outline" disabled>
                  Доступно только в Telegram
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 