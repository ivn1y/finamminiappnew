import 'server-only'
import { auth } from '@/shared/lib/auth'

export async function canUserViewData(userId: string): Promise<boolean> {
  try {
    const session = await auth()
    return session?.user?.telegramId?.toString() === userId
  } catch {
    return false
  }
}

export async function canUserModifyData(userId: string): Promise<boolean> {
  try {
    const session = await auth()
    return session?.user?.telegramId?.toString() === userId
  } catch {
    return false
  }
}

export async function getCurrentUserId(): Promise<string | null> {
  try {
    const session = await auth()
    return session?.user?.telegramId?.toString() || null
  } catch {
    return null
  }
} 