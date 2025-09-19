import { 
  QRCodeData, 
  QRValidationResult, 
  QRCodeType, 
  QRReward, 
  QR_CODE_PATTERNS 
} from '../types/qr';

/**
 * Валидация QR-кода по формату FINAM:
 */
export function validateQRCode(code: string): QRValidationResult {
  // Проверка на пустой код
  if (!code || code.trim().length === 0) {
    return {
      isValid: false,
      error: 'Код не может быть пустым'
    };
  }

  const trimmedCode = code.trim();

  // Проверка базового формата FINAM:
  if (!trimmedCode.startsWith('FINAM:')) {
    return {
      isValid: false,
      error: 'Код должен начинаться с "FINAM:"'
    };
  }

  // Проверка длины кода
  if (trimmedCode.length < 8) {
    return {
      isValid: false,
      error: 'Код слишком короткий'
    };
  }

  if (trimmedCode.length > 100) {
    return {
      isValid: false,
      error: 'Код слишком длинный'
    };
  }

  // Проверка на валидные символы (только буквы, цифры, подчеркивания, двоеточия)
  const validPattern = /^FINAM:[A-Z0-9_]+$/;
  if (!validPattern.test(trimmedCode)) {
    return {
      isValid: false,
      error: 'Код содержит недопустимые символы'
    };
  }

  // Определение типа кода
  const codeType = determineQRCodeType(trimmedCode);
  if (!codeType) {
    return {
      isValid: false,
      error: 'Неизвестный тип кода'
    };
  }

  // Создание данных кода
  const qrData: QRCodeData = {
    code: trimmedCode,
    type: codeType,
    timestamp: new Date().toISOString()
  };

  return {
    isValid: true,
    data: qrData
  };
}

/**
 * Определение типа QR-кода
 */
function determineQRCodeType(code: string): QRCodeType | null {
  for (const pattern of QR_CODE_PATTERNS) {
    if (code.startsWith(pattern.prefix)) {
      return pattern.type;
    }
  }
  return null;
}

/**
 * Генерация награды за сканирование QR-кода
 */
export function generateQRReward(qrData: QRCodeData, isDuplicate: boolean = false): QRReward {
  if (isDuplicate) {
    return {
      xp: 5,
      message: 'Код уже был отсканирован ранее (+5 XP)',
      isNewBadge: false
    };
  }

  const baseRewards: Record<QRCodeType, QRReward> = {
    trader: {
      xp: 50,
      badge: 'qr_trader',
      message: 'Отсканирован код трейдера! (+50 XP)',
      isNewBadge: true
    },
    startup: {
      xp: 75,
      badge: 'qr_startup',
      message: 'Отсканирован код стартапа! (+75 XP)',
      isNewBadge: true
    },
    expert: {
      xp: 100,
      badge: 'qr_expert',
      message: 'Отсканирован код эксперта! (+100 XP)',
      isNewBadge: true
    },
    partner: {
      xp: 125,
      badge: 'qr_partner',
      message: 'Отсканирован код партнера! (+125 XP)',
      isNewBadge: true
    },
    event: {
      xp: 60,
      badge: 'qr_event',
      message: 'Отсканирован код мероприятия! (+60 XP)',
      isNewBadge: true
    },
    zone: {
      xp: 40,
      badge: 'qr_zone',
      message: 'Отсканирован код зоны! (+40 XP)',
      isNewBadge: true
    },
    networking: {
      xp: 30,
      badge: 'qr_networking',
      message: 'Отсканирован код нетворкинга! (+30 XP)',
      isNewBadge: true
    },
    demo: {
      xp: 20,
      badge: 'qr_demo',
      message: 'Отсканирован демо-код! (+20 XP)',
      isNewBadge: true
    }
  };

  return baseRewards[qrData.type] || {
    xp: 25,
    message: 'Отсканирован QR-код! (+25 XP)',
    isNewBadge: false
  };
}

/**
 * Проверка, является ли код дубликатом
 */
export function isDuplicateCode(code: string, scanHistory: string[]): boolean {
  return scanHistory.includes(code);
}

/**
 * Генерация демо-кодов для тестирования
 */
export function generateDemoCodes(): string[] {
  return [
    'FINAM:TRADER_2024',
    'FINAM:STARTUP_ZONE_A',
    'FINAM:EXPERT_MENTOR_2024',
    'FINAM:PARTNER_BUSINESS',
    'FINAM:EVENT_MAIN_STAGE',
    'FINAM:ZONE_NETWORKING',
    'FINAM:DEMO_PITCH_2024'
  ];
}

/**
 * Получение описания типа кода
 */
export function getQRCodeTypeDescription(type: QRCodeType): string {
  const descriptions: Record<QRCodeType, string> = {
    trader: 'Код трейдера',
    startup: 'Код стартапа',
    expert: 'Код эксперта',
    partner: 'Код партнера',
    event: 'Код мероприятия',
    zone: 'Код зоны',
    networking: 'Код нетворкинга',
    demo: 'Демо-код'
  };

  return descriptions[type] || 'Неизвестный тип кода';
}

/**
 * Форматирование кода для отображения
 */
export function formatQRCodeForDisplay(code: string): string {
  if (code.length <= 20) return code;
  
  const prefix = code.substring(0, 10);
  const suffix = code.substring(code.length - 10);
  return `${prefix}...${suffix}`;
}
