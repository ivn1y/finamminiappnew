#!/usr/bin/env node

const os = require('os');
const fs = require('fs');
const path = require('path');
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

function checkHTTPStatus(url) {
  try {
    const output = execSync(`curl -s -o /dev/null -w "%{http_code}" ${url}`, { encoding: 'utf8' });
    return output.trim();
  } catch (error) {
    return '000';
  }
}

function loadStatusFile() {
  const statusPath = path.join(__dirname, '..', 'local-dev-status.json');
  try {
    const content = fs.readFileSync(statusPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

function main() {
  console.log(`${colors.bright}${colors.cyan}🔍 Проверка статуса локального сервера${colors.reset}\n`);
  
  const ip = getLocalIP();
  const frontendPort = 3000;
  const apiPort = 3001;
  
  // Проверяем порты
  const frontendRunning = checkPortStatus(frontendPort);
  const apiRunning = checkPortStatus(apiPort);
  
  // Проверяем HTTP статус
  const frontendStatus = frontendRunning ? checkHTTPStatus(`http://localhost:${frontendPort}`) : '000';
  const apiStatus = apiRunning ? checkHTTPStatus(`http://localhost:${apiPort}/api/health`) : '000';
  
  console.log(`${colors.blue}📡 Сетевые адреса:${colors.reset}`);
  console.log(`   💻 Локальный:     ${colors.green}http://localhost:${frontendPort}${colors.reset}`);
  console.log(`   📱 Мобильный:     ${colors.green}http://${ip}:${frontendPort}${colors.reset}`);
  console.log(`   🔌 API сервер:    ${colors.green}http://localhost:${apiPort}${colors.reset}`);
  console.log("");
  
  console.log(`${colors.blue}📊 Статус сервисов:${colors.reset}`);
  
  // Фронтенд
  if (frontendRunning) {
    const statusColor = frontendStatus === '200' ? colors.green : colors.yellow;
    console.log(`   🖥️  Фронтенд:      ${statusColor}✅ Запущен${colors.reset} (HTTP ${frontendStatus})`);
  } else {
    console.log(`   🖥️  Фронтенд:      ${colors.red}❌ Остановлен${colors.reset}`);
  }
  
  // API
  if (apiRunning) {
    const statusColor = apiStatus === '200' ? colors.green : colors.yellow;
    console.log(`   🔌 API сервер:    ${statusColor}✅ Запущен${colors.reset} (HTTP ${apiStatus})`);
  } else {
    console.log(`   🔌 API сервер:    ${colors.red}❌ Остановлен${colors.reset}`);
  }
  
  console.log("");
  
  // Показываем информацию из файла статуса
  const statusData = loadStatusFile();
  if (statusData) {
    console.log(`${colors.blue}📋 Информация о сессии:${colors.reset}`);
    console.log(`   🕐 Время запуска:  ${colors.white}${new Date(statusData.timestamp).toLocaleString()}${colors.reset}`);
    console.log(`   🔧 Режим:         ${colors.white}${statusData.mode || 'unknown'}${colors.reset}`);
    console.log(`   📱 IP адрес:      ${colors.white}${statusData.network?.ip || ip}${colors.reset}`);
    console.log("");
  }
  
  // Рекомендации
  if (!frontendRunning || !apiRunning) {
    console.log(`${colors.yellow}💡 Рекомендации:${colors.reset}`);
    if (!frontendRunning) {
      console.log(`   • Запустите фронтенд: ${colors.cyan}npm start${colors.reset}`);
    }
    if (!apiRunning) {
      console.log(`   • Запустите API: ${colors.cyan}npm run mock-api${colors.reset}`);
    }
    console.log(`   • Или запустите все сразу: ${colors.cyan}npm start${colors.reset}`);
  } else {
    console.log(`${colors.green}🎉 Все сервисы работают!${colors.reset}`);
    console.log(`${colors.white}📱 Для мобильного доступа отсканируйте QR код: ${colors.cyan}npm run qr${colors.reset}`);
  }
  
  console.log("");
}

if (require.main === module) {
  main();
}

module.exports = { getLocalIP, checkPortStatus, checkHTTPStatus, loadStatusFile };