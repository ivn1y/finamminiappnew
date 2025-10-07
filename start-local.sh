#!/bin/bash

# Скрипт для запуска локальных версий приложения
# Автор: AI Assistant
# Дата: $(date)

echo "🚀 Запуск локальных версий приложения..."
echo ""

# Получаем IP-адрес
IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')

echo "📱 Мобильная версия (для телефона):"
echo "   http://$IP:3000"
echo ""
echo "💻 Локальная версия (для компьютера):"
echo "   http://localhost:3000"
echo ""

# Проверяем, свободен ли порт
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Порт 3000 занят. Останавливаем процессы..."
    lsof -ti:3000 | xargs kill -9
    sleep 2
fi

echo "🔄 Запускаем серверы..."
echo ""

# Запускаем мобильную версию в фоне
echo "📱 Запуск мобильной версии..."
npm run mobile &
MOBILE_PID=$!

# Ждем немного
sleep 3

echo "✅ Серверы запущены!"
echo ""
echo "🌐 Доступ к приложению:"
echo "   Компьютер: http://localhost:3000"
echo "   Телефон:   http://$IP:3000"
echo ""
echo "⚠️  Для остановки нажмите Ctrl+C"
echo ""

# Ждем сигнала завершения
trap "echo '🛑 Останавливаем серверы...'; kill $MOBILE_PID 2>/dev/null; exit" INT

# Ждем
wait
