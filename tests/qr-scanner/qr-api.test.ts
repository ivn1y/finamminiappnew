import { qrApiService } from '../../src/shared/lib/qr-api';

// Mock navigator.mediaDevices
const mockGetUserMedia = jest.fn();
Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: mockGetUserMedia,
  },
  writable: true,
});

describe('QR API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUserMedia.mockClear();
  });

  describe('scanQRCode', () => {
    it('should successfully scan a valid QR code', async () => {
      const request = {
        code: 'FINAM:TRADER_2024',
        userId: 'test-user'
      };

      const response = await qrApiService.scanQRCode(request);

      expect(response.success).toBe(true);
      expect(response.result).toBeDefined();
      expect(response.result?.success).toBe(true);
      expect(response.result?.code).toBe(request.code);
      expect(response.result?.reward).toBeDefined();
      expect(response.result?.reward?.xp).toBeGreaterThan(0);
    });

    it('should reject invalid QR codes', async () => {
      const request = {
        code: 'INVALID_CODE',
        userId: 'test-user'
      };

      const response = await qrApiService.scanQRCode(request);

      expect(response.success).toBe(false);
      expect(response.error).toBeDefined();
      expect(response.result?.success).toBe(false);
    });

    it('should handle duplicate codes', async () => {
      const request = {
        code: 'FINAM:TRADER_2024',
        userId: 'test-user'
      };

      // First scan
      const firstResponse = await qrApiService.scanQRCode(request);
      expect(firstResponse.success).toBe(true);

      // Second scan (duplicate)
      const secondResponse = await qrApiService.scanQRCode(request);
      expect(secondResponse.success).toBe(true);
      expect(secondResponse.result?.isDuplicate).toBe(true);
      expect(secondResponse.result?.reward?.xp).toBe(5);
    });
  });

  describe('getScanHistory', () => {
    it('should return empty history for new user', async () => {
      const response = await qrApiService.getScanHistory('new-user');

      expect(response.success).toBe(true);
      expect(response.history).toBeDefined();
      expect(response.history?.length).toBe(0);
    });

    it('should return scan history for user with scans', async () => {
      const userId = 'test-user';
      
      // Add some scans
      await qrApiService.scanQRCode({ code: 'FINAM:TRADER_2024', userId });
      await qrApiService.scanQRCode({ code: 'FINAM:STARTUP_ZONE_A', userId });

      const response = await qrApiService.getScanHistory(userId);

      expect(response.success).toBe(true);
      expect(response.history).toBeDefined();
      expect(response.history?.length).toBe(2);
    });
  });

  describe('clearScanHistory', () => {
    it('should clear scan history for user', async () => {
      const userId = 'test-user';
      
      // Add some scans
      await qrApiService.scanQRCode({ code: 'FINAM:TRADER_2024', userId });
      
      // Verify history exists
      let historyResponse = await qrApiService.getScanHistory(userId);
      expect(historyResponse.history?.length).toBe(1);

      // Clear history
      const clearResponse = await qrApiService.clearScanHistory(userId);
      expect(clearResponse.success).toBe(true);

      // Verify history is cleared
      historyResponse = await qrApiService.getScanHistory(userId);
      expect(historyResponse.history?.length).toBe(0);
    });
  });

  describe('getScanStats', () => {
    it('should return correct stats for user', async () => {
      const userId = 'test-user';
      
      // Add some scans
      await qrApiService.scanQRCode({ code: 'FINAM:TRADER_2024', userId });
      await qrApiService.scanQRCode({ code: 'FINAM:STARTUP_ZONE_A', userId });

      const response = await qrApiService.getScanStats(userId);

      expect(response.success).toBe(true);
      expect(response.stats).toBeDefined();
      expect(response.stats?.totalScanned).toBe(2);
      expect(response.stats?.totalXP).toBeGreaterThan(0);
      expect(response.stats?.badgesEarned).toBeDefined();
      expect(Array.isArray(response.stats?.badgesEarned)).toBe(true);
    });
  });

  describe('checkCameraAvailability', () => {
    it('should return available when camera is accessible', async () => {
      mockGetUserMedia.mockResolvedValueOnce({
        getTracks: () => [{ stop: jest.fn() }]
      });

      const response = await qrApiService.checkCameraAvailability();

      expect(response.success).toBe(true);
      expect(response.available).toBe(true);
      expect(response.error).toBeUndefined();
    });

    it('should return unavailable when camera is not accessible', async () => {
      mockGetUserMedia.mockRejectedValueOnce(new Error('Camera not available'));

      const response = await qrApiService.checkCameraAvailability();

      expect(response.success).toBe(true);
      expect(response.available).toBe(false);
      expect(response.error).toBeDefined();
    });

    it('should return unavailable when getUserMedia is not supported', async () => {
      // Mock navigator.mediaDevices as undefined
      const originalMediaDevices = navigator.mediaDevices;
      Object.defineProperty(navigator, 'mediaDevices', {
        value: undefined,
        writable: true,
      });

      const response = await qrApiService.checkCameraAvailability();

      expect(response.success).toBe(true);
      expect(response.available).toBe(false);
      expect(response.error).toBeDefined();

      // Restore original value
      Object.defineProperty(navigator, 'mediaDevices', {
        value: originalMediaDevices,
        writable: true,
      });
    });
  });

  describe('generateTestCodes', () => {
    it('should generate valid test codes', async () => {
      const response = await qrApiService.generateTestCodes();

      expect(response.success).toBe(true);
      expect(response.codes).toBeDefined();
      expect(Array.isArray(response.codes)).toBe(true);
      expect(response.codes?.length).toBeGreaterThan(0);
      
      response.codes?.forEach(code => {
        expect(code).toMatch(/^FINAM:/);
      });
    });
  });
});
