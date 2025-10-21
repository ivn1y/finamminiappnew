#!/usr/bin/env node

const { execSync } = require('child_process');
const os = require('os');

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

function main() {
  const ip = getLocalIP();
  const port = 3000;
  
  console.log('\n🚀 Запуск универсальной мобильной версии приложения...\n');
  console.log('📱 Доступные адреса для мобильных устройств:');
  console.log(`   http://${ip}:${port} (автоопределение)`);
  console.log(`   http://192.168.1.13:${port} (ваш текущий IP)`);
  console.log(`   http://192.168.1.196:${port} (альтернативный)`);
  console.log(`   http://192.168.1.192:${port} (альтернативный)`);
  console.log('');
  console.log('💻 Локальная версия:');
  console.log(`   http://localhost:${port}`);
  console.log('');
  console.log('📋 Инструкции для подключения с телефона:');
  console.log('   1. Убедитесь, что телефон подключен к той же Wi-Fi сети');
  console.log('   2. Откройте браузер на телефоне');
  console.log('   3. Перейдите по одному из адресов выше');
  console.log('');
  console.log('⚠️  Для остановки сервера нажмите Ctrl+C');
  console.log('');
  
  // Запускаем Next.js сервер
  try {
    execSync(`npm run dev:mobile`, { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Ошибка запуска сервера:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { getLocalIP };

