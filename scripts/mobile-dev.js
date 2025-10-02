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
  
  console.log('\n🚀 Запуск сервера для мобильного тестирования...\n');
  console.log(`📱 Откройте в браузере мобильного устройства:`);
  console.log(`   http://${ip}:${port}\n`);
  console.log(`💻 Или на компьютере:`);
  console.log(`   http://localhost:${port}\n`);
  console.log('⚠️  Убедитесь, что мобильное устройство подключено к той же Wi-Fi сети!\n');
  
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


