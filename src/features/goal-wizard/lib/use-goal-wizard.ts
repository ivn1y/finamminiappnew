'use client';

import { useState, useCallback } from 'react';
import { useAppStore } from '@/shared/store/app-store';

export interface GoalWizardState {
  isOpen: boolean;
  selectedGoal: string;
  currentStep: number;
  isSubmitting: boolean;
}

export interface GoalWizardActions {
  openWizard: () => void;
  closeWizard: () => void;
  selectGoal: (goal: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  submitGoal: (goal: string) => Promise<void>;
  resetWizard: () => void;
}

export const useGoalWizard = (): GoalWizardState & GoalWizardActions => {
  const { user, updateUser, incrementProgress } = useAppStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openWizard = useCallback(() => {
    setIsOpen(true);
    setCurrentStep(1);
    setSelectedGoal(user?.intent7d || '');
  }, [user?.intent7d]);

  const closeWizard = useCallback(() => {
    setIsOpen(false);
    setCurrentStep(1);
    setSelectedGoal('');
    setIsSubmitting(false);
  }, []);

  const selectGoal = useCallback((goal: string) => {
    setSelectedGoal(goal);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const submitGoal = useCallback(async (goal: string) => {
    if (!goal) return;
    
    setIsSubmitting(true);
    
    try {
      // Обновляем цель пользователя
      updateUser({ intent7d: goal });
      
      // Увеличиваем прогресс если это первый раз
      if (!user?.intent7d) {
        incrementProgress();
      }
      
      // Сбрасываем состояние
      setSelectedGoal('');
      setCurrentStep(1);
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving goal:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [user?.intent7d, updateUser, incrementProgress]);

  const resetWizard = useCallback(() => {
    setSelectedGoal('');
    setCurrentStep(1);
    setIsSubmitting(false);
  }, []);

  return {
    // State
    isOpen,
    selectedGoal,
    currentStep,
    isSubmitting,
    
    // Actions
    openWizard,
    closeWizard,
    selectGoal,
    nextStep,
    prevStep,
    submitGoal,
    resetWizard
  };
};
