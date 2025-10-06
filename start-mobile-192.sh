#!/bin/bash

# Скрипт для запуска мобильной версии с автоматическим определением IP
# Автор: AI Assistant

echo "🚀 Запуск мобильной версии приложения..."
echo ""

# Получаем IP-адрес
IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')

echo "📱 Мобильная версия доступна по адресам:"
echo "   http://$IP:3000"
echo ""
echo "💻 Локальная версия:"
echo "   http://localhost:3000"
echo ""

# Проверяем, свободен ли порт
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Порт 3000 занят. Останавливаем процессы..."
    lsof -ti:3000 | xargs kill -9
    sleep 2
fi

echo "🔄 Запускаем мобильный сервер..."
echo ""

# Запускаем мобильную версию
echo "📱 Запуск сервера для мобильных устройств..."
echo "⚠️  Для остановки нажмите Ctrl+C"
echo ""

# Запускаем скрипт мобильной разработки
node scripts/mobile-dev-192.js
