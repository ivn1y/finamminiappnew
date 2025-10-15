#!/bin/bash

# 🚀 Универсальный скрипт запуска для ПК и мобильного
# Автор: AI Assistant
# Версия: 2.0

set -e

echo "🚀 Запуск универсальной локальной версии"
echo "========================================"
echo ""

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода с цветом
print_status() {
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

# Проверяем Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js не установлен. Установите Node.js версии 18+ и попробуйте снова."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Требуется Node.js версии 18+. Текущая версия: $(node --version)"
    exit 1
fi

print_status "Node.js версия: $(node --version)"

# Получаем IP адрес
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
if [ -z "$LOCAL_IP" ]; then
    print_warning "Не удалось определить IP адрес. Используйте localhost для тестирования."
    LOCAL_IP="localhost"
fi

print_info "IP адрес: $LOCAL_IP"

# Очищаем порты
print_info "Очищаем порты..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
sleep 2

# Проверяем зависимости
if [ ! -d "node_modules" ]; then
    print_info "Устанавливаем зависимости..."
    npm install
fi

print_status "Зависимости установлены"

echo ""
echo "📱 Доступные адреса:"
echo "   💻 Компьютер: http://localhost:3000"
echo "   📱 Мобильный: http://$LOCAL_IP:3000"
echo "   🔧 Mock API:   http://localhost:3001"
echo ""

echo "🎯 Тестовые данные:"
echo "   QR коды:"
echo "     TRADER_001  - получение бейджа 'first_trade'"
echo "     CONTENT_001 - разблокировка контента"
echo "   Тестовый пользователь:"
echo "     ID: user_123"
echo "     Роль: trader"
echo "     XP: 150"
echo ""

# Функция для обработки сигналов
cleanup() {
    echo ""
    print_warning "Останавливаем серверы..."
    kill $MOCK_PID 2>/dev/null || true
    kill $NEXT_PID 2>/dev/null || true
    print_status "Серверы остановлены"
    exit 0
}

# Устанавливаем обработчик сигналов
trap cleanup SIGINT SIGTERM

# Запускаем Mock API
print_info "Запускаем Mock API сервер..."
node simple-mock-server.js &
MOCK_PID=$!

# Ждем запуска Mock API
sleep 3

# Проверяем, что Mock API запустился
if ! kill -0 $MOCK_PID 2>/dev/null; then
    print_error "Не удалось запустить Mock API сервер"
    exit 1
fi

print_status "Mock API запущен на порту 3001"

# Запускаем Next.js
print_info "Запускаем основное приложение..."
print_warning "Для остановки нажмите Ctrl+C"
echo ""

# Запускаем Next.js с правильными параметрами
npx next dev --port 3000 --hostname 0.0.0.0 &
NEXT_PID=$!

# Ждем запуска Next.js
sleep 5

# Проверяем, что Next.js запустился
if ! kill -0 $NEXT_PID 2>/dev/null; then
    print_error "Не удалось запустить Next.js сервер"
    kill $MOCK_PID 2>/dev/null || true
    exit 1
fi

print_status "Приложение запущено!"
echo ""
print_info "Откройте в браузере:"
print_info "  💻 Компьютер: http://localhost:3000"
print_info "  📱 Мобильный: http://$LOCAL_IP:3000"
echo ""

# Ждем завершения
wait $NEXT_PID
