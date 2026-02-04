'use client';

import { User } from '@/shared/types/app';

// ============================================
// Types
// ============================================

export interface CRMFormData {
  fullName: string;
  email: string;
  phone?: string;
  direction: string;
  subDirection?: string;
  market?: string;
  risk?: string;
  profile?: string;
  interest?: string;
  message?: string;
  sourceUrl?: string;
  referral?: string;
}

export interface CRMSubmissionResult {
  success: boolean;
  message: string;
  details?: any;
}

export interface CRMSubmissionRequest extends CRMFormData {
  utmParams?: Record<string, string>;
}

/**
 * Данные из маркетинговой формы ввода
 */
export interface MarketingFormData {
  name: string;
  email: string;
  phone: string;
  role: string | null;
  roleHistory?: Array<{ role: string; timestamp: string }>;
  company?: string;
  position?: string;
  goals?: string;
  interests?: string;
}

// ============================================
// Profile Data Mapping
// ============================================

/**
 * Маппинг данных профиля пользователя в формат CRM
 */
export function mapUserProfileToCRM(user: User, additionalData?: Partial<CRMFormData>): CRMFormData {
  console.log('📝 [MAP-USER-TO-CRM] Маппинг данных пользователя:', {
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    hasCredentials: !!user.credentials,
    email: user.credentials?.email || 'ОТСУТСТВУЕТ',
    phone: user.credentials?.phone || 'ОТСУТСТВУЕТ',
    additionalDataKeys: additionalData ? Object.keys(additionalData) : []
  });
  
  // Базовые данные из профиля
  const email = user.credentials?.email || additionalData?.email || '';
  const phone = user.credentials?.phone || additionalData?.phone || '';
  const fullName = user.name || additionalData?.fullName || 'Пользователь';
  const direction = user.role || additionalData?.direction || 'guest';
  
  if (!email) {
    console.error('❌ [MAP-USER-TO-CRM] КРИТИЧЕСКАЯ ОШИБКА: email отсутствует!', {
      userCredentials: user.credentials,
      additionalDataEmail: additionalData?.email
    });
  }
  
  const baseData: CRMFormData = {
    fullName,
    email,
    phone,
    direction,
    message: additionalData?.message || `Заявка от пользователя ${fullName}`,
    sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
  };
  
  console.log('📝 [MAP-USER-TO-CRM] Сформированные базовые данные:', {
    fullName: baseData.fullName,
    email: baseData.email || 'ПУСТО!',
    phone: baseData.phone || 'отсутствует',
    direction: baseData.direction
  });

  // Маппинг специфичных данных по ролям
  let result: CRMFormData;
  switch (user.role) {
    case 'trader':
      result = {
        ...baseData,
        direction: 'trader',
        market: user.profile?.trader?.markets?.[0] || additionalData?.market,
        risk: mapRiskLevel(user.profile?.trader?.risk) || additionalData?.risk,
        ...additionalData,
      };
      break;

    case 'startup':
      result = {
        ...baseData,
        direction: 'startup',
        subDirection: mapStartupStage(user.profile?.startup?.stage) || additionalData?.subDirection,
        ...additionalData,
      };
      break;

    case 'expert':
      result = {
        ...baseData,
        direction: 'expert',
        profile: user.profile?.expert?.domain || additionalData?.profile,
        ...additionalData,
      };
      break;

    case 'partner':
      result = {
        ...baseData,
        direction: 'business',
        interest: mapPartnerInterest(user.profile?.partner?.interest) || additionalData?.interest,
        ...additionalData,
      };
      break;

    case 'scout':
      result = {
        ...baseData,
        direction: 'scout',
        subDirection: additionalData?.subDirection || 'Региональные скауты',
        ...additionalData,
      };
      break;

    default:
      result = {
        ...baseData,
        ...additionalData,
      };
  }
  
  // Убеждаемся, что email не потерялся при spread additionalData
  if (!result.email && email) {
    console.warn('⚠️ [MAP-USER-TO-CRM] Email был потерян при spread, восстанавливаем...');
    result.email = email;
  }
  
  console.log('📝 [MAP-USER-TO-CRM] Финальный результат:', {
    fullName: result.fullName,
    email: result.email || 'ПУСТО!',
    phone: result.phone || 'отсутствует',
    direction: result.direction
  });
  
  return result;
}

/**
 * Маппинг уровня риска из профиля в формат CRM
 */
function mapRiskLevel(risk?: 'low' | 'medium' | 'high'): string | undefined {
  switch (risk) {
    case 'low':
      return 'Консервативный';
    case 'medium':
      return 'Умеренный';
    case 'high':
      return 'Агрессивный';
    default:
      return undefined;
  }
}

/**
 * Маппинг стадии стартапа в поднаправление
 */
function mapStartupStage(stage?: 'idea' | 'MVP' | 'PMF' | 'Scale'): string | undefined {
  switch (stage) {
    case 'idea':
      return 'Инновации в UX/UI и мобильных платформах';
    case 'MVP':
      return 'Торговые системы и автоматизация';
    case 'PMF':
      return 'Финансовые операции и интеграция';
    case 'Scale':
      return 'Искусственный интеллект и оптимизация';
    default:
      return 'Другое';
  }
}

/**
 * Маппинг интереса партнера
 */
function mapPartnerInterest(interest?: 'white-label' | 'franchise' | 'api'): string | undefined {
  switch (interest) {
    case 'white-label':
      return 'Запуск совместного проекта';
    case 'franchise':
      return 'Открыть франшизу';
    case 'api':
      return 'Кроссейл';
    default:
      return 'Другое (Укажите)';
  }
}

/**
 * Маппинг роли пользователя в направление для CRM
 */
function mapRoleToDirection(role: string | null): string {
  if (!role) return 'guest';
  
  const roleMap: Record<string, string> = {
    trader: 'trader',
    startup: 'startup',
    expert: 'expert',
    partner: 'business',
    scout: 'scout',
    guest: 'guest',
  };
  
  return roleMap[role] || 'guest';
}

// ============================================
// CRM API Client
// ============================================

/**
 * Отправка заявки в CRM
 */
export async function submitToCRM(data: CRMSubmissionRequest): Promise<CRMSubmissionResult> {
  try {
    console.log('📤 Отправка заявки в CRM:', { direction: data.direction });

    // Подготавливаем заголовки с UTM параметрами
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Добавляем UTM параметры в заголовки, если есть
    if (data.utmParams) {
      Object.entries(data.utmParams).forEach(([key, value]) => {
        if (value && value.trim()) {
          headers[`x-${key.replace('_', '-')}`] = value;
        }
      });
    }

    const response = await fetch('/api/crm-submit', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Ошибка отправки в CRM:', result);
      return {
        success: false,
        message: result.message || `Ошибка ${response.status}`,
        details: result.details,
      };
    }

    console.log('✅ Заявка успешно отправлена в CRM');
    return result;

  } catch (error: any) {
    console.error('❌ Критическая ошибка при отправке в CRM:', error);
    return {
      success: false,
      message: 'Ошибка сети при отправке заявки',
      details: { error: error.message },
    };
  }
}

/**
 * Отправка заявки от пользователя с автоматическим маппингом профиля
 */
export async function submitUserApplicationToCRM(
  user: User,
  additionalData?: Partial<CRMFormData>,
  utmParams?: Record<string, string>
): Promise<CRMSubmissionResult> {
  console.log('📤 [SUBMIT-USER-TO-CRM] Начинаем отправку заявки пользователя:', {
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    hasCredentials: !!user.credentials,
    email: user.credentials?.email || 'ОТСУТСТВУЕТ',
    phone: user.credentials?.phone || 'отсутствует',
    additionalData: additionalData ? Object.keys(additionalData) : []
  });
  
  // Маппим данные профиля пользователя
  const crmData = mapUserProfileToCRM(user, additionalData);
  
  console.log('📤 [SUBMIT-USER-TO-CRM] Данные после маппинга:', {
    fullName: crmData.fullName,
    email: crmData.email || 'ПУСТО!',
    phone: crmData.phone || 'отсутствует',
    direction: crmData.direction
  });

  // Добавляем UTM параметры из URL, если не переданы
  const finalUtmParams = utmParams || extractUtmFromUrl();

  return submitToCRM({
    ...crmData,
    utmParams: finalUtmParams,
  });
}

/**
 * Извлечение UTM параметров из URL
 */
export function extractUtmFromUrl(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  const urlParams = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};

  // Стандартные UTM параметры
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(param => {
    const value = urlParams.get(param);
    if (value) utmParams[param] = value;
  });

  // Внутренние параметры
  ['int_source', 'int_medium', 'int_campaign', 'int_content', 'int_term'].forEach(param => {
    const value = urlParams.get(param);
    if (value) utmParams[param] = value;
  });

  return utmParams;
}

/**
 * Быстрая отправка заявки "Записаться" для чата
 */
export async function submitBookingRequest(
  user: User,
  message?: string
): Promise<CRMSubmissionResult> {
  return submitUserApplicationToCRM(user, {
    message: message || `Заявка на запись от пользователя ${user.name || user.id}. Источник: чат-ассистент`,
    sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
  });
}

/**
 * Отправка данных из маркетинговой формы ввода в CRM
 * Используется для страницы data-input с формой регистрации
 */
export async function submitMarketingUserRequest(
  formData: MarketingFormData
): Promise<CRMSubmissionResult> {
  console.log('📤 [SUBMIT-MARKETING-TO-CRM] Начинаем отправку данных из маркетинговой формы:', {
    name: formData.name,
    email: formData.email,
    phone: formData.phone ? 'есть' : 'отсутствует',
    role: formData.role || 'не указана',
    hasRoleHistory: !!formData.roleHistory?.length,
    hasCompany: !!formData.company,
    hasPosition: !!formData.position,
    hasGoals: !!formData.goals,
    hasInterests: !!formData.interests,
  });

  // Маппинг роли в направление
  const direction = mapRoleToDirection(formData.role);

  // Формируем сообщение из дополнительных данных
  const messageParts: string[] = [];
  
  if (formData.goals) {
    messageParts.push(`Цели: ${formData.goals}`);
  }
  
  if (formData.company) {
    messageParts.push(`Компания: ${formData.company}`);
  }
  
  if (formData.position) {
    messageParts.push(`Должность: ${formData.position}`);
  }
  
  if (formData.roleHistory && formData.roleHistory.length > 0) {
    const historyText = formData.roleHistory
      .map(h => `${h.role} (${new Date(h.timestamp).toLocaleString('ru-RU')})`)
      .join(', ');
    messageParts.push(`История выбора ролей: ${historyText}`);
  }

  // Формируем данные для CRM
  const crmData: CRMFormData = {
    fullName: formData.name,
    email: formData.email,
    phone: formData.phone,
    direction: direction,
    interest: formData.interests,
    message: messageParts.length > 0 ? messageParts.join('\n') : 'Заявка из маркетинговой формы',
    sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
  };

  console.log('📤 [SUBMIT-MARKETING-TO-CRM] Данные после маппинга:', {
    fullName: crmData.fullName,
    email: crmData.email || 'ПУСТО!',
    phone: crmData.phone || 'отсутствует',
    direction: crmData.direction,
    hasMessage: !!crmData.message,
    messageLength: crmData.message?.length || 0,
  });

  // Извлекаем UTM параметры из URL
  const utmParams = extractUtmFromUrl();

  return submitToCRM({
    ...crmData,
    utmParams,
  });
}
