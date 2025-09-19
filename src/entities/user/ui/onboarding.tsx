'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/shared/store/app-store';
import { UserRole } from '@/shared/types/app';
import { roleContent } from '@/shared/data/seed';
import { ChevronRight, Sparkles, Target, Users, Building2, Lightbulb } from 'lucide-react';

const roleIcons = {
  trader: Target,
  startup: Lightbulb,
  expert: Users,
  partner: Building2
};

export const Onboarding: React.FC = () => {
  const { setUser, updateUser, completeOnboarding, eventMode } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [profileData, setProfileData] = useState<any>({});

  const handleWelcomeNext = () => {
    setCurrentStep(1);
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentStep(2);
  };

  const handleProfileSubmit = () => {
    if (!selectedRole) return;

    const newUser = {
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
      role: selectedRole,
      profile: { [selectedRole]: profileData },
      badges: ['explorer'],
      xp: 100,
      progressSteps: 1
    };

    setUser(newUser);
    completeOnboarding();
  };

  const handleQuickTest = () => {
    const testUser = {
      id: `test_user_${Date.now()}`,
      createdAt: new Date().toISOString(),
      role: 'trader' as UserRole,
      profile: { 
        trader: {
          years: 3,
          markets: ['Форекс', 'Акции'],
          risk: 'medium' as const
        }
      },
      badges: ['explorer'],
      xp: 100,
      progressSteps: 2
    };

    setUser(testUser);
    completeOnboarding();
  };

  const renderWelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center text-white">
        <div className="mb-8">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
          <h1 className="text-3xl font-bold mb-4">Привет!</h1>
          <p className="text-lg mb-2">Мы — Финам.</p>
          {eventMode ? (
            <div className="text-left space-y-3">
              <p>Сегодня ты на конференции TradeID. Наше мини-приложение поможет:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>посмотреть карту и расписание</li>
                <li>проходить квесты и получать бонусы</li>
              </ul>
              <div className="bg-yellow-400/20 rounded-lg p-3 mt-4">
                <p className="font-semibold">⚡ Самый быстрый, кто найдёт зону и отсканирует QR, получит приз!</p>
                <p className="text-sm mt-1">Остальные — ранний доступ к инструментам и подарки на стенде.</p>
              </div>
            </div>
          ) : (
            <div className="text-left space-y-3">
              <p>В 2025 году мы запустили Finam Collab — пространство для трейдеров, стартапов и экспертов.</p>
              <p>Зачем это тебе? Здесь ты можешь запускать стратегии, пилоты и влиять на рынок.</p>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <button
            onClick={handleWelcomeNext}
            className="bg-white text-blue-600 hover:bg-gray-50 w-full text-lg py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            Поехали
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
          <button
            onClick={handleQuickTest}
            className="bg-yellow-400 text-blue-600 hover:bg-yellow-300 w-full text-lg py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            🚀 Быстрый тест (Трейдер)
          </button>
        </div>
      </div>
    </div>
  );

  const renderRoleSelection = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto lg:max-w-4xl xl:max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Кто ты?</h1>
          <p className="text-gray-600">Выбери свою роль в экосистеме</p>
        </div>
        
        <div className="space-y-4">
          {roleContent.map((role) => {
            const IconComponent = roleIcons[role.id];
            return (
              <div
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className="bg-white rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-blue-500"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{role.title}</h3>
                    <p className="text-blue-600 font-medium text-sm">{role.subtitle}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderProfileForm = () => {
    if (!selectedRole) return null;

    const role = roleContent.find(r => r.id === selectedRole);
    if (!role) return null;

    const handleInputChange = (field: string, value: any) => {
      setProfileData((prev: any) => ({ ...prev, [field]: value }));
    };

    const renderFields = () => {
      switch (selectedRole) {
        case 'trader':
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Сколько лет в трейдинге?
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={profileData.years || ''}
                  onChange={(e) => handleInputChange('years', parseInt(e.target.value))}
                >
                  <option value="">Выбери опыт</option>
                  <option value="0">Меньше года</option>
                  <option value="1">1-2 года</option>
                  <option value="3">3-5 лет</option>
                  <option value="5">Больше 5 лет</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  На каких рынках торгуешь?
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Форекс, акции, криптовалюты..."
                  value={profileData.markets || ''}
                  onChange={(e) => handleInputChange('markets', e.target.value.split(',').map((s: string) => s.trim()))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Твой риск-профиль?
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={profileData.risk || ''}
                  onChange={(e) => handleInputChange('risk', e.target.value)}
                >
                  <option value="">Выбери профиль</option>
                  <option value="low">Консервативный</option>
                  <option value="medium">Умеренный</option>
                  <option value="high">Агрессивный</option>
                </select>
              </div>
            </div>
          );
        // Добавить остальные роли по аналогии...
        default:
          return null;
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-md mx-auto lg:max-w-4xl xl:max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Быстрый профиль</h1>
            <p className="text-gray-600">Расскажи о себе в нескольких словах</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 mb-6">
            {renderFields()}
          </div>
          
          <button
            onClick={handleProfileSubmit}
            className="bg-blue-600 text-white hover:bg-blue-700 w-full text-lg py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            Готово!
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    );
  };

  switch (currentStep) {
    case 0:
      return renderWelcomeScreen();
    case 1:
      return renderRoleSelection();
    case 2:
      return renderProfileForm();
    default:
      return renderWelcomeScreen();
  }
};
