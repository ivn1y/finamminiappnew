import { RoleContent, Badge, EventData, ChatIntent } from '../types/app';

export const globalBadges: Badge[] = [
  { id: 'qr_scanner_badge', title: 'QR-Сканер', tooltip: 'QR-код отсканирован! (+50 XP)' },
  { id: 'explorer', title: 'Исследователь', tooltip: 'Первый шаг в Collab сделан' }
];

export const roleContent: RoleContent[] = [
  {
    id: 'trader',
    title: 'Трейдер',
    subtitle: 'Алхимик рынков',
    goals7d: [
      'Запустить стратегию на капитале',
      'Получить доступ к платформе автоследования',
      'Пройти быстрый скоринг стратегии'
    ],
    firstQuest: {
      title: 'Быстрый скоринг стратегии',
      desc: 'Ответь на 3 вопроса: опыт, рынки, риск-профиль. Откроем доступ к тестовой среде.',
      rewardBadge: 'Risk Manager'
    },
    badges: [
      { id: 'risk', title: 'Risk Manager', tooltip: 'Точно знаешь свой риск-профиль' },
      { id: 'algo', title: 'Algo-Creator', tooltip: 'Создаёшь стратегии на алгоритмах' },
      { id: 'explorer', title: 'Market Explorer', tooltip: 'Изучаешь новые рынки' }
    ],
    pushes: [
      'Проверим твою выдержку? Заполни риск-профиль →',
      'Сегодня твой день: протестируй стратегию в Collab →'
    ]
  },
  {
    id: 'startup',
    title: 'Стартап',
    subtitle: 'Изобретатель будущего',
    goals7d: [
      'Найти пилота с Финам',
      'Получить интро к экспертам/рынку',
      'Подать заявку в акселератор'
    ],
    firstQuest: {
      title: 'Питч в 3 слова',
      desc: 'Опиши продукт тремя словами и выбери стадию проекта.',
      rewardBadge: 'Pilot Starter'
    },
    badges: [
      { id: 'pilot', title: 'Pilot Starter', tooltip: 'Запустил первый пилот' },
      { id: 'growth', title: 'Growth Hacker', tooltip: 'Нашёл нестандартный путь к росту' },
      { id: 'deal', title: 'Deal Closer', tooltip: 'Закрыл сделку с партнёром' }
    ],
    pushes: [
      'Challenge: опиши проект тремя словами →',
      'Загрузи one-pager и получи шанс на пилот →'
    ]
  },
  {
    id: 'expert',
    title: 'Эксперт',
    subtitle: 'Мудрец-наставник',
    goals7d: [
      'Стать ментором/трекером',
      'Подключиться к проекту команды',
      'Войти во Внешний Совет Директоров'
    ],
    firstQuest: {
      title: 'Выбор роли',
      desc: 'Кем ты хочешь быть в Collab — ментором или трекером?',
      rewardBadge: 'Wise Owl'
    },
    badges: [
      { id: 'owl', title: 'Wise Owl', tooltip: 'Делишься опытом и видением' },
      { id: 'challenger', title: 'Idea Challenger', tooltip: 'Помогаешь проверять гипотезы' },
      { id: 'mentor', title: 'Mentor+', tooltip: 'Поддерживаешь команды на пути к рынку' }
    ],
    pushes: [
      'Миссия: оцени идею, которую мы пришлём завтра',
      'Выбери роль — ментор или трекер →'
    ]
  },
  {
    id: 'partner',
    title: 'Партнёр',
    subtitle: 'Строитель экосистемы',
    goals7d: [
      'Запустить white-label/франшизу',
      'Подключиться к витрине продуктов',
      'Получить интеграцию по API'
    ],
    firstQuest: {
      title: 'Выбери пакет',
      desc: 'Определи, что интереснее — франшиза, white-label или API. Получи чек-лист онбординга.',
      rewardBadge: 'Integrator'
    },
    badges: [
      { id: 'integrator', title: 'Integrator', tooltip: 'Соединяешь решения в экосистеме' },
      { id: 'builder', title: 'Builder', tooltip: 'Запустил новый продукт с Collab' },
      { id: 'visionary', title: 'Visionary', tooltip: 'Формируешь стратегию будущего' }
    ],
    pushes: [
      'Выбери пакет и получи чек-лист онбординга',
      'Присоединись к витрине продуктов Collab →'
    ]
  }
];

export const eventData: EventData = {
  eventMode: true,
  zones: [
    {
      id: 'finam-a',
      name: 'Стенд Финам A',
      coords: [55.7558, 37.6176],
      qr: 'FINAM_A_2024',
      prize: 'Ранний доступ к платформе'
    },
    {
      id: 'finam-b',
      name: 'Стенд Финам B',
      coords: [55.7559, 37.6177],
      qr: 'FINAM_B_2024',
      prize: 'Консультация эксперта'
    },
    {
      id: 'startup-zone',
      name: 'Зона стартапов',
      coords: [55.7560, 37.6178],
      qr: 'STARTUP_ZONE_2024',
      prize: 'Подарок от партнёров'
    }
  ],
  schedule: [
    {
      id: 'opening',
      title: 'Открытие конференции',
      time: '09:00',
      stage: 'Главная сцена',
      durationMin: 30
    },
    {
      id: 'trading-session',
      title: 'Трейдинг сессия',
      time: '10:00',
      stage: 'Зал A',
      durationMin: 60
    },
    {
      id: 'startup-pitch',
      title: 'Питч стартапов',
      time: '11:30',
      stage: 'Зал B',
      durationMin: 90
    },
    {
      id: 'networking',
      title: 'Нетворкинг',
      time: '13:00',
      stage: 'Фойе',
      durationMin: 60
    }
  ]
};

export const chatIntents: ChatIntent[] = [
  {
    id: 'what-is-collab',
    title: 'Что такое Collab?',
    response: 'Finam Collab — это пространство для трейдеров, стартапов и экспертов. Здесь можно запускать стратегии, пилоты и влиять на рынок.'
  },
  {
    id: 'trader-program',
    title: 'Программа для трейдеров',
    response: 'Для трейдеров доступны: капитал для стратегий, платформа автоследования, быстрый скоринг и тестовая среда.'
  },
  {
    id: 'startup-pilots',
    title: 'Стартап и пилоты',
    response: 'Стартапы могут получить пилоты с Финам, доступ к экспертам и рынку, а также подать заявку в акселератор.'
  },
  {
    id: 'experts-council',
    title: 'Эксперты и Совет',
    response: 'Эксперты могут стать менторами, трекерами или войти во Внешний Совет Директоров для влияния на проекты.'
  },
  {
    id: 'partnership',
    title: 'Партнёрство и франшиза',
    response: 'Партнёры могут запустить white-label, франшизу или API интеграцию, а также подключиться к витрине продуктов.'
  }
];
