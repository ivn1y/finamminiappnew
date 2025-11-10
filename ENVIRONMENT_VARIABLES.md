# Environment Variables Configuration

## Обзор

Данный документ описывает все переменные окружения, необходимые для работы web проекта. Переменные разделены на серверные (приватные) и клиентские (публичные).

## ⚠️ Важные правила безопасности

1. **Серверные переменные** - доступны только на сервере, НЕ передаются клиенту
2. **Клиентские переменные** - должны иметь префикс `NEXT_PUBLIC_`, передаются в браузер
3. **Никогда не используйте** `NEXT_PUBLIC_` для секретных данных (API ключи, токены, пароли)

## 📋 Обязательные переменные

### Next.js Authentication
```bash
# Секретный ключ для подписи JWT токенов (СЕРВЕРНАЯ)
NEXTAUTH_SECRET=your-very-secure-secret-key-min-32-chars

# URL приложения (СЕРВЕРНАЯ)
NEXTAUTH_URL=http://localhost:3000
```

### Telegram Bot Configuration
```bash
# Токен Telegram бота (СЕРВЕРНАЯ)
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz

# Публичное имя бота для клиентских компонентов (КЛИЕНТСКАЯ)
NEXT_PUBLIC_TELEGRAM_BOT_NAME=your_bot_name
```

### API Configuration
```bash
# URL внутреннего API (КЛИЕНТСКАЯ - используется в браузере для запросов)
NEXT_PUBLIC_API_URL=http://localhost:8000

# URL для серверных запросов, если отличается от публичного (СЕРВЕРНАЯ)
INTERNAL_API_URL=http://localhost:8000
```

## 🔧 CRM Integration

### Основные настройки CRM
```bash
# URL CRM API (СЕРВЕРНАЯ)
CRM_API_URL=https://api.finam.tech

# Общий Form UID по умолчанию (СЕРВЕРНАЯ)
CRM_FORM_UID=779

# Endpoint для отправки заявок в CRM (СЕРВЕРНАЯ)
# Может быть локальным (/api/crm-submit) или внешним URL (https://.../api/crm-submit)
# По умолчанию: /api/crm-submit
CRM_SUBMIT_ENDPOINT=/api/crm-submit
```

### CRM Form UIDs по направлениям (опционально)
```bash
# Form UID для трейдеров (СЕРВЕРНАЯ)
CRM_FORM_UID_TRADER=779

# Form UID для стартапов (СЕРВЕРНАЯ)
CRM_FORM_UID_STARTUP=778

# Form UID для экспертов (СЕРВЕРНАЯ)
CRM_FORM_UID_EXPERT=7243

# Form UID для скаутов (СЕРВЕРНАЯ)
CRM_FORM_UID_SCOUT=705

# Form UID для партнеров (СЕРВЕРНАЯ)
CRM_FORM_UID_PARTNER=7206
```

## 🤖 AI Chat Configuration

### MCP Server
```bash
# URL MCP сервера для AI инструментов (СЕРВЕРНАЯ)
MCP_SERVER_URL=https://flow.changesandbox.ru/mcp/2353930c-19b8-42e1-8068-61e89505310a
```

### OpenAI/AI Provider
```bash
# API ключ для OpenAI (СЕРВЕРНАЯ)
OPENAI_API_KEY=sk-your-openai-api-key

# Модель по умолчанию (СЕРВЕРНАЯ)
AI_MODEL=gpt-4o-mini

# Температура для AI ответов (СЕРВЕРНАЯ)
AI_TEMPERATURE=0.7
```

### Chat API Proxy
```bash
# Endpoint для проксирования запросов чата (СЕРВЕРНАЯ)
# Может быть локальным (/api/chat) или внешним URL (https://.../api/chat)
# Используется для работы с другим инстансом приложения внутри контура
# По умолчанию: /api/chat
CHAT_API_ENDPOINT=/api/chat
```

## 📊 Analytics & Monitoring (опционально)

### Yandex Metrika
```bash
# ID счетчика Yandex Metrika (КЛИЕНТСКАЯ)
NEXT_PUBLIC_YANDEX_METRIKA_ID=12345678

# Включить/выключить аналитику (КЛИЕНТСКАЯ)
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

### Sentry (опционально)
```bash
# DSN для Sentry (КЛИЕНТСКАЯ)
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id

# Окружение для Sentry (СЕРВЕРНАЯ)
SENTRY_ENVIRONMENT=production
```

## 🗄️ Database (если используется)

```bash
# URL подключения к базе данных (СЕРВЕРНАЯ)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# URL для Redis (если используется) (СЕРВЕРНАЯ)
REDIS_URL=redis://localhost:6379
```

## 🤖 Huntflow Integration (опционально)

```bash
# Huntflow API настройки (ВСЕ СЕРВЕРНЫЕ)
HUNTFLOW_API_TOKEN=your-huntflow-api-token
HUNTFLOW_ACCOUNT_ID=12345
HUNTFLOW_VACANCY_ID=67890
HUNTFLOW_STATUS_ID=1
```

## 📱 Telegram Integration (опционально)

```bash
# Telegram Bot настройки (ВСЕ СЕРВЕРНЫЕ)
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=-1001234567890
```

## 🔐 Email Configuration (опционально)

```bash
# SMTP настройки для отправки email (ВСЕ СЕРВЕРНЫЕ)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@finamcollab.com
```

## 📱 Mobile/PWA Configuration

```bash
# URL для манифеста PWA (КЛИЕНТСКАЯ)
NEXT_PUBLIC_MANIFEST_URL=/manifest.json

# Включить Service Worker (КЛИЕНТСКАЯ)
NEXT_PUBLIC_SW_ENABLED=true
```

## 🌍 Internationalization (опционально)

```bash
# Язык по умолчанию (КЛИЕНТСКАЯ)
NEXT_PUBLIC_DEFAULT_LOCALE=ru

# Поддерживаемые языки (КЛИЕНТСКАЯ)
NEXT_PUBLIC_SUPPORTED_LOCALES=ru,en
```

## 🚀 Deployment Configuration

### Production
```bash
# Окружение (СЕРВЕРНАЯ)
NODE_ENV=production

# Уровень логирования (СЕРВЕРНАЯ)
LOG_LEVEL=info

# Порт для сервера (СЕРВЕРНАЯ)
PORT=3000

# Хост для сервера (СЕРВЕРНАЯ)
HOST=0.0.0.0
```

### Development
```bash
# Окружение (СЕРВЕРНАЯ)
NODE_ENV=development

# Уровень логирования (СЕРВЕРНАЯ)
LOG_LEVEL=debug

# Включить детальные ошибки (СЕРВЕРНАЯ)
DETAILED_ERRORS=true
```

## 📝 Пример .env.local файла

```bash
# ============================================
# NEXT.JS CONFIGURATION
# ============================================
NEXTAUTH_SECRET=your-super-secret-key-at-least-32-characters-long
NEXTAUTH_URL=http://localhost:3000

# ============================================
# TELEGRAM CONFIGURATION
# ============================================
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
NEXT_PUBLIC_TELEGRAM_BOT_NAME=finam_collab_bot

# ============================================
# API CONFIGURATION
# ============================================
NEXT_PUBLIC_API_URL=http://localhost:8000
INTERNAL_API_URL=http://localhost:8000

# ============================================
# CRM CONFIGURATION
# ============================================
CRM_API_URL=https://api.finam.tech
CRM_FORM_UID=779
CRM_FORM_UID_TRADER=779
CRM_FORM_UID_STARTUP=778
CRM_FORM_UID_EXPERT=7243
CRM_FORM_UID_SCOUT=705
CRM_FORM_UID_PARTNER=7206
# Endpoint для отправки заявок (локальный или внешний)
CRM_SUBMIT_ENDPOINT=/api/crm-submit

# ============================================
# AI CHAT CONFIGURATION
# ============================================
MCP_SERVER_URL=https://flow.changesandbox.ru/mcp/2353930c-19b8-42e1-8068-61e89505310a
OPENAI_API_KEY=sk-your-openai-api-key
AI_MODEL=gpt-4o-mini
AI_TEMPERATURE=0.7
# Endpoint для проксирования запросов чата (локальный или внешний)
CHAT_API_ENDPOINT=/api/chat

# ============================================
# ANALYTICS (OPTIONAL)
# ============================================
NEXT_PUBLIC_YANDEX_METRIKA_ID=12345678
NEXT_PUBLIC_ANALYTICS_ENABLED=true

# ============================================
# DEVELOPMENT SETTINGS
# ============================================
NODE_ENV=development
LOG_LEVEL=debug
DETAILED_ERRORS=true
```

## 🔍 Проверка переменных

Для проверки корректности настройки переменных окружения можно использовать следующий скрипт:

```typescript
// scripts/check-env.ts
const requiredServerVars = [
  'NEXTAUTH_SECRET',
  'TELEGRAM_BOT_TOKEN',
  'CRM_API_URL',
  'MCP_SERVER_URL'
];

const requiredClientVars = [
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_TELEGRAM_BOT_NAME'
];

// Проверка серверных переменных
requiredServerVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Missing required server environment variable: ${varName}`);
  } else {
    console.log(`✅ ${varName} is set`);
  }
});

// Проверка клиентских переменных
requiredClientVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Missing required client environment variable: ${varName}`);
  } else {
    console.log(`✅ ${varName} is set`);
  }
});
```

## ⚠️ Безопасность

### Что НИКОГДА не должно попадать в NEXT_PUBLIC_:
- API ключи и токены
- Пароли и секретные ключи
- Внутренние URL серверов
- Данные подключения к базе данных
- Любая конфиденциальная информация

### Что МОЖНО использовать в NEXT_PUBLIC_:
- URL публичных API
- ID счетчиков аналитики
- Публичные настройки UI
- Названия сервисов
- Флаги включения/выключения функций

## 🔄 Обновление переменных

1. **Development**: Обновите `.env.local` и перезапустите сервер разработки
2. **Production**: Обновите переменные в вашей платформе деплоя (Vercel, Railway, etc.)
3. **Docker**: Обновите `docker-compose.yml` или передайте через `-e` флаги

## 📚 Дополнительные ресурсы

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Next.js Runtime Environment Variables](https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration)
