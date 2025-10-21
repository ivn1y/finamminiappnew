#!/bin/bash

# Скрипт для быстрого тестирования на разных устройствах
# Автор: AI Assistant

echo "🧪 Тестирование на разных устройствах"
echo "===================================="
echo ""

# Проверяем зависимости
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден"
    exit 1
fi

# Получаем команду
ACTION=${1:-"start"}

echo "🔧 Команда: $ACTION"
echo ""

case $ACTION in
  "start")
    echo "🚀 Запускаем серверы для тестирования..."
    node scripts/test-devices.js start
    ;;
  "open")
    DEVICE=${2:-"desktop"}
    echo "🌐 Открываем в браузере ($DEVICE)..."
    node scripts/test-devices.js open $DEVICE
    ;;
  "qr")
    echo "📱 Показываем QR код для мобильного доступа..."
    node scripts/test-devices.js qr
    ;;
  "status")
    echo "📊 Проверяем статус сервисов..."
    node scripts/test-devices.js status
    ;;
  "stop")
    echo "🛑 Останавливаем серверы..."
    node scripts/test-devices.js stop
    ;;
  *)
    echo "❌ Неизвестная команда: $ACTION"
    echo ""
    echo "💡 Доступные команды:"
    echo "   start  - Запустить серверы для тестирования"
    echo "   open   - Открыть в браузере (desktop/mobile)"
    echo "   qr     - Показать QR код для мобильного доступа"
    echo "   status - Показать статус сервисов"
    echo "   stop   - Остановить все серверы"
    echo ""
    echo "💡 Примеры:"
    echo "   ./test-devices.sh start"
    echo "   ./test-devices.sh open desktop"
    echo "   ./test-devices.sh open mobile"
    echo "   ./test-devices.sh qr"
    echo "   ./test-devices.sh status"
    echo "   ./test-devices.sh stop"
    ;;
esac

