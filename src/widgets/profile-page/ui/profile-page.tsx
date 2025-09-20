'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/shared/store/app-store';
import { roleContent, eventData } from '@/shared/data/seed';
import { 
  User as UserIcon, 
  Award, 
  Target, 
  Share2, 
  Edit3, 
  Star, 
  Crown,
  Zap,
  Shield,
  Lightbulb,
  Users,
  Building2,
  RefreshCw,
  MapPin,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { GoalWizard, GoalProgressTracker } from '@/features/goal-wizard';
import { ProfileEditModal } from '@/features/profile-edit';
import { AvatarView, AvatarCustomizationModal } from '@/features/avatar-customization';
import { BadgesGrid } from '@/features/badges-grid';
import { useProfile } from '@/shared/hooks/use-profile';
import { useProfileAnalytics } from '@/shared/hooks/use-profile-analytics';
import { BadgeInfoTooltip } from '@/shared/ui/badge-info-tooltip';
import { ProgressCircle } from '@/shared/ui/progress-circle';
import { XPTooltip } from '@/shared/ui/xp-tooltip';
import { TelegramCommunityCTA } from '@/shared/ui/telegram-community-cta';
import { User } from '@/shared/types/app';

export const ProfilePage: React.FC = () => {
  const { user, getAllBadges, getProgressPercentage } = useAppStore();
  const { syncWithApi, isLoading: isProfileLoading } = useProfile();
  const { 
    updateProfile, 
    updateAvatar, 
    trackBadgeClick, 
    trackScreenView, 
    trackGoalSelection, 
    trackShareProfile 
  } = useProfileAnalytics();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showGoalWizard, setShowGoalWizard] = useState(false);
  const [showAdvancedEdit, setShowAdvancedEdit] = useState(false);
  const [showAvatarCustomization, setShowAvatarCustomization] = useState(false);

  const handleResetData = () => {
    // Reset user data to initial state
    const newUser = {
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
      role: 'trader' as const,
      profile: {},
      badges: ['explorer', 'qr_scanner_badge'],
      xp: 300,
      progressSteps: 2,
      scannedZones: ['finam-a', 'startup-zone'],
      intent7d: 'Получить доступ к платформе автоследования',
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
    };
    
    // Update the store with new user data
    useAppStore.setState({ user: newUser });
    
    // Show success message
    alert('Данные пользователя сброшены и инициализированы!');
  };

  if (!user || !user.role) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 pb-24 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Пользователь не найден</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Данные пользователя не загружены. Нажмите кнопку для инициализации.
            </p>
            <Button onClick={handleResetData} className="w-full">
              Инициализировать пользователя
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Отладочная информация
  console.log('🔍 ProfilePage: Данные пользователя:', {
    user,
    scannedZones: user.scannedZones,
    badges: user.badges,
    xp: user.xp
  });

  const role = roleContent.find(r => r.id === user.role);
  if (!role) return null;

  const allBadges = getAllBadges();
  const userBadges = allBadges.filter(badge => user.badges.includes(badge.id));
  const lockedBadges = allBadges.filter(badge => !user.badges.includes(badge.id));

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case 'trader': return Target;
      case 'startup': return Lightbulb;
      case 'expert': return Users;
      case 'partner': return Building2;
      default: return UserIcon;
    }
  };

  const getBadgeIcon = (badgeId: string) => {
    switch (badgeId) {
      case 'qr_scanner_badge': return Target; // QR-сканер
      case 'explorer': return Star;
      case 'risk': return Shield;
      case 'algo': return Zap;
      case 'pilot': return Target;
      case 'growth': return Zap;
      case 'deal': return Crown;
      case 'owl': return Users;
      case 'challenger': return Lightbulb;
      case 'mentor': return Users;
      case 'integrator': return Building2;
      case 'builder': return Zap;
      case 'visionary': return Crown;
      default: return Award;
    }
  };

  const [editData, setEditData] = useState({
    name: user?.name || '',
    intent7d: user?.intent7d || ''
  });

  // Обновляем editData при изменении пользователя
  React.useEffect(() => {
    setEditData({
      name: user?.name || '',
      intent7d: user?.intent7d || ''
    });
  }, [user]);

  const handleSaveEdit = () => {
    useAppStore.getState().updateUser(editData);
    setShowEditModal(false);
  };

  const handleAdvancedEdit = () => {
    setShowAdvancedEdit(true);
  };

  const handleProfileSaved = (updatedUser: User) => {
    useAppStore.getState().setUser(updatedUser);
    setShowAdvancedEdit(false);
  };

  const handleSyncProfile = async () => {
    await syncWithApi();
  };

  const handleOpenGoalWizard = () => {
    setShowGoalWizard(true);
  };

  const handleGoalSelected = (goal: string) => {
    // Цель уже сохранена в хуке, здесь можно добавить дополнительную логику
    console.log('Goal selected:', goal);
  };

  const handleAvatarCustomization = () => {
    setShowAvatarCustomization(true);
  };

  const handleAvatarSave = async (avatarData: { frameId?: string; accessories?: string[] }) => {
    try {
      await updateAvatar(avatarData);
      setShowAvatarCustomization(false);
    } catch (error) {
      console.error('Error saving avatar:', error);
      // Show error toast or handle error
    }
  };

  const handleBadgeClick = async (badge: any) => {
    await trackBadgeClick(badge.id);
  };

  const handleShare = async () => {
    await trackShareProfile();
    
    const shareData = {
      title: 'Finam Collab',
      text: `Я участвую в Finam Collab как ${role.title}! Присоединяйся!`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareData.url);
      // Show toast notification
      alert('Ссылка скопирована в буфер обмена!');
    }
  };


  const RoleIcon = getRoleIcon(user.role!);

  // Track screen view on mount
  React.useEffect(() => {
    trackScreenView('me');
  }, [trackScreenView]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-24">
      <div className="max-w-md mx-auto lg:max-w-4xl xl:max-w-6xl">
        {/* RPG Avatar with Progress Circle */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <AvatarView 
              user={user}
              onCustomize={handleAvatarCustomization}
              className="mb-4"
            />
            {/* Progress Circle with Level - replaces XP indicator */}
            <div className="absolute -bottom-2 -right-2">
              <XPTooltip currentXP={user.xp}>
                <ProgressCircle 
                  progress={getProgressPercentage()} 
                  size={50}
                  strokeWidth={4}
                  className="text-blue-600 cursor-pointer hover:scale-105 transition-transform"
                >
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900">
                      {Math.floor(user.xp / 100) + 1}
                    </div>
                  </div>
                </ProgressCircle>
              </XPTooltip>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {user.name || role.title}
          </h2>
          <p className="text-lg text-blue-600 font-medium">{role.subtitle}</p>
          <p className="text-gray-600 text-base mt-2">
            Прогресс: {Math.round(getProgressPercentage())}%
          </p>
          <p className="text-sm text-gray-500 mt-1 opacity-75">
            Нажмите на аватар для кастомизации
          </p>
        </div>

        {/* Badges Grid */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <BadgesGrid
              userBadges={user.badges}
              allBadges={allBadges}
              onBadgeClick={handleBadgeClick}
            />
          </CardContent>
        </Card>

        {/* Scanned Zones */}
        {user.scannedZones && user.scannedZones.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Отсканированные зоны</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user.scannedZones.map((zoneId) => {
                  const zone = eventData.zones.find(z => z.id === zoneId);
                  if (!zone) return null;
                  
                  return (
                    <div
                      key={zoneId}
                      className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">{zone.name}</h4>
                          {zone.prize && (
                            <p className="text-sm text-green-600">Приз: {zone.prize}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        QR: {zone.qr}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Data */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Мои данные</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSyncProfile}
                  disabled={isProfileLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${isProfileLoading ? 'animate-spin' : ''}`} />
                  Синхронизировать
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAdvancedEdit}
                >
                  <Edit3 className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetData}
                  className="ml-2"
                >
                  Сбросить данные
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Роль
                </Label>
                <p className="text-gray-900 mt-1">{role.title} — {role.subtitle}</p>
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">
                    Цель на 7 дней
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleOpenGoalWizard}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Target className="w-4 h-4 mr-1" />
                    {user.intent7d ? 'Изменить' : 'Выбрать'}
                  </Button>
                </div>
                <p className="text-gray-900 mt-1">
                  {user.intent7d || 'Не выбрана'}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Шаги прогресса
                </Label>
                <p className="text-gray-900 mt-1">{user.progressSteps}/5</p>
              </div>

              {/* Ролевые данные профиля */}
              {user.profile && user.profile[user.role] && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">
                    Детали профиля
                  </h4>
                  <div className="space-y-2">
                    {user.role === 'trader' && user.profile.trader && (
                      <>
                        {user.profile.trader.years && (
                          <div>
                            <span className="text-sm text-gray-600">Опыт: </span>
                            <span className="text-sm text-gray-900">{user.profile.trader.years} лет</span>
                          </div>
                        )}
                        {user.profile.trader.risk && (
                          <div>
                            <span className="text-sm text-gray-600">Риск: </span>
                            <span className="text-sm text-gray-900 capitalize">{user.profile.trader.risk}</span>
                          </div>
                        )}
                        {user.profile.trader.markets && user.profile.trader.markets.length > 0 && (
                          <div>
                            <span className="text-sm text-gray-600">Рынки: </span>
                            <span className="text-sm text-gray-900">{user.profile.trader.markets.join(', ')}</span>
                          </div>
                        )}
                      </>
                    )}
                    
                    {user.role === 'startup' && user.profile.startup && (
                      <>
                        {user.profile.startup.stage && (
                          <div>
                            <span className="text-sm text-gray-600">Стадия: </span>
                            <span className="text-sm text-gray-900 capitalize">{user.profile.startup.stage}</span>
                          </div>
                        )}
                        {user.profile.startup.pitch3 && (
                          <div>
                            <span className="text-sm text-gray-600">Питч: </span>
                            <span className="text-sm text-gray-900">{user.profile.startup.pitch3}</span>
                          </div>
                        )}
                        {user.profile.startup.site && (
                          <div>
                            <span className="text-sm text-gray-600">Сайт: </span>
                            <a 
                              href={user.profile.startup.site} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {user.profile.startup.site}
                            </a>
                          </div>
                        )}
                      </>
                    )}

                    {user.role === 'expert' && user.profile.expert && (
                      <>
                        {user.profile.expert.domain && (
                          <div>
                            <span className="text-sm text-gray-600">Область: </span>
                            <span className="text-sm text-gray-900">{user.profile.expert.domain}</span>
                          </div>
                        )}
                        {user.profile.expert.availabilityHrs && (
                          <div>
                            <span className="text-sm text-gray-600">Доступность: </span>
                            <span className="text-sm text-gray-900">{user.profile.expert.availabilityHrs} ч/нед</span>
                          </div>
                        )}
                        {user.profile.expert.mode && (
                          <div>
                            <span className="text-sm text-gray-600">Режим: </span>
                            <span className="text-sm text-gray-900 capitalize">{user.profile.expert.mode}</span>
                          </div>
                        )}
                      </>
                    )}

                    {user.role === 'partner' && user.profile.partner && (
                      <>
                        {user.profile.partner.type && (
                          <div>
                            <span className="text-sm text-gray-600">Тип: </span>
                            <span className="text-sm text-gray-900 capitalize">{user.profile.partner.type}</span>
                          </div>
                        )}
                        {user.profile.partner.interest && (
                          <div>
                            <span className="text-sm text-gray-600">Интерес: </span>
                            <span className="text-sm text-gray-900 capitalize">{user.profile.partner.interest}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Goal Progress Tracker */}
        {user.intent7d && (
          <div className="mb-6">
            <GoalProgressTracker onEditGoal={handleOpenGoalWizard} />
          </div>
        )}

        {/* Share Button */}
        <Card>
          <CardContent className="p-6">
            <Button
              onClick={handleShare}
              variant="ghost"
              className="w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <Share2 className="w-5 h-5" />
              <span>Поделиться</span>
            </Button>
          </CardContent>
        </Card>

        {/* Telegram Community CTA */}
        <TelegramCommunityCTA className="mt-4" />

        {/* Edit Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="w-full max-w-md">
            <DialogHeader>
              <DialogTitle>
                Редактировать данные
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Имя
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Введите имя"
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="intent" className="text-sm font-medium text-gray-700">
                  Цель на 7 дней
                </Label>
                <Select 
                  value={editData.intent7d} 
                  onValueChange={(value) => setEditData(prev => ({ ...prev, intent7d: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Выберите цель" />
                  </SelectTrigger>
                  <SelectContent>
                    {role.goals7d.map((goal, index) => (
                      <SelectItem key={index} value={goal}>{goal}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="flex-1"
              >
                Сохранить
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Goal Wizard */}
        <GoalWizard
          isOpen={showGoalWizard}
          onClose={() => setShowGoalWizard(false)}
          onGoalSelected={handleGoalSelected}
        />

        {/* Advanced Profile Edit Modal */}
        <ProfileEditModal
          isOpen={showAdvancedEdit}
          onClose={() => setShowAdvancedEdit(false)}
          user={user}
          onSave={handleProfileSaved}
        />

        {/* Avatar Customization Modal */}
        <AvatarCustomizationModal
          isOpen={showAvatarCustomization}
          onClose={() => setShowAvatarCustomization(false)}
          user={user}
          onSave={handleAvatarSave}
        />
      </div>
    </div>
  );
};
