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

// ============================================
// Profile Data Mapping
// ============================================

/**
 * Маппинг данных профиля пользователя в формат CRM
 */
export function mapUserProfileToCRM(user: User, additionalData?: Partial<CRMFormData>): CRMFormData {
  // Базовые данные из профиля
  const baseData: CRMFormData = {
    fullName: user.name || 'Пользователь',
    email: user.credentials?.email || '',
    phone: user.credentials?.phone || '',
    direction: user.role || 'guest',
    message: additionalData?.message || `Заявка от пользователя ${user.name || user.id}`,
    sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
  };

  // Маппинг специфичных данных по ролям
  switch (user.role) {
    case 'trader':
      return {
        ...baseData,
        direction: 'trader',
        market: user.profile?.trader?.markets?.[0] || additionalData?.market,
        risk: mapRiskLevel(user.profile?.trader?.risk) || additionalData?.risk,
        ...additionalData,
      };

    case 'startup':
      return {
        ...baseData,
        direction: 'startup',
        subDirection: mapStartupStage(user.profile?.startup?.stage) || additionalData?.subDirection,
        ...additionalData,
      };

    case 'expert':
      return {
        ...baseData,
        direction: 'expert',
        profile: user.profile?.expert?.domain || additionalData?.profile,
        ...additionalData,
      };

    case 'partner':
      return {
        ...baseData,
        direction: 'business',
        interest: mapPartnerInterest(user.profile?.partner?.interest) || additionalData?.interest,
        ...additionalData,
      };

    case 'scout':
      return {
        ...baseData,
        direction: 'scout',
        subDirection: additionalData?.subDirection || 'Региональные скауты',
        ...additionalData,
      };

    default:
      return {
        ...baseData,
        ...additionalData,
      };
  }
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
  // Маппим данные профиля пользователя
  const crmData = mapUserProfileToCRM(user, additionalData);

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
