// Unified API service that works with both mock and real API
import { apiClient } from './api-client'
import { mockApiClient, CreateUserRequest, UpdateUserRequest, RedeemQRRequest, LogEventRequest } from './mock-api-client'
import { User } from '../types/app'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

class UnifiedApiService {
  private isMockMode: boolean

  constructor() {
    this.isMockMode = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || process.env.NODE_ENV === 'development'
    console.log(`[Unified API] Using ${this.isMockMode ? 'Mock' : 'Real'} API`)
  }

  // Создать пользователя
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<{ user: User }>> {
    if (this.isMockMode) {
      return await mockApiClient.createUser(userData)
    } else {
      // Реальная реализация для production API
      throw new Error('Real API createUser not implemented yet')
    }
  }

  // Обновить пользователя
  async updateUser(userId: string, updates: UpdateUserRequest): Promise<ApiResponse<{ user: User }>> {
    if (this.isMockMode) {
      return await mockApiClient.updateUser(userId, updates)
    } else {
      // Реальная реализация для production API
      throw new Error('Real API updateUser not implemented yet')
    }
  }

  // Получить контент
  async getContent(): Promise<ApiResponse<any[]>> {
    if (this.isMockMode) {
      return await mockApiClient.getContent()
    } else {
      // Реальная реализация для production API
      throw new Error('Real API getContent not implemented yet')
    }
  }

  // Использовать QR код
  async redeemQR(request: RedeemQRRequest): Promise<ApiResponse<any>> {
    if (this.isMockMode) {
      return await mockApiClient.redeemQR(request)
    } else {
      // Реальная реализация для production API
      throw new Error('Real API redeemQR not implemented yet')
    }
  }

  // Логировать событие
  async logEvent(userId: string, eventType: LogEventRequest["eventType"], data: any): Promise<ApiResponse<any>> {
    if (this.isMockMode) {
      return await mockApiClient.logEvent({ userId, eventType, data })
    } else {
      // Реальная реализация для production API
      throw new Error('Real API logEvent not implemented yet')
    }
  }

  // Получить пользователя
  async getUser(userId: string): Promise<ApiResponse<User>> {
    if (this.isMockMode) {
      return await mockApiClient.getUser(userId)
    } else {
      // Используем реальный API для получения пользователя
      try {
        const response = await apiClient.getCurrentUser('') // Нужен токен
        return {
          success: true,
          data: response as any
        }
      } catch (error) {
        throw new Error(`Failed to get user: ${error}`)
      }
    }
  }

  // Аутентификация через Telegram
  async authenticateWithTelegram(initData: string) {
    if (this.isMockMode) {
      // Мок аутентификация
      return {
        access_token: 'mock_token_' + Date.now(),
        token_type: 'Bearer',
        expires_in: 3600,
        user: {
          user_id: 'mock_user_' + Date.now(),
          username: 'mock_user',
          fullname: 'Mock User',
          points: 100,
          season_points: 50,
          attempts: 0,
          inventory_count: 0,
          freeze: false
        }
      }
    } else {
      return await apiClient.authenticateWithTelegram(initData)
    }
  }

  // Обновить токен
  async refreshToken(refreshToken: string) {
    if (this.isMockMode) {
      // Мок обновление токена
      return {
        access_token: 'mock_refreshed_token_' + Date.now(),
        token_type: 'Bearer',
        expires_in: 3600,
        user: {
          user_id: 'mock_user_refreshed',
          username: 'mock_user',
          fullname: 'Mock User',
          points: 100,
          season_points: 50,
          attempts: 0,
          inventory_count: 0,
          freeze: false
        }
      }
    } else {
      return await apiClient.refreshToken(refreshToken)
    }
  }

  // Установить токен авторизации
  setAuthToken(token: string) {
    if (!this.isMockMode) {
      apiClient.setAuthToken(token)
    }
  }

  // Очистить токен авторизации
  clearAuthToken() {
    if (!this.isMockMode) {
      apiClient.clearAuthToken()
    }
  }

  // Получить режим работы
  getMode(): 'mock' | 'real' {
    return this.isMockMode ? 'mock' : 'real'
  }

  // Переключить режим (для отладки)
  setMockMode(enabled: boolean) {
    this.isMockMode = enabled
    console.log(`[Unified API] Switched to ${this.isMockMode ? 'Mock' : 'Real'} API`)
  }
}

export const unifiedApiService = new UnifiedApiService()
