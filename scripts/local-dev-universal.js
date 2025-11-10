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
  gray: '\x1b[90m',
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
  try {
    const qr = require('qrcode-terminal');
    console.log(`${colors.cyan}📱 QR код для мобильного доступа:${colors.reset}`);
    qr.generate(url, { small: true }, (qr) => {
      console.log(qr);
    });
  } catch (error) {
    console.log(`${colors.yellow}💡 Установите qrcode-terminal для отображения QR кода: npm install -g qrcode-terminal${colors.reset}`);
  }
}

function createStatusFile(data) {
  const statusPath = path.join(__dirname, '..', 'local-dev-status.json');
  fs.writeFileSync(statusPath, JSON.stringify(data, null, 2));
}

function checkDependencies() {
  console.log(`${colors.blue}🔍 Проверяем зависимости...${colors.reset}`);
  
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    
    console.log(`${colors.green}✅ Node.js ${nodeVersion}${colors.reset}`);
    console.log(`${colors.green}✅ npm ${npmVersion}${colors.reset}`);
    
    // Проверяем версию Node.js
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    if (majorVersion < 18) {
      console.log(`${colors.red}❌ Требуется Node.js >= 18.0.0${colors.reset}`);
      process.exit(1);
    }
    
  } catch (error) {
    console.log(`${colors.red}❌ Node.js или npm не найдены${colors.reset}`);
    process.exit(1);
  }
}

function checkNodeModules() {
  const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log(`${colors.yellow}📦 Устанавливаем зависимости...${colors.reset}`);
    try {
      execSync('npm install', { 
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit'
      });
      console.log(`${colors.green}✅ Зависимости установлены${colors.reset}`);
    } catch (error) {
      console.log(`${colors.red}❌ Ошибка установки зависимостей${colors.reset}`);
      process.exit(1);
    }
  } else {
    console.log(`${colors.green}✅ Зависимости найдены${colors.reset}`);
  }
}

function displayNetworkInfo(ip, frontendPort, apiPort) {
  console.log(`\n${colors.bright}${colors.cyan}🌐 Сетевые адреса:${colors.reset}`);
  console.log(`   ${colors.gray}💻${colors.reset} Локальный:     ${colors.green}http://localhost:${frontendPort}${colors.reset}`);
  console.log(`   ${colors.gray}📱${colors.reset} Мобильный:     ${colors.green}http://${ip}:${frontendPort}${colors.reset}`);
  console.log(`   ${colors.gray}🔌${colors.reset} API сервер:    ${colors.green}http://localhost:${apiPort}${colors.reset}`);
  console.log(`   ${colors.gray}📊${colors.reset} Статус:        ${colors.green}http://localhost:${frontendPort}/api/status${colors.reset}`);
}

function displayInstructions(ip, frontendPort) {
  console.log(`\n${colors.bright}${colors.yellow}📋 Инструкции:${colors.reset}`);
  console.log(`${colors.white}• Для тестирования на компьютере: откройте http://localhost:${frontendPort}${colors.reset}`);
  console.log(`${colors.white}• Для тестирования на мобильном: откройте http://${ip}:${frontendPort}${colors.reset}`);
  console.log(`${colors.white}• Убедитесь, что мобильное устройство подключено к той же Wi-Fi сети${colors.reset}`);
  console.log(`${colors.white}• Для остановки серверов нажмите Ctrl+C${colors.reset}`);
}

function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || 'universal';
  
  console.log(`${colors.bright}${colors.cyan}🚀 Finam Collab Mini App - Локальная разработка${colors.reset}`);
  console.log(`${colors.gray}================================================${colors.reset}\n`);
  
  // Проверяем зависимости
  checkDependencies();
  checkNodeModules();
  
  const ip = getLocalIP();
  const frontendPort = 3000;
  const apiPort = 3001;
  
  console.log(`\n${colors.blue}🔄 Подготовка серверов...${colors.reset}`);
  
  // Останавливаем существующие процессы
  killProcessOnPort(frontendPort);
  killProcessOnPort(apiPort);
  
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
    },
    instructions: {
      desktop: `http://localhost:${frontendPort}`,
      mobile: `http://${ip}:${frontendPort}`,
      qrCode: `http://${ip}:${frontendPort}`
    }
  };
  
  createStatusFile(statusData);
  
  displayNetworkInfo(ip, frontendPort, apiPort);
  displayInstructions(ip, frontendPort);
  
  console.log(`\n${colors.magenta}🔄 Запускаем Mock API сервер...${colors.reset}`);
  
  // Запускаем mock API сервер в фоне
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
    
    // Показываем информацию для мобильного доступа
    setTimeout(() => {
      console.log(`\n${colors.cyan}📱 Для быстрого доступа с мобильного устройства:${colors.reset}`);
      console.log(`${colors.green}http://${ip}:${frontendPort}${colors.reset}`);
      
      console.log(`\n${colors.bright}${colors.green}🎉 Серверы запущены и готовы к работе!${colors.reset}`);
      console.log(`${colors.gray}================================================${colors.reset}`);
      
    }, 3000);
    
  }, 2000);
  
  // Обработка завершения
  process.on('SIGINT', () => {
    console.log(`\n${colors.yellow}🛑 Останавливаем серверы...${colors.reset}`);
    
    // Обновляем статус
    statusData.frontend.status = 'stopped';
    statusData.api.status = 'stopped';
    createStatusFile(statusData);
    
    apiProcess.kill();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log(`\n${colors.yellow}🛑 Останавливаем серверы...${colors.reset}`);
    
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