import { createAuth } from './auth/next-auth-factory'
import type { AuthConfig } from './auth/types'

const authConfig: AuthConfig = {
  secret: process.env.NEXTAUTH_SECRET || '',
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
}

const { auth, signIn, signOut } = createAuth(authConfig)
export { auth, signIn, signOut }