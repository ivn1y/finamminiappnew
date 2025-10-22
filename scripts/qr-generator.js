#!/usr/bin/env node

const os = require('os');
const { execSync } = require('child_process');

// Цвета для консоли
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Skip internal (loopback) addresses and non-IPv4 addresses
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  
  return 'localhost';
}

function checkPortStatus(port) {
  try {
    const output = execSync(`lsof -Pi :${port} -sTCP:LISTEN`, { encoding: 'utf8' });
    return output.trim().length > 0;
  } catch (error) {
    return false;
  }
}

function createQRCode(url) {
  try {
    const qr = require('qrcode-terminal');
    console.log(`${colors.cyan}📱 QR код для мобильного доступа:${colors.reset}`);
    console.log(`${colors.green}${url}${colors.reset}\n`);
    qr.generate(url, { small: true }, (qr) => {
      console.log(qr);
    });
  } catch (error) {
    console.log(`${colors.red}❌ Ошибка генерации QR кода:${colors.reset} ${error.message}`);
    console.log(`${colors.yellow}💡 Установите qrcode-terminal: npm install qrcode-terminal${colors.reset}`);
    console.log(`${colors.white}📱 Или откройте ссылку вручную: ${url}${colors.reset}`);
  }
}

function main() {
  const args = process.argv.slice(2);
  const port = args[0] || 3000;
  
  console.log(`${colors.bright}${colors.cyan}📱 Генератор QR кода для мобильного доступа${colors.reset}\n`);
  
  const ip = getLocalIP();
  const url = `http://${ip}:${port}`;
  
  // Проверяем, запущен ли сервер
  if (!checkPortStatus(port)) {
    console.log(`${colors.red}❌ Сервер не запущен на порту ${port}${colors.reset}`);
    console.log(`${colors.yellow}💡 Запустите сервер командой: npm start${colors.reset}`);
    process.exit(1);
  }
  
  console.log(`${colors.blue}📡 Сетевые адреса:${colors.reset}`);
  console.log(`   💻 Локальный:     ${colors.green}http://localhost:${port}${colors.reset}`);
  console.log(`   📱 Мобильный:     ${colors.green}${url}${colors.reset}`);
  console.log("");
  
  console.log(`${colors.white}📱 Для мобильного тестирования убедитесь, что устройство в той же Wi-Fi сети${colors.reset}`);
  console.log("");
  
  createQRCode(url);
  
  console.log(`\n${colors.yellow}💡 Советы:${colors.reset}`);
  console.log(`   • Убедитесь, что компьютер и телефон в одной Wi-Fi сети`);
  console.log(`   • Если не работает, проверьте настройки брандмауэра`);
  console.log(`   • Для остановки сервера нажмите Ctrl+C в терминале сервера`);
}

if (require.main === module) {
  main();
}

module.exports = { getLocalIP, checkPortStatus, createQRCode };
