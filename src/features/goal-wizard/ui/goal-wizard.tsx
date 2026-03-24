'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/shared/store/app-store';
import { useProfileAnalytics } from '@/shared/hooks/use-profile-analytics';
import { roleContent } from '@/shared/data/seed';
import { 
  Target, 
  CheckCircle, 
  ArrowRight, 
  Calendar,
  Star,
  Zap,
  Lightbulb,
  Users,
  Building2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Progress } from '@/shared/ui/progress';
import { Badge } from '@/shared/ui/badge';

interface GoalWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onGoalSelected?: (goal: string) => void;
}

export const GoalWizard: React.FC<GoalWizardProps> = ({ 
  isOpen, 
  onClose, 
  onGoalSelected 
}) => {
  const { user, updateUser, incrementProgress } = useAppStore();
  const { trackGoalSelection } = useProfileAnalytics();
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Сбрасываем состояние при открытии модального окна
  React.useEffect(() => {
    if (isOpen) {
      setSelectedGoal(user?.intent7d || '');
      setCurrentStep(1);
      setIsSubmitting(false);
    }
  }, [isOpen, user?.intent7d]);

  if (!user || !user.role) return null;

  const role = roleContent.find(r => r.id === user.role);
  if (!role) return null;

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case 'trader': return Target;
      case 'startup': return Lightbulb;
      case 'expert': return Users;
      case 'partner': return Building2;
      default: return Target;
    }
  };

  const getGoalIcon = (goalIndex: number) => {
    const icons = [Star, Zap, Target];
    return icons[goalIndex % icons.length];
  };

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedGoal) return;
    
    setIsSubmitting(true);
    
    try {
      // Track goal selection
      await trackGoalSelection(selectedGoal);
      
      // Обновляем цель пользователя
      updateUser({ intent7d: selectedGoal });
      
      // Увеличиваем прогресс если это первый раз
      if (!user.intent7d) {
        incrementProgress();
      }
      
      // Вызываем колбэк если передан
      onGoalSelected?.(selectedGoal);
      
      // Закрываем мастер
      onClose();
      
      // Сбрасываем состояние
      setSelectedGoal('');
      setCurrentStep(1);
    } catch (error) {
      console.error('Error saving goal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedGoal('');
    setCurrentStep(1);
    setIsSubmitting(false);
    onClose();
  };

  const RoleIcon = getRoleIcon(user.role);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        handleClose();
      }
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900">
            Мастер выбора цели на 7 дней
          </DialogTitle>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Шаг {currentStep} из 2
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / 2) * 100)}%
            </span>
          </div>
          <Progress value={(currentStep / 2) * 100} className="h-2" />
        </div>

        {/* Step 1: Role and Goals Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Role Info */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <RoleIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {role.title}
                    </h3>
                    <p className="text-gray-600">{role.subtitle}</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  Выбери одну из предложенных целей на ближайшие 7 дней. 
                  Это поможет тебе сфокусироваться на главном и получить максимальную пользу от участия в Коллаб.
                </p>
              </CardContent>
            </Card>

            {/* Goals Selection */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Доступные цели:
              </h4>
              {role.goals7d.map((goal, index) => {
                const GoalIcon = getGoalIcon(index);
                const isSelected = selectedGoal === goal;
                
                return (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                        : 'hover:shadow-md hover:border-gray-300'
                    }`}
                    onClick={() => handleGoalSelect(goal)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <GoalIcon className={`w-5 h-5 ${
                            isSelected ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${
                            isSelected ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {goal}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Current Goal Badge */}
            {user.intent7d && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Текущая цель:
                      </p>
                      <p className="text-yellow-700">{user.intent7d}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 2: Confirmation */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Отличный выбор!
                </h3>
                <p className="text-gray-700 mb-4">
                  Ты выбрал цель на 7 дней:
                </p>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <p className="text-lg font-medium text-gray-900">
                    {selectedGoal}
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Эта цель поможет тебе сфокусироваться и получить максимальную пользу от участия в Коллаб.
                </p>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Что тебя ждёт:</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Персональные рекомендации</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Отслеживание прогресса</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Доступ к релевантным квестам</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Возможность изменить цель в любой момент</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-6 border-t">
          {currentStep === 1 ? (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                variant="outline"
                onClick={handleNext}
                disabled={!selectedGoal}
                className="flex-1"
              >
                Далее
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1"
              >
                Назад
              </Button>
              <Button
                variant="outline"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Сохранение...' : 'Подтвердить'}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
