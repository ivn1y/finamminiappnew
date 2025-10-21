#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

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

function killProcessOnPort(port) {
  try {
    const output = execSync(`lsof -ti:${port}`, { encoding: 'utf8' });
    if (output.trim()) {
      console.log(`${colors.yellow}⚠️  Останавливаем процессы на порту ${port}...${colors.reset}`);
      execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'ignore' });
      return true;
    }
  } catch (error) {
    // Порт свободен
  }
  return false;
}

function createQRCode(url) {
  // Простая генерация QR кода в консоли
  const qr = require('qrcode-terminal');
  console.log(`${colors.cyan}📱 QR код для мобильного доступа:${colors.reset}`);
  qr.generate(url, { small: true }, (qr) => {
    console.log(qr);
  });
}

function createStatusFile(data) {
  const statusPath = path.join(__dirname, '..', 'local-dev-status.json');
  fs.writeFileSync(statusPath, JSON.stringify(data, null, 2));
}

function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || 'universal';
  
  const ip = getLocalIP();
  const frontendPort = 3000;
  const apiPort = 3001;
  
  console.log(`${colors.bright}${colors.cyan}🚀 Универсальный локальный сервер разработки${colors.reset}\n`);
  
  // Останавливаем существующие процессы
  killProcessOnPort(frontendPort);
  killProcessOnPort(apiPort);
  
  console.log(`${colors.blue}📡 Сетевые адреса:${colors.reset}`);
  console.log(`   💻 Локальный:     ${colors.green}http://localhost:${frontendPort}${colors.reset}`);
  console.log(`   📱 Мобильный:     ${colors.green}http://${ip}:${frontendPort}${colors.reset}`);
  console.log(`   🔌 API сервер:    ${colors.green}http://localhost:${apiPort}${colors.reset}\n`);
  
  // Создаем файл статуса
  const statusData = {
    timestamp: new Date().toISOString(),
    mode: mode,
    frontend: {
      local: `http://localhost:${frontendPort}`,
      mobile: `http://${ip}:${frontendPort}`,
      port: frontendPort,
      status: 'starting'
    },
    api: {
      url: `http://localhost:${apiPort}`,
      port: apiPort,
      status: 'starting'
    },
    network: {
      ip: ip,
      interfaces: os.networkInterfaces()
    }
  };
  
  createStatusFile(statusData);
  
  console.log(`${colors.yellow}🔧 Режим: ${mode}${colors.reset}`);
  console.log(`${colors.white}📱 Для мобильного тестирования убедитесь, что устройство в той же Wi-Fi сети${colors.reset}`);
  console.log(`${colors.white}⚠️  Для остановки нажмите Ctrl+C${colors.reset}\n`);
  
  // Запускаем mock API сервер в фоне
  console.log(`${colors.magenta}🔄 Запускаем Mock API сервер...${colors.reset}`);
  const apiProcess = spawn('node', ['mock-server.js'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe'
  });
  
  apiProcess.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Mock API Server запущен')) {
      console.log(`${colors.green}✅ Mock API сервер запущен на порту ${apiPort}${colors.reset}`);
      
      // Обновляем статус API
      statusData.api.status = 'running';
      createStatusFile(statusData);
    }
  });
  
  apiProcess.stderr.on('data', (data) => {
    console.error(`${colors.red}API Error:${colors.reset}`, data.toString());
  });
  
  // Ждем запуска API сервера
  setTimeout(() => {
    console.log(`${colors.magenta}🔄 Запускаем Next.js сервер...${colors.reset}`);
    
    // Запускаем Next.js с доступом по всем IP
    const nextProcess = spawn('npm', ['run', 'dev:mobile'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
    
    nextProcess.on('error', (error) => {
      console.error(`${colors.red}❌ Ошибка запуска Next.js сервера:${colors.reset}`, error.message);
      apiProcess.kill();
      process.exit(1);
    });
    
    // Обновляем статус фронтенда
    statusData.frontend.status = 'running';
    createStatusFile(statusData);
    
    // Показываем QR код для мобильного доступа
    setTimeout(() => {
      console.log(`\n${colors.cyan}📱 Для быстрого доступа с мобильного устройства:${colors.reset}`);
      console.log(`${colors.green}http://${ip}:${frontendPort}${colors.reset}`);
      
      // Пытаемся показать QR код
      try {
        createQRCode(`http://${ip}:${frontendPort}`);
      } catch (error) {
        console.log(`${colors.yellow}💡 Установите qrcode-terminal для отображения QR кода: npm install -g qrcode-terminal${colors.reset}`);
      }
    }, 3000);
    
  }, 2000);
  
  // Обработка завершения
  process.on('SIGINT', () => {
    console.log(`${colors.yellow}\n🛑 Останавливаем серверы...${colors.reset}`);
    
    // Обновляем статус
    statusData.frontend.status = 'stopped';
    statusData.api.status = 'stopped';
    createStatusFile(statusData);
    
    apiProcess.kill();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log(`${colors.yellow}\n🛑 Останавливаем серверы...${colors.reset}`);
    
    statusData.frontend.status = 'stopped';
    statusData.api.status = 'stopped';
    createStatusFile(statusData);
    
    apiProcess.kill();
    process.exit(0);
  });
}

if (require.main === module) {
  main();
}

module.exports = { getLocalIP, killProcessOnPort, createQRCode };
