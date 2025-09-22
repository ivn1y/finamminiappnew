'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/shared/store/app-store';
import { UserRole } from '@/shared/types/app';
import { roleContent } from '@/shared/data/seed';
import { ChevronRight, ChevronLeft, Sparkles, Target, Users, Building2, Lightbulb, AlertCircle } from 'lucide-react';

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [name, setName] = useState('');
  const [intent7d, setIntent7d] = useState('');

  // Функции валидации
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1: // Выбор роли
        if (!selectedRole) {
          newErrors.role = 'Пожалуйста, выберите свою роль';
        }
        break;
      case 2: // Заполнение профиля
        if (!selectedRole) return false;
        
        switch (selectedRole) {
          case 'trader':
            if (!profileData.years) newErrors.years = 'Укажите опыт в трейдинге';
            if (!profileData.markets || profileData.markets.length === 0) newErrors.markets = 'Укажите рынки торговли';
            if (!profileData.risk) newErrors.risk = 'Выберите риск-профиль';
            break;
          case 'startup':
            if (!profileData.stage) newErrors.stage = 'Укажите стадию проекта';
            if (!profileData.description || profileData.description.trim().length < 3) newErrors.description = 'Опишите продукт (минимум 3 символа)';
            break;
          case 'expert':
            if (!profileData.expertType) newErrors.expertType = 'Выберите роль в Collab';
            if (!profileData.expertise || profileData.expertise.trim().length < 3) newErrors.expertise = 'Укажите область экспертизы (минимум 3 символа)';
            if (!profileData.experience) newErrors.experience = 'Укажите опыт работы';
            break;
          case 'partner':
            if (!profileData.partnershipType) newErrors.partnershipType = 'Выберите тип партнерства';
            if (!profileData.description || profileData.description.trim().length < 10) newErrors.description = 'Опишите продукт/услугу (минимум 10 символов)';
            break;
        }
        break;
      case 3: // Имя и цель
        if (!name.trim()) newErrors.name = 'Введите ваше имя';
        if (!intent7d.trim()) newErrors.intent7d = 'Опишите вашу цель на 7 дней';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleWelcomeNext = () => {
    setCurrentStep(1);
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentStep(2);
  };

  const handleRoleNext = () => {
    if (validateStep(1)) {
      setCurrentStep(2);
    }
  };

  const handleProfileNext = () => {
    if (validateStep(2)) {
      setCurrentStep(3);
    }
  };

  const handleFinalSubmit = () => {
    if (!selectedRole || !validateStep(3)) return;

    const newUser = {
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
      role: selectedRole,
      profile: { [selectedRole]: profileData },
      badges: ['explorer'],
      xp: 100,
      progressSteps: 1,
      name: name.trim(),
      intent7d: intent7d.trim()
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
            const isSelected = selectedRole === role.id;
            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`bg-white rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow border-2 ${
                  isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-blue-500'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{role.title}</h3>
                    <p className="text-blue-600 font-medium text-sm">{role.subtitle}</p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Error message */}
        {errors.role && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 text-sm">{errors.role}</span>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex space-x-3 mt-8">
          <button
            onClick={handleBack}
            className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Назад
          </button>
          <button
            onClick={handleRoleNext}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700 py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            Далее
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
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
                  Сколько лет в трейдинге? *
                </label>
                <select
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.years ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={profileData.years || ''}
                  onChange={(e) => {
                    handleInputChange('years', e.target.value);
                    if (errors.years) {
                      setErrors(prev => ({ ...prev, years: '' }));
                    }
                  }}
                >
                  <option value="">Выбери опыт</option>
                  <option value="0">Меньше года</option>
                  <option value="1">1-2 года</option>
                  <option value="3">3-5 лет</option>
                  <option value="5">Больше 5 лет</option>
                </select>
                {errors.years && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.years}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  На каких рынках торгуешь? *
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.markets ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Форекс, акции, криптовалюты..."
                  value={Array.isArray(profileData.markets) ? profileData.markets.join(', ') : (profileData.markets || '')}
                  onChange={(e) => {
                    const markets = e.target.value.split(',').map((s: string) => s.trim()).filter(s => s);
                    handleInputChange('markets', markets);
                    if (errors.markets) {
                      setErrors(prev => ({ ...prev, markets: '' }));
                    }
                  }}
                />
                {errors.markets && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.markets}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Твой риск-профиль? *
                </label>
                <select
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.risk ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={profileData.risk || ''}
                  onChange={(e) => {
                    handleInputChange('risk', e.target.value);
                    if (errors.risk) {
                      setErrors(prev => ({ ...prev, risk: '' }));
                    }
                  }}
                >
                  <option value="">Выбери профиль</option>
                  <option value="low">Консервативный</option>
                  <option value="medium">Умеренный</option>
                  <option value="high">Агрессивный</option>
                </select>
                {errors.risk && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.risk}
                  </p>
                )}
              </div>
            </div>
          );

        case 'startup':
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  На какой стадии твой проект? *
                </label>
                <select
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.stage ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={profileData.stage || ''}
                  onChange={(e) => {
                    handleInputChange('stage', e.target.value);
                    if (errors.stage) {
                      setErrors(prev => ({ ...prev, stage: '' }));
                    }
                  }}
                >
                  <option value="">Выбери стадию</option>
                  <option value="idea">Идея</option>
                  <option value="mvp">MVP</option>
                  <option value="growth">Рост</option>
                  <option value="scale">Масштабирование</option>
                </select>
                {errors.stage && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.stage}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Опиши свой продукт в трех словах *
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Быстро, удобно, эффективно"
                  value={profileData.description || ''}
                  onChange={(e) => {
                    handleInputChange('description', e.target.value);
                    if (errors.description) {
                      setErrors(prev => ({ ...prev, description: '' }));
                    }
                  }}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          );

        case 'expert':
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Кем ты хочешь быть в Collab? *
                </label>
                <select
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.expertType ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={profileData.expertType || ''}
                  onChange={(e) => {
                    handleInputChange('expertType', e.target.value);
                    if (errors.expertType) {
                      setErrors(prev => ({ ...prev, expertType: '' }));
                    }
                  }}
                >
                  <option value="">Выбери роль</option>
                  <option value="mentor">Ментор</option>
                  <option value="tracker">Трекер</option>
                  <option value="council">Совет директоров</option>
                </select>
                {errors.expertType && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.expertType}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  В какой области твоя экспертиза? *
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.expertise ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Финансы, технологии, маркетинг..."
                  value={profileData.expertise || ''}
                  onChange={(e) => {
                    handleInputChange('expertise', e.target.value);
                    if (errors.expertise) {
                      setErrors(prev => ({ ...prev, expertise: '' }));
                    }
                  }}
                />
                {errors.expertise && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.expertise}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Сколько лет опыта в этой области? *
                </label>
                <select
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.experience ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={profileData.experience || ''}
                  onChange={(e) => {
                    handleInputChange('experience', e.target.value);
                    if (errors.experience) {
                      setErrors(prev => ({ ...prev, experience: '' }));
                    }
                  }}
                >
                  <option value="">Выбери опыт</option>
                  <option value="1-3">1-3 года</option>
                  <option value="3-5">3-5 лет</option>
                  <option value="5-10">5-10 лет</option>
                  <option value="10+">Больше 10 лет</option>
                </select>
                {errors.experience && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.experience}
                  </p>
                )}
              </div>
            </div>
          );

        case 'partner':
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Что тебя интересует? *
                </label>
                <select
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.partnershipType ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={profileData.partnershipType || ''}
                  onChange={(e) => {
                    handleInputChange('partnershipType', e.target.value);
                    if (errors.partnershipType) {
                      setErrors(prev => ({ ...prev, partnershipType: '' }));
                    }
                  }}
                >
                  <option value="">Выбери пакет</option>
                  <option value="franchise">Франшиза</option>
                  <option value="white-label">White-label</option>
                  <option value="api">API интеграция</option>
                </select>
                {errors.partnershipType && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.partnershipType}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Опиши свой продукт/услугу *
                </label>
                <textarea
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Расскажи о том, что ты предлагаешь..."
                  value={profileData.description || ''}
                  onChange={(e) => {
                    handleInputChange('description', e.target.value);
                    if (errors.description) {
                      setErrors(prev => ({ ...prev, description: '' }));
                    }
                  }}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          );

        default:
          return (
            <div className="text-center py-8">
              <p className="text-gray-500">Форма для этой роли пока не готова</p>
            </div>
          );
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
          
          {/* Navigation buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleBack}
              className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Назад
            </button>
            <button
              onClick={handleProfileNext}
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700 py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              Далее
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderNameAndGoal = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Последний шаг</h1>
          <p className="text-gray-600">Расскажи немного о себе</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Как тебя зовут? *
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Введите ваше имя"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) {
                  setErrors(prev => ({ ...prev, name: '' }));
                }
              }}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Какая у тебя цель на 7 дней? *
            </label>
            <textarea
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none ${
                errors.intent7d ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Опишите вашу цель на ближайшую неделю..."
              value={intent7d}
              onChange={(e) => {
                setIntent7d(e.target.value);
                if (errors.intent7d) {
                  setErrors(prev => ({ ...prev, intent7d: '' }));
                }
              }}
            />
            {errors.intent7d && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.intent7d}
              </p>
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleBack}
            className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Назад
          </button>
          <button
            onClick={handleFinalSubmit}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700 py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            Завершить
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );

  switch (currentStep) {
    case 0:
      return renderWelcomeScreen();
    case 1:
      return renderRoleSelection();
    case 2:
      return renderProfileForm();
    case 3:
      return renderNameAndGoal();
    default:
      return renderWelcomeScreen();
  }
};
