'use client';

import { useCallback } from 'react';
import { useAppStore } from '@/shared/store/app-store';
import { profileAPI, ProfileUpdateRequest, BadgeClaimRequest, AnalyticsEvent } from '@/shared/lib/profile-api';
import { User } from '@/shared/types/app';

export const useProfileAnalytics = () => {
  const { user, setUser } = useAppStore();

  const trackEvent = useCallback(async (event: string, props?: Record<string, any>) => {
    if (!user) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      userId: user.id,
      props,
      ts: new Date().toISOString(),
    };

    await profileAPI.trackEvent(analyticsEvent);
  }, [user]);

  const updateProfile = useCallback(async (updates: ProfileUpdateRequest) => {
    if (!user) return;

    try {
      // Track analytics event
      await trackEvent('profile_edit_started', { fields: Object.keys(updates) });

      // Update user via API
      const updatedUser = await profileAPI.updateUser(user.id, updates);
      
      // Update local state
      setUser(updatedUser);

      // Track success event
      await trackEvent('profile_saved', { fields: Object.keys(updates) });

      return updatedUser;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }, [user, setUser, trackEvent]);

  const updateAvatar = useCallback(async (avatarData: { frameId?: string; accessories?: string[] }) => {
    if (!user) return;

    try {
      // Track analytics event
      await trackEvent('avatar_customization_opened');

      const updates: ProfileUpdateRequest = {
        avatar: {
          characterId: user.avatar?.characterId || `${user.role}_v1`,
          frameId: avatarData.frameId,
          accessories: avatarData.accessories || []
        }
      };

      const updatedUser = await profileAPI.updateUser(user.id, updates);
      setUser(updatedUser);

      // Track success event
      await trackEvent('avatar_customization_applied', {
        frameId: avatarData.frameId,
        accessories: avatarData.accessories
      });

      return updatedUser;
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw error;
    }
  }, [user, setUser, trackEvent]);

  const claimBadge = useCallback(async (badgeId: string, source: BadgeClaimRequest['source']) => {
    if (!user) return;

    try {
      // Track analytics event
      await trackEvent('badge_claim_attempt', { badgeId, source });

      const request: BadgeClaimRequest = {
        badgeId,
        source
      };

      const response = await profileAPI.claimBadge(user.id, request);
      
      if (response.success && response.user) {
        setUser(response.user);
        
        // Track success event
        await trackEvent('badge_claim_success', { 
          badgeId, 
          earned: response.earned,
          xpAdded: response.xpAdded 
        });
      }

      return response;
    } catch (error) {
      console.error('Error claiming badge:', error);
      throw error;
    }
  }, [user, setUser, trackEvent]);

  const trackBadgeClick = useCallback(async (badgeId: string) => {
    await trackEvent('badge_clicked', { badgeId });
  }, [trackEvent]);

  const trackScreenView = useCallback(async (screen: string) => {
    await trackEvent('screen_view', { screen });
  }, [trackEvent]);

  const trackGoalSelection = useCallback(async (goal: string) => {
    await trackEvent('intent7d_selected', { goal });
  }, [trackEvent]);

  const trackShareProfile = useCallback(async () => {
    await trackEvent('share_profile_clicked');
  }, [trackEvent]);

  return {
    updateProfile,
    updateAvatar,
    claimBadge,
    trackBadgeClick,
    trackScreenView,
    trackGoalSelection,
    trackShareProfile,
    trackEvent
  };
};
