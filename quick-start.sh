#!/bin/bash

# Супер простой запуск для тестирования
# Автор: AI Assistant

echo "⚡ Быстрый запуск для тестирования"
echo "=================================="

# Получаем IP
IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')

echo "🌐 IP: $IP"
echo "📱 Мобильный: http://$IP:3000"
echo "💻 Компьютер: http://localhost:3000"
echo ""

# Убиваем процессы на портах
killall node 2>/dev/null || true
sleep 1

echo "🚀 Запускаем..."

# Запускаем mock API в фоне
node simple-mock-server.js &
sleep 2

# Запускаем Next.js
npx next dev --port 3000 --hostname 0.0.0.0
