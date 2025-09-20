// Avatar assets configuration
export interface CharacterAsset {
  id: string;
  name: string;
  description: string;
  image: string;
  image2x: string;
  fallbackIcon: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface FrameAsset {
  id: string;
  name: string;
  description: string;
  image: string;
  unlocked: boolean;
  unlockCondition?: string;
}

export interface AccessoryAsset {
  id: string;
  name: string;
  description: string;
  image: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  unlocked: boolean;
  unlockCondition?: string;
}

// Character assets based on the provided descriptions
export const characterAssets: Record<string, CharacterAsset> = {
  partner: {
    id: 'partner',
    name: 'Партнер',
    description: 'Мудрый стратег, собирающий пазл глобального сотрудничества',
    image: '/assets/avatars/characters/partner.svg',
    image2x: '/assets/avatars/characters/partner.svg',
    fallbackIcon: 'Building2',
    theme: {
      primary: '#8B4513', // Saddle Brown
      secondary: '#D2691E', // Chocolate
      accent: '#FF8C00' // Dark Orange
    }
  },
  startup: {
    id: 'startup',
    name: 'Стартапер',
    description: 'Инноватор с видением будущего, создающий ракеты идей',
    image: '/assets/avatars/characters/startup.svg',
    image2x: '/assets/avatars/characters/startup.svg',
    fallbackIcon: 'Lightbulb',
    theme: {
      primary: '#FF6B35', // Orange Red
      secondary: '#4A90E2', // Blue
      accent: '#00D4AA' // Teal
    }
  },
  trader: {
    id: 'trader',
    name: 'Трейдер',
    description: 'Алхимик финансовых рынков, создающий эликсиры прибыли',
    image: '/assets/avatars/characters/trader.svg',
    image2x: '/assets/avatars/characters/trader.svg',
    fallbackIcon: 'Target',
    theme: {
      primary: '#2C3E50', // Dark Blue Gray
      secondary: '#E74C3C', // Red
      accent: '#F39C12' // Orange
    }
  },
  expert: {
    id: 'expert',
    name: 'Эксперт',
    description: 'Мудрец знаний, хранитель древних формул и мудрости',
    image: '/assets/avatars/characters/expert.svg',
    image2x: '/assets/avatars/characters/expert.svg',
    fallbackIcon: 'Users',
    theme: {
      primary: '#8B4513', // Saddle Brown
      secondary: '#DAA520', // Goldenrod
      accent: '#FFD700' // Gold
    }
  }
};

// Frame assets
export const frameAssets: FrameAsset[] = [
  {
    id: 'frame_gold',
    name: 'Золотая рамка',
    description: 'Классическая золотая рамка',
    image: '/assets/avatars/frames/placeholder.svg', // Placeholder until real image is provided
    unlocked: true
  },
  {
    id: 'frame_silver',
    name: 'Серебряная рамка',
    description: 'Элегантная серебряная рамка',
    image: '/assets/avatars/frames/placeholder.svg', // Placeholder until real image is provided
    unlocked: true
  },
  {
    id: 'frame_diamond',
    name: 'Алмазная рамка',
    description: 'Открывается при получении бейджа "Алмазный трейдер"',
    image: '/assets/avatars/frames/placeholder.svg', // Placeholder until real image is provided
    unlocked: false,
    unlockCondition: 'badge:diamond_trader'
  },
  {
    id: 'frame_rainbow',
    name: 'Радужная рамка',
    description: 'Открывается при достижении 10 уровня',
    image: '/assets/avatars/frames/placeholder.svg', // Placeholder until real image is provided
    unlocked: false,
    unlockCondition: 'level:10'
  },
  {
    id: 'frame_crystal',
    name: 'Кристальная рамка',
    description: 'Открывается при получении бейджа "Кристальный эксперт"',
    image: '/assets/avatars/frames/placeholder.svg', // Placeholder until real image is provided
    unlocked: false,
    unlockCondition: 'badge:crystal_expert'
  },
  {
    id: 'frame_plasma',
    name: 'Плазменная рамка',
    description: 'Открывается при получении бейджа "Плазменный стартапер"',
    image: '/assets/avatars/frames/placeholder.svg', // Placeholder until real image is provided
    unlocked: false,
    unlockCondition: 'badge:plasma_startup'
  }
];

// Accessory assets
export const accessoryAssets: AccessoryAsset[] = [
  {
    id: 'amulet_1',
    name: 'Амулет удачи',
    description: 'Приносит удачу в трейдинге',
    image: '/assets/avatars/accessories/placeholder.svg', // Placeholder until real image is provided
    position: 'center',
    unlocked: true
  },
  {
    id: 'hat_1',
    name: 'Шляпа мудрости',
    description: 'Увеличивает мудрость',
    image: '/assets/avatars/accessories/placeholder.svg', // Placeholder until real image is provided
    position: 'top',
    unlocked: true
  },
  {
    id: 'crown_1',
    name: 'Корона лидера',
    description: 'Открывается при получении бейджа "Лидер"',
    image: '/assets/avatars/accessories/placeholder.svg', // Placeholder until real image is provided
    position: 'top',
    unlocked: false,
    unlockCondition: 'badge:leader'
  },
  {
    id: 'glasses_1',
    name: 'Очки аналитика',
    description: 'Открывается при получении бейджа "Аналитик"',
    image: '/assets/avatars/accessories/placeholder.svg', // Placeholder until real image is provided
    position: 'center',
    unlocked: false,
    unlockCondition: 'badge:analyst'
  },
  {
    id: 'medal_1',
    name: 'Медаль достижений',
    description: 'Открывается при получении 5 бейджей',
    image: '/assets/avatars/accessories/placeholder.svg', // Placeholder until real image is provided
    position: 'center',
    unlocked: false,
    unlockCondition: 'badges:5'
  },
  {
    id: 'cape_1',
    name: 'Плащ героя',
    description: 'Открывается при получении бейджа "Герой"',
    image: '/assets/avatars/accessories/placeholder.svg', // Placeholder until real image is provided
    position: 'center',
    unlocked: false,
    unlockCondition: 'badge:hero'
  }
];

// Helper functions
export const getCharacterAsset = (role: string): CharacterAsset => {
  return characterAssets[role] || characterAssets.trader;
};

export const getFrameAsset = (frameId: string): FrameAsset | undefined => {
  return frameAssets.find(frame => frame.id === frameId);
};

export const getAccessoryAsset = (accessoryId: string): AccessoryAsset | undefined => {
  return accessoryAssets.find(accessory => accessory.id === accessoryId);
};

export const getUnlockedFrames = (userBadges: string[], userLevel: number): FrameAsset[] => {
  return frameAssets.filter(frame => {
    if (frame.unlocked) return true;
    if (!frame.unlockCondition) return false;
    
    const [type, value] = frame.unlockCondition.split(':');
    
    switch (type) {
      case 'badge':
        return userBadges.includes(value);
      case 'level':
        return userLevel >= parseInt(value);
      case 'badges':
        return userBadges.length >= parseInt(value);
      default:
        return false;
    }
  });
};

export const getUnlockedAccessories = (userBadges: string[], userLevel: number): AccessoryAsset[] => {
  return accessoryAssets.filter(accessory => {
    if (accessory.unlocked) return true;
    if (!accessory.unlockCondition) return false;
    
    const [type, value] = accessory.unlockCondition.split(':');
    
    switch (type) {
      case 'badge':
        return userBadges.includes(value);
      case 'level':
        return userLevel >= parseInt(value);
      case 'badges':
        return userBadges.length >= parseInt(value);
      default:
        return false;
    }
  });
};
