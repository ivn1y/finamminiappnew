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
import { CuratorContacts } from '@/features/curator-contacts';
import { User } from '@/shared/types/app';
import Image from 'next/image';
import { ProfileTour } from '@/features/app-tour';
import { useRouter } from 'next/navigation';


const FirstQuest = () => {
  const handleTelegramClick = () => {
    window.open('https://t.me/finam_invest', '_blank');
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '354px',
        height: '174px',
        padding: '16px 20px 20px 20px',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '16px',
        borderRadius: '8px',
        background: '#1A1A1F',
      }}
    >
      <h3
        style={{
          color: '#FFF',
          fontFamily: '"Inter Tight", sans-serif',
          fontSize: '24px',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '110%',
          letterSpacing: '-0.48px',
          margin: 0,
        }}
      >
        Твой первый квест
      </h3>
      <p
        style={{
          width: '329px',
          color: '#FFF',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '20px',
          letterSpacing: '-0.056px',
          margin: 0,
        }}
      >
        Присоединиться к нашему Telegram коммьюнити
      </p>
      <button
        onClick={handleTelegramClick}
        style={{
          display: 'flex',
          width: '321px',
          padding: '16px 24px',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '8px',
          background: 'rgba(79, 79, 89, 0.24)',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              color: '#EBEBF2',
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif',
              fontSize: '17px',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: '24px',
              letterSpacing: '-0.204px',
            }}
          >
            Перейти
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
            <path d="M10.5 20C16.0228 20 20.5 15.5228 20.5 10C20.5 4.47715 16.0228 0 10.5 0C4.97715 0 0.5 4.47715 0.5 10C0.5 15.5228 4.97715 20 10.5 20Z" fill="url(#paint0_linear_telegram_icon_quest)"/>
            <defs>
              <linearGradient id="paint0_linear_telegram_icon_quest" x1="10.5" y1="0" x2="10.5" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2AABEE"/>
                <stop offset="1" stopColor="#229ED9"/>
              </linearGradient>
            </defs>
            <g transform="translate(4.5, 5)">
              <path fillRule="evenodd" clipRule="evenodd" d="M1.02651 3.89397C3.94171 2.62387 5.88563 1.78653 6.85828 1.38197C9.63539 0.22688 10.2124 0.0262276 10.5886 0.0196019C10.6713 0.0181447 10.8563 0.0386461 10.9761 0.135865C11.0772 0.217955 11.1051 0.328847 11.1184 0.406678C11.1317 0.484508 11.1483 0.661808 11.1351 0.800345C10.9846 2.38158 10.3334 6.21883 10.0022 7.98984C9.86198 8.73922 9.58596 8.99048 9.31875 9.01507C8.73803 9.06851 8.29706 8.63129 7.73461 8.2626C6.85448 7.68566 6.35726 7.32652 5.50294 6.76353C4.51563 6.11291 5.15566 5.75531 5.71833 5.1709C5.86558 5.01796 8.42424 2.69066 8.47376 2.47954C8.47996 2.45313 8.4857 2.35471 8.42723 2.30274C8.36876 2.25077 8.28246 2.26854 8.22019 2.28268C8.13191 2.30271 6.72589 3.23204 4.00213 5.07066C3.60303 5.3447 3.24155 5.47823 2.91767 5.47123C2.56062 5.46352 1.87379 5.26935 1.36321 5.10338C0.736959 4.89981 0.239227 4.79218 0.282569 4.44646C0.305143 4.26638 0.553123 4.08222 1.02651 3.89397Z" fill="white"/>
            </g>
          </svg>
        </div>
      </button>
    </div>
  );
};

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

  const roleImageMapping: Record<string, string> = {
    trader: '/assets/roles/trader.png',
    startup: '/assets/roles/startaper.png',
    partner: '/assets/roles/partner.png',
    guest: '/assets/roles/guest.jpg',
    expert: '/assets/roles/expert.png',
  };

  const roleImage = roleImageMapping[user.role] || '/assets/avatars/characters/placeholder.svg';

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
    <div className="min-h-screen bg-black flex justify-center items-start">
      {showProfileTour && highlightedRect && (
        <ProfileTour
            highlightedElementRect={highlightedRect}
            onComplete={endProfileTour}
        />
      )}
      <div className="relative" style={{ width: '393px', height: '1335px' }}>
        {/* Avatar */}
        <div
          style={{
            position: 'absolute',
            top: '115px',
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
            src={roleImage}
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
            top: '98.41px',
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
            top: '321px',
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
            top: '354px',
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
            top: '418px',
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
            top: '758px',
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
            top: '980px',
            left: '20px',
            right: '20px',
          }}
        >
          <FirstQuest />
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
