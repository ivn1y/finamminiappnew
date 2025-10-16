# 🚀 Развертывание бота на существующий сервер

## 📋 Варианты развертывания:

### 1. **Прямое копирование файлов**
```bash
# На вашем сервере
scp -r telegram-bot/ user@your-server:/path/to/project/
scp Procfile user@your-server:/path/to/project/
scp requirements.txt user@your-server:/path/to/project/

# На сервере
cd /path/to/project/
pip install -r requirements.txt
python telegram-bot/bot.py &
```

### 2. **Через GitHub (автоматическое развертывание)**
```bash
# Локально
git add .
git commit -m "Add Telegram bot"
git push origin main

# На сервере настроить webhook для автодеплоя
```

### 3. **Через Docker (если используете)**
```dockerfile
# Dockerfile для бота
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY telegram-bot/ ./telegram-bot/
CMD ["python", "telegram-bot/bot.py"]
```

## ⚙️ Настройка как сервис (systemd)

Создать файл `/etc/systemd/system/telegram-bot.service`:

```ini
[Unit]
Description=Telegram Bot
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/project
ExecStart=/usr/bin/python3 telegram-bot/bot.py
Restart=always
RestartSec=10
Environment=TELEGRAM_BOT_TOKEN=8258511260:AAHG6drhuPrXKuGyo7_B4h8czxcupQZOPRw
Environment=MINI_APP_URL=https://collab.generationfi.online/

[Install]
WantedBy=multi-user.target
```

Затем:
```bash
sudo systemctl daemon-reload
sudo systemctl enable telegram-bot
sudo systemctl start telegram-bot
sudo systemctl status telegram-bot
```

## 🔄 Автозапуск и мониторинг

```bash
# Проверить статус
sudo systemctl status telegram-bot

# Посмотреть логи
sudo journalctl -u telegram-bot -f

# Перезапустить
sudo systemctl restart telegram-bot
```

## 📱 Результат:

После развертывания бот будет работать **24/7** на вашем сервере!
