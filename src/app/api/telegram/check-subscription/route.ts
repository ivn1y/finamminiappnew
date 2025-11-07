import { NextRequest, NextResponse } from 'next/server'

interface CheckSubscriptionRequest {
  userId: number
  channelUsername?: string
  channelId?: string
}

interface TelegramBotApiResponse {
  ok: boolean
  result?: {
    status: 'member' | 'left' | 'kicked' | 'restricted' | 'administrator' | 'creator'
    user: {
      id: number
      is_bot: boolean
      first_name: string
      username?: string
    }
  }
  error_code?: number
  description?: string
}

/**
 * Проверяет подписку пользователя на Telegram канал
 * Использует Telegram Bot API метод getChatMember
 */
export async function POST(request: NextRequest) {
  try {
    const body: CheckSubscriptionRequest = await request.json()
    const { userId, channelUsername, channelId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      console.error('[CheckSubscription] TELEGRAM_BOT_TOKEN is not set')
      return NextResponse.json(
        { error: 'Telegram bot token is not configured' },
        { status: 500 }
      )
    }

    // Определяем chat_id для канала
    // Можно использовать username (например, @finam_collab) или channel ID
    const chatId = channelId || channelUsername || '@finam_collab'

    // Вызываем Telegram Bot API метод getChatMember
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/getChatMember`
    
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        user_id: userId,
      }),
    })

    const data: TelegramBotApiResponse = await response.json()

    if (!data.ok) {
      console.error('[CheckSubscription] Telegram API error:', data)
      
      // Если пользователь не найден в канале, это нормально - значит не подписан
      if (data.error_code === 400) {
        return NextResponse.json({
          isSubscribed: false,
          error: data.description || 'User is not a member of the channel',
        })
      }

      return NextResponse.json(
        { error: data.description || 'Failed to check subscription' },
        { status: 500 }
      )
    }

    // Проверяем статус подписки
    // member, administrator, creator - считаются подписанными
    // left, kicked, restricted - не подписан
    const isSubscribed = ['member', 'administrator', 'creator'].includes(
      data.result?.status || ''
    )

    return NextResponse.json({
      isSubscribed,
      status: data.result?.status,
    })
  } catch (error) {
    console.error('[CheckSubscription] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

