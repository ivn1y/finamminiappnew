#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Универсальный скрипт для тестирования
# Автор: AI Assistant

echo "🧪 Универсальный тестовый запуск"
echo "================================="
echo ""

# Получаем IP адрес машины
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP="192.168.1.100"  # fallback IP
fi

echo "🌐 Ваш IP адрес: $LOCAL_IP"
echo ""

# Проверяем, свободны ли порты
echo "🔍 Проверяем порты..."

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Порт 3000 занят. Останавливаем процессы..."
    lsof -ti:3000 | xargs kill -9
    sleep 2
fi

if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Порт 3001 занят. Останавливаем процессы..."
    lsof -ti:3001 | xargs kill -9
    sleep 2
fi

echo "✅ Порты свободны"
echo ""

echo "📱 Доступные адреса для тестирования:"
echo "   💻 Компьютер:     http://localhost:3000"
echo "   📱 Мобильный:     http://$LOCAL_IP:3000"
echo "   🔧 Mock API:      http://localhost:3001"
echo ""

echo "🎯 Тестовые QR коды:"
echo "   TRADER_001  - получение бейджа"
echo "   CONTENT_001 - разблокировка контента"
echo ""

echo "🔄 Запускаем серверы..."
echo ""

# Запускаем mock API в фоне
echo "🔧 Запуск Mock API сервера..."
npm run mock-api &
MOCK_API_PID=$!

# Ждем запуска mock API
sleep 3

echo "🚀 Запуск основного приложения..."
echo "⚠️  Для остановки нажмите Ctrl+C"
echo ""

# Запускаем основное приложение с правильными настройками для мобильного доступа
echo "🔧 Настройка для мобильного доступа..."
export HOSTNAME=0.0.0.0
export PORT=3000

node scripts/run-next-dev.js dev --port 3000 --hostname 0.0.0.0

# При выходе убиваем mock API
echo ""
echo "🛑 Останавливаем Mock API сервер..."
kill $MOCK_API_PID 2>/dev/null

echo "✅ Тестирование завершено"
