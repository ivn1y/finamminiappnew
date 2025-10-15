#!/bin/bash

# 🚀 Стабильный запуск локальной версии (после билда)
# Автор: AI Assistant
# Версия: 4.0 - Устойчивый к билдам

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Функции для вывода с цветом
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
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
print_header "🚀 Стабильный запуск Finam Collab Mini App"
print_header "=========================================="
echo ""

# Полная очистка
print_step "Полная очистка после билда..."
killall node 2>/dev/null || true
lsof -ti:3000,3001 | xargs kill -9 2>/dev/null || true
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo
rm -rf .swc
sleep 3
print_success "Полная очистка завершена"

# Проверяем Node.js
print_step "Проверяем Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js не установлен. Установите Node.js версии 18+ и попробуйте снова."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Требуется Node.js версии 18+. Текущая версия: $(node --version)"
    exit 1
fi

print_success "Node.js версия: $(node --version)"

# Проверяем зависимости
print_step "Проверяем зависимости..."
if [ ! -d "node_modules" ]; then
    print_info "Устанавливаем зависимости..."
    npm install
fi
print_success "Зависимости готовы"

# Получаем IP адрес
print_step "Определяем IP адрес..."
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
if [ -z "$LOCAL_IP" ]; then
    print_warning "Не удалось определить IP адрес. Используйте localhost для тестирования."
    LOCAL_IP="localhost"
fi

print_success "IP адрес: $LOCAL_IP"

# Проверяем файлы
print_step "Проверяем файлы..."
if [ ! -f "mock-server.js" ]; then
    print_error "Файл mock-server.js не найден"
    exit 1
fi

if [ ! -f "mock-api/db.json" ]; then
    print_error "Файл mock-api/db.json не найден"
    exit 1
fi

print_success "Все файлы на месте"

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

# Функция для обработки сигналов
cleanup() {
    echo ""
    print_warning "Останавливаем серверы..."
    kill $MOCK_PID 2>/dev/null || true
    kill $NEXT_PID 2>/dev/null || true
    print_success "Серверы остановлены"
    exit 0
}

# Устанавливаем обработчик сигналов
trap cleanup SIGINT SIGTERM

# Запускаем Mock API
print_step "Запускаем Mock API сервер..."
node mock-server.js &
MOCK_PID=$!

# Ждем запуска Mock API
sleep 5

# Проверяем, что Mock API запустился
if ! kill -0 $MOCK_PID 2>/dev/null; then
    print_error "Не удалось запустить Mock API сервер"
    exit 1
fi

print_success "Mock API запущен на порту 3001"

# Запускаем Next.js в режиме разработки
print_step "Запускаем основное приложение в режиме разработки..."
print_warning "Для остановки нажмите Ctrl+C"
echo ""

# Запускаем Next.js с правильными параметрами для разработки
NODE_ENV=development npx next dev --port 3000 --hostname 0.0.0.0 --turbo &
NEXT_PID=$!

# Ждем запуска Next.js
sleep 10

# Проверяем, что Next.js запустился
if ! kill -0 $NEXT_PID 2>/dev/null; then
    print_error "Не удалось запустить Next.js сервер"
    kill $MOCK_PID 2>/dev/null || true
    exit 1
fi

print_success "Приложение запущено!"
echo ""
print_header "🎉 Готово к использованию!"
print_info "Откройте в браузере:"
print_info "  💻 Компьютер: http://localhost:3000"
print_info "  📱 Мобильный: http://$LOCAL_IP:3000"
echo ""

# Ждем завершения
wait $NEXT_PID

