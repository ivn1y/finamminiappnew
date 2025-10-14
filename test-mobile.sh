#!/bin/bash

# Скрипт для мобильного тестирования
# Автор: AI Assistant

echo "📱 Запуск мобильной тестовой версии..."
echo ""

# Получаем IP адрес машины
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP="192.168.1.100"  # fallback IP
fi

echo "🌐 Ваш IP адрес: $LOCAL_IP"
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

echo "📱 Мобильная тестовая версия будет доступна по адресам:"
echo "   http://$LOCAL_IP:3000"
echo "   http://localhost:3000"
echo ""
echo "🔧 Mock API будет доступен по адресу:"
echo "   http://$LOCAL_IP:3001"
echo ""
echo "⚠️  Убедитесь, что мобильное устройство подключено к той же Wi-Fi сети!"
echo ""

# Запускаем mock API в фоне
echo "🔄 Запускаем mock API сервер..."
npm run mock-api &
MOCK_API_PID=$!

# Ждем немного, чтобы mock API запустился
sleep 3

echo "🔄 Запускаем мобильное приложение..."
echo "⚠️  Для остановки нажмите Ctrl+C"
echo ""

# Запускаем мобильную версию с правильными настройками
echo "🔧 Настройка для мобильного доступа..."
export HOSTNAME=0.0.0.0
export PORT=3000

# Запускаем Next.js с правильными параметрами
npx next dev --port 3000 --hostname 0.0.0.0

# При выходе убиваем mock API
echo ""
echo "🛑 Останавливаем mock API сервер..."
kill $MOCK_API_PID 2>/dev/null
