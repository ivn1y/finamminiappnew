# CRM Integration для Web проекта

## Обзор

Система интеграции с CRM позволяет отправлять заявки пользователей из различных частей приложения в CRM Финама. Логика основана на `unified_form` из основного проекта, но адаптирована для Next.js архитектуры.

## Компоненты системы

### 1. API Route: `/api/crm-submit`

**Файл**: `web/src/app/api/crm-submit/route.ts`

Серверный эндпоинт для отправки заявок в CRM. Принимает данные формы и UTM параметры, автоматически определяет правильный CRM form UID по направлению пользователя.

**Использование**:
```typescript
const response = await fetch('/api/crm-submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-utm-source': 'website',
    'x-utm-campaign': 'spring2024'
  },
  body: JSON.stringify({
    fullName: 'Иван Иванов',
    email: 'ivan@example.com',
    direction: 'trader',
    // ... другие поля
  })
});
```

### 2. CRM API Client

**Файл**: `web/src/shared/lib/crm-api.ts`

Клиентская библиотека для работы с CRM API. Включает:

- Типы данных для CRM
- Функции маппинга профиля пользователя в формат CRM
- Утилиты для отправки заявок
- Извлечение UTM параметров

**Основные функции**:

```typescript
// Отправка заявки с автоматическим маппингом профиля
await submitUserApplicationToCRM(user, {
  message: 'Дополнительное сообщение'
});

// Быстрая отправка заявки "Записаться"
await submitBookingRequest(user, 'Заявка на консультацию');

// Маппинг профиля пользователя в формат CRM
const crmData = mapUserProfileToCRM(user, additionalData);
```

### 3. Booking Hook

**Файл**: `web/src/shared/hooks/use-booking.ts`

React хук для управления состоянием отправки заявок:

```typescript
const { submitBooking, isSubmitting, lastResult, error } = useBooking();

// Отправка заявки
const result = await submitBooking('Сообщение пользователя');
```

### 4. Chat Tools

**Файл**: `web/src/app/api/chat/tools/booking-tool.ts`

AI инструмент для чата, который позволяет ассистенту отправлять заявки в CRM:

```typescript
// Автоматически вызывается AI когда пользователь хочет записаться
// Параметры извлекаются из контекста разговора
```

### 5. FSM Chat Integration

**Файл**: `web/src/widgets/chat-page/ui/chat-page.tsx`

Интеграция с FSM чатом - автоматическая отправка заявки при переходе в узел `profile_ok`:

- Определяет продукт по контексту сообщений
- Отправляет заявку с данными пользователя
- Логирует результат операции

## Маппинг данных профиля

Система автоматически маппит данные профиля пользователя в формат CRM:

### Trader
- `direction`: 'trader'
- `market`: из `user.profile.trader.markets[0]`
- `risk`: 'low' → 'Консервативный', 'medium' → 'Умеренный', 'high' → 'Агрессивный'

### Startup
- `direction`: 'startup'
- `subDirection`: маппинг стадии стартапа в поднаправление

### Expert
- `direction`: 'expert'
- `profile`: из `user.profile.expert.domain`

### Partner
- `direction`: 'business'
- `interest`: маппинг типа интереса партнера

## Переменные окружения

```bash
# CRM Configuration
CRM_API_URL=https://api.finam.tech
CRM_FORM_UID=779  # Общий UID по умолчанию

# CRM Form UIDs по направлениям (опционально)
CRM_FORM_UID_TRADER=779
CRM_FORM_UID_STARTUP=778
CRM_FORM_UID_EXPERT=7243
CRM_FORM_UID_SCOUT=705
CRM_FORM_UID_PARTNER=7206
```

## Логика выбора CRM Form UID

1. **По направлению**: Проверяется переменная `CRM_FORM_UID_{DIRECTION}`
2. **Общий**: Используется `CRM_FORM_UID`
3. **Fallback**: Используются хардкодированные значения по умолчанию

## Использование в компонентах

### Простая отправка заявки

```typescript
import { useBooking } from '@/shared/hooks/use-booking';

const MyComponent = () => {
  const { submitBooking, isSubmitting } = useBooking();
  
  const handleBooking = async () => {
    const result = await submitBooking('Заявка на консультацию');
    if (result.success) {
      // Успех
    }
  };
  
  return (
    <button onClick={handleBooking} disabled={isSubmitting}>
      {isSubmitting ? 'Отправка...' : 'Записаться'}
    </button>
  );
};
```

### Отправка с дополнительными данными

```typescript
import { submitUserApplicationToCRM } from '@/shared/lib/crm-api';
import { useAppStore } from '@/shared/store/app-store';

const MyComponent = () => {
  const { user } = useAppStore();
  
  const handleSubmit = async () => {
    if (!user) return;
    
    const result = await submitUserApplicationToCRM(user, {
      message: 'Интересует Trade API',
      market: 'Америка',
    });
  };
};
```

## Логирование и отладка

Система включает подробное логирование:

- `📝` - Начало обработки заявки
- `📤` - Отправка в CRM
- `✅` - Успешная отправка
- `❌` - Ошибка отправки
- `🚀` - Запуск процесса

## Обработка ошибок

Все функции возвращают объект `CRMSubmissionResult`:

```typescript
interface CRMSubmissionResult {
  success: boolean;
  message: string;
  details?: any;
}
```

## AI Chat Integration

AI ассистент автоматически использует `bookingTool` когда пользователь:
- Хочет записаться на консультацию
- Просит связаться со специалистом
- Хочет получить доступ к продукту
- Оставляет заявку

Инструмент извлекает данные пользователя из контекста и отправляет заявку в CRM.
