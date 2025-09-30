# DDD Архитектура геймифицированного инвестиционного MiniApp

## Технический стек
- **Backend**: FastAPI, SQLAlchemy, Alembic, Celery, Celery Beat, Redis, PostgreSQL
- **Frontend**: Next.js
- **Авторизация**: NextAuth.js (credentials) + Telegram
- **Real-time**: WebSockets

## Bounded Contexts

### 1. User Management Context
**Ответственность**: Управление пользователями, авторизация, профили

**Основные сущности**:
- User (пользователь)
- UserProfile (профиль пользователя)
- TelegramCredentials (Telegram учетные данные)
- AuthenticationSession (сессия аутентификации)

**Ключевые агрегаты**:
- UserAggregate (корень - User)

**Доменные сервисы**:
- TelegramAuthenticationService
- UserRegistrationService
- ProfileCustomizationService

**Интеграции**:
- Telegram Bot API
- NextAuth.js credentials provider
- Game Progress Context (для получения игрового прогресса)

### 2. Game Economy Context
**Ответственность**: Игровая экономика, валюты, магазин

**Основные сущности**:
- GameCurrency (игровая валюта)
- Transaction (транзакция)
- Shop (магазин)
- ShopItem (товар в магазине)
- Wallet (кошелек пользователя)

**Ключевые агрегаты**:
- WalletAggregate (корень - Wallet)
- TransactionAggregate (корень - Transaction)

**Доменные сервисы**:
- PricingService
- RewardCalculationService
- TransactionService

**Интеграции**:
- Game Progress Context (начисление наград)

### 3. Rating System Context
**Ответственность**: Рейтинговая система, лидерборды

**Основные сущности**:
- PlayerRating (рейтинг игрока)
- Leaderboard (лидерборд)
- RatingHistory (история рейтинга)

**Ключевые агрегаты**:
- RatingAggregate (корень - PlayerRating)

**Доменные сервисы**:
- RatingCalculationService
- LeaderboardUpdateService

**Интеграции**:
- User Management Context (получение данных пользователей)

### 4. Quest System Context
**Ответственность**: Система квестов, образовательные задания

**Основные сущности**:
- Quest (квест)
- QuestProgress (прогресс квеста)
- QuestReward (награда за квест)
- EducationalContent (образовательный контент)

**Ключевые агрегаты**:
- QuestAggregate (корень - Quest)
- QuestProgressAggregate (корень - QuestProgress)

**Доменные сервисы**:
- QuestProgressTrackingService
- RewardDistributionService
- EducationalContentService

**Интеграции**:
- Game Progress Context (отслеживание прогресса)
- Game Economy Context (выдача наград)

### 5. Game Progress Context
**Ответственность**: Система уровней, опыт, достижения

**Основные сущности**:
- PlayerLevel (уровень игрока)
- Experience (опыт)
- Achievement (достижение)
- Milestone (веха)

**Ключевые агрегаты**:
- PlayerProgressAggregate (корень - PlayerLevel)

**Доменные сервисы**:
- ExperienceCalculationService
- LevelProgressionService
- AchievementUnlockService

**Интеграции**:
- Все контексты (получение событий для начисления опыта)

### 6. Reward Distribution Context
**Ответственность**: Интеграция с брокерским счетом Финам

**Основные сущности**:
- RealReward (реальная награда)
- StockGrant (предоставление акции)
- BrokerageIntegration (интеграция с брокером)

**Ключевые агрегаты**:
- RewardAggregate (корень - RealReward)

**Доменные сервисы**:
- StockGrantService
- BrokerageIntegrationService

**Интеграции**:
- External Финам API

## Техническая архитектура

### Слои приложения
1. **Presentation Layer** (FastAPI controllers, WebSocket handlers)
2. **Application Layer** (Use Cases, Application Services)
3. **Domain Layer** (Entities, Value Objects, Domain Services)
4. **Infrastructure Layer** (SQLAlchemy repositories, Redis cache, Celery tasks)

### Real-time коммуникация (WebSocket)
- **Notifications**: Push-уведомления о важных событиях

### Асинхронные задачи (Celery + Redis)
- **Quest Progress Tracking**: Отслеживание прогресса квестов
- **Daily/Weekly Reset**: Сброс ежедневных/недельных заданий
- **Leaderboard Updates**: Обновление рейтинговых таблиц
- **Reward Distribution**: Выдача наград и интеграция с Финам
- **Data Analytics**: Сбор игровой статистики

### Database схема (PostgreSQL)
- Отдельные схемы для каждого Bounded Context
- Использование database-per-service подхода в рамках одной БД
- Event Store для Domain Events

### Авторизация и безопасность
- **FastAPI Security**: Middleware для проверки JWT токенов
- **Telegram Integration**: Валидация данных от Telegram WebApp
- **NextAuth.js**: Управление сессиями на фронтенде
- **Rate Limiting**: Защита от злоупотреблений API

### Мониторинг и наблюдаемость
- **Health Checks**: Для всех сервисов
- **Metrics Collection**: Игровые метрики и техническое состояние
- **Distributed Tracing**: Отслеживание запросов между контекстами
- **Event Logging**: Аудит всех доменных событий

## Интеграционные паттерны

### Domain Events
- Использование событийной архитектуры для связи между контекстами
- Event Bus на основе Redis Pub/Sub
- Eventual Consistency между агрегатами

### Anti-Corruption Layer
- Для интеграции с внешними системами (Telegram API, Финам API)
- Трансляция внешних моделей во внутренние доменные модели

### Shared Kernel
- Общие Value Objects (UserId, Currency, Timestamp)
- Общие интерфейсы для cross-cutting concerns