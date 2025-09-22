# Mock API для PoC

Этот мок-API предназначен для разработки и тестирования фронтенда без необходимости подключения к реальному бэкенду.

## Запуск

### Только мок-API
```bash
npm run mock-api
```

### Мок-API + фронтенд одновременно
```bash
npm run dev:full
```

## Endpoints

### Пользователи

#### POST /api/createUser
Создать нового пользователя

**Request:**
```json
{
  "name": "Имя пользователя",
  "role": "trader",
  "profile": {
    "trader": {
      "years": 3,
      "markets": ["forex", "crypto"],
      "risk": "medium"
    }
  },
  "intent7d": "Цель на 7 дней"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... }
  },
  "message": "Пользователь успешно создан"
}
```

#### PUT /api/updateUser/:id
Обновить пользователя

**Request:**
```json
{
  "name": "Новое имя",
  "profile": { ... },
  "xp": 200
}
```

#### GET /api/users/:id
Получить пользователя по ID

#### GET /api/users
Получить всех пользователей

### Контент

#### GET /api/getContent
Получить весь контент

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "content_1",
      "type": "article",
      "title": "Основы трейдинга",
      "description": "Введение в мир трейдинга",
      "content": "Трейдинг - это искусство...",
      "tags": ["education", "trading"],
      "difficulty": "beginner",
      "xpReward": 50,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### QR коды

#### POST /api/redeemQR
Использовать QR код

**Request:**
```json
{
  "qrCode": "TRADER_001",
  "userId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "reward": {
      "type": "badge",
      "value": "first_trade",
      "xp": 100
    }
  },
  "message": "QR код успешно использован"
}
```

### Аналитика

#### POST /api/logEvent
Логировать событие

**Request:**
```json
{
  "userId": "user_123",
  "eventType": "role_selected",
  "data": {
    "role": "trader",
    "timestamp": "2024-01-01T10:00:00.000Z"
  }
}
```

#### GET /api/events/:userId
Получить события пользователя

## Структура данных

### Пользователь
```typescript
interface User {
  id: string
  createdAt: string
  role: 'trader' | 'startup' | 'expert' | 'partner' | null
  profile: {
    trader?: {
      years: number
      markets: string[]
      risk: 'low' | 'medium' | 'high'
    }
    // ... другие роли
  }
  intent7d: string
  badges: string[]
  xp: number
  progressSteps: number
  name: string
  goalProgress: {
    current: number
    target: number
    daysLeft: number
    notes: Array<{
      id: number
      text: string
      date: string
      progress: number
    }>
    milestones: Array<{
      id: number
      title: string
      completed: boolean
      date: string | null
    }>
  }
}
```

### События аналитики
```typescript
interface AnalyticsEvent {
  id: string
  userId: string
  eventType: 'role_selected' | 'profile_submitted' | 'quest_completed' | 'qr_scanned' | 'badge_earned'
  data: Record<string, any>
  createdAt: string
}
```

## Настройка

### Переменные окружения
- `NEXT_PUBLIC_USE_MOCK_API=true` - использовать мок-API
- `PORT=3001` - порт для мок-API (по умолчанию 3001)

### Переключение режимов
В коде можно переключать между мок и реальным API:
```typescript
import { unifiedApiService } from '@/shared/lib/unified-api-service'

// Переключить на мок-API
unifiedApiService.setMockMode(true)

// Переключить на реальный API
unifiedApiService.setMockMode(false)
```

## Отладка

### Analytics Debug Panel
В правом нижнем углу приложения есть панель отладки аналитики, которая показывает:
- Количество событий
- Статистику по типам событий
- Последние события
- Возможность экспорта/очистки данных

### Логирование
Все события логируются в консоль браузера с цветовой подсветкой для удобства отладки.

## Тестирование

### Тестовые данные
В `db.json` уже есть тестовые данные:
- Пользователь с ID `user_123`
- QR коды для тестирования
- Контент для демонстрации

### Тестовые QR коды
- `TRADER_001` - бейдж "first_trade" + 100 XP
- `CONTENT_001` - разблокировка контента + 25 XP
