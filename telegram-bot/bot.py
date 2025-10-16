from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
import os
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()

# Получаем токен бота из переменных окружения
TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

if not TOKEN:
    print("❌ TELEGRAM_BOT_TOKEN не найден в переменных окружения!")
    print("Создайте файл .env и добавьте: TELEGRAM_BOT_TOKEN=ваш_токен_от_BotFather")
    exit(1)

# URL вашего мини-приложения
MINI_APP_URL = "https://collab.generationfi.online/"

print("🤖 Telegram бот запущен!")
print("📱 Мини-приложение:", MINI_APP_URL)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработчик команды /start"""
    user = update.effective_user
    first_name = user.first_name or "Пользователь"
    username = f"@{user.username}" if user.username else ""
    
    print(f"👤 Пользователь {first_name} {username} ({user.id}) запустил бота")
    
    # Приветственное сообщение
    welcome_message = f"""Привет, {first_name}! 👋

Наше мини приложение для конференции TradeId поможет найти:
• Посмотреть карту и расписание
• Проходить квесты и получать бонусы

Нажмите кнопку ниже, чтобы начать! 🚀"""

    # Создаем inline клавиатуру с кнопкой для запуска мини-приложения
    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton("🚀 Поехали!", web_app=WebAppInfo(url=MINI_APP_URL))]
    ])

    # Отправляем сообщение с кнопкой
    await update.message.reply_text(
        welcome_message,
        reply_markup=keyboard
    )
    
    print(f"✅ Приветственное сообщение отправлено пользователю {first_name}")

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработчик команды /help"""
    user = update.effective_user
    first_name = user.first_name or "Пользователь"
    
    print(f"❓ Пользователь {first_name} запросил помощь")
    
    help_message = """ℹ️ <b>Помощь</b>

<b>Как использовать бота:</b>
1. Нажмите "🚀 Поехали!" для запуска мини-приложения
2. В мини-приложении вы сможете:
   • Просматривать карту конференции
   • Изучать расписание мероприятий
   • Участвовать в квестах
   • Получать бонусы и достижения

<b>Команды:</b>
/start - Начать работу с ботом
/help - Показать это сообщение

Если у вас есть вопросы, обратитесь в поддержку!"""

    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton("🚀 Запустить приложение", web_app=WebAppInfo(url=MINI_APP_URL))]
    ])

    await update.message.reply_text(
        help_message,
        parse_mode="HTML",
        reply_markup=keyboard
    )

def main():
    """Основная функция для запуска бота"""
    # Создаем приложение
    app = ApplicationBuilder().token(TOKEN).build()
    
    # Добавляем обработчики команд
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_command))
    
    # Запускаем бота
    print("🚀 Запуск бота...")
    app.run_polling()

if __name__ == "__main__":
    main()
