'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, AppState, UserRole } from '../types/app';
import { globalBadges, roleContent } from '../data/seed';
import { logRoleSelected, logProfileSubmitted, logBadgeEarned, logQRScanned } from '../lib/analytics-service';

interface AppStore extends Omit<AppState, 'currentTab'> {
  telegramQuestCompleted: boolean;
  showAppTour: boolean;
  showProfileTour: boolean;
  showMapTour: boolean;
  showScheduleTour: boolean;
  showAssistantTour: boolean;
  isUserDataInputModalOpen: boolean;
  isProductModalOpen: boolean;
  isScheduleModalOpen: boolean;
  selectedScheduleEvent: any;
  // Actions
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  setEventMode: (mode: boolean) => void;
  completeOnboarding: () => void;
  completeTelegramQuest: () => void;
  startAppTour: () => void;
  endAppTour: () => void;
  startProfileTour: () => void;
  endProfileTour: () => void;
  startMapTour: () => void;
  endMapTour: () => void;
  startScheduleTour: () => void;
  endScheduleTour: () => void;
  startAssistantTour: () => void;
  endAssistantTour: () => void;
  completeHomeTourAndGoToProfile: () => void;
  completeMapTourAndGoToSchedule: () => void;
  completeScheduleTourAndGoToAssistant: () => void;
  openUserDataInputModal: () => void;
  closeUserDataInputModal: () => void;
  openProductModal: () => void;
  closeProductModal: () => void;
  openScheduleModal: (event: any) => void;
  closeScheduleModal: () => void;
  addBadge: (badgeId: string) => void;
  incrementProgress: () => void;
  setQRScanner: (show: boolean) => void;
  hideQRScanner: () => void;
  addScannedZone: (zoneId: string) => void;
  
  // Getters
  getRoleContent: (role: UserRole) => any;
  getAllBadges: () => any[];
  getProgressPercentage: () => number;
}

const createInitialUser = (): User => ({
  id: `user_${Date.now()}`,
  createdAt: new Date().toISOString(),
  role: 'trader',
  profile: {},
  credentials: {
    phone: '',
    email: ''
  },
  badges: ['explorer'], // Убираем qr_scanner_badge - он должен зарабатываться
  xp: 100, // Начальный XP
  progressSteps: 1, // Начальный прогресс
  scannedZones: [], // Убираем предзаполненные зоны
  intent7d: 'Изучить возможности платформы',
  goalProgress: {
    current: 10,
    target: 100,
    daysLeft: 7,
    notes: [
      {
        id: 1,
        text: 'прогресс',
        date: new Date().toISOString(),
        progress: 10
      }
    ],
    milestones: [
      {
        id: 1,
        title: 'Начало работы',
        completed: true,
        date: '2024-01-01'
      },
      {
        id: 2,
        title: 'Первый результат',
        completed: false,
        date: null
      },
      {
        id: 3,
        title: 'Промежуточная проверка',
        completed: false,
        date: null
      },
      {
        id: 4,
        title: 'Завершение цели',
        completed: false,
        date: null
      }
    ]
  }
});

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: createInitialUser(),
      eventMode: true,
      isOnboardingComplete: false, // Новые пользователи должны проходить онбординг
      showQRScanner: false,
      telegramQuestCompleted: false,
      showAppTour: false,
      showProfileTour: false,
      showMapTour: false,
      showScheduleTour: false,
      showAssistantTour: false,
      isUserDataInputModalOpen: false,
      isProductModalOpen: false,
      isScheduleModalOpen: false,
      selectedScheduleEvent: null,

      // Actions
      setUser: (user) => {
        set({ user });
        // Логируем создание/обновление пользователя
        if (user.role) {
          logRoleSelected(user.role, user.id);
        }
      },
      
      updateUser: (updates) => set((state) => {
        if (!state.user) return state;
        
        const updatedUser = { ...state.user, ...updates };
        
        // Логируем обновление профиля
        if (updates.profile) {
          const profileFields = Object.keys(updates.profile);
          logProfileSubmitted(updatedUser.role || 'unknown', profileFields, updatedUser.id);
        }
        
        return { user: updatedUser };
      }),
      
      setEventMode: (mode) => set({ eventMode: mode }),
      
      completeOnboarding: () => set({ isOnboardingComplete: true }),

      completeTelegramQuest: () => set({ telegramQuestCompleted: true }),

      startAppTour: () => set({ showAppTour: true }),
      endAppTour: () => set({ showAppTour: false }),
      startProfileTour: () => set({ showProfileTour: true }),
      endProfileTour: () => set({ showProfileTour: false }),
      startMapTour: () => set({ showMapTour: true }),
      endMapTour: () => set({ showMapTour: false }),
      startScheduleTour: () => set({ showScheduleTour: true }),
      endScheduleTour: () => set({ showScheduleTour: false }),
      startAssistantTour: () => set({ showAssistantTour: true }),
      endAssistantTour: () => set({ showAssistantTour: false }),
      completeHomeTourAndGoToProfile: () => {
        set({ showAppTour: false, showProfileTour: true });
        // Навигация будет обработана в компоненте
      },
      completeMapTourAndGoToSchedule: () => set({ showMapTour: false, showScheduleTour: true }),
      completeScheduleTourAndGoToAssistant: () => set({ showScheduleTour: false, showAssistantTour: true }),
      openUserDataInputModal: () => set({ isUserDataInputModalOpen: true }),
      closeUserDataInputModal: () => set({ isUserDataInputModalOpen: false }),
      openProductModal: () => set({ isProductModalOpen: true }),
      closeProductModal: () => set({ isProductModalOpen: false }),
      openScheduleModal: (event) => set({ isScheduleModalOpen: true, selectedScheduleEvent: event }),
      closeScheduleModal: () => set({ isScheduleModalOpen: false, selectedScheduleEvent: null }),
      
      addBadge: (badgeId) => set((state) => {
        if (!state.user) return state;
        
        const user = { ...state.user };
        if (!user.badges.includes(badgeId)) {
          user.badges.push(badgeId);
          user.xp += 100; // XP за бейдж
          
          // Логируем получение бейджа
          logBadgeEarned(badgeId, badgeId, 100, user.id);
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
      hideQRScanner: () => set({ showQRScanner: false }),
      
      addScannedZone: (zoneId) => set((state) => {
        if (!state.user) return state;
        
        const user = { ...state.user };
        if (!user.scannedZones) {
          user.scannedZones = [];
        }
        if (!user.scannedZones.includes(zoneId)) {
          user.scannedZones.push(zoneId);
          
          // Логируем сканирование QR кода
          logQRScanned(zoneId, 'zone', zoneId, user.id);
        }
        
        return { user };
      }),

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
        isOnboardingComplete: state.isOnboardingComplete,
        showAppTour: state.showAppTour,
        showProfileTour: state.showProfileTour,
        showMapTour: state.showMapTour,
        showScheduleTour: state.showScheduleTour,
        showAssistantTour: state.showAssistantTour,
      })
    }
  )
);

// Helper для создания пользователя
export const createUser = createInitialUser;