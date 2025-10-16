#!/bin/bash

echo "🚀 Запуск Telegram бота с ngrok туннелем..."

# Останавливаем предыдущие процессы
pkill -f bot.py
pkill -f ngrok

# Запускаем ngrok туннель для порта 3000
echo "🌐 Запуск ngrok туннеля..."
ngrok http 3000 --log=stdout > ngrok.log 2>&1 &
NGROK_PID=$!

# Ждем запуска ngrok
echo "⏳ Ожидание запуска ngrok..."
sleep 5

# Получаем публичный URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    tunnels = data.get('tunnels', [])
    for tunnel in tunnels:
        if tunnel.get('proto') == 'https':
            print(tunnel.get('public_url', ''))
            break
except:
    pass
")

if [ -z "$NGROK_URL" ]; then
    echo "❌ Не удалось получить ngrok URL"
    exit 1
fi

echo "✅ Ngrok URL: $NGROK_URL"

# Обновляем .env файл с новым URL
echo "TELEGRAM_BOT_TOKEN=8258511260:AAHG6drhuPrXKuGyo7_B4h8czxcupQZOPRw" > telegram-bot/.env
echo "MINI_APP_URL=$NGROK_URL" >> telegram-bot/.env

echo "📝 Обновлен .env файл с URL: $NGROK_URL"

# Запускаем бота
echo "🤖 Запуск Telegram бота..."
cd telegram-bot
python3 bot.py &
BOT_PID=$!

echo ""
echo "✅ Все сервисы запущены!"
echo "🌐 Ngrok URL: $NGROK_URL"
echo "🤖 Telegram бот: работает"
echo ""
echo "Теперь отправьте /start вашему боту в Telegram!"
echo ""
echo "Для остановки нажмите Ctrl+C"

# Функция для остановки всех процессов
cleanup() {
    echo ""
    echo "🛑 Остановка процессов..."
    kill $BOT_PID $NGROK_PID 2>/dev/null
    exit 0
}

# Устанавливаем обработчик сигналов
trap cleanup SIGINT SIGTERM

# Ждем завершения любого из процессов
wait $BOT_PID $NGROK_PID
