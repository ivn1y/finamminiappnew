#!/bin/bash

# Скрипт для запуска Telegram бота

echo "🤖 Запуск Telegram бота..."

# Переходим в папку с ботом
cd telegram-bot

# Проверяем наличие Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 не найден! Установите Python 3.8 или выше"
    exit 1
fi

# Проверяем наличие .env файла
if [ ! -f .env ]; then
    echo "❌ Файл .env не найден!"
    echo "📝 Создайте файл .env на основе config.example:"
    echo "cp config.example .env"
    echo "Затем отредактируйте .env и добавьте ваш токен от BotFather"
    exit 1
fi

# Проверяем наличие токена бота
if ! grep -q "TELEGRAM_BOT_TOKEN=" .env || grep -q "TELEGRAM_BOT_TOKEN=your_bot_token" .env; then
    echo "❌ TELEGRAM_BOT_TOKEN не настроен в .env файле!"
    echo "📝 Добавьте ваш токен от BotFather в файл .env"
    exit 1
fi

# Устанавливаем зависимости если нужно
if [ ! -d "venv" ]; then
    echo "📦 Создание виртуального окружения..."
    python3 -m venv venv
fi

echo "🔧 Активация виртуального окружения..."
source venv/bin/activate

echo "📦 Установка зависимостей..."
pip install -r requirements.txt

echo "🚀 Запуск бота..."
python bot.py
