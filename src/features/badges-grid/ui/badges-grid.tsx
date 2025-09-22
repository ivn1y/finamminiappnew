'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { BadgeInfoTooltip } from '@/shared/ui/badge-info-tooltip';
import { Badge } from '@/shared/ui/badge';
import { 
  Award, 
  Target, 
  Star, 
  Shield, 
  Zap, 
  Crown, 
  Users, 
  Lightbulb, 
  Building2,
  X
} from 'lucide-react';

interface BadgeData {
  id: string;
  title: string;
  tooltip: string;
  unlockCondition?: {
    type: 'quest_completed' | 'profile_completed' | 'qr_scanned' | 'xp_level';
    questId?: string;
    level?: number;
    scans?: number;
  };
}

interface BadgesGridProps {
  userBadges: string[];
  allBadges: BadgeData[];
  onBadgeClick?: (badge: BadgeData) => void;
  className?: string;
}

export const BadgesGrid: React.FC<BadgesGridProps> = ({
  userBadges,
  allBadges,
  onBadgeClick,
  className = ''
}) => {
  const [selectedBadge, setSelectedBadge] = useState<BadgeData | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  const getBadgeIcon = (badgeId: string) => {
    switch (badgeId) {
      case 'qr_scanner_badge': return Target;
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

  const isBadgeUnlocked = (badgeId: string) => {
    return userBadges.includes(badgeId);
  };

  const getUnlockConditionText = (condition?: BadgeData['unlockCondition']) => {
    if (!condition) return 'Условие не указано';
    
    switch (condition.type) {
      case 'quest_completed':
        return `Завершите квест: ${condition.questId}`;
      case 'profile_completed':
        return 'Заполните профиль полностью';
      case 'qr_scanned':
        return `Отсканируйте ${condition.scans} QR-кодов`;
      case 'xp_level':
        return `Достигните ${condition.level} уровня`;
      default:
        return 'Условие не указано';
    }
  };

  const convertBadgeDataToBadge = (badge: BadgeData) => ({
    id: badge.id,
    title: badge.title,
    tooltip: badge.tooltip,
    howToEarn: badge.unlockCondition ? getUnlockConditionText(badge.unlockCondition) : 'Условие не указано'
  });

  const handleBadgeClick = (badge: BadgeData) => {
    setSelectedBadge(badge);
    onBadgeClick?.(badge);
  };

  const earnedBadges = allBadges.filter(badge => isBadgeUnlocked(badge.id));
  const lockedBadges = allBadges.filter(badge => !isBadgeUnlocked(badge.id));

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Stats */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Мои бейджи</h3>
        <Badge variant="secondary" className="text-sm">
          {earnedBadges.length}/{allBadges.length}
        </Badge>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Полученные</h4>
          <div className="grid grid-cols-3 gap-2">
            {earnedBadges.map((badge) => {
              const BadgeIcon = getBadgeIcon(badge.id);
              return (
                <Card
                  key={badge.id}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 text-center relative group hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => handleBadgeClick(badge)}
                >
                  <CardContent className="p-2">
                    <div className="relative">
                      <BadgeIcon className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    </div>
                    <div className="absolute top-1 right-1">
                      <BadgeInfoTooltip badge={convertBadgeDataToBadge(badge)} isEarned={true} />
                    </div>
                    <h4 className="font-medium text-gray-900 text-xs leading-tight">{badge.title}</h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-1">{badge.tooltip}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Заблокированные</h4>
          <div className="grid grid-cols-3 gap-2">
            {lockedBadges.map((badge) => {
              const BadgeIcon = getBadgeIcon(badge.id);
              return (
                <Card
                  key={badge.id}
                  className="bg-gray-100 border-2 border-gray-200 text-center relative group hover:shadow-md transition-all duration-200 cursor-pointer opacity-75"
                  onClick={() => handleBadgeClick(badge)}
                >
                  <CardContent className="p-2">
                    <div className="relative">
                      <BadgeIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    </div>
                    <div className="absolute top-1 right-1">
                      <BadgeInfoTooltip badge={convertBadgeDataToBadge(badge)} isEarned={false} />
                    </div>
                    <h4 className="font-medium text-gray-500 text-xs leading-tight">{badge.title}</h4>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{badge.tooltip}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      Заблокировано
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm bg-white shadow-2xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{selectedBadge.title}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedBadge(null)}
                  className="w-8 h-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            
              <div className="text-center mb-3">
                {(() => {
                  const BadgeIcon = getBadgeIcon(selectedBadge.id);
                  return (
                    <BadgeIcon className={`w-12 h-12 mx-auto mb-2 ${
                      isBadgeUnlocked(selectedBadge.id) ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                  );
                })()}
              </div>

              <p className="text-gray-700 mb-3 text-center text-sm">{selectedBadge.tooltip}</p>

              {!isBadgeUnlocked(selectedBadge.id) && selectedBadge.unlockCondition && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                  <h4 className="font-medium text-yellow-800 mb-1 text-sm">Как получить:</h4>
                  <p className="text-yellow-700 text-xs">
                    {getUnlockConditionText(selectedBadge.unlockCondition)}
                  </p>
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedBadge(null)}
                  className="flex-1 text-sm"
                >
                  Закрыть
                </Button>
                {!isBadgeUnlocked(selectedBadge.id) && (
                  <Button
                    onClick={() => {
                      setShowUnlockModal(true);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    Как выполнить
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Unlock Instructions Modal */}
      {showUnlockModal && selectedBadge && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm bg-white shadow-2xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Как получить ачивку</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowUnlockModal(false)}
                  className="w-8 h-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="text-center mb-3">
                {(() => {
                  const BadgeIcon = getBadgeIcon(selectedBadge.id);
                  return (
                    <BadgeIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  );
                })()}
                <h4 className="font-medium text-gray-900 text-sm">{selectedBadge.title}</h4>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <h4 className="font-medium text-blue-800 mb-2 text-sm">Инструкция:</h4>
                <p className="text-blue-700 text-sm">
                  {selectedBadge.unlockCondition ? 
                    getUnlockConditionText(selectedBadge.unlockCondition) : 
                    'Условие не указано'
                  }
                </p>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowUnlockModal(false)}
                  className="flex-1 text-sm"
                >
                  Понятно
                </Button>
                <Button
                  onClick={() => {
                    // TODO: Navigate to quest or action
                    console.log('Navigate to unlock action for:', selectedBadge.id);
                    setShowUnlockModal(false);
                    setSelectedBadge(null);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  Выполнить
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
