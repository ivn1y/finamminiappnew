'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/shared/store/app-store';
import { roleContent } from '@/shared/data/seed';
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
  RefreshCw
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
import { useProfile } from '@/shared/hooks/use-profile';
import { BadgeInfoTooltip } from '@/shared/ui/badge-info-tooltip';
import { ProgressCircle } from '@/shared/ui/progress-circle';
import { XPTooltip } from '@/shared/ui/xp-tooltip';
import { User } from '@/shared/types/app';

export const ProfilePage: React.FC = () => {
  const { user, getAllBadges, getProgressPercentage } = useAppStore();
  const { syncWithApi, isLoading: isProfileLoading } = useProfile();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showGoalWizard, setShowGoalWizard] = useState(false);
  const [showAdvancedEdit, setShowAdvancedEdit] = useState(false);

  if (!user || !user.role) return null;

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

  const handleShare = async () => {
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

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-24">
      <div className="max-w-md mx-auto lg:max-w-4xl xl:max-w-6xl">
        {/* Avatar with Progress Circle */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                <RoleIcon className="w-12 h-12" />
              </AvatarFallback>
            </Avatar>
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
        </div>

        {/* Badges */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Мои бейджи</CardTitle>
              <span className="text-base text-gray-500">
                {userBadges.length}/{allBadges.length}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
              {/* Earned badges */}
              {userBadges.map((badge) => {
                const BadgeIcon = getBadgeIcon(badge.id);
                return (
                  <Card
                    key={badge.id}
                    className="bg-blue-50 border-2 border-blue-500 text-center relative"
                  >
                    <CardContent className="p-3">
                      <div className="absolute top-2 right-2">
                        <BadgeInfoTooltip badge={badge} isEarned={true} />
                      </div>
                      <BadgeIcon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                      <h4 className="font-medium text-gray-900 text-base">{badge.title}</h4>
                      <p className="text-sm text-gray-600 mt-2">{badge.tooltip}</p>
                    </CardContent>
                  </Card>
                );
              })}
              
              {/* Locked badges */}
              {lockedBadges.map((badge) => {
                const BadgeIcon = getBadgeIcon(badge.id);
                return (
                  <Card
                    key={badge.id}
                    className="bg-gray-100 border-2 border-gray-200 text-center opacity-50 relative"
                  >
                    <CardContent className="p-3">
                      <div className="absolute top-2 right-2">
                        <BadgeInfoTooltip badge={badge} isEarned={false} />
                      </div>
                      <BadgeIcon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <h4 className="font-medium text-gray-500 text-base">{badge.title}</h4>
                      <p className="text-sm text-gray-400 mt-2">Заблокировано</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

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
      </div>
    </div>
  );
};
