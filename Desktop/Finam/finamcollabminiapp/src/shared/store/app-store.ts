import { create } from 'zustand';
import { UserRole } from '@/shared/types/app';

interface User {
  name?: string;
  role?: UserRole;
  credentials?: {
    email?: string;
    phone?: string;
  };
  avatar?: {
    characterId?: string;
    frameId?: string;
    accessories?: string[];
  };
}

interface RoleHistoryEntry {
  role: UserRole;
  timestamp: string;
}

interface AppStore {
  user: User | null;
  selectedRole: UserRole | null;
  roleHistory: RoleHistoryEntry[];
  isUserDataInputModalOpen: boolean;
  isProductModalOpen: boolean;
  showQRScanner: boolean;
  showAppTour: boolean;
  showProfileTour: boolean;
  showMapTour: boolean;
  showScheduleTour: boolean;
  showAssistantTour: boolean;
  isOnboardingComplete: boolean;
  updateUser: (user: Partial<User>) => void;
  setSelectedRole: (role: UserRole | null) => void;
  addRoleToHistory: (role: UserRole) => void;
  openUserDataInputModal: () => void;
  closeUserDataInputModal: () => void;
  openQRScanner: () => void;
  hideQRScanner: () => void;
  setShowAppTour: (show: boolean) => void;
  setShowProfileTour: (show: boolean) => void;
  setShowMapTour: (show: boolean) => void;
  setShowScheduleTour: (show: boolean) => void;
  setShowAssistantTour: (show: boolean) => void;
  setIsOnboardingComplete: (complete: boolean) => void;
  setIsProductModalOpen: (open: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  selectedRole: null,
  roleHistory: [],
  isUserDataInputModalOpen: false,
  isProductModalOpen: false,
  showQRScanner: false,
  showAppTour: false,
  showProfileTour: false,
  showMapTour: false,
  showScheduleTour: false,
  showAssistantTour: false,
  isOnboardingComplete: false,
  updateUser: (userData) => set((state) => ({
    user: { ...state.user, ...userData } as User
  })),
  setSelectedRole: (role) => set({ selectedRole: role }),
  addRoleToHistory: (role) => set((state) => ({
    roleHistory: [...state.roleHistory, { role, timestamp: new Date().toISOString() }]
  })),
  openUserDataInputModal: () => set({ isUserDataInputModalOpen: true }),
  closeUserDataInputModal: () => set({ isUserDataInputModalOpen: false }),
  openQRScanner: () => set({ showQRScanner: true }),
  hideQRScanner: () => set({ showQRScanner: false }),
  setShowAppTour: (show) => set({ showAppTour: show }),
  setShowProfileTour: (show) => set({ showProfileTour: show }),
  setShowMapTour: (show) => set({ showMapTour: show }),
  setShowScheduleTour: (show) => set({ showScheduleTour: show }),
  setShowAssistantTour: (show) => set({ showAssistantTour: show }),
  setIsOnboardingComplete: (complete) => set({ isOnboardingComplete: complete }),
  setIsProductModalOpen: (open) => set({ isProductModalOpen: open }),
}));
