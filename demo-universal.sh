#!/bin/bash

# 🎯 Демонстрация локальной версии
# Автор: AI Assistant

echo "🎯 Демонстрация локальной версии Finam Collab Mini App"
echo "===================================================="
echo ""

# Цвета
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Получаем IP
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP="localhost"
fi

echo -e "${BLUE}🌐 IP адрес: $LOCAL_IP${NC}"
echo ""

echo -e "${GREEN}📱 Доступные адреса:${NC}"
echo "   💻 Компьютер: http://localhost:3000"
echo "   📱 Мобильный: http://$LOCAL_IP:3000"
echo "   🔧 Mock API:   http://localhost:3001"
echo ""

echo -e "${GREEN}🎯 Тестовые данные:${NC}"
echo "   QR коды:"
echo "     TRADER_001  - получение бейджа 'first_trade' (+100 XP)"
echo "     CONTENT_001 - разблокировка контента (+25 XP)"
echo ""
echo "   Тестовый пользователь:"
echo "     ID: user_123"
echo "     Роль: trader"
echo "     XP: 150"
echo "     Бейджи: explorer"
echo ""

echo -e "${GREEN}🚀 Команды для запуска:${NC}"
echo "   npm run start-universal    # Универсальный запуск"
echo "   npm run test-universal      # Тестирование"
echo "   npm run dev:local          # Только для компьютера"
echo "   npm run dev:mobile         # Только для мобильного"
echo ""

echo -e "${GREEN}🔧 API эндпоинты:${NC}"
echo "   GET    /api/users          # Список пользователей"
echo "   GET    /api/users/:id       # Данные пользователя"
echo "   POST   /api/createUser      # Создание пользователя"
echo "   PUT    /api/updateUser/:id  # Обновление пользователя"
echo "   POST   /api/redeemQR        # Использование QR кода"
echo "   POST   /api/logEvent        # Логирование событий"
echo "   GET    /api/events/:userId  # События пользователя"
echo ""

echo -e "${GREEN}📚 Документация:${NC}"
echo "   README_UNIVERSAL.md        # Быстрый старт"
echo "   UNIVERSAL_SETUP.md         # Полная документация"
echo "   LOCAL_SETUP.md             # Локальная настройка"
echo ""

echo -e "${YELLOW}⚠️  Важно:${NC}"
echo "   • Для мобильного тестирования устройства должны быть в одной Wi-Fi сети"
echo "   • Требуется Node.js версии 18.0.0+"
echo "   • Для остановки используйте Ctrl+C"
echo ""

echo -e "${GREEN}✅ Готово к использованию!${NC}"
echo "   Запустите: npm run start-universal"

