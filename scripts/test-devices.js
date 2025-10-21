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
      execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'ignore' });
      return true;
    }
  } catch (error) {
    // Порт свободен
  }
  return false;
}

function openURL(url) {
  const platform = os.platform();
  
  try {
    if (platform === 'darwin') {
      execSync(`open "${url}"`, { stdio: 'ignore' });
    } else if (platform === 'win32') {
      execSync(`start "${url}"`, { stdio: 'ignore' });
    } else {
      execSync(`xdg-open "${url}"`, { stdio: 'ignore' });
    }
    return true;
  } catch (error) {
    return false;
  }
}

function generateQRCode(url) {
  try {
    // Используем qrencode если доступен
    const qrCode = execSync(`qrencode -t ansiutf8 "${url}"`, { encoding: 'utf8' });
    return qrCode;
  } catch (error) {
    // Если qrencode недоступен, создаем текстовый QR код
    return `
┌─────────────────────────────────────┐
│  📱 QR код для мобильного доступа   │
│                                     │
│  ${url.padEnd(35)} │
│                                     │
│  Скопируйте этот URL в браузер      │
│  мобильного устройства             │
└─────────────────────────────────────┘
`;
  }
}

function main() {
  const args = process.argv.slice(2);
  const action = args[0] || 'start';
  
  const ip = getLocalIP();
  const frontendPort = 3000;
  const apiPort = 3001;
  
  console.log(`${colors.bright}${colors.cyan}🧪 Тестирование на разных устройствах${colors.reset}\n`);
  
  if (action === 'start') {
    console.log(`${colors.yellow}🚀 Запускаем серверы для тестирования...${colors.reset}\n`);
    
    // Останавливаем существующие процессы
    killProcessOnPort(frontendPort);
    killProcessOnPort(apiPort);
    
    console.log(`${colors.blue}📡 Адреса для тестирования:${colors.reset}`);
    console.log(`   💻 Компьютер:     ${colors.green}http://localhost:${frontendPort}${colors.reset}`);
    console.log(`   📱 Мобильный:     ${colors.green}http://${ip}:${frontendPort}${colors.reset}`);
    console.log(`   🔌 API:           ${colors.green}http://localhost:${apiPort}${colors.reset}\n`);
    
    // Запускаем серверы
    console.log(`${colors.magenta}🔄 Запускаем серверы...${colors.reset}`);
    
    // Запускаем mock API
    const apiProcess = spawn('node', ['mock-server.js'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    });
    
    apiProcess.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Mock API Server запущен')) {
        console.log(`${colors.green}✅ Mock API сервер запущен${colors.reset}`);
        
        // Запускаем фронтенд
        setTimeout(() => {
          console.log(`${colors.green}✅ Запускаем фронтенд сервер...${colors.reset}`);
          
          try {
            execSync(`npm run dev:mobile`, { 
              stdio: 'inherit',
              cwd: path.join(__dirname, '..')
            });
          } catch (error) {
            console.error(`${colors.red}❌ Ошибка запуска фронтенда:${colors.reset}`, error.message);
            apiProcess.kill();
            process.exit(1);
          }
        }, 2000);
      }
    });
    
    // Обработка завершения
    process.on('SIGINT', () => {
      console.log(`${colors.yellow}\n🛑 Останавливаем серверы...${colors.reset}`);
      apiProcess.kill();
      process.exit(0);
    });
    
  } else if (action === 'open') {
    const device = args[1] || 'desktop';
    
    if (device === 'desktop') {
      const url = `http://localhost:${frontendPort}`;
      console.log(`${colors.blue}💻 Открываем на компьютере: ${url}${colors.reset}`);
      if (openURL(url)) {
        console.log(`${colors.green}✅ Браузер открыт${colors.reset}`);
      } else {
        console.log(`${colors.yellow}⚠️  Не удалось открыть браузер автоматически${colors.reset}`);
        console.log(`   Откройте вручную: ${url}`);
      }
    } else if (device === 'mobile') {
      const url = `http://${ip}:${frontendPort}`;
      console.log(`${colors.blue}📱 Адрес для мобильного устройства: ${url}${colors.reset}`);
      console.log(`${colors.yellow}📱 QR код для быстрого доступа:${colors.reset}`);
      console.log(generateQRCode(url));
    }
    
  } else if (action === 'qr') {
    const url = `http://${ip}:${frontendPort}`;
    console.log(`${colors.blue}📱 QR код для мобильного доступа:${colors.reset}`);
    console.log(generateQRCode(url));
    
  } else if (action === 'status') {
    console.log(`${colors.blue}📊 Статус сервисов:${colors.reset}`);
    
    try {
      const frontendStatus = execSync(`lsof -Pi :${frontendPort} -sTCP:LISTEN`, { encoding: 'utf8' });
      console.log(`${colors.green}✅ Фронтенд запущен на порту ${frontendPort}${colors.reset}`);
    } catch (error) {
      console.log(`${colors.red}❌ Фронтенд не запущен${colors.reset}`);
    }
    
    try {
      const apiStatus = execSync(`lsof -Pi :${apiPort} -sTCP:LISTEN`, { encoding: 'utf8' });
      console.log(`${colors.green}✅ API запущен на порту ${apiPort}${colors.reset}`);
    } catch (error) {
      console.log(`${colors.red}❌ API не запущен${colors.reset}`);
    }
    
    console.log(`\n${colors.blue}📡 Доступные адреса:${colors.reset}`);
    console.log(`   💻 Компьютер: http://localhost:${frontendPort}`);
    console.log(`   📱 Мобильный: http://${ip}:${frontendPort}`);
    
  } else if (action === 'stop') {
    console.log(`${colors.yellow}🛑 Останавливаем все серверы...${colors.reset}`);
    
    const frontendKilled = killProcessOnPort(frontendPort);
    const apiKilled = killProcessOnPort(apiPort);
    
    if (frontendKilled) {
      console.log(`${colors.green}✅ Фронтенд сервер остановлен${colors.reset}`);
    }
    if (apiKilled) {
      console.log(`${colors.green}✅ API сервер остановлен${colors.reset}`);
    }
    
    if (!frontendKilled && !apiKilled) {
      console.log(`${colors.yellow}⚠️  Серверы не были запущены${colors.reset}`);
    }
    
  } else {
    console.log(`${colors.red}❌ Неизвестная команда: ${action}${colors.reset}`);
    console.log(`\n${colors.yellow}Доступные команды:${colors.reset}`);
    console.log(`  ${colors.cyan}start${colors.reset}  - Запустить серверы для тестирования`);
    console.log(`  ${colors.cyan}open${colors.reset}   - Открыть в браузере (desktop/mobile)`);
    console.log(`  ${colors.cyan}qr${colors.reset}     - Показать QR код для мобильного доступа`);
    console.log(`  ${colors.cyan}status${colors.reset} - Показать статус сервисов`);
    console.log(`  ${colors.cyan}stop${colors.reset}    - Остановить все серверы`);
    console.log(`\n${colors.yellow}Примеры:${colors.reset}`);
    console.log(`  node scripts/test-devices.js start`);
    console.log(`  node scripts/test-devices.js open desktop`);
    console.log(`  node scripts/test-devices.js open mobile`);
    console.log(`  node scripts/test-devices.js qr`);
    console.log(`  node scripts/test-devices.js status`);
    console.log(`  node scripts/test-devices.js stop`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { getLocalIP, killProcessOnPort, openURL, generateQRCode };

