import { 
  validateQRCode, 
  generateQRReward, 
  isDuplicateCode,
  generateDemoCodes,
  getQRCodeTypeDescription,
  formatQRCodeForDisplay
} from '../../src/shared/lib/qr-utils';
import { QRCodeData } from '../../src/shared/types/qr';

describe('QR Utils', () => {
  describe('validateQRCode', () => {
    it('should validate correct FINAM codes', () => {
      const validCodes = [
        'FINAM:TRADER_2024',
        'FINAM:STARTUP_ZONE_A',
        'FINAM:EXPERT_MENTOR_2024',
        'FINAM:PARTNER_BUSINESS',
        'FINAM:EVENT_MAIN_STAGE',
        'FINAM:ZONE_NETWORKING'
      ];

      validCodes.forEach(code => {
        const result = validateQRCode(code);
        expect(result.isValid).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data?.code).toBe(code);
        expect(result.data?.type).toBeDefined();
      });
    });

    it('should reject invalid codes', () => {
      const invalidCodes = [
        '',
        '   ',
        'INVALID',
        'FINAM',
        'FINAM:',
        'FINAM:123',
        'FINAM:TRADER_',
        'finam:TRADER_2024',
        'FINAM:TRADER_2024!',
        'FINAM:TRADER_2024@',
        'FINAM:TRADER_2024#',
        'FINAM:TRADER_2024$',
        'FINAM:TRADER_2024%',
        'FINAM:TRADER_2024^',
        'FINAM:TRADER_2024&',
        'FINAM:TRADER_2024*',
        'FINAM:TRADER_2024(',
        'FINAM:TRADER_2024)',
        'FINAM:TRADER_2024+',
        'FINAM:TRADER_2024=',
        'FINAM:TRADER_2024[',
        'FINAM:TRADER_2024]',
        'FINAM:TRADER_2024{',
        'FINAM:TRADER_2024}',
        'FINAM:TRADER_2024|',
        'FINAM:TRADER_2024\\',
        'FINAM:TRADER_2024:',
        'FINAM:TRADER_2024;',
        'FINAM:TRADER_2024"',
        'FINAM:TRADER_2024\'',
        'FINAM:TRADER_2024<',
        'FINAM:TRADER_2024>',
        'FINAM:TRADER_2024,',
        'FINAM:TRADER_2024.',
        'FINAM:TRADER_2024?',
        'FINAM:TRADER_2024/',
        'FINAM:TRADER_2024 ',
        ' FINAM:TRADER_2024',
        'FINAM: TRADER_2024',
        'FINAM:TRADER_ 2024',
        'FINAM:TRADER_2024 ',
        'FINAM:TRADER_2024\n',
        'FINAM:TRADER_2024\t',
        'FINAM:TRADER_2024\r'
      ];

      invalidCodes.forEach(code => {
        const result = validateQRCode(code);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeDefined();
        expect(result.data).toBeUndefined();
      });
    });

    it('should handle edge cases', () => {
      // Very long code
      const longCode = 'FINAM:TRADER_' + 'A'.repeat(100);
      const longResult = validateQRCode(longCode);
      expect(longResult.isValid).toBe(false);
      expect(longResult.error).toBe('Код слишком длинный');

      // Very short code
      const shortResult = validateQRCode('FINAM:');
      expect(shortResult.isValid).toBe(false);
      expect(shortResult.error).toBe('Код слишком короткий');
    });
  });

  describe('generateQRReward', () => {
    const mockQRData: QRCodeData = {
      code: 'FINAM:TRADER_2024',
      type: 'trader',
      timestamp: '2024-01-01T00:00:00.000Z'
    };

    it('should generate correct rewards for different types', () => {
      const types = ['trader', 'startup', 'expert', 'partner', 'event', 'zone', 'networking', 'demo'] as const;
      
      types.forEach(type => {
        const data = { ...mockQRData, type };
        const reward = generateQRReward(data);
        
        expect(reward).toBeDefined();
        expect(reward.xp).toBeGreaterThan(0);
        expect(reward.message).toBeDefined();
        expect(typeof reward.message).toBe('string');
        expect(reward.message.length).toBeGreaterThan(0);
      });
    });

    it('should handle duplicate codes', () => {
      const reward = generateQRReward(mockQRData, true);
      
      expect(reward.xp).toBe(5);
      expect(reward.message).toContain('уже был отсканирован');
      expect(reward.isNewBadge).toBe(false);
    });

    it('should generate new badges for non-duplicate codes', () => {
      const reward = generateQRReward(mockQRData, false);
      
      expect(reward.xp).toBeGreaterThan(5);
      expect(reward.badge).toBeDefined();
      expect(reward.isNewBadge).toBe(true);
    });
  });

  describe('isDuplicateCode', () => {
    it('should detect duplicate codes', () => {
      const history = ['FINAM:TRADER_2024', 'FINAM:STARTUP_ZONE_A'];
      
      expect(isDuplicateCode('FINAM:TRADER_2024', history)).toBe(true);
      expect(isDuplicateCode('FINAM:STARTUP_ZONE_A', history)).toBe(true);
      expect(isDuplicateCode('FINAM:EXPERT_MENTOR_2024', history)).toBe(false);
    });

    it('should handle empty history', () => {
      expect(isDuplicateCode('FINAM:TRADER_2024', [])).toBe(false);
    });
  });

  describe('generateDemoCodes', () => {
    it('should generate valid demo codes', () => {
      const codes = generateDemoCodes();
      
      expect(codes).toBeDefined();
      expect(Array.isArray(codes)).toBe(true);
      expect(codes.length).toBeGreaterThan(0);
      
      codes.forEach(code => {
        const validation = validateQRCode(code);
        expect(validation.isValid).toBe(true);
      });
    });
  });

  describe('getQRCodeTypeDescription', () => {
    it('should return correct descriptions for all types', () => {
      const types = ['trader', 'startup', 'expert', 'partner', 'event', 'zone', 'networking', 'demo'] as const;
      
      types.forEach(type => {
        const description = getQRCodeTypeDescription(type);
        expect(description).toBeDefined();
        expect(typeof description).toBe('string');
        expect(description.length).toBeGreaterThan(0);
      });
    });
  });

  describe('formatQRCodeForDisplay', () => {
    it('should format short codes correctly', () => {
      const shortCode = 'FINAM:TRADER_2024';
      const formatted = formatQRCodeForDisplay(shortCode);
      expect(formatted).toBe(shortCode);
    });

    it('should format long codes correctly', () => {
      const longCode = 'FINAM:TRADER_2024_VERY_LONG_CODE_WITH_MANY_CHARACTERS';
      const formatted = formatQRCodeForDisplay(longCode);
      expect(formatted).toContain('...');
      expect(formatted.length).toBeLessThan(longCode.length);
    });
  });
});
