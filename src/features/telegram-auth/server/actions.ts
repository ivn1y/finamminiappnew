'use server'

import { signIn } from '@/shared/lib/auth'

export async function authenticateWithTelegram(initData: string) {
  try {
    console.log('[TelegramAuth] authenticateWithTelegram called with initData length:', initData?.length)
    
    if (!initData) {
      console.log('[TelegramAuth] No initData provided')
      return { success: false, error: 'No initData provided' }
    }

    // Авторизуемся через NextAuth
    const result = await signIn('telegram', {
      initData: initData,
      redirect: false,
    })

    console.log('[TelegramAuth] SignIn result:', result)

    if (result?.error) {
      return { success: false, error: result.error }
    }

    return { success: true }
  } catch (error) {
    console.error('[TelegramAuth] Error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
} 