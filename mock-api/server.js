const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Middleware для CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Middleware для логирования
server.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Кастомные роуты для API
server.post('/api/createUser', (req, res) => {
  const { name, role, profile, intent7d } = req.body;
  
  const newUser = {
    id: `user_${Date.now()}`,
    createdAt: new Date().toISOString(),
    role: role || null,
    profile: profile || {},
    intent7d: intent7d || '',
    badges: ['explorer'],
    xp: 100,
    progressSteps: 0,
    name: name || 'Новый пользователь',
    goalProgress: {
      current: 0,
      target: 100,
      daysLeft: 7,
      notes: [],
      milestones: []
    }
  };
  
  const db = router.db;
  db.get('users').push(newUser).write();
  
  res.json({
    success: true,
    data: { user: newUser },
    message: 'Пользователь успешно создан'
  });
});

server.put('/api/updateUser/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const db = router.db;
  const user = db.get('users').find({ id }).value();
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'Пользователь не найден'
    });
  }
  
  const updatedUser = { ...user, ...updates };
  db.get('users').find({ id }).assign(updatedUser).write();
  
  res.json({
    success: true,
    data: { user: updatedUser },
    message: 'Пользователь успешно обновлен'
  });
});

server.get('/api/getContent', (req, res) => {
  const db = router.db;
  const content = db.get('content').value();
  
  res.json({
    success: true,
    data: content
  });
});

server.post('/api/redeemQR', (req, res) => {
  const { qrCode, userId } = req.body;
  
  if (!qrCode || !userId) {
    return res.status(400).json({
      success: false,
      error: 'QR код и ID пользователя обязательны'
    });
  }
  
  const db = router.db;
  const qr = db.get('qrCodes').find({ code: qrCode, isActive: true }).value();
  
  if (!qr) {
    return res.status(404).json({
      success: false,
      error: 'QR код не найден или неактивен'
    });
  }
  
  // Проверяем срок действия
  if (new Date() > new Date(qr.expiresAt)) {
    return res.status(400).json({
      success: false,
      error: 'QR код истек'
    });
  }
  
  const user = db.get('users').find({ id: userId }).value();
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'Пользователь не найден'
    });
  }
  
  // Применяем награду
  let updatedUser = { ...user };
  
  if (qr.reward.type === 'badge') {
    if (!updatedUser.badges.includes(qr.reward.value)) {
      updatedUser.badges.push(qr.reward.value);
    }
  } else if (qr.reward.type === 'content') {
    // Логика для разблокировки контента
    if (!updatedUser.unlockedContent) {
      updatedUser.unlockedContent = [];
    }
    if (!updatedUser.unlockedContent.includes(qr.reward.value)) {
      updatedUser.unlockedContent.push(qr.reward.value);
    }
  }
  
  updatedUser.xp += qr.reward.xp;
  
  db.get('users').find({ id: userId }).assign(updatedUser).write();
  
  // Деактивируем QR код
  db.get('qrCodes').find({ id: qr.id }).assign({ isActive: false }).write();
  
  res.json({
    success: true,
    data: {
      user: updatedUser,
      reward: qr.reward
    },
    message: 'QR код успешно использован'
  });
});

server.post('/api/logEvent', (req, res) => {
  const { userId, eventType, data } = req.body;
  
  if (!userId || !eventType) {
    return res.status(400).json({
      success: false,
      error: 'ID пользователя и тип события обязательны'
    });
  }
  
  const event = {
    id: `event_${Date.now()}`,
    userId,
    eventType,
    data: data || {},
    createdAt: new Date().toISOString()
  };
  
  const db = router.db;
  db.get('events').push(event).write();
  
  res.json({
    success: true,
    data: event,
    message: 'Событие успешно записано'
  });
});

// Получить события пользователя
server.get('/api/events/:userId', (req, res) => {
  const { userId } = req.params;
  const db = router.db;
  const events = db.get('events').filter({ userId }).value();
  
  res.json({
    success: true,
    data: events
  });
});

server.use('/api', router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Mock API Server is running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});
