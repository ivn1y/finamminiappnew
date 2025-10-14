#!/bin/bash

# Диагностический скрипт для мобильного подключения
# Автор: AI Assistant

echo "🔍 Диагностика мобильного подключения"
echo "===================================="
echo ""

# Получаем IP адрес
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
echo "🌐 IP адрес компьютера: $LOCAL_IP"
echo ""

# Проверяем порты
echo "🔍 Проверка портов:"
if lsof -Pi :3000 -sTCP:LISTEN >/dev/null 2>&1; then
    echo "✅ Порт 3000: ЗАНЯТ"
    lsof -Pi :3000 -sTCP:LISTEN
else
    echo "❌ Порт 3000: СВОБОДЕН"
fi

if lsof -Pi :3001 -sTCP:LISTEN >/dev/null 2>&1; then
    echo "✅ Порт 3001: ЗАНЯТ"
    lsof -Pi :3001 -sTCP:LISTEN
else
    echo "❌ Порт 3001: СВОБОДЕН"
fi
echo ""

# Проверяем файрвол
echo "🔥 Проверка файрвола:"
if command -v pfctl >/dev/null 2>&1; then
    echo "📋 Статус файрвола macOS:"
    sudo pfctl -s info 2>/dev/null || echo "Файрвол не активен"
else
    echo "Файрвол не найден"
fi
echo ""

# Проверяем сетевые интерфейсы
echo "🌐 Сетевые интерфейсы:"
ifconfig | grep -A 1 "inet " | grep -v "127.0.0.1"
echo ""

# Тест подключения
echo "🧪 Тест подключения:"
if curl -s --connect-timeout 5 http://$LOCAL_IP:3000 >/dev/null 2>&1; then
    echo "✅ Локальное подключение к $LOCAL_IP:3000 работает"
else
    echo "❌ Локальное подключение к $LOCAL_IP:3000 не работает"
fi

if curl -s --connect-timeout 5 http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Подключение к localhost:3000 работает"
else
    echo "❌ Подключение к localhost:3000 не работает"
fi
echo ""

echo "📱 Для мобильного тестирования используйте:"
echo "   http://$LOCAL_IP:3000"
echo ""
echo "🔧 Если мобильное устройство не подключается:"
echo "   1. Убедитесь, что устройства в одной Wi-Fi сети"
echo "   2. Проверьте файрвол на компьютере"
echo "   3. Для iOS: разрешите HTTP соединения в настройках"
echo "   4. Попробуйте перезапустить роутер"
echo ""

echo "🚀 Для запуска тестовой версии:"
echo "   npm run test-all"
