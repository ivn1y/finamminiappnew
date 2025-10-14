#!/bin/bash

# 🚀 Простой запуск для тестирования на телефоне и компьютере
# Автор: AI Assistant

echo "🚀 Запуск локальной версии для тестирования"
echo "=========================================="
echo ""

# Получаем IP адрес
IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
echo "🌐 IP адрес: $IP"
echo ""

echo "📱 Доступные адреса:"
echo "   💻 Компьютер: http://localhost:3000"
echo "   📱 Мобильный:  http://$IP:3000"
echo "   🔧 Mock API:   http://localhost:3001"
echo ""

echo "🎯 Тестовые данные:"
echo "   QR коды: TRADER_001, CONTENT_001"
echo "   Пользователь: user_123 (trader, 150 XP)"
echo ""

# Функция для остановки
cleanup() {
    echo ""
    echo "🛑 Останавливаем серверы..."
    kill $MOCK_PID 2>/dev/null || true
    kill $NEXT_PID 2>/dev/null || true
    echo "✅ Серверы остановлены"
    exit 0
}

# Устанавливаем обработчик сигналов
trap cleanup SIGINT SIGTERM

echo "🔄 Запускаем Mock API..."
node mock-server.js &
MOCK_PID=$!
sleep 3

echo "🔄 Запускаем основное приложение..."
echo "⚠️  Для остановки нажмите Ctrl+C"
echo ""

# Запускаем Next.js
npx next dev --port 3000 --hostname 0.0.0.0 &
NEXT_PID=$!

# Ждем запуска
sleep 5

echo "✅ Приложение запущено!"
echo ""
echo "🎉 Готово к тестированию!"
echo "   💻 Компьютер: http://localhost:3000"
echo "   📱 Мобильный:  http://$IP:3000"
echo ""

# Ждем завершения
wait $NEXT_PID

