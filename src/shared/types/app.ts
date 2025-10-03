export type UserRole = 'trader' | 'startup' | 'expert' | 'partner' | 'guest';

export interface GoalProgress {
  current: number;
  target: number;
  daysLeft: number;
  notes: GoalProgressNote[];
  milestones: GoalMilestone[];
}

export interface GoalProgressNote {
  id: number;
  text: string;
  date: string;
  progress: number;
  isEditable?: boolean;
}

export interface GoalMilestone {
  id: number;
  title: string;
  completed: boolean;
  date: string | null;
}

export interface User {
  id: string;
  createdAt: string;
  role: UserRole | null;
  profile: {
    trader?: {
      years?: number;
      markets?: string[];
      risk?: 'low' | 'medium' | 'high';
    };
    startup?: {
      stage?: 'idea' | 'MVP' | 'PMF' | 'Scale';
      pitch3?: string;
      site?: string;
    };
    expert?: {
      domain?: string;
      availabilityHrs?: number;
      mode?: 'mentor' | 'tracker';
    };
    partner?: {
      type?: 'university' | 'business' | 'media' | 'franchise';
      interest?: 'white-label' | 'franchise' | 'api';
    };
    guest?: {};
  };
  credentials?: {
    phone?: string;
    email?: string;
  };
  intent7d?: string;
  goalProgress?: GoalProgress;
  badges: string[];
  xp: number;
  progressSteps: number; // 0..5
  name?: string;
  scannedZones?: string[]; // ID отсканированных зон
  avatar?: {
    characterId?: string;
    frameId?: string;
    accessories?: string[];
  };
}

export interface Badge {
  id: string;
  title: string;
  tooltip: string;
  icon?: string;
  howToEarn: string;
}

export interface RoleContent {
  id: UserRole;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  goals7d: string[];
  firstQuest: {
    title: string;
    desc: string;
    rewardBadge: string;
  };
  badges: Badge[];
  pushes: string[];
}

export interface EventData {
  eventMode: boolean;
  zones: {
    id: string;
    name: string;
    coords: [number, number];
    qr?: string;
    prize?: string;
  }[];
  schedule: {
    id: string;
    title: string;
    time: string;
    stage: string;
    durationMin?: number;
  }[];
}

export interface QRRedemption {
  id: string;
  userId: string;
  zoneId: string;
  code: string;
  redeemedAt: string;
}

export interface AnalyticEvent {
  id: string;
  userId?: string;
  name: string;
  ts: string;
  props?: Record<string, any>;
}

export interface AppState {
  user: User | null;
  eventMode: boolean;
  currentTab: 'home' | 'map' | 'chat' | 'profile';
  isOnboardingComplete: boolean;
  showQRScanner: boolean;
}

export interface ChatIntent {
  id: string;
  title: string;
  response: string;
}

export interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  description?: string;
  format: 'Выступление' | 'Панель' | 'Круглый стол' | 'Кофе-брейк' | 'Обед' | 'After Party';
  speakers: string[];
  block?: string;
}

export interface ScheduleData {
  events: ScheduleEvent[];
}
