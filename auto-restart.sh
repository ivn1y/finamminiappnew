#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Автоматический перезапуск для стабильной работы
# Автор: AI Assistant

echo "🔄 Автоматический запуск с перезапуском"
echo "======================================"

# Получаем IP
IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')

echo "🌐 IP: $IP"
echo "📱 Мобильный: http://$IP:3000"
echo "💻 Компьютер: http://localhost:3000"
echo ""

# Функция запуска серверов
start_servers() {
    echo "🔄 Запуск серверов..."
    
    # Очищаем порты
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    sleep 2
    
    # Запускаем Mock API
    node simple-mock-server.js &
    MOCK_PID=$!
    sleep 3
    
    # Запускаем Next.js
    node scripts/run-next-dev.js dev --port 3000 --hostname 0.0.0.0 &
    NEXT_PID=$!
    
    echo "✅ Серверы запущены"
    echo "⚠️  Для остановки нажмите Ctrl+C"
}

# Функция остановки
cleanup() {
    echo ""
    echo "🛑 Останавливаем серверы..."
    kill $MOCK_PID 2>/dev/null || true
    kill $NEXT_PID 2>/dev/null || true
    exit 0
}

# Устанавливаем обработчик
trap cleanup SIGINT SIGTERM

# Запускаем серверы
start_servers

# Мониторим и перезапускаем при необходимости
while true; do
    sleep 10
    
    # Проверяем, работает ли Next.js
    if ! kill -0 $NEXT_PID 2>/dev/null; then
        echo "⚠️  Next.js остановился, перезапускаем..."
        start_servers
    fi
    
    # Проверяем, работает ли Mock API
    if ! kill -0 $MOCK_PID 2>/dev/null; then
        echo "⚠️  Mock API остановился, перезапускаем..."
        node simple-mock-server.js &
        MOCK_PID=$!
        sleep 3
    fi
done
