import { User } from '@/shared/types/app';

export interface ProfileUpdateRequest {
  displayName?: string;
  contact?: {
    telegram?: string;
    email?: string;
  };
  intent7d?: string;
  avatar?: {
    characterId?: string;
    frameId?: string;
    accessories?: string[];
  };
}

export interface BadgeClaimRequest {
  badgeId: string;
  source: 'quest' | 'profile' | 'qr_scan' | 'xp_level';
}

export interface BadgeClaimResponse {
  success: boolean;
  earned: boolean;
  xpAdded?: number;
  user?: User;
}

export interface AnalyticsEvent {
  event: string;
  userId: string;
  props?: Record<string, any>;
  ts: string;
}

class ProfileAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  async getUser(userId: string): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async updateUser(userId: string, updates: ProfileUpdateRequest): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('Изменения не применены. Попробуйте снова.');
        }
        throw new Error(`Failed to update user: ${response.statusText}`);
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async claimBadge(userId: string, request: BadgeClaimRequest): Promise<BadgeClaimResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/badges/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Failed to claim badge: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error claiming badge:', error);
      throw error;
    }
  }

  async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Error tracking event:', error);
      // Don't throw error for analytics - it's not critical
    }
  }

  // Offline queue for when network is unavailable
  private offlineQueue: Array<() => Promise<User>> = [];

  async updateUserOffline(userId: string, updates: ProfileUpdateRequest): Promise<User> {
    const updateFn = () => this.updateUser(userId, updates);
    
    try {
      return await updateFn();
    } catch (error) {
      // If offline, add to queue
      if (error instanceof TypeError && error.message.includes('fetch')) {
        this.offlineQueue.push(updateFn);
        console.log('Added update to offline queue');
        // Return current user data as fallback
        return this.getUser(userId);
      } else {
        throw error;
      }
    }
  }

  async syncOfflineQueue(): Promise<void> {
    if (this.offlineQueue.length === 0) return;

    console.log(`Syncing ${this.offlineQueue.length} offline updates...`);
    
    const queue = [...this.offlineQueue];
    this.offlineQueue = [];

    for (const updateFn of queue) {
      try {
        await updateFn();
      } catch (error) {
        console.error('Failed to sync offline update:', error);
        // Re-add to queue if still failing
        this.offlineQueue.push(updateFn);
      }
    }
  }

  getOfflineQueueLength(): number {
    return this.offlineQueue.length;
  }
}

export const profileAPI = new ProfileAPI();
