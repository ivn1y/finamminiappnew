import { createNextAuthHandler } from '@/shared/lib/auth/auth-config'
import type { AuthConfig } from '@/shared/lib/auth/types'

const authConfig: AuthConfig = {
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-key-change-in-production',
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || 'dev-bot-token',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
}

const { handlers } = createNextAuthHandler(authConfig)

export const { GET, POST } = handlers