// Server-side API client for main service integration (Edge Runtime compatible)

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  added_to_attachment_menu?: boolean
  allows_write_to_pm?: boolean
  photo_url?: string
}

export interface UserResponse {
  user_id: string
  username: string
  fullname: string
  points: number
  season_points: number
  attempts: number
  inventory_count: number
  freeze: boolean
}

export interface AuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  user: UserResponse
}

class ServerApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async authenticateWithTelegram(initData: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/auth/telegram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Telegram-Init-Data': initData,
        },
        body: JSON.stringify({ initData }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Authentication failed: ${error}`)
      }

      return response.json()
    } catch (error: any) {
      throw new Error(`Authentication failed: ${error.message}`)
    }
  }

  async getCurrentUser(accessToken: string): Promise<UserResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/users/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to get current user')
      }

      return response.json()
    } catch (error: any) {
      throw new Error(`Failed to get current user: ${error.message}`)
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      return response.json()
    } catch (error: any) {
      throw new Error(`Token refresh failed: ${error.message}`)
    }
  }
}

export const serverApiClient = new ServerApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')
