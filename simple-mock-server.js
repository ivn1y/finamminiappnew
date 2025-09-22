const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Загружаем данные из JSON файла
let db = {};
try {
  const dbPath = path.join(__dirname, 'mock-api', 'db.json');
  const dbContent = fs.readFileSync(dbPath, 'utf8');
  db = JSON.parse(dbContent);
} catch (error) {
  console.error('Error loading database:', error);
  process.exit(1);
}

// Функция для отправки JSON ответа
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
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

// CORS middleware
function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
}

// Создаем сервер
const server = http.createServer((req, res) => {
  setCORSHeaders(res);
  
  // Обработка preflight запросов
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  
  console.log(`${new Date().toISOString()} - ${method} ${pathname}`);
  
  // Маршруты API
  if (pathname === '/api/users' && method === 'GET') {
    sendJSON(res, 200, db.users || []);
  }
  else if (pathname.startsWith('/api/users/') && method === 'GET') {
    const userId = pathname.split('/')[3];
    const user = db.users?.find(u => u.id === userId);
    if (user) {
      sendJSON(res, 200, user);
    } else {
      sendJSON(res, 404, { error: 'User not found' });
    }
  }
  else if (pathname === '/api/createUser' && method === 'POST') {
    parseBody(req, (err, body) => {
      if (err) {
        sendJSON(res, 400, { error: 'Invalid JSON' });
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
    });
  }
  else if (pathname.startsWith('/api/updateUser/') && method === 'PUT') {
    const userId = pathname.split('/')[3];
    parseBody(req, (err, body) => {
      if (err) {
        sendJSON(res, 400, { error: 'Invalid JSON' });
        return;
      }
      
      const userIndex = db.users?.findIndex(u => u.id === userId);
      if (userIndex === -1 || userIndex === undefined) {
        sendJSON(res, 404, { success: false, error: 'Пользователь не найден' });
        return;
      }
      
      const updatedUser = { ...db.users[userIndex], ...body };
      db.users[userIndex] = updatedUser;
      
      sendJSON(res, 200, {
        success: true,
        data: { user: updatedUser },
        message: 'Пользователь успешно обновлен'
      });
    });
  }
  else if (pathname === '/api/getContent' && method === 'GET') {
    sendJSON(res, 200, {
      success: true,
      data: db.content || []
    });
  }
  else if (pathname === '/api/redeemQR' && method === 'POST') {
    parseBody(req, (err, body) => {
      if (err) {
        sendJSON(res, 400, { error: 'Invalid JSON' });
        return;
      }
      
      const { qrCode, userId } = body;
      
      if (!qrCode || !userId) {
        sendJSON(res, 400, {
          success: false,
          error: 'QR код и ID пользователя обязательны'
        });
        return;
      }
      
      const qr = db.qrCodes?.find(q => q.code === qrCode && q.isActive);
      if (!qr) {
        sendJSON(res, 404, {
          success: false,
          error: 'QR код не найден или неактивен'
        });
        return;
      }
      
      // Проверяем срок действия
      if (new Date() > new Date(qr.expiresAt)) {
        sendJSON(res, 400, {
          success: false,
          error: 'QR код истек'
        });
        return;
      }
      
      const userIndex = db.users?.findIndex(u => u.id === userId);
      if (userIndex === -1 || userIndex === undefined) {
        sendJSON(res, 404, {
          success: false,
          error: 'Пользователь не найден'
        });
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
    });
  }
  else if (pathname === '/api/logEvent' && method === 'POST') {
    parseBody(req, (err, body) => {
      if (err) {
        sendJSON(res, 400, { error: 'Invalid JSON' });
        return;
      }
      
      const { userId, eventType, data } = body;
      
      if (!userId || !eventType) {
        sendJSON(res, 400, {
          success: false,
          error: 'ID пользователя и тип события обязательны'
        });
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
    });
  }
  else if (pathname.startsWith('/api/events/') && method === 'GET') {
    const userId = pathname.split('/')[3];
    const events = db.events?.filter(e => e.userId === userId) || [];
    sendJSON(res, 200, {
      success: true,
      data: events
    });
  }
  else {
    sendJSON(res, 404, { error: 'Not found' });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Mock API Server is running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
  console.log('Available endpoints:');
  console.log('  GET    /api/users');
  console.log('  GET    /api/users/:id');
  console.log('  POST   /api/createUser');
  console.log('  PUT    /api/updateUser/:id');
  console.log('  GET    /api/getContent');
  console.log('  POST   /api/redeemQR');
  console.log('  POST   /api/logEvent');
  console.log('  GET    /api/events/:userId');
});
