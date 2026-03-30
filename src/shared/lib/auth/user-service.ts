import { prisma } from '../db'

interface TelegramUserData {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  allows_write_to_pm?: boolean
  photo_url?: string
}

export async function saveOrUpdateUser(telegramUser: TelegramUserData) {
  try {
    const user = await prisma.user.upsert({
      where: { telegramId: BigInt(telegramUser.id) },
      update: {
        username: telegramUser.username,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        languageCode: telegramUser.language_code,
        isPremium: telegramUser.is_premium ?? false,
        allowsWriteToPm: telegramUser.allows_write_to_pm ?? true,
        photoUrl: telegramUser.photo_url,
      },
      create: {
        telegramId: BigInt(telegramUser.id),
        username: telegramUser.username,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        languageCode: telegramUser.language_code,
        isPremium: telegramUser.is_premium ?? false,
        allowsWriteToPm: telegramUser.allows_write_to_pm ?? true,
        photoUrl: telegramUser.photo_url,
      },
    })

    console.log('[UserService] User saved/updated:', {
      id: user.id,
      telegramId: user.telegramId.toString(),
      username: user.username,
    })

    return user
  } catch (error) {
    console.error('[UserService] Error saving user:', error)
    throw error
  }
}

export async function getUserByTelegramId(telegramId: number) {
  return prisma.user.findUnique({
    where: { telegramId: BigInt(telegramId) },
  })
}
