# 🚀 Развертывание Telegram бота на Heroku (круглосуточно)

## 📋 Что нужно сделать:

### 1. **Создать аккаунт на Heroku**
- Зайдите на [heroku.com](https://heroku.com)
- Зарегистрируйтесь (бесплатно)

### 2. **Установить Heroku CLI**
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Или скачайте с сайта heroku.com
```

### 3. **Войти в Heroku**
```bash
heroku login
```

### 4. **Создать приложение**
```bash
# В папке проекта
heroku create your-bot-name-here
```

### 5. **Настроить переменные окружения**
```bash
heroku config:set TELEGRAM_BOT_TOKEN=8258511260:AAHG6drhuPrXKuGyo7_B4h8czxcupQZOPRw
heroku config:set MINI_APP_URL=https://collab.generationfi.online/
```

### 6. **Развернуть бота**
```bash
git add .
git commit -m "Deploy Telegram bot"
git push heroku main
```

### 7. **Проверить работу**
```bash
heroku logs --tail
```

## ✅ После развертывания:

- **Бот будет работать 24/7** на серверах Heroku
- **Бесплатно** (с ограничениями, но для бота достаточно)
- **Автоматически перезапускается** при сбоях

## 🔧 Альтернативы:

### **Railway** (еще проще):
1. Зайдите на [railway.app](https://railway.app)
2. Подключите GitHub репозиторий
3. Настройте переменные окружения
4. Развертывание автоматическое

### **VPS сервер** (полный контроль):
1. Арендуйте VPS ($5-10/месяц)
2. Установите Python и зависимости
3. Запустите бота через systemd или screen
4. Настройте автозапуск

## 📱 Результат:

После развертывания ваш бот будет отвечать на `/start` **круглосуточно**!
