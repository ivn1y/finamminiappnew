'use client';

import { useState, useCallback } from 'react';
import { useAppStore } from '../store/app-store';
import { mockApiService, ProfileUpdateRequest } from '../lib/mock-api';
import { User } from '../types/app';

export interface UseProfileReturn {
  // Состояние
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
  
  // Методы
  loadProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: ProfileUpdateRequest) => Promise<boolean>;
  syncWithApi: () => Promise<void>;
  clearError: () => void;
}

export const useProfile = (): UseProfileReturn => {
  const { user, updateUser, setUser } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Загрузить профиль с API
  const loadProfile = useCallback(async (userId: string) => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await mockApiService.getUserProfile(userId);
      
      if (response.success && response.data) {
        setUser(response.data.user);
      } else {
        setError(response.error || 'Ошибка загрузки профиля');
      }
    } catch (err) {
      setError('Ошибка сети при загрузке профиля');
      console.error('Profile load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  // Обновить профиль
  const updateProfile = useCallback(async (updates: ProfileUpdateRequest): Promise<boolean> => {
    if (!user?.id) {
      setError('Пользователь не авторизован');
      return false;
    }
    
    setIsUpdating(true);
    setError(null);
    
    try {
      // Сначала обновляем локально для быстрого отклика
      updateUser(updates);
      
      // Затем синхронизируем с API
      const response = await mockApiService.updateUserProfile(user.id, updates);
      
      if (response.success && response.data) {
        // Обновляем локальные данные актуальными с сервера
        setUser(response.data.user);
        return true;
      } else {
        // Откатываем изменения при ошибке
        setError(response.error || 'Ошибка обновления профиля');
        return false;
      }
    } catch (err) {
      setError('Ошибка сети при обновлении профиля');
      console.error('Profile update error:', err);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [user?.id, updateUser, setUser]);

  // Синхронизировать с API
  const syncWithApi = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await mockApiService.getUserProfile(user.id);
      
      if (response.success && response.data) {
        setUser(response.data.user);
      } else {
        setError(response.error || 'Ошибка синхронизации');
      }
    } catch (err) {
      setError('Ошибка сети при синхронизации');
      console.error('Profile sync error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, setUser]);

  // Очистить ошибку
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    isUpdating,
    loadProfile,
    updateProfile,
    syncWithApi,
    clearError
  };
};
