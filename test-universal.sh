#!/bin/bash

# 🧪 Быстрый тест локальной версии
# Автор: AI Assistant

echo "🧪 Быстрый тест локальной версии"
echo "================================"
echo ""

# Цвета
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Функции
test_url() {
    local url=$1
    local name=$2
    
    echo -n "Тестируем $name ($url)... "
    
    if curl -s --connect-timeout 5 "$url" > /dev/null; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        return 1
    fi
}

# Получаем IP
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP="localhost"
fi

echo "🌐 IP адрес: $LOCAL_IP"
echo ""

# Тестируем Mock API
test_url "http://localhost:3001/api/users" "Mock API"

# Тестируем основное приложение
test_url "http://localhost:3000" "Основное приложение (localhost)"
test_url "http://$LOCAL_IP:3000" "Основное приложение (мобильный IP)"

echo ""
echo "📱 Доступные адреса:"
echo "   💻 Компьютер: http://localhost:3000"
echo "   📱 Мобильный: http://$LOCAL_IP:3000"
echo "   🔧 Mock API:   http://localhost:3001"
echo ""

echo "🎯 Тестовые QR коды:"
echo "   TRADER_001  - получение бейджа"
echo "   CONTENT_001 - разблокировка контента"
echo ""

echo "🚀 Для запуска используйте:"
echo "   npm run start-universal"
echo "   или"
echo "   ./start-universal.sh"
