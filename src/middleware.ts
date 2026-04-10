import { createMiddleware } from '@/shared/lib/auth/next-middleware-factory'
import { createAuth } from '@/shared/lib/auth/next-auth-factory'

const authConfig = {
  secret: process.env.NEXTAUTH_SECRET || '',
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
}

const { auth } = createAuth(authConfig)

const middlewareConfig = {
  authRedirectPath: '/auth', // Используется только для обычных браузеров
  dashboardPath: '/collab',
  publicPaths: ['/images/', '/videos/', '/onboarding', '/privacy-policy', '/consent-personal-data', '/bugbounty', '/'],
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
}

export default createMiddleware(middlewareConfig, auth)

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ]
}