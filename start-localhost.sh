#!/bin/bash

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Остановка процессов на порту 3000..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    sleep 2
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Установка зависимостей..."
    npm install
fi

echo ""
echo "🚀 Запуск локальной версии (для компьютера)..."
echo ""
echo "💻 Доступен по адресу:"
echo "   http://localhost:3000"
echo ""
echo "🔧 Режим разработки с hot reload"
echo ""
echo "📱 Для мобильной версии используйте:"
echo "   ./start-mobile-universal.sh"
echo "   или npm run mobile"
echo ""
echo "⚠️  Для остановки нажмите Ctrl+C"
echo ""

node scripts/localhost-dev.js
