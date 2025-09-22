// Mock API client for PoC integration
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { User, UserRole } from '../types/app'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface CreateUserRequest {
  name?: string
  role?: UserRole | null
  profile?: Partial<User['profile']>
  intent7d?: string
}

export interface UpdateUserRequest {
  name?: string
  role?: UserRole | null
  profile?: Partial<User['profile']>
  intent7d?: string
  badges?: string[]
  xp?: number
  progressSteps?: number
  goalProgress?: User['goalProgress']
}

export interface ContentItem {
  id: string
  type: 'article' | 'video' | 'quiz'
  title: string
  description: string
  content: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  xpReward: number
  createdAt: string
}

export interface QRCode {
  id: string
  code: string
  type: 'badge' | 'content' | 'xp'
  reward: {
    type: 'badge' | 'content' | 'xp'
    value: string
    xp: number
  }
  isActive: boolean
  createdAt: string
  expiresAt: string
}

export interface RedeemQRRequest {
  qrCode: string
  userId: string
}

export interface RedeemQRResponse {
  user: User
  reward: QRCode['reward']
}

export interface AnalyticsEvent {
  id: string
  userId: string
  eventType: 'role_selected' | 'profile_submitted' | 'quest_completed' | 'qr_scanned' | 'badge_earned'
  data: Record<string, any>
  createdAt: string
}

export interface LogEventRequest {
  userId: string
  eventType: AnalyticsEvent['eventType']
  data?: Record<string, any>
}

class MockApiClient {
  private axiosInstance: AxiosInstance

  constructor(baseUrl: string = 'http://localhost:3001') {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`[Mock API] ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => {
        console.error('[Mock API] Request error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`[Mock API] Response ${response.status} for ${response.config.url}`)
        return response
      },
      (error) => {
        console.error('[Mock API] Response error:', {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        })
        return Promise.reject(error)
      }
    )
  }

  // Создать пользователя
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<{ user: User }>> {
    try {
      const response: AxiosResponse<ApiResponse<{ user: User }>> = await this.axiosInstance.post(
        '/api/createUser',
        userData
      )
      return response.data
    } catch (error: any) {
      throw new Error(`Failed to create user: ${error.response?.data?.error || error.message}`)
    }
  }

  // Обновить пользователя
  async updateUser(userId: string, updates: UpdateUserRequest): Promise<ApiResponse<{ user: User }>> {
    try {
      const response: AxiosResponse<ApiResponse<{ user: User }>> = await this.axiosInstance.put(
        `/api/updateUser/${userId}`,
        updates
      )
      return response.data
    } catch (error: any) {
      throw new Error(`Failed to update user: ${error.response?.data?.error || error.message}`)
    }
  }

  // Получить контент
  async getContent(): Promise<ApiResponse<ContentItem[]>> {
    try {
      const response: AxiosResponse<ApiResponse<ContentItem[]>> = await this.axiosInstance.get(
        '/api/getContent'
      )
      return response.data
    } catch (error: any) {
      throw new Error(`Failed to get content: ${error.response?.data?.error || error.message}`)
    }
  }

  // Использовать QR код
  async redeemQR(request: RedeemQRRequest): Promise<ApiResponse<RedeemQRResponse>> {
    try {
      const response: AxiosResponse<ApiResponse<RedeemQRResponse>> = await this.axiosInstance.post(
        '/api/redeemQR',
        request
      )
      return response.data
    } catch (error: any) {
      throw new Error(`Failed to redeem QR code: ${error.response?.data?.error || error.message}`)
    }
  }

  // Логировать событие аналитики
  async logEvent(event: LogEventRequest): Promise<ApiResponse<AnalyticsEvent>> {
    try {
      const response: AxiosResponse<ApiResponse<AnalyticsEvent>> = await this.axiosInstance.post(
        '/api/logEvent',
        event
      )
      return response.data
    } catch (error: any) {
      throw new Error(`Failed to log event: ${error.response?.data?.error || error.message}`)
    }
  }

  // Получить события пользователя
  async getUserEvents(userId: string): Promise<ApiResponse<AnalyticsEvent[]>> {
    try {
      const response: AxiosResponse<ApiResponse<AnalyticsEvent[]>> = await this.axiosInstance.get(
        `/api/events/${userId}`
      )
      return response.data
    } catch (error: any) {
      throw new Error(`Failed to get user events: ${error.response?.data?.error || error.message}`)
    }
  }

  // Получить пользователя по ID (через json-server)
  async getUser(userId: string): Promise<ApiResponse<User>> {
    try {
      const response: AxiosResponse<User> = await this.axiosInstance.get(
        `/api/users/${userId}`
      )
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      throw new Error(`Failed to get user: ${error.response?.data?.error || error.message}`)
    }
  }

  // Получить всех пользователей (для отладки)
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response: AxiosResponse<User[]> = await this.axiosInstance.get(
        '/api/users'
      )
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      throw new Error(`Failed to get all users: ${error.response?.data?.error || error.message}`)
    }
  }
}

export const mockApiClient = new MockApiClient()
