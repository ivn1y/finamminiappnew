#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

PORT=3000
IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "localhost")

echo "🔄 Останавливаю dev-сервер на порту $PORT..."
lsof -ti:$PORT | xargs kill -9 2>/dev/null
sleep 1

echo "📥 Обновляю код с main..."
git checkout main
git pull origin main

echo "📦 Устанавливаю зависимости..."
npm install

echo "🗄️ Синхронизирую базу данных..."
npx prisma generate
npx prisma db push

echo "🚀 Запускаю dev-сервер..."
node scripts/run-next-dev.js dev --port $PORT --hostname 0.0.0.0 &

sleep 5

echo ""
echo "✅ Готово!"
echo "💻 Компьютер: http://localhost:$PORT/bugbounty"
echo "📱 iPhone:    http://$IP:$PORT/bugbounty"
echo ""
