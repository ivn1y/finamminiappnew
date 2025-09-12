'use client';

import { User, UserRole } from '../types/app';

// Интерфейсы для API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  profile?: Partial<User['profile']>;
  intent7d?: string;
}

export interface ProfileResponse {
  user: User;
  updatedAt: string;
}

// Мок данные пользователей (симуляция базы данных)
const mockUsers: Map<string, User> = new Map();

// Инициализация мок данных
const initializeMockData = () => {
  // Создаем тестового пользователя
  const testUser: User = {
    id: 'user_123',
    createdAt: new Date().toISOString(),
    role: 'trader',
    profile: {
      trader: {
        years: 3,
        markets: ['forex', 'crypto'],
        risk: 'medium'
      }
    },
    intent7d: 'Запустить стратегию на капитале',
    badges: ['explorer'],
    xp: 150,
    progressSteps: 2,
    name: 'Тестовый Трейдер',
    goalProgress: {
      current: 25,
      target: 100,
      daysLeft: 5,
      notes: [],
      milestones: [
        { id: 1, title: 'Начало работы', completed: true, date: '2024-01-01' },
        { id: 2, title: 'Первый результат', completed: false, date: null },
        { id: 3, title: 'Промежуточная проверка', completed: false, date: null },
        { id: 4, title: 'Завершение цели', completed: false, date: null }
      ]
    }
  };

  mockUsers.set(testUser.id, testUser);
};

// Инициализируем данные при загрузке модуля
initializeMockData();

class MockApiService {
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Получить профиль пользователя
  async getUserProfile(userId: string): Promise<ApiResponse<ProfileResponse>> {
    await this.delay(300);
    
    const user = mockUsers.get(userId);
    if (!user) {
      return {
        success: false,
        error: 'Пользователь не найден'
      };
    }

    return {
      success: true,
      data: {
        user: { ...user },
        updatedAt: new Date().toISOString()
      }
    };
  }

  // Обновить профиль пользователя
  async updateUserProfile(
    userId: string, 
    updates: ProfileUpdateRequest
  ): Promise<ApiResponse<ProfileResponse>> {
    await this.delay(400);
    
    const user = mockUsers.get(userId);
    if (!user) {
      return {
        success: false,
        error: 'Пользователь не найден'
      };
    }

    // Валидация данных
    const validationError = this.validateProfileUpdate(updates, user.role);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    // Обновляем пользователя
    const updatedUser: User = {
      ...user,
      ...updates,
      profile: {
        ...user.profile,
        ...updates.profile
      }
    };

    mockUsers.set(userId, updatedUser);

    return {
      success: true,
      data: {
        user: { ...updatedUser },
        updatedAt: new Date().toISOString()
      },
      message: 'Профиль успешно обновлен'
    };
  }

  // Создать нового пользователя
  async createUser(userData: Partial<User>): Promise<ApiResponse<ProfileResponse>> {
    await this.delay(600);
    
    const userId = `user_${Date.now()}`;
    const newUser: User = {
      id: userId,
      createdAt: new Date().toISOString(),
      role: null,
      profile: {},
      badges: ['explorer'],
      xp: 100,
      progressSteps: 0,
      ...userData
    };

    mockUsers.set(userId, newUser);

    return {
      success: true,
      data: {
        user: { ...newUser },
        updatedAt: new Date().toISOString()
      },
      message: 'Пользователь успешно создан'
    };
  }

  // Валидация обновления профиля
  private validateProfileUpdate(updates: ProfileUpdateRequest, userRole: UserRole | null): string | null {
    // Валидация имени
    if (updates.name !== undefined) {
      if (typeof updates.name !== 'string') {
        return 'Имя должно быть строкой';
      }
      if (updates.name.length < 2) {
        return 'Имя должно содержать минимум 2 символа';
      }
      if (updates.name.length > 50) {
        return 'Имя не должно превышать 50 символов';
      }
    }

    // Валидация профиля по ролям
    if (updates.profile && userRole) {
      const roleProfile = updates.profile[userRole];
      if (roleProfile) {
        const validationError = this.validateRoleProfile(roleProfile, userRole);
        if (validationError) {
          return validationError;
        }
      }
    }

    // Валидация цели на 7 дней
    if (updates.intent7d !== undefined) {
      if (typeof updates.intent7d !== 'string') {
        return 'Цель должна быть строкой';
      }
      if (updates.intent7d.length > 200) {
        return 'Цель не должна превышать 200 символов';
      }
    }

    return null;
  }

  // Валидация профиля по ролям
  private validateRoleProfile(profile: any, role: UserRole): string | null {
    switch (role) {
      case 'trader':
        if (profile.years !== undefined && (profile.years < 0 || profile.years > 50)) {
          return 'Опыт трейдинга должен быть от 0 до 50 лет';
        }
        if (profile.risk && !['low', 'medium', 'high'].includes(profile.risk)) {
          return 'Уровень риска должен быть: low, medium или high';
        }
        if (profile.markets && !Array.isArray(profile.markets)) {
          return 'Рынки должны быть массивом';
        }
        break;

      case 'startup':
        if (profile.stage && !['idea', 'MVP', 'PMF', 'Scale'].includes(profile.stage)) {
          return 'Стадия должна быть: idea, MVP, PMF или Scale';
        }
        if (profile.pitch3 && profile.pitch3.length > 100) {
          return 'Питч в 3 слова не должен превышать 100 символов';
        }
        if (profile.site && !this.isValidUrl(profile.site)) {
          return 'Некорректный URL сайта';
        }
        break;

      case 'expert':
        if (profile.availabilityHrs !== undefined && (profile.availabilityHrs < 0 || profile.availabilityHrs > 40)) {
          return 'Доступность должна быть от 0 до 40 часов в неделю';
        }
        if (profile.mode && !['mentor', 'tracker'].includes(profile.mode)) {
          return 'Режим должен быть: mentor или tracker';
        }
        break;

      case 'partner':
        if (profile.type && !['university', 'business', 'media', 'franchise'].includes(profile.type)) {
          return 'Тип партнёра должен быть: university, business, media или franchise';
        }
        if (profile.interest && !['white-label', 'franchise', 'api'].includes(profile.interest)) {
          return 'Интерес должен быть: white-label, franchise или api';
        }
        break;
    }

    return null;
  }

  // Проверка валидности URL
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Получить всех пользователей (для отладки)
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    await this.delay(200);
    
    return {
      success: true,
      data: Array.from(mockUsers.values())
    };
  }

  // Очистить все данные (для тестирования)
  async clearAllData(): Promise<ApiResponse<void>> {
    mockUsers.clear();
    initializeMockData();
    
    return {
      success: true,
      message: 'Все данные очищены'
    };
  }
}

export const mockApiService = new MockApiService();
