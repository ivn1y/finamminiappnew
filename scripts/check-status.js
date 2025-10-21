#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

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

function checkPortStatus(port) {
  try {
    const output = execSync(`lsof -Pi :${port} -sTCP:LISTEN`, { encoding: 'utf8' });
    return {
      running: true,
      process: output.trim()
    };
  } catch (error) {
    return {
      running: false,
      process: null
    };
  }
}

function checkHTTPStatus(url) {
  try {
    const output = execSync(`curl -s -o /dev/null -w "%{http_code}" "${url}"`, { encoding: 'utf8' });
    return {
      status: parseInt(output.trim()),
      accessible: parseInt(output.trim()) < 400
    };
  } catch (error) {
    return {
      status: 0,
      accessible: false
    };
  }
}

function loadStatusFile() {
  const statusPath = path.join(__dirname, '..', 'local-dev-status.json');
  try {
    if (fs.existsSync(statusPath)) {
      const content = fs.readFileSync(statusPath, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    // Игнорируем ошибки чтения файла
  }
  return null;
}

function formatStatus(status) {
  if (status.running) {
    return `${colors.green}✅ Запущен${colors.reset}`;
  } else {
    return `${colors.red}❌ Остановлен${colors.reset}`;
  }
}

function formatHTTPStatus(httpStatus) {
  if (httpStatus.accessible) {
    return `${colors.green}✅ HTTP ${httpStatus.status}${colors.reset}`;
  } else {
    return `${colors.red}❌ Недоступен${colors.reset}`;
  }
}

function main() {
  console.log(`${colors.bright}${colors.cyan}📊 Статус локальных сервисов${colors.reset}\n`);
  
  const ip = getLocalIP();
  const frontendPort = 3000;
  const apiPort = 3001;
  
  // Проверяем статус портов
  const frontendPortStatus = checkPortStatus(frontendPort);
  const apiPortStatus = checkPortStatus(apiPort);
  
  // Проверяем HTTP статус
  const frontendHTTP = checkHTTPStatus(`http://localhost:${frontendPort}`);
  const apiHTTP = checkHTTPStatus(`http://localhost:${apiPort}`);
  
  // Загружаем файл статуса
  const statusFile = loadStatusFile();
  
  console.log(`${colors.blue}🔌 Статус портов:${colors.reset}`);
  console.log(`   Frontend (${frontendPort}): ${formatStatus(frontendPortStatus)}`);
  console.log(`   API (${apiPort}):         ${formatStatus(apiPortStatus)}`);
  console.log('');
  
  console.log(`${colors.blue}🌐 HTTP статус:${colors.reset}`);
  console.log(`   Frontend: ${formatHTTPStatus(frontendHTTP)}`);
  console.log(`   API:      ${formatHTTPStatus(apiHTTP)}`);
  console.log('');
  
  console.log(`${colors.blue}📡 Доступные адреса:${colors.reset}`);
  console.log(`   💻 Локальный фронтенд:  ${colors.green}http://localhost:${frontendPort}${colors.reset}`);
  console.log(`   📱 Мобильный фронтенд:  ${colors.green}http://${ip}:${frontendPort}${colors.reset}`);
  console.log(`   🔌 API сервер:          ${colors.green}http://localhost:${apiPort}${colors.reset}`);
  console.log('');
  
  if (statusFile) {
    console.log(`${colors.blue}📄 Информация из файла статуса:${colors.reset}`);
    console.log(`   Режим: ${statusFile.mode || 'неизвестно'}`);
    console.log(`   Время запуска: ${statusFile.timestamp || 'неизвестно'}`);
    console.log(`   Статус фронтенда: ${statusFile.frontend?.status || 'неизвестно'}`);
    console.log(`   Статус API: ${statusFile.api?.status || 'неизвестно'}`);
    console.log('');
  }
  
  // Проверяем процессы
  if (frontendPortStatus.running) {
    console.log(`${colors.blue}🔍 Процесс фронтенда:${colors.reset}`);
    console.log(`   ${frontendPortStatus.process}`);
    console.log('');
  }
  
  if (apiPortStatus.running) {
    console.log(`${colors.blue}🔍 Процесс API:${colors.reset}`);
    console.log(`   ${apiPortStatus.process}`);
    console.log('');
  }
  
  // Рекомендации
  console.log(`${colors.yellow}💡 Рекомендации:${colors.reset}`);
  
  if (!frontendPortStatus.running) {
    console.log(`   • Запустите фронтенд: ${colors.cyan}./start-local-universal.sh${colors.reset}`);
  }
  
  if (!apiPortStatus.running) {
    console.log(`   • Запустите API: ${colors.cyan}npm run mock-api${colors.reset}`);
  }
  
  if (frontendPortStatus.running && apiPortStatus.running) {
    console.log(`   • Все сервисы запущены и готовы к работе!`);
    console.log(`   • Для остановки используйте Ctrl+C в терминале с серверами`);
  }
  
  console.log('');
  
  // Проверяем сетевые интерфейсы
  console.log(`${colors.blue}🌐 Сетевые интерфейсы:${colors.reset}`);
  const interfaces = os.networkInterfaces();
  Object.keys(interfaces).forEach(name => {
    const iface = interfaces[name];
    iface.forEach(addr => {
      if (addr.family === 'IPv4' && !addr.internal) {
        console.log(`   ${name}: ${addr.address}`);
      }
    });
  });
  
  console.log('');
}

if (require.main === module) {
  main();
}

module.exports = { checkPortStatus, checkHTTPStatus, getLocalIP };

