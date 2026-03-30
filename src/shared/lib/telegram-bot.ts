const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

interface SendMessageOptions {
  chatId: number | string
  text: string
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2'
  disableWebPagePreview?: boolean
  disableNotification?: boolean
}

interface TelegramApiResponse {
  ok: boolean
  result?: any
  error_code?: number
  description?: string
}

export async function sendMessage(options: SendMessageOptions): Promise<TelegramApiResponse> {
  if (!BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN is not configured')
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: options.chatId,
      text: options.text,
      parse_mode: options.parseMode,
      disable_web_page_preview: options.disableWebPagePreview,
      disable_notification: options.disableNotification,
    }),
  })

  return response.json()
}

export interface BroadcastResult {
  success: number
  failed: number
  errors: Array<{ telegramId: string; error: string }>
}

export async function broadcastMessage(
  userIds: bigint[],
  message: string,
  options?: {
    parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2'
    delayMs?: number
  }
): Promise<BroadcastResult> {
  const result: BroadcastResult = {
    success: 0,
    failed: 0,
    errors: [],
  }

  const delayMs = options?.delayMs ?? 50

  for (const telegramId of userIds) {
    try {
      const response = await sendMessage({
        chatId: Number(telegramId),
        text: message,
        parseMode: options?.parseMode,
      })

      if (response.ok) {
        result.success++
      } else {
        result.failed++
        result.errors.push({
          telegramId: telegramId.toString(),
          error: response.description || 'Unknown error',
        })
      }
    } catch (error) {
      result.failed++
      result.errors.push({
        telegramId: telegramId.toString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }

    if (delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }

  return result
}
