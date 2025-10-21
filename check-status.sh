#!/bin/bash

# Скрипт для проверки статуса всех локальных сервисов
# Автор: AI Assistant

echo "📊 Проверка статуса локальных сервисов"
echo "====================================="
echo ""

# Проверяем зависимости
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден"
    exit 1
fi

if ! command -v curl &> /dev/null; then
    echo "⚠️  curl не найден. Устанавливаем для проверки HTTP статуса..."
    # На macOS можно использовать brew
    if command -v brew &> /dev/null; then
        brew install curl
    else
        echo "❌ Установите curl для полной проверки статуса"
    fi
fi

echo "🔍 Проверяем статус сервисов..."
echo ""

# Запускаем скрипт проверки статуса
node scripts/check-status.js

echo ""
echo "💡 Для запуска сервисов используйте:"
echo "   ./start-local-universal.sh"
echo ""
echo "💡 Для остановки сервисов найдите процесс и остановите его:"
echo "   lsof -ti:3000 | xargs kill -9"
echo "   lsof -ti:3001 | xargs kill -9"

