#!/bin/bash

# 🧪 Качественное тестирование локальной версии
# Автор: AI Assistant
# Версия: 3.0

set -e

# Цвета
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Функции
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_header() {
    echo -e "${CYAN}$1${NC}"
}

print_step() {
    echo -e "${MAGENTA}🔧 $1${NC}"
}

# Заголовок
echo ""
print_header "🧪 Тестирование локальной версии Finam Collab Mini App"
print_header "====================================================="
echo ""

# Функции тестирования
test_url() {
    local url=$1
    local name=$2
    local expected_status=${3:-200}
    
    print_step "Тестируем $name ($url)..."
    
    local response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 "$url")
    
    if [ "$response" = "$expected_status" ]; then
        print_success "$name работает (HTTP $response)"
        return 0
    else
        print_error "$name не работает (HTTP $response, ожидался $expected_status)"
        return 1
    fi
}

test_api_endpoint() {
    local url=$1
    local name=$2
    local expected_keys=$3
    
    print_step "Тестируем API: $name ($url)..."
    
    local response=$(curl -s --connect-timeout 10 "$url")
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 "$url")
    
    if [ "$status_code" = "200" ]; then
        # Проверяем JSON (простая проверка)
        if echo "$response" | grep -q "{" && echo "$response" | grep -q "}"; then
            print_success "$name работает (HTTP $status_code, валидный JSON)"
            return 0
        else
            print_error "$name возвращает невалидный JSON"
            return 1
        fi
    else
        print_error "$name не работает (HTTP $status_code)"
        return 1
    fi
}

# Получаем IP
print_step "Определяем IP адрес..."
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP="localhost"
fi

print_info "IP адрес: $LOCAL_IP"
echo ""

# Тестируем Mock API
print_header "🔧 Тестирование Mock API..."
test_url "http://localhost:3001/api/health" "Health Check"
test_api_endpoint "http://localhost:3001/api/users" "Users API"
test_api_endpoint "http://localhost:3001/api/getContent" "Content API"

echo ""

# Тестируем основное приложение
print_header "🚀 Тестирование основного приложения..."
test_url "http://localhost:3000" "Основное приложение (localhost)"
test_url "http://$LOCAL_IP:3000" "Основное приложение (мобильный IP)"

echo ""

# Тестируем QR API
print_header "📱 Тестирование QR API..."
test_url "http://localhost:3001/api/redeemQR" "QR Redeem API" "404"

echo ""

# Результаты
print_header "📊 Результаты тестирования:"
echo ""

print_header "📱 Доступные адреса:"
echo "   💻 Компьютер: http://localhost:3000"
echo "   📱 Мобильный: http://$LOCAL_IP:3000"
echo "   🔧 Mock API:   http://localhost:3001"
echo ""

print_header "🎯 Тестовые данные:"
echo "   QR коды:"
echo "     TRADER_001  - получение бейджа 'first_trade' (+100 XP)"
echo "     CONTENT_001 - разблокировка контента (+25 XP)"
echo "   Тестовый пользователь:"
echo "     ID: user_123"
echo "     Роль: trader"
echo "     XP: 150"
echo "     Бейджи: explorer"
echo ""

print_header "🚀 Команды для запуска:"
echo "   ./start-local.sh        # Запуск приложения"
echo "   npm run start-local      # Альтернативный запуск"
echo "   npm run dev:local        # Только для компьютера"
echo "   npm run dev:mobile       # Только для мобильного"
echo ""

print_header "🔧 API эндпоинты:"
echo "   GET    /api/users          # Список пользователей"
echo "   GET    /api/users/:id       # Данные пользователя"
echo "   POST   /api/createUser      # Создание пользователя"
echo "   PUT    /api/updateUser/:id  # Обновление пользователя"
echo "   POST   /api/redeemQR        # Использование QR кода"
echo "   POST   /api/logEvent        # Логирование событий"
echo "   GET    /api/events/:userId  # События пользователя"
echo "   GET    /api/health          # Проверка здоровья"
echo ""

print_header "⚠️  Важно:"
echo "   • Для мобильного тестирования устройства должны быть в одной Wi-Fi сети"
echo "   • Требуется Node.js версии 18.0.0+"
echo "   • Для остановки используйте Ctrl+C"
echo ""

print_success "Тестирование завершено!"
print_info "Для запуска используйте: ./start-local.sh"