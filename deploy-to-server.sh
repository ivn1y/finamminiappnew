#!/bin/bash

# Скрипт для развертывания Telegram бота на сервер

echo "🚀 Развертывание Telegram бота на сервер..."

# Проверяем наличие необходимых файлов
if [ ! -f "telegram-bot/bot.py" ]; then
    echo "❌ Файл telegram-bot/bot.py не найден!"
    exit 1
fi

if [ ! -f "requirements.txt" ]; then
    echo "❌ Файл requirements.txt не найден!"
    exit 1
fi

echo "📁 Файлы найдены, готовим к развертыванию..."

# Создаем архив для передачи на сервер
tar -czf telegram-bot-deploy.tar.gz telegram-bot/ requirements.txt Procfile

echo "📦 Архив создан: telegram-bot-deploy.tar.gz"
echo ""
echo "📋 Инструкции для развертывания на сервере:"
echo ""
echo "1. Скопируйте архив на сервер:"
echo "   scp telegram-bot-deploy.tar.gz user@your-server:/path/to/project/"
echo ""
echo "2. На сервере распакуйте архив:"
echo "   tar -xzf telegram-bot-deploy.tar.gz"
echo ""
echo "3. Установите зависимости:"
echo "   pip install -r requirements.txt"
echo ""
echo "4. Запустите бота:"
echo "   python telegram-bot/bot.py &"
echo ""
echo "5. Или создайте systemd сервис (см. SERVER_DEPLOYMENT.md)"
echo ""
echo "✅ Готово к развертыванию!"
