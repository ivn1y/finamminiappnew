'use client';

import { useState, useCallback } from 'react';
import { useAppStore } from '@/shared/store/app-store';
import { submitBookingRequest, CRMSubmissionResult } from '@/shared/lib/crm-api';

export interface BookingState {
  isSubmitting: boolean;
  lastResult: CRMSubmissionResult | null;
  error: string | null;
}

export const useBooking = () => {
  const { user } = useAppStore();
  const [state, setState] = useState<BookingState>({
    isSubmitting: false,
    lastResult: null,
    error: null,
  });

  const submitBooking = useCallback(async (message?: string): Promise<CRMSubmissionResult> => {
    if (!user) {
      const errorResult: CRMSubmissionResult = {
        success: false,
        message: 'Пользователь не авторизован',
      };
      setState(prev => ({ ...prev, lastResult: errorResult, error: 'Пользователь не авторизован' }));
      return errorResult;
    }

    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      console.log('📤 Отправка заявки на запись:', { userId: user.id, userRole: user.role });
      
      const result = await submitBookingRequest(user, message);
      
      setState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        lastResult: result,
        error: result.success ? null : result.message 
      }));

      if (result.success) {
        console.log('✅ Заявка успешно отправлена');
      } else {
        console.error('❌ Ошибка отправки заявки:', result.message);
      }

      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Неизвестная ошибка';
      const errorResult: CRMSubmissionResult = {
        success: false,
        message: errorMessage,
      };

      setState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        lastResult: errorResult,
        error: errorMessage 
      }));

      console.error('❌ Критическая ошибка при отправке заявки:', error);
      return errorResult;
    }
  }, [user]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearResult = useCallback(() => {
    setState(prev => ({ ...prev, lastResult: null, error: null }));
  }, []);

  return {
    ...state,
    submitBooking,
    clearError,
    clearResult,
    canSubmit: !!user && !state.isSubmitting,
  };
};
