// Analytics service for logging events to localStorage and API
import { mockApiClient, AnalyticsEvent, LogEventRequest } from './mock-api-client'

export type AnalyticsEventType = 
  | 'role_selected' 
  | 'profile_submitted' 
  | 'quest_completed' 
  | 'qr_scanned' 
  | 'badge_earned'

export interface AnalyticsEventData {
  role_selected: { role: string; timestamp: string }
  profile_submitted: { profileType: string; fields: string[]; timestamp: string }
  quest_completed: { questId: string; questType: string; xpEarned: number; timestamp: string }
  qr_scanned: { qrCode: string; rewardType: string; rewardValue: string; timestamp: string }
  badge_earned: { badgeId: string; badgeName: string; xpEarned: number; timestamp: string }
}

class AnalyticsService {
  private readonly STORAGE_KEY = 'finam_analytics_events'
  private readonly MAX_LOCAL_EVENTS = 1000
  private isOnline: boolean = true
  private retryQueue: LogEventRequest[] = []

  constructor() {
    // Проверяем онлайн статус
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true
    
    // Слушаем изменения онлайн статуса
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true
        this.processRetryQueue()
      })
      
      window.addEventListener('offline', () => {
        this.isOnline = false
      })
    }
  }

  // Логировать событие
  async logEvent<T extends AnalyticsEventType>(
    eventType: T,
    data: AnalyticsEventData[T],
    userId?: string
  ): Promise<void> {
    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: userId || 'anonymous',
      eventType,
      data: {
        ...data,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        url: typeof window !== 'undefined' ? window.location.href : '',
        referrer: typeof document !== 'undefined' ? document.referrer : ''
      },
      createdAt: new Date().toISOString()
    }

    // Сохраняем в localStorage
    this.saveToLocalStorage(event)

    // Логируем в консоль для отладки
    this.logToConsole(event)

    // Отправляем в API если онлайн
    if (this.isOnline) {
      try {
        await this.sendToAPI(event)
      } catch (error) {
        console.warn('[Analytics] Failed to send event to API, adding to retry queue:', error)
        this.addToRetryQueue(event)
      }
    } else {
      console.log('[Analytics] Offline, event saved locally and added to retry queue')
      this.addToRetryQueue(event)
    }
  }

  // Сохранить в localStorage
  private saveToLocalStorage(event: AnalyticsEvent): void {
    if (typeof window === 'undefined') return

    try {
      const existingEvents = this.getLocalEvents()
      const updatedEvents = [event, ...existingEvents].slice(0, this.MAX_LOCAL_EVENTS)
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedEvents))
    } catch (error) {
      console.error('[Analytics] Failed to save event to localStorage:', error)
    }
  }

  // Получить события из localStorage
  getLocalEvents(): AnalyticsEvent[] {
    if (typeof window === 'undefined') return []

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('[Analytics] Failed to get events from localStorage:', error)
      return []
    }
  }

  // Очистить локальные события
  clearLocalEvents(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(this.STORAGE_KEY)
      console.log('[Analytics] Local events cleared')
    } catch (error) {
      console.error('[Analytics] Failed to clear local events:', error)
    }
  }

  // Отправить в API
  private async sendToAPI(event: AnalyticsEvent): Promise<void> {
    const request: LogEventRequest = {
      userId: event.userId,
      eventType: event.eventType,
      data: event.data
    }

    await mockApiClient.logEvent(request)
  }

  // Добавить в очередь повторов
  private addToRetryQueue(event: AnalyticsEvent): void {
    const request: LogEventRequest = {
      userId: event.userId,
      eventType: event.eventType,
      data: event.data
    }
    
    this.retryQueue.push(request)
  }

  // Обработать очередь повторов
  private async processRetryQueue(): Promise<void> {
    if (this.retryQueue.length === 0) return

    console.log(`[Analytics] Processing ${this.retryQueue.length} events from retry queue`)

    const eventsToProcess = [...this.retryQueue]
    this.retryQueue = []

    for (const event of eventsToProcess) {
      try {
        await mockApiClient.logEvent(event)
        console.log('[Analytics] Successfully sent retry event:', event.eventType)
      } catch (error) {
        console.warn('[Analytics] Failed to send retry event, re-adding to queue:', error)
        this.retryQueue.push(event)
      }
    }
  }

  // Логировать в консоль для отладки
  private logToConsole(event: AnalyticsEvent): void {
    const style = 'background: #4CAF50; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;'
    const eventStyle = 'background: #2196F3; color: white; padding: 2px 6px; border-radius: 3px;'
    
    console.group(`%c[Analytics]%c ${event.eventType}`, style, eventStyle)
    console.log('Event ID:', event.id)
    console.log('User ID:', event.userId)
    console.log('Data:', event.data)
    console.log('Timestamp:', event.createdAt)
    console.groupEnd()
  }

  // Получить статистику событий
  getEventStats(): {
    totalEvents: number
    eventsByType: Record<string, number>
    recentEvents: AnalyticsEvent[]
  } {
    const events = this.getLocalEvents()
    const eventsByType = events.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalEvents: events.length,
      eventsByType,
      recentEvents: events.slice(0, 10)
    }
  }

  // Экспорт событий для отладки
  exportEvents(): string {
    const events = this.getLocalEvents()
    return JSON.stringify(events, null, 2)
  }

  // Импорт событий
  importEvents(eventsJson: string): boolean {
    try {
      const events = JSON.parse(eventsJson)
      if (Array.isArray(events)) {
        localStorage.setItem(this.STORAGE_KEY, eventsJson)
        console.log('[Analytics] Events imported successfully')
        return true
      }
      return false
    } catch (error) {
      console.error('[Analytics] Failed to import events:', error)
      return false
    }
  }

  // Синхронизировать с сервером
  async syncWithServer(): Promise<void> {
    if (!this.isOnline) {
      console.log('[Analytics] Cannot sync: offline')
      return
    }

    const localEvents = this.getLocalEvents()
    console.log(`[Analytics] Syncing ${localEvents.length} local events with server`)

    for (const event of localEvents) {
      try {
        await this.sendToAPI(event)
      } catch (error) {
        console.warn('[Analytics] Failed to sync event:', error)
      }
    }

    // Очищаем локальные события после успешной синхронизации
    this.clearLocalEvents()
  }
}

export const analyticsService = new AnalyticsService()

// Удобные функции для логирования конкретных событий
export const logRoleSelected = (role: string, userId?: string) => 
  analyticsService.logEvent('role_selected', { role, timestamp: new Date().toISOString() }, userId)

export const logProfileSubmitted = (profileType: string, fields: string[], userId?: string) => 
  analyticsService.logEvent('profile_submitted', { profileType, fields, timestamp: new Date().toISOString() }, userId)

export const logQuestCompleted = (questId: string, questType: string, xpEarned: number, userId?: string) => 
  analyticsService.logEvent('quest_completed', { questId, questType, xpEarned, timestamp: new Date().toISOString() }, userId)

export const logQRScanned = (qrCode: string, rewardType: string, rewardValue: string, userId?: string) => 
  analyticsService.logEvent('qr_scanned', { qrCode, rewardType, rewardValue, timestamp: new Date().toISOString() }, userId)

export const logBadgeEarned = (badgeId: string, badgeName: string, xpEarned: number, userId?: string) => 
  analyticsService.logEvent('badge_earned', { badgeId, badgeName, xpEarned, timestamp: new Date().toISOString() }, userId)
