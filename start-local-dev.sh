#!/bin/bash

# Finam Collab Mini App - Локальная разработка
# Автор: AI Assistant
# Описание: Запускает сервер для тестирования на компьютере и мобильных устройствах

echo "🚀 Finam Collab Mini App - Локальная разработка"
echo "=============================================="
echo ""

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Файл package.json не найден. Запустите скрипт из корневой директории проекта."
    exit 1
fi

# Проверяем зависимости
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден. Установите Node.js >= 18.0.0"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm не найден. Установите npm"
    exit 1
fi

# Проверяем версию Node.js
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Требуется Node.js >= 18.0.0. Текущая версия: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) - OK"
echo "✅ npm $(npm --version) - OK"
echo ""

# Проверяем, установлены ли зависимости
if [ ! -d "node_modules" ]; then
    echo "📦 Устанавливаем зависимости..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Ошибка установки зависимостей"
        exit 1
    fi
    echo "✅ Зависимости установлены"
    echo ""
fi

# Останавливаем существующие процессы
echo "🔄 Останавливаем существующие процессы..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "   Останавливаем процесс на порту 3000..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
fi

if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "   Останавливаем процесс на порту 3001..."
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
fi

sleep 2
echo "✅ Процессы остановлены"
echo ""

# Получаем IP-адрес
IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')

echo "📡 Сетевые адреса:"
echo "   💻 Локальный:     http://localhost:3000"
echo "   📱 Мобильный:     http://$IP:3000"
echo "   🔌 API сервер:    http://localhost:3001"
echo ""

echo "📱 Для мобильного тестирования убедитесь, что устройство в той же Wi-Fi сети"
echo "⚠️  Для остановки нажмите Ctrl+C"
echo ""

# Запускаем универсальный скрипт
echo "🚀 Запускаем серверы..."
node scripts/local-dev-universal.js

