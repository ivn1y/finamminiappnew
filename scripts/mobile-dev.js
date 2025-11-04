#!/usr/bin/env node

const { execSync } = require('child_process');
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      if (interface.family === 'IPv4' && !interface.internal) {
        const ip = interface.address;
        if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
          return ip;
        }
      }
    }
  }
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
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
  
  delete process.env.NODE_ENV;
  process.env.NODE_ENV = 'development';
  
  console.log('\n🚀 Запуск версии для ПК и телефона...\n');
  console.log('📱 Для телефона (в той же Wi-Fi сети):');
  console.log(`   http://${ip}:${port}\n`);
  console.log('💻 Для компьютера:');
  console.log(`   http://localhost:${port}\n`);
  console.log('⚠️  Убедитесь, что телефон в той же Wi-Fi сети!');
  console.log('⚠️  Для остановки нажмите Ctrl+C\n');
  
  const env = Object.assign({}, process.env, { NODE_ENV: 'development' });
  
  try {
    execSync(`npm run dev:mobile`, { 
      stdio: 'inherit',
      env: env
    });
  } catch (error) {
    if (error.signal !== 'SIGINT') {
      console.error('❌ Ошибка запуска:', error.message);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = { getLocalIP };
