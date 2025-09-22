// API client for main service integration
import axios, { AxiosInstance, AxiosResponse } from 'axios'

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

class ApiClient {
  private axiosInstance: AxiosInstance

  constructor(baseUrl: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => {
        console.error('[API] Request error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`[API] Response ${response.status} for ${response.config.url}`)
        return response
      },
      (error) => {
        console.error('[API] Response error:', {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        })
        return Promise.reject(error)
      }
    )
  }

  async authenticateWithTelegram(initData: string): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.axiosInstance.post(
        '/auth/telegram',
        { initData },
        {
          headers: {
            'X-Telegram-Init-Data': initData,
          },
        }
      )
      return response.data
    } catch (error: any) {
      throw new Error(`Authentication failed: ${error.response?.data?.detail || error.message}`)
    }
  }

  async getCurrentUser(accessToken: string): Promise<UserResponse> {
    try {
      const response: AxiosResponse<UserResponse> = await this.axiosInstance.get(
        '/users/me',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    } catch (error: any) {
      throw new Error(`Failed to get current user: ${error.response?.data?.detail || error.message}`)
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.axiosInstance.post(
        '/auth/refresh',
        { refresh_token: refreshToken }
      )
      return response.data
    } catch (error: any) {
      throw new Error(`Token refresh failed: ${error.response?.data?.detail || error.message}`)
    }
  }

  // Method to set auth token for subsequent requests
  setAuthToken(token: string) {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  // Method to clear auth token
  clearAuthToken() {
    delete this.axiosInstance.defaults.headers.common['Authorization']
  }
}

// Определяем какой API использовать - мок или реальный
const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || process.env.NODE_ENV === 'development'
const apiUrl = isMockMode ? 'http://localhost:3001' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')

export const apiClient = new ApiClient(apiUrl)
