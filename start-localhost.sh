#!/bin/bash

# Скрипт для запуска локальной версии на localhost:3000
# Автор: AI Assistant

echo "🚀 Запуск локальной версии приложения (localhost:3000)..."
echo ""

echo "💻 Локальная версия доступна по адресу:"
echo "   http://localhost:3000"
echo ""
echo "📱 Для мобильного тестирования используйте:"
echo "   ./start-mobile-192.sh (для IP 192.168.1.192)"
echo "   ./start-mobile-196.sh (для IP 192.168.1.196)"
echo ""

# Проверяем, свободен ли порт
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Порт 3000 занят. Останавливаем процессы..."
    lsof -ti:3000 | xargs kill -9
    sleep 2
fi

echo "🔄 Запускаем локальный сервер..."
echo ""

# Запускаем локальную версию
echo "💻 Запуск сервера для локальной разработки..."
echo "🔧 Режим разработки с hot reload"
echo "⚠️  Для остановки нажмите Ctrl+C"
echo ""

# Запускаем скрипт локальной разработки
node scripts/localhost-dev.js
