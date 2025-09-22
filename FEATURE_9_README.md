# Feature 9: RPG Profile Screen

## Обзор

Реализован экран профиля пользователя с RPG-аватаром, системой бейджей, кастомизацией и аналитикой согласно техническому заданию.

## Реализованная функциональность

### ✅ 1. RPG Avatar System
- **AvatarView** - компонент аватара с кастомизацией
- Поддержка 4 ролей: trader, startup, expert, partner
- Визуальные градиенты для каждой роли
- Кнопка редактирования аватара

### ✅ 2. Avatar Customization
- **AvatarCustomizationModal** - модальное окно кастомизации
- Выбор рамок (frames) с разблокированными/заблокированными состояниями
- Выбор аксессуаров (accessories)
- Предварительный просмотр изменений
- Условия разблокировки с тултипами

### ✅ 3. Badges Grid System
- **BadgesGrid** - улучшенный грид бейджей
- Разделение на полученные и заблокированные бейджи
- Интерактивные карточки с детальной информацией
- Условия разблокировки для каждого бейджа
- Анимации и визуальные эффекты

### ✅ 4. Profile Management
- Интеграция с существующим **ProfileEditModal**
- Поддержка всех ролевых полей профиля
- Валидация и обработка ошибок
- Отслеживание изменений

### ✅ 5. Goal Wizard
- Обновленный **GoalWizard** с аналитикой
- Выбор цели на 7 дней по ролям
- Пошаговый интерфейс
- Подтверждение выбора

### ✅ 6. API Integration
- **ProfileAPI** - клиент для работы с профилем
- Поддержка offline режима с очередью синхронизации
- Обработка ошибок и retry логика
- Типизированные интерфейсы

### ✅ 7. Analytics System
- **useProfileAnalytics** - хук для аналитики
- Отслеживание всех ключевых событий:
  - `screen_view` - просмотр экрана
  - `avatar_customization_opened` - открытие кастомизации
  - `avatar_customization_applied` - применение кастомизации
  - `badge_clicked` - клик по бейджу
  - `badge_claim_attempt` - попытка получения бейджа
  - `profile_edit_started` - начало редактирования
  - `profile_saved` - сохранение профиля
  - `intent7d_selected` - выбор цели
  - `share_profile_clicked` - поделиться профилем

## Структура файлов

```
src/
├── features/
│   ├── avatar-customization/
│   │   ├── ui/
│   │   │   ├── avatar-view.tsx
│   │   │   └── avatar-customization-modal.tsx
│   │   └── index.ts
│   └── badges-grid/
│       ├── ui/
│       │   └── badges-grid.tsx
│       └── index.ts
├── shared/
│   ├── hooks/
│   │   └── use-profile-analytics.ts
│   ├── lib/
│   │   └── profile-api.ts
│   └── types/
│       └── app.ts (обновлен с avatar полем)
└── widgets/
    └── profile-page/
        └── ui/
            └── profile-page.tsx (обновлен)
```

## Ключевые компоненты

### AvatarView
```tsx
<AvatarView 
  user={user}
  onCustomize={handleAvatarCustomization}
  className="mb-4"
/>
```

### BadgesGrid
```tsx
<BadgesGrid
  userBadges={user.badges}
  allBadges={allBadges}
  onBadgeClick={handleBadgeClick}
/>
```

### AvatarCustomizationModal
```tsx
<AvatarCustomizationModal
  isOpen={showAvatarCustomization}
  onClose={() => setShowAvatarCustomization(false)}
  user={user}
  onSave={handleAvatarSave}
/>
```

## API Endpoints

### GET /users/:id
Получение данных пользователя

### PATCH /users/:id
Обновление профиля пользователя
```json
{
  "displayName": "string",
  "contact": {
    "telegram": "string",
    "email": "string"
  },
  "intent7d": "string",
  "avatar": {
    "characterId": "string",
    "frameId": "string",
    "accessories": ["string"]
  }
}
```

### POST /users/:id/badges/claim
Получение бейджа
```json
{
  "badgeId": "string",
  "source": "quest" | "profile" | "qr_scan" | "xp_level"
}
```

### POST /analytics
Отправка события аналитики
```json
{
  "event": "string",
  "userId": "string",
  "props": {},
  "ts": "string"
}
```

## Типы данных

### User (обновлен)
```typescript
interface User {
  // ... существующие поля
  avatar?: {
    characterId?: string;
    frameId?: string;
    accessories?: string[];
  };
}
```

### BadgeData
```typescript
interface BadgeData {
  id: string;
  title: string;
  tooltip: string;
  unlockCondition?: {
    type: 'quest_completed' | 'profile_completed' | 'qr_scanned' | 'xp_level';
    questId?: string;
    level?: number;
    scans?: number;
  };
}
```

## Особенности реализации

### 1. Offline Support
- Очередь синхронизации для offline изменений
- Автоматическая синхронизация при восстановлении соединения
- Graceful degradation при ошибках сети

### 2. Analytics Integration
- Все ключевые действия отслеживаются
- События отправляются асинхронно
- Ошибки аналитики не блокируют основную функциональность

### 3. Error Handling
- Обработка ошибок API с пользовательскими сообщениями
- Retry логика для критичных операций
- Fallback для offline режима

### 4. Performance
- Lazy loading компонентов
- Мемоизация обработчиков
- Оптимизированные re-renders

## Тестирование

### Ручные тесты
1. Открыть экран профиля → проверить отображение аватара
2. Кликнуть на аватар → открыть кастомизацию
3. Выбрать рамку/аксессуар → применить изменения
4. Кликнуть на бейдж → открыть детальную информацию
5. Редактировать профиль → сохранить изменения
6. Выбрать цель на 7 дней → подтвердить выбор
7. Поделиться профилем → проверить функциональность

### Unit тесты
- Компоненты AvatarView, BadgesGrid
- Хуки useProfileAnalytics
- API клиент ProfileAPI

## Следующие шаги

1. **Дизайн ассеты** - заменить mock данные на реальные изображения
2. **Backend интеграция** - подключить к реальному API
3. **Анимации** - добавить Lottie анимации для unlock эффектов
4. **Тестирование** - написать E2E тесты
5. **Оптимизация** - добавить кэширование и оптимизации

## Совместимость

- ✅ Next.js 14
- ✅ React 18
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Lucide React Icons
- ✅ FSD Architecture
