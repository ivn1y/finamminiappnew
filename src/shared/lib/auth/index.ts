export * from './next-auth-factory'
export * from './auth-config'
export * from './types' 

import { createAuth } from '@/shared/lib/auth/next-auth-factory'

const authConfig = {
  secret: process.env.NEXTAUTH_SECRET || '',
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  apiBaseUrl: process.env.API_BASE_URL || '',
}

const { handler, auth: baseAuth, signIn, signOut } = createAuth(authConfig)

// Создаем функцию auth для получения сессии
async function auth() {
  try {
    console.log('[AUTH] called without args')
    console.log('[AUTH] baseAuth type:', typeof baseAuth)
    
    if (typeof baseAuth !== 'function') {
      console.error('[AUTH] baseAuth is not a function:', baseAuth)
      return null
    }
    
    // В NextAuth 5 auth() может быть вызван без аргументов в серверных компонентах
    const result = await baseAuth()
    console.log('[AUTH] result:', result)
    console.log('[AUTH] result type:', typeof result)
    
    return result
  } catch (error) {
    console.error('[AUTH] error:', error)
    return null
  }
}

// Экспортируем как отдельные функции для Next.js App Router
export const GET = handler.GET
export const POST = handler.POST
export { auth, signIn, signOut }