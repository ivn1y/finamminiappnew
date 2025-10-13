#!/bin/bash

# Скрипт для локального тестирования на компьютере
# Автор: AI Assistant

echo "🚀 Запуск локальной тестовой версии для компьютера..."
echo ""

# Проверяем, свободен ли порт 3000
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Порт 3000 занят. Останавливаем процессы..."
    lsof -ti:3000 | xargs kill -9
    sleep 2
fi

# Проверяем, свободен ли порт 3001 (для mock API)
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Порт 3001 занят. Останавливаем процессы..."
    lsof -ti:3001 | xargs kill -9
    sleep 2
fi

echo "💻 Локальная тестовая версия будет доступна по адресу:"
echo "   http://localhost:3000"
echo ""
echo "🔧 Mock API будет доступен по адресу:"
echo "   http://localhost:3001"
echo ""
echo "📱 Для мобильного тестирования используйте:"
echo "   ./test-mobile.sh"
echo ""

# Запускаем mock API в фоне
echo "🔄 Запускаем mock API сервер..."
npm run mock-api &
MOCK_API_PID=$!

# Ждем немного, чтобы mock API запустился
sleep 3

echo "🔄 Запускаем основное приложение..."
echo "⚠️  Для остановки нажмите Ctrl+C"
echo ""

# Запускаем основное приложение
npm run dev:local

# При выходе убиваем mock API
echo ""
echo "🛑 Останавливаем mock API сервер..."
kill $MOCK_API_PID 2>/dev/null
