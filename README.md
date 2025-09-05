# Nutriya - Telegram WebApp

Система авторизации для Telegram WebApp с интеграцией в централизованный сервис управления пользователями (User-Gate) через NextAuth.

## Возможности

- ✅ Автоматическое определение запуска в Telegram WebApp
- ✅ Получение данных пользователя из Telegram WebApp API
- ✅ Проверка подписи Telegram данных
- ✅ Создание/обновление пользователя в User-Gate
- ✅ Создание NextAuth сессии
- ✅ HMAC подпись всех запросов к User-Gate API
- ✅ Синхронизация данных пользователя
- ✅ Получение информации о подписке
- ✅ Отображение данных пользователя с revalidate каждые 15 секунд

## Настройка

### 1. Переменные окружения

Создайте файл `.env.local` в корне проекта:

```env
# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-telegram-bot-token

# User-Gate API
USER_GATE_BASE_URL=http://localhost:8000
USER_GATE_CLIENT_ID=your-client-id
USER_GATE_SECRET_KEY=your-secret-key
```

### 2. Настройка Telegram Bot

1. Создайте бота через @BotFather
2. Получите токен бота
3. Настройте WebApp в боте:
   ```
   /setmenubutton
   /newapp
   ```

### 3. Настройка User-Gate

1. Убедитесь, что User-Gate сервис запущен
2. Создайте клиента в User-Gate с получением `client_id` и `secret_key`
3. Настройте схему данных для пользователей

## Архитектура

### SDK для User-Gate API

```typescript
// apps/web/src/shared/lib/user-gate-sdk.ts
export class UserGateSDK {
  // HMAC подпись запросов
  // Retry логика
  // Методы для работы с пользователями и подписками
}
```

### Telegram WebApp утилиты

```typescript
// apps/web/src/shared/lib/telegram-webapp.ts
export function validateTelegramSignature(initData: string, botToken: string): boolean
export function parseInitData(initData: string): TelegramWebAppInitData | null
export function isTelegramWebApp(): boolean
```

### NextAuth конфигурация

```typescript
// apps/web/src/auth.ts
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    {
      id: 'telegram',
      // Кастомный провайдер для Telegram WebApp
    }
  ]
})
```

## Поток авторизации

1. Пользователь запускает WebApp в Telegram
2. Получение `initData` от Telegram WebApp
3. Проверка подписи Telegram данных
4. Запрос к User-Gate для создания/обновления пользователя
5. Создание NextAuth сессии
6. Загрузка данных пользователя и подписки

## API Endpoints

### `/api/auth/[...nextauth]`
- NextAuth роуты для авторизации

### `/api/user-data`
- GET: Получение данных пользователя (revalidate: 15s)
- POST: Сохранение данных пользователя

## Компоненты

### TelegramAuthButton
```typescript
// apps/web/src/features/telegram-auth/ui/telegram-auth-button.tsx
export function TelegramAuthButton() {
  // Авторизация через Telegram WebApp
}
```

### DashboardContent
```typescript
// apps/web/src/app/(base)/dashboard/dashboard-content.tsx
export function DashboardContent() {
  // Интерфейс по референсу дизайна
  // Отображение данных пользователя и подписки
}
```

## Безопасность

- ✅ Проверка подписи Telegram WebApp данных
- ✅ HMAC подпись для User-Gate API
- ✅ Валидация временных меток запросов
- ✅ Защита от replay-атак
- ✅ Graceful degradation при недоступности User-Gate
- ✅ Retry логика для API запросов
- ✅ Логирование ошибок

## Запуск

```bash
# Установка зависимостей
pnpm install

# Запуск в режиме разработки
pnpm dev

# Сборка для продакшена
pnpm build
pnpm start
```

## Структура проекта

```
apps/web/src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   └── user-data/route.ts
│   ├── (base)/
│   │   ├── auth/
│   │   │   └── auth-form.tsx
│   │   └── dashboard/
│   │       ├── page.tsx
│   │       └── dashboard-content.tsx
│   └── providers/
│       └── index.tsx
├── features/
│   └── telegram-auth/
│       └── ui/
│           └── telegram-auth-button.tsx
├── shared/
│   ├── lib/
│   │   ├── telegram-webapp.ts
│   │   ├── telegram-provider.ts
│   │   └── user-gate-sdk.ts
│   └── ui/
└── auth.ts
```

## Тестирование

1. Откройте приложение в Telegram WebApp
2. Проверьте авторизацию через Telegram
3. Убедитесь, что данные синхронизируются с User-Gate
4. Проверьте отображение подписки и данных пользователя