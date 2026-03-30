export interface TelegramInitDataUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  allows_write_to_pm?: boolean
  photo_url?: string
}

export interface ParsedInitData {
  user?: TelegramInitDataUser
  auth_date?: number
  hash?: string
  query_id?: string
  chat_instance?: string
  chat_type?: string
  start_param?: string
}

export function parseInitData(initData: string): ParsedInitData {
  const params = new URLSearchParams(initData)
  const result: ParsedInitData = {}

  const userStr = params.get('user')
  if (userStr) {
    try {
      result.user = JSON.parse(decodeURIComponent(userStr))
    } catch (e) {
      console.error('[parseInitData] Failed to parse user:', e)
    }
  }

  const authDate = params.get('auth_date')
  if (authDate) {
    result.auth_date = parseInt(authDate)
  }

  result.hash = params.get('hash') || undefined
  result.query_id = params.get('query_id') || undefined
  result.chat_instance = params.get('chat_instance') || undefined
  result.chat_type = params.get('chat_type') || undefined
  result.start_param = params.get('start_param') || undefined

  return result
}
