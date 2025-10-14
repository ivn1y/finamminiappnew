const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

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
};

// Загружаем данные из JSON файла
let db = {};
try {
  const dbPath = path.join(__dirname, 'mock-api', 'db.json');
  const dbContent = fs.readFileSync(dbPath, 'utf8');
  db = JSON.parse(dbContent);
  console.log(`${colors.green}✅ База данных загружена${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}❌ Ошибка загрузки базы данных:${colors.reset}`, error.message);
  process.exit(1);
}

// Функция для отправки JSON ответа
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data, null, 2));
}

// Функция для парсинга тела запроса
function parseBody(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const parsed = JSON.parse(body);
      callback(null, parsed);
    } catch (error) {
      callback(error, null);
    }
  });
}

// Функция для логирования запросов
function logRequest(method, pathname, statusCode) {
  const timestamp = new Date().toISOString();
  const statusColor = statusCode >= 400 ? colors.red : colors.green;
  console.log(`${colors.cyan}[${timestamp}]${colors.reset} ${colors.yellow}${method}${colors.reset} ${pathname} ${statusColor}${statusCode}${colors.reset}`);
}

// Создаем сервер
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  
  // Обработка preflight запросов
  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    logRequest(method, pathname, 200);
    return;
  }
  
  // Маршруты API
  if (pathname === '/api/users' && method === 'GET') {
    sendJSON(res, 200, db.users || []);
    logRequest(method, pathname, 200);
  }
  else if (pathname.startsWith('/api/users/') && method === 'GET') {
    const userId = pathname.split('/')[3];
    const user = db.users?.find(u => u.id === userId);
    if (user) {
      sendJSON(res, 200, user);
      logRequest(method, pathname, 200);
    } else {
      sendJSON(res, 404, { error: 'User not found' });
      logRequest(method, pathname, 404);
    }
  }
  else if (pathname === '/api/createUser' && method === 'POST') {
    parseBody(req, (err, body) => {
      if (err) {
        sendJSON(res, 400, { error: 'Invalid JSON' });
        logRequest(method, pathname, 400);
        return;
      }
      
      const newUser = {
        id: `user_${Date.now()}`,
        createdAt: new Date().toISOString(),
        role: body.role || null,
        profile: body.profile || {},
        intent7d: body.intent7d || '',
        badges: ['explorer'],
        xp: 100,
        progressSteps: 0,
        name: body.name || 'Новый пользователь',
        goalProgress: {
          current: 0,
          target: 100,
          daysLeft: 7,
          notes: [],
          milestones: []
        }
      };
      
      if (!db.users) db.users = [];
      db.users.push(newUser);
      
      sendJSON(res, 200, {
        success: true,
        data: { user: newUser },
        message: 'Пользователь успешно создан'
      });
      logRequest(method, pathname, 200);
    });
  }
  else if (pathname.startsWith('/api/updateUser/') && method === 'PUT') {
    const userId = pathname.split('/')[3];
    parseBody(req, (err, body) => {
      if (err) {
        sendJSON(res, 400, { error: 'Invalid JSON' });
        logRequest(method, pathname, 400);
        return;
      }
      
      const userIndex = db.users?.findIndex(u => u.id === userId);
      if (userIndex === -1 || userIndex === undefined) {
        sendJSON(res, 404, { success: false, error: 'Пользователь не найден' });
        logRequest(method, pathname, 404);
        return;
      }
      
      const updatedUser = { ...db.users[userIndex], ...body };
      db.users[userIndex] = updatedUser;
      
      sendJSON(res, 200, {
        success: true,
        data: { user: updatedUser },
        message: 'Пользователь успешно обновлен'
      });
      logRequest(method, pathname, 200);
    });
  }
  else if (pathname === '/api/getContent' && method === 'GET') {
    sendJSON(res, 200, {
      success: true,
      data: db.content || []
    });
    logRequest(method, pathname, 200);
  }
  else if (pathname === '/api/redeemQR' && method === 'POST') {
    parseBody(req, (err, body) => {
      if (err) {
        sendJSON(res, 400, { error: 'Invalid JSON' });
        logRequest(method, pathname, 400);
        return;
      }
      
      const { qrCode, userId } = body;
      
      if (!qrCode || !userId) {
        sendJSON(res, 400, {
          success: false,
          error: 'QR код и ID пользователя обязательны'
        });
        logRequest(method, pathname, 400);
        return;
      }
      
      const qr = db.qrCodes?.find(q => q.code === qrCode && q.isActive);
      if (!qr) {
        sendJSON(res, 404, {
          success: false,
          error: 'QR код не найден или неактивен'
        });
        logRequest(method, pathname, 404);
        return;
      }
      
      // Проверяем срок действия
      if (new Date() > new Date(qr.expiresAt)) {
        sendJSON(res, 400, {
          success: false,
          error: 'QR код истек'
        });
        logRequest(method, pathname, 400);
        return;
      }
      
      const userIndex = db.users?.findIndex(u => u.id === userId);
      if (userIndex === -1 || userIndex === undefined) {
        sendJSON(res, 404, {
          success: false,
          error: 'Пользователь не найден'
        });
        logRequest(method, pathname, 404);
        return;
      }
      
      // Применяем награду
      let updatedUser = { ...db.users[userIndex] };
      
      if (qr.reward.type === 'badge') {
        if (!updatedUser.badges.includes(qr.reward.value)) {
          updatedUser.badges.push(qr.reward.value);
        }
      } else if (qr.reward.type === 'content') {
        if (!updatedUser.unlockedContent) {
          updatedUser.unlockedContent = [];
        }
        if (!updatedUser.unlockedContent.includes(qr.reward.value)) {
          updatedUser.unlockedContent.push(qr.reward.value);
        }
      }
      
      updatedUser.xp += qr.reward.xp;
      db.users[userIndex] = updatedUser;
      
      // Деактивируем QR код
      const qrIndex = db.qrCodes.findIndex(q => q.id === qr.id);
      if (qrIndex !== -1) {
        db.qrCodes[qrIndex].isActive = false;
      }
      
      sendJSON(res, 200, {
        success: true,
        data: {
          user: updatedUser,
          reward: qr.reward
        },
        message: 'QR код успешно использован'
      });
      logRequest(method, pathname, 200);
    });
  }
  else if (pathname === '/api/logEvent' && method === 'POST') {
    parseBody(req, (err, body) => {
      if (err) {
        sendJSON(res, 400, { error: 'Invalid JSON' });
        logRequest(method, pathname, 400);
        return;
      }
      
      const { userId, eventType, data } = body;
      
      if (!userId || !eventType) {
        sendJSON(res, 400, {
          success: false,
          error: 'ID пользователя и тип события обязательны'
        });
        logRequest(method, pathname, 400);
        return;
      }
      
      const event = {
        id: `event_${Date.now()}`,
        userId,
        eventType,
        data: data || {},
        createdAt: new Date().toISOString()
      };
      
      if (!db.events) db.events = [];
      db.events.push(event);
      
      sendJSON(res, 200, {
        success: true,
        data: event,
        message: 'Событие успешно записано'
      });
      logRequest(method, pathname, 200);
    });
  }
  else if (pathname.startsWith('/api/events/') && method === 'GET') {
    const userId = pathname.split('/')[3];
    const events = db.events?.filter(e => e.userId === userId) || [];
    sendJSON(res, 200, {
      success: true,
      data: events
    });
    logRequest(method, pathname, 200);
  }
  else if (pathname === '/api/health' && method === 'GET') {
    sendJSON(res, 200, {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
    logRequest(method, pathname, 200);
  }
  else {
    sendJSON(res, 404, { error: 'Not found' });
    logRequest(method, pathname, 404);
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`${colors.green}🚀 Mock API Server запущен на порту ${PORT}${colors.reset}`);
  console.log(`${colors.blue}📡 API доступен по адресу: http://localhost:${PORT}/api${colors.reset}`);
  console.log(`${colors.yellow}🔍 Доступные эндпоинты:${colors.reset}`);
  console.log(`  ${colors.cyan}GET${colors.reset}    /api/users`);
  console.log(`  ${colors.cyan}GET${colors.reset}    /api/users/:id`);
  console.log(`  ${colors.magenta}POST${colors.reset}   /api/createUser`);
  console.log(`  ${colors.yellow}PUT${colors.reset}    /api/updateUser/:id`);
  console.log(`  ${colors.cyan}GET${colors.reset}    /api/getContent`);
  console.log(`  ${colors.magenta}POST${colors.reset}   /api/redeemQR`);
  console.log(`  ${colors.magenta}POST${colors.reset}   /api/logEvent`);
  console.log(`  ${colors.cyan}GET${colors.reset}    /api/events/:userId`);
  console.log(`  ${colors.cyan}GET${colors.reset}    /api/health`);
  console.log('');
});

// Обработка ошибок
server.on('error', (err) => {
  console.error(`${colors.red}❌ Ошибка сервера:${colors.reset}`, err);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log(`${colors.yellow}🛑 Останавливаем Mock API сервер...${colors.reset}`);
  server.close(() => {
    console.log(`${colors.green}✅ Mock API сервер остановлен${colors.reset}`);
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log(`${colors.yellow}🛑 Останавливаем Mock API сервер...${colors.reset}`);
  server.close(() => {
    console.log(`${colors.green}✅ Mock API сервер остановлен${colors.reset}`);
    process.exit(0);
  });
});
