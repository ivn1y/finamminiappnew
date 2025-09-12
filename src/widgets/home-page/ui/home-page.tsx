'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/shared/store/app-store';
import { Map, QrCode, Users, Target, ChevronRight, Star, Gift } from 'lucide-react';
import { roleContent } from '@/shared/data/seed';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Progress } from '@/shared/ui/progress';
import { GoalWizard, GoalProgressTracker } from '@/features/goal-wizard';

export const HomePage: React.FC = () => {
  const { user, eventMode } = useAppStore();
  const [showGoalWizard, setShowGoalWizard] = useState(false);

  if (!user || !user.role) return null;

  const role = roleContent.find(r => r.id === user.role);
  if (!role) return null;

  const progressPercentage = (user.progressSteps / 5) * 100;

  const handleOpenGoalWizard = () => {
    setShowGoalWizard(true);
  };

  const handleGoalSelected = (goal: string) => {
    // Цель уже сохранена в хуке, здесь можно добавить дополнительную логику
    console.log('Goal selected:', goal);
  };

  const progressSteps = [
    'Роль выбрана',
    'Профиль заполнен', 
    'Цель на 7 дней',
    'Первый квест',
    'QR-квест'
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-24">
      <div className="max-w-md mx-auto lg:max-w-4xl xl:max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Привет, {user.name || role.title}!
          </h1>
          <p className="text-lg text-gray-600">
            Ты прошёл {user.progressSteps}/5 шагов до своей первой коллаборации
          </p>
        </div>

        {/* Progress Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Прогресс</CardTitle>
              <span className="text-base text-gray-500">{user.progressSteps}/5</span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} className="mb-6" />
            
            <div className="space-y-3">
              {progressSteps.map((step, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    index < user.progressSteps 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {index < user.progressSteps && <Star className="w-4 h-4" />}
                  </div>
                  <span className={`text-base ${
                    index < user.progressSteps ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Cards */}
        <div className="space-y-4 mb-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={handleOpenGoalWizard}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-5">
                <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user.intent7d ? 'Изменить цель' : 'Выбрать цель на 7 дней'}
                  </h3>
                  <p className="text-gray-600 text-base">
                    {user.intent7d ? 'Обновить фокус' : '→ Первый квест'}
                  </p>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          {eventMode && (
            <>
              <Link href="/collab/map">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-5">
                      <div className="w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center">
                        <Map className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">Открыть карту и расписание</h3>
                        <p className="text-gray-600 text-base">Найди стенды и события</p>
                      </div>
                      <ChevronRight className="w-6 h-6 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/collab/map">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-5">
                      <div className="w-16 h-16 bg-yellow-50 rounded-lg flex items-center justify-center">
                        <QrCode className="w-8 h-8 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">Сканировать QR и получить бонус</h3>
                        <p className="text-gray-600 text-base">Найди зоны и получи призы</p>
                      </div>
                      <ChevronRight className="w-6 h-6 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </>
          )}

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-5">
                <div className="w-16 h-16 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Присоединиться к коммьюнити</h3>
                  <p className="text-gray-600 text-base">Telegram канал</p>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goal Progress Tracker */}
        {user.intent7d && (
          <div className="mb-6">
            <GoalProgressTracker onEditGoal={handleOpenGoalWizard} />
          </div>
        )}

        {/* Daily Quest */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <Gift className="w-8 h-8 text-yellow-600" />
              <h3 className="text-xl font-semibold text-gray-900">Задание на сегодня</h3>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="text-lg font-medium text-blue-600 mb-3">{role.firstQuest.title}</h4>
              <p className="text-gray-700 text-base mb-4">{role.firstQuest.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Награда: {role.firstQuest.rewardBadge}</span>
                <Button className="px-6 py-3">
                  Выполнить
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goal Wizard */}
        <GoalWizard
          isOpen={showGoalWizard}
          onClose={() => setShowGoalWizard(false)}
          onGoalSelected={handleGoalSelected}
        />
      </div>
    </div>
  );
};
