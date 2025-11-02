#!/bin/bash

IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')

if [ -z "$IP" ]; then
    IP="localhost"
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Остановка процессов на порту 3000..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    sleep 2
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Установка зависимостей..."
    npm install
fi

export NODE_ENV=development

echo ""
echo "🚀 Запуск версии для ПК и телефона..."
echo ""
echo "📱 Для телефона (в той же Wi-Fi сети):"
echo "   http://$IP:3000"
echo ""
echo "💻 Для компьютера:"
echo "   http://localhost:3000"
echo ""
echo "📋 Для подключения с телефона:"
echo "   1. Убедитесь, что телефон в той же Wi-Fi сети"
echo "   2. Откройте браузер на телефоне"
echo "   3. Перейдите по адресу: http://$IP:3000"
echo ""
echo "⚠️  Для остановки нажмите Ctrl+C"
echo ""

node scripts/mobile-dev.js
