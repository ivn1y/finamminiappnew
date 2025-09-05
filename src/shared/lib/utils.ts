import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod";
export { zodToJsonSchema } from "zod-to-json-schema";
export { jsonSchemaToZod } from "json-schema-to-zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getValueByPath<T>(obj: T, path: string): unknown {
  try {
    if (!obj || typeof obj !== "object" || !path) return undefined;

    const keys = path.split('.');
    let current: any = obj;

    for (const key of keys) {
      if (current === null || current === undefined) return undefined;

      // Преобразуем числовые ключи (для массивов)
      const arrayKey = /^\d+$/.test(key) ? parseInt(key, 10) : key;
      
      // Проверяем существование ключа (безопасный доступ)
      if (!(arrayKey in current)) return undefined;
      
      current = current[arrayKey];
    }

    return current;
  } catch {
    return undefined; // На случай любых непредвиденных ошибок
  }
}


export function generateDataUrl(file: File, callback: (imageUrl: string) => void) {
  const reader = new FileReader();
  reader.onload = () => callback(reader.result as string);
  reader.readAsDataURL(file);
}

export const getInitDataFromUrl = (): string | null => {
  if (typeof window !== "undefined") {
    let initData = (window as any)?.Telegram?.WebApp?.initData;

    if (!initData) {
      const params = new URLSearchParams(window.location.search);
      initData = params.get('initData');
      
      if (initData) {
        initData = decodeURIComponent(initData);
      }
    }

    return initData;
  }
  
  // Возвращаем null, если код выполняется на сервере
  return null;
};

export const extendWithInitData = (url: string): string => {
  if (typeof window !== "undefined") {
    const webapp = (window as any)?.Telegram?.WebApp;
    let initData = webapp?.initData;
    console.log(initData, "from extendWithInitData")
    if (initData) {
      const encodedInitData = encodeURIComponent(initData);
      const urlObj = new URL(url);
      urlObj.searchParams.set('initData', encodedInitData);
      return urlObj.toString();
    }
  }

  // Возвращаем оригинальный URL, если код выполняется на сервере или нет initData
  return url;
};


export function objectToZodSchema(obj: Record<string, any>): z.ZodObject<any> {
  const schemaShape: Record<string, z.ZodTypeAny> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      // Преобразуем значение в строку для описания
      const description = `Example: ${value.toString()}`;

      // Определяем тип значения и создаем соответствующую Zod-схему
      if (typeof value === 'string') {
        schemaShape[key] = z.string().describe(description);
      } else if (typeof value === 'number') {
        schemaShape[key] = z.number().describe(description);
      } else if (typeof value === 'boolean') {
        schemaShape[key] = z.boolean().describe(description);
      } else if (Array.isArray(value)) {
        // Если значение — массив, проверяем тип его элементов
        if (value.length > 0) {
          const firstElement = value[0];
          if (typeof firstElement === 'string') {
            schemaShape[key] = z.array(z.string()).describe(description);
          } else if (typeof firstElement === 'number') {
            schemaShape[key] = z.array(z.number()).describe(description);
          } else if (typeof firstElement === 'boolean') {
            schemaShape[key] = z.array(z.boolean()).describe(description);
          } else {
            // Если тип элемента массива неизвестен, используем z.any()
            schemaShape[key] = z.array(z.any()).describe(description);
          }
        } else {
          // Если массив пустой, используем z.array(z.any())
          schemaShape[key] = z.array(z.any()).describe(description);
        }
      } else if (value && typeof value === 'object') {
        // Если значение — объект, рекурсивно создаем схему для него
        schemaShape[key] = objectToZodSchema(value).describe(description);
      } else {
        // Если тип неизвестен, используем z.any()
        schemaShape[key] = z.any().describe(description);
      }
    }
  }

  return z.object(schemaShape);
}

// Функция для форматирования времени с учетом timezone
export function formatTimeWithTimezone(dateString: string, timezone?: string): string {
  try {
    // Создаем Date объект из строки (предполагаем, что это UTC)
    const utcDate = new Date(dateString)
    
    // Проверяем валидность даты
    if (isNaN(utcDate.getTime())) {
      return 'Не указано'
    }
    
    // Получаем timezone пользователя
    let userTimezone = timezone
    if (!userTimezone) {
      userTimezone = getUserTimezone()
    }
    
    // Форматируем время в timezone пользователя
    return utcDate.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: userTimezone
    })
  } catch (error) {
    console.error('Error formatting time:', error)
    return 'Не указано'
  }
}

// Функция для получения текущего timezone пользователя
export function getUserTimezone(): string {
  // На сервере пытаемся получить из cookies
  if (typeof window === 'undefined') {
    try {
      const { cookies } = require('next/headers')
      const cookieStore = cookies()
      const timezoneCookie = cookieStore.get('user_timezone')
      return timezoneCookie?.value || 'Europe/Moscow'
    } catch (error) {
      // Если не удалось получить cookies, возвращаем дефолтное значение
      return 'Europe/Moscow'
    }
  }
  
  // На клиенте сначала проверяем localStorage, потом cookies
  try {
    const localStorageTimezone = localStorage.getItem('user_timezone')
    if (localStorageTimezone) {
      return localStorageTimezone
    }
    
    // Если нет в localStorage, проверяем cookies
    const cookies = document.cookie.split(';')
    const timezoneCookie = cookies.find(cookie => cookie.trim().startsWith('user_timezone='))
    if (timezoneCookie) {
      const timezone = timezoneCookie.split('=')[1]
      // Сохраняем в localStorage для быстрого доступа
      localStorage.setItem('user_timezone', timezone)
      return timezone
    }
  } catch (error) {
    console.warn('Error reading timezone from storage:', error)
  }
  
  return 'Europe/Moscow'
}

// Функция для получения timezone на сервере (для использования в server actions)
export function getServerTimezone(): string {
  try {
    const { cookies } = require('next/headers')
    const cookieStore = cookies()
    const timezoneCookie = cookieStore.get('user_timezone')
    return timezoneCookie?.value || 'Europe/Moscow'
  } catch (error) {
    return 'Europe/Moscow'
  }
}

// Функция для установки timezone пользователя
export function setUserTimezone(timezone: string): void {
  if (typeof window === 'undefined') {
    // На сервере не можем устанавливать cookies напрямую
    // Cookies должны устанавливаться через server actions или middleware
    console.warn('setUserTimezone called on server side - use server action instead')
    return
  } else {
    // На клиенте устанавливаем в localStorage и cookies
    try {
      localStorage.setItem('user_timezone', timezone)
      
      // Устанавливаем cookie
      document.cookie = `user_timezone=${timezone}; path=/; max-age=${365 * 24 * 60 * 60}; samesite=lax${process.env.NODE_ENV === 'production' ? '; secure' : ''}`
    } catch (error) {
      console.warn('Error setting timezone in client storage:', error)
    }
  }
}

// Функция для получения смещения timezone в минутах
function getTimezoneOffsetMinutes(timezone: string, date: Date = new Date()): number {
  // Используем известные смещения для популярных timezone
  const timezoneOffsets: Record<string, number> = {
    'Europe/Moscow': 180, // UTC+3
    'Europe/London': 0,   // UTC+0 (зима) / UTC+1 (лето)
    'America/New_York': -300, // UTC-5 (зима) / UTC-4 (лето)
    'America/Los_Angeles': -480, // UTC-8 (зима) / UTC-7 (лето)
    'Asia/Tokyo': 540,    // UTC+9
    'Australia/Sydney': 600, // UTC+10 (зима) / UTC+11 (лето)
    'Asia/Shanghai': 480, // UTC+8
    'Europe/Berlin': 60,  // UTC+1 (зима) / UTC+2 (лето)
    'Europe/Paris': 60,   // UTC+1 (зима) / UTC+2 (лето)
    'Asia/Dubai': 240,    // UTC+4
    'Asia/Kolkata': 330,  // UTC+5:30
    'America/Sao_Paulo': -180, // UTC-3 (зима) / UTC-2 (лето)
  }
  
  // Получаем смещение из известных значений
  let offset = timezoneOffsets[timezone]
  
  // Если timezone не найден в списке, используем fallback метод
  if (offset === undefined) {
    console.warn(`Unknown timezone: ${timezone}, using fallback method`)
    
    // Создаем дату в указанном timezone
    const dateInTimezone = new Date(date.toLocaleString('en-US', { timeZone: timezone }))
    
    // Создаем UTC дату с теми же компонентами
    const utcDate = new Date(Date.UTC(
      dateInTimezone.getFullYear(),
      dateInTimezone.getMonth(),
      dateInTimezone.getDate(),
      dateInTimezone.getHours(),
      dateInTimezone.getMinutes(),
      dateInTimezone.getSeconds(),
      dateInTimezone.getMilliseconds()
    ))
    
    // Вычисляем разницу в минутах
    offset = (utcDate.getTime() - dateInTimezone.getTime()) / (1000 * 60)
  }
  
  // Отладочная информация
  console.log(`getTimezoneOffsetMinutes - timezone: ${timezone}, offset: ${offset} minutes`)
  
  return offset
}

// Утилиты для работы с UTC датами с учетом timezone пользователя
export function getStartOfDayInTimezone(date: Date, timezone?: string): Date {
  const userTimezone = timezone || getUserTimezone()
  
  // Создаем дату в timezone пользователя
  const localDateString = date.toLocaleDateString('en-CA', { timeZone: userTimezone })
  const [year, month, day] = localDateString.split('-').map(Number)
  
  // Создаем UTC дату для начала дня в timezone пользователя
  const utcDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
  
  // Получаем смещение timezone в минутах
  const timezoneOffset = getTimezoneOffsetMinutes(userTimezone, utcDate)
  
  // Применяем смещение (вычитаем смещение, чтобы получить UTC время, которое соответствует 00:00 в timezone)
  const result = new Date(utcDate.getTime() - (timezoneOffset * 60 * 1000))
  
  // Отладочная информация
  console.log(`getStartOfDayInTimezone - input: ${date.toISOString()}, timezone: ${userTimezone}`)
  console.log(`getStartOfDayInTimezone - localDateString: ${localDateString}`)
  console.log(`getStartOfDayInTimezone - utcDate: ${utcDate.toISOString()}`)
  console.log(`getStartOfDayInTimezone - timezoneOffset: ${timezoneOffset}`)
  console.log(`getStartOfDayInTimezone - result: ${result.toISOString()}`)
  
  return result
}

export function getEndOfDayInTimezone(date: Date, timezone?: string): Date {
  const userTimezone = timezone || getUserTimezone()
  
  // Создаем дату в timezone пользователя
  const localDateString = date.toLocaleDateString('en-CA', { timeZone: userTimezone })
  const [year, month, day] = localDateString.split('-').map(Number)
  
  // Создаем UTC дату для конца дня в timezone пользователя
  const utcDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999))
  
  // Получаем смещение timezone в минутах
  const timezoneOffset = getTimezoneOffsetMinutes(userTimezone, utcDate)
  
  // Применяем смещение (вычитаем смещение, чтобы получить UTC время, которое соответствует 23:59:59.999 в timezone)
  const result = new Date(utcDate.getTime() - (timezoneOffset * 60 * 1000))
  
  // Отладочная информация
  if (typeof window !== 'undefined') {
    console.log(`getEndOfDayInTimezone - input: ${date.toISOString()}, timezone: ${userTimezone}`)
    console.log(`getEndOfDayInTimezone - localDateString: ${localDateString}`)
    console.log(`getEndOfDayInTimezone - utcDate: ${utcDate.toISOString()}`)
    console.log(`getEndOfDayInTimezone - timezoneOffset: ${timezoneOffset}`)
    console.log(`getEndOfDayInTimezone - result: ${result.toISOString()}`)
  }
  
  return result
}

export function getStartOfMonthInTimezone(date: Date, timezone?: string): Date {
  const userTimezone = timezone || getUserTimezone()
  
  // Создаем дату в timezone пользователя
  const localDate = new Date(date.getFullYear(), date.getMonth(), 1)
  const localDateInTimezone = new Date(localDate.toLocaleDateString('en-CA', { timeZone: userTimezone }))
  
  // Конвертируем обратно в UTC
  const utcDate = new Date(localDateInTimezone.getTime() - (localDateInTimezone.getTimezoneOffset() * 60000))
  
  return new Date(Date.UTC(utcDate.getFullYear(), utcDate.getMonth(), 1, 0, 0, 0, 0))
}

export function getEndOfMonthInTimezone(date: Date, timezone?: string): Date {
  const userTimezone = timezone || getUserTimezone()
  
  // Создаем дату в timezone пользователя
  const localDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  const localDateInTimezone = new Date(localDate.toLocaleDateString('en-CA', { timeZone: userTimezone }))
  
  // Конвертируем обратно в UTC
  const utcDate = new Date(localDateInTimezone.getTime() - (localDateInTimezone.getTimezoneOffset() * 60000))
  
  return new Date(Date.UTC(utcDate.getFullYear(), utcDate.getMonth(), utcDate.getDate(), 23, 59, 59, 999))
}

// Обратная совместимость с существующими UTC функциями
export function getStartOfDayUTC(date: Date): Date {
  return getStartOfDayInTimezone(date)
}

export function getEndOfDayUTC(date: Date): Date {
  return getEndOfDayInTimezone(date)
}

export function getStartOfMonthUTC(date: Date): Date {
  return getStartOfMonthInTimezone(date)
}

export function getEndOfMonthUTC(date: Date): Date {
  return getEndOfMonthInTimezone(date)
}
