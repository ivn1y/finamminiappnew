'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/shared/store/app-store';
import { roleContent, eventData } from '@/shared/data/seed';
import { 
  User as UserIcon, 
  Award, 
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
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { ProfileEditModal } from '@/features/profile-edit';
import { AvatarView, AvatarCustomizationModal } from '@/features/avatar-customization';
import { BadgesGrid } from '@/features/badges-grid';
import { CredentialsCollectionForm } from '@/features/credentials-collection';
import { useProfile } from '@/shared/hooks/use-profile';
import { useProfileAnalytics } from '@/shared/hooks/use-profile-analytics';
import { BadgeInfoTooltip } from '@/shared/ui/badge-info-tooltip';
import { LevelProgressCircle } from '@/shared/ui/level-progress-circle';
import { XPTooltip } from '@/shared/ui/xp-tooltip';
import { TelegramCommunityCTA } from '@/shared/ui/telegram-community-cta';
import { TelegramChannelBlock } from '@/shared/ui/telegram-channel-block';
import { CuratorContacts } from '@/features/curator-contacts';
import { User } from '@/shared/types/app';
import Image from 'next/image';
import { ProfileTour } from '@/features/app-tour';
import { useRouter } from 'next/navigation';

export const ProfilePage: React.FC = () => {
  const { user, getAllBadges, getProgressPercentage, showProfileTour, endProfileTour, startMapTour, openUserDataInputModal } = useAppStore();
  const { syncWithApi, isLoading: isProfileLoading } = useProfile();
  const { 
    updateProfile, 
    updateAvatar, 
    trackBadgeClick, 
    trackScreenView, 
    trackShareProfile 
  } = useProfileAnalytics();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAdvancedEdit, setShowAdvancedEdit] = useState(false);
  const [showAvatarCustomization, setShowAvatarCustomization] = useState(false);
  const credentialsFormRef = React.useRef<HTMLDivElement>(null);
  const [highlightedRect, setHighlightedRect] = useState<DOMRect | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const updateRect = () => {
      if (credentialsFormRef.current) {
        setHighlightedRect(credentialsFormRef.current.getBoundingClientRect());
      }
    };

    if (showProfileTour) {
      const timer = setTimeout(() => {
        updateRect();
        window.addEventListener('scroll', updateRect, true);
        window.addEventListener('resize', updateRect);
      }, 100);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('scroll', updateRect, true);
        window.removeEventListener('resize', updateRect);
      };
    } else {
      setHighlightedRect(null);
    }
  }, [showProfileTour]);

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
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
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
      case 'trader': return UserIcon;
      case 'startup': return Lightbulb;
      case 'expert': return Users;
      case 'partner': return Building2;
      default: return UserIcon;
    }
  };

  const getBadgeIcon = (badgeId: string) => {
    switch (badgeId) {
      case 'qr_scanner_badge': return Award; // QR-сканер
      case 'explorer': return Star;
      case 'risk': return Shield;
      case 'algo': return Zap;
      case 'pilot': return Award;
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
    name: user?.name || ''
  });

  // Обновляем editData при изменении пользователя
  React.useEffect(() => {
    setEditData({
      name: user?.name || ''
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

  const handleCredentialsSave = (credentials: { name?: string; phone?: string; email?: string }) => {
    const updatedUser = {
      ...user,
      name: credentials.name || user.name,
      credentials: {
        ...user.credentials,
        phone: credentials.phone || user.credentials?.phone,
        email: credentials.email || user.credentials?.email,
      }
    };
    useAppStore.getState().setUser(updatedUser);

    if (
      showProfileTour &&
      updatedUser.name &&
      updatedUser.credentials?.phone &&
      updatedUser.credentials?.email
    ) {
      endProfileTour();
      startMapTour();
      router.push('/collab/map');
    }
  };


  const RoleIcon = getRoleIcon(user.role!);

  // Track screen view on mount
  React.useEffect(() => {
    trackScreenView('me');
  }, [trackScreenView]);

  return (
    <div className="w-full bg-black flex justify-center overflow-x-hidden">
      {showProfileTour && highlightedRect && (
        <ProfileTour
            highlightedElementRect={highlightedRect}
            onComplete={endProfileTour}
        />
      )}
      <div className="relative" style={{ width: '393px', height: '1203px' }}>
        {/* Avatar */}
        <div
          style={{
            position: 'absolute',
            top: '55px',
            left: '126.8px',
            width: '139px',
            height: '184px',
            borderRadius: '8px',
            border: '1px solid #CD81FF',
            overflow: 'hidden', // to ensure the Image respects the border radius
            background: 'lightgray',
          }}
        >
          <Image
            src={role.image}
            alt={role.title}
            width={139}
            height={184}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Level Indicator */}
        <div
          style={{
            position: 'absolute',
            top: '38.41px',
            left: '243.21px',
            width: '42.188px',
            height: '42.188px',
          }}
          className="flex items-center justify-center"
        >
            <LevelProgressCircle
                level={Math.floor(user.xp / 100) + 1}
                progress={getProgressPercentage()}
            />
          </div>
          
        {/* Role Name */}
        <div
          style={{
            position: 'absolute',
            top: '261px',
            left: '27.8px',
            right: '29.2px',
            textAlign: 'center',
            color: '#FFF',
            fontFamily: '"Inter Tight", sans-serif',
            fontSize: '30px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '110%',
            letterSpacing: '-0.6px',
          }}
        >
            {user.name || role.title}
        </div>

        {/* Role Description */}
        <div
          style={{
            position: 'absolute',
            top: '294px',
            left: '27.8px',
            right: '29.2px',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.72)',
            fontFamily: '"Inter", sans-serif',
            fontSize: '17px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '24px',
            letterSpacing: '-0.17px',
          }}
        >
          {role.subtitle}
              </div>

        {/* User Credentials Section */}
        <div
          ref={credentialsFormRef}
          style={{
            position: 'absolute',
            top: '358px',
            left: '20px',
            right: '20px',
          }}
        >
          <CredentialsCollectionForm user={user} role={role} onSave={handleCredentialsSave} />
              </div>

        {/* Curator Contacts Section */}
        <div
          style={{
            position: 'absolute',
            top: '698px',
            left: '20px',
            right: '20px',
          }}
        >
          <CuratorContacts />
              </div>
              
        {/* First Quest Section */}
        <div
          style={{
            position: 'absolute',
            top: '920px',
            left: '20px',
            right: '20px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <TelegramChannelBlock />
            </div>
            
        {/* Modals */}
        <ProfileEditModal
          isOpen={showAdvancedEdit}
          onClose={() => setShowAdvancedEdit(false)}
          user={user}
          onSave={handleProfileSaved}
        />
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
