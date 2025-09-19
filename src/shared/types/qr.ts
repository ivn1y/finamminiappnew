export interface QRCodeData {
  code: string;
  type: QRCodeType;
  zone?: string;
  event?: string;
  timestamp: string;
}

export type QRCodeType = 
  | 'trader' 
  | 'startup' 
  | 'expert' 
  | 'partner' 
  | 'event' 
  | 'zone' 
  | 'networking' 
  | 'demo';

export interface QRValidationResult {
  isValid: boolean;
  error?: string;
  data?: QRCodeData;
}

export interface QRReward {
  badge?: string;
  xp: number;
  message: string;
  isNewBadge?: boolean;
}

export interface QRScanResult {
  success: boolean;
  code?: string;
  reward?: QRReward;
  error?: string;
  isDuplicate?: boolean;
}

export interface QRScannerConfig {
  enableCamera: boolean;
  enableManualInput: boolean;
  enableDemoMode: boolean;
  autoCloseOnSuccess: boolean;
  showRewards: boolean;
}

export interface QRCodePattern {
  prefix: string;
  type: QRCodeType;
  required: boolean;
  example: string;
}

export const QR_CODE_PATTERNS: QRCodePattern[] = [
  {
    prefix: 'FINAM:TRADER_',
    type: 'trader',
    required: true,
    example: 'FINAM:TRADER_2024'
  },
  {
    prefix: 'FINAM:STARTUP_',
    type: 'startup',
    required: true,
    example: 'FINAM:STARTUP_ZONE_A'
  },
  {
    prefix: 'FINAM:EXPERT_',
    type: 'expert',
    required: true,
    example: 'FINAM:EXPERT_MENTOR_2024'
  },
  {
    prefix: 'FINAM:PARTNER_',
    type: 'partner',
    required: true,
    example: 'FINAM:PARTNER_BUSINESS'
  },
  {
    prefix: 'FINAM:EVENT_',
    type: 'event',
    required: true,
    example: 'FINAM:EVENT_MAIN_STAGE'
  },
  {
    prefix: 'FINAM:ZONE_',
    type: 'zone',
    required: true,
    example: 'FINAM:ZONE_NETWORKING'
  }
];

export interface QRScannerState {
  isScanning: boolean;
  isCameraActive: boolean;
  lastScannedCode?: string;
  scanHistory: QRScanResult[];
  totalScanned: number;
  totalXP: number;
  badgesEarned: string[];
}
