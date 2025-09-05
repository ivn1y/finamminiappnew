'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, AppState, UserRole } from '../types/app';
import { globalBadges, roleContent } from '../data/seed';

interface AppStore extends Omit<AppState, 'currentTab'> {
  // Actions
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  setEventMode: (mode: boolean) => void;
  completeOnboarding: () => void;
  addBadge: (badgeId: string) => void;
  incrementProgress: () => void;
  setQRScanner: (show: boolean) => void;
  
  // Getters
  getRoleContent: (role: UserRole) => any;
  getAllBadges: () => any[];
  getProgressPercentage: () => number;
}

const createInitialUser = (): User => ({
  id: `user_${Date.now()}`,
  createdAt: new Date().toISOString(),
  role: null,
  profile: {},
  badges: [],
  xp: 0,
  progressSteps: 0
});

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      eventMode: true,
      isOnboardingComplete: false,
      showQRScanner: false,

      // Actions
      setUser: (user) => set({ user }),
      
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
      
      setEventMode: (mode) => set({ eventMode: mode }),
      
      completeOnboarding: () => set({ isOnboardingComplete: true }),
      
      addBadge: (badgeId) => set((state) => {
        if (!state.user) return state;
        
        const user = { ...state.user };
        if (!user.badges.includes(badgeId)) {
          user.badges.push(badgeId);
          user.xp += 100; // XP за бейдж
        }
        
        return { user };
      }),
      
      incrementProgress: () => set((state) => {
        if (!state.user) return state;
        
        const user = { ...state.user };
        if (user.progressSteps < 5) {
          user.progressSteps += 1;
          user.xp += 50; // XP за шаг
        }
        
        return { user };
      }),
      
      setQRScanner: (show) => set({ showQRScanner: show }),

      // Getters
      getRoleContent: (role) => {
        return roleContent.find(r => r.id === role);
      },
      
      getAllBadges: () => {
        const { user } = get();
        if (!user || !user.role) return globalBadges;
        
        const roleContentData = get().getRoleContent(user.role);
        return [...globalBadges, ...(roleContentData?.badges || [])];
      },
      
      getProgressPercentage: () => {
        const { user } = get();
        return user ? (user.progressSteps / 5) * 100 : 0;
      }
    }),
    {
      name: 'finam-collab-storage',
      storage: typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : createJSONStorage(() => ({
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {}
      })),
      partialize: (state) => ({
        user: state.user,
        eventMode: state.eventMode,
        isOnboardingComplete: state.isOnboardingComplete
      })
    }
  )
);

// Helper для создания пользователя
export const createUser = createInitialUser;
