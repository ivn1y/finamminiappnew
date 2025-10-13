#!/bin/bash

# Простой и надежный скрипт для локального тестирования
# Автор: AI Assistant

echo "🚀 Запуск локальной версии для мобилки и компа"
echo "=============================================="
echo ""

# Получаем IP адрес
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
echo "🌐 IP адрес: $LOCAL_IP"
echo ""

# Очищаем порты
echo "🧹 Очищаем порты..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
sleep 2

echo "📱 Доступные адреса:"
echo "   💻 Компьютер: http://localhost:3000"
echo "   📱 Мобильный: http://$LOCAL_IP:3000"
echo "   🔧 Mock API:   http://localhost:3001"
echo ""

echo "🎯 Тестовые QR коды:"
echo "   TRADER_001  - получение бейджа"
echo "   CONTENT_001 - разблокировка контента"
echo ""

# Функция для обработки сигналов
cleanup() {
    echo ""
    echo "🛑 Останавливаем серверы..."
    kill $MOCK_PID 2>/dev/null || true
    kill $NEXT_PID 2>/dev/null || true
    exit 0
}

# Устанавливаем обработчик сигналов
trap cleanup SIGINT SIGTERM

echo "🔄 Запускаем Mock API..."
node simple-mock-server.js &
MOCK_PID=$!

# Ждем запуска Mock API
sleep 3

echo "🔄 Запускаем основное приложение..."
echo "⚠️  Для остановки нажмите Ctrl+C"
echo ""

# Запускаем Next.js с правильными параметрами
npx next dev --port 3000 --hostname 0.0.0.0 &
NEXT_PID=$!

# Ждем завершения
wait $NEXT_PID