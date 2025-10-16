'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/shared/store/app-store';
import { roleContent } from '@/shared/data/seed';
import {
  CheckFilledIcon,
  CheckUnfilledIcon,
  ArrowIcon,
  TelegramIcon,
} from '@/shared/ui/icons';
import { BadgeModal } from '@/shared/ui';
import Image from 'next/image';
import { HomeTour } from '@/features/app-tour';

const TaskButton = React.forwardRef<HTMLDivElement, {
  href?: string;
  text: string;
  completed: boolean;
  onClick?: () => void;
}>(({ href, text, completed, onClick }, ref) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const content = (
    <div
      ref={ref}
      className="relative flex w-[313px] h-[44px] items-center rounded-[4px] bg-[#1F1F25] pl-[10px]"
      onClick={handleClick}
      style={{ cursor: (onClick || href) ? 'pointer' : 'default' }}
    >
      <div className="flex items-center gap-[14px]">
        {completed ? <CheckFilledIcon /> : <CheckUnfilledIcon />}
        <span className="font-inter text-[15px] font-normal leading-[22px] tracking-[-0.09px] text-white">
          {text}
        </span>
      </div>
      <div className="absolute right-[8px] top-1/2 -translate-y-1/2">
        <ArrowIcon />
      </div>
    </div>
  );

  if (href && !onClick) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
});
TaskButton.displayName = 'TaskButton';

const Badge = ({
  imgSrc,
  grayImgSrc,
  title,
  achieved,
  onClick,
}: {
  imgSrc: string;
  grayImgSrc: string;
  title: string;
  achieved: boolean;
  onClick?: () => void;
}) => (
  <div
    className={`relative flex w-[172px] h-[137px] p-[8px_16px] flex-col items-start gap-[10px] rounded-[8px] bg-[#1A1A1F] cursor-pointer ${
      achieved ? 'border border-[#FDB938]' : ''
    }`}
    onClick={onClick}
  >
    <div className="absolute top-[15px] left-1/2 -translate-x-1/2">
      <Image
        src={achieved ? imgSrc : grayImgSrc}
        alt={title}
        width={70}
        height={70}
        className="aspect-square"
      />
    </div>

    <span
      className={`absolute bottom-[19px] left-0 right-0 text-center font-inter text-[14px] font-medium leading-[20px] tracking-[-0.056px] ${
        achieved ? 'text-white' : 'text-[#6F6F7C]'
      }`}
    >
      {title}
    </span>
    {!achieved && (
      <div className="absolute top-[10px] right-[8px]">
        <div className="relative w-[15px] h-[15px]">
          <svg
            xmlns="http://www.w.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
          >
            <circle cx="7.5" cy="7.5" r="7.5" fill="white" />
          </svg>
          <span className="absolute top-[-2px] right-[3px] font-inter text-[14px] font-normal leading-[20px] tracking-[-0.056px] text-[#6F6F7C]">
            ?
          </span>
        </div>
      </div>
    )}
  </div>
);

export const HomePage: React.FC = () => {
  const { user, telegramQuestCompleted, completeTelegramQuest, showAppTour, endAppTour, completeHomeTourAndGoToProfile } = useAppStore();
  const router = useRouter();
  const [selectedBadge, setSelectedBadge] = useState<{
    imgSrc: string;
    grayImgSrc: string;
    title: string;
    achieved: boolean;
    description?: string;
    howToEarn?: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const profileTaskRef = useRef<HTMLDivElement>(null);
  const [highlightedButtonRect, setHighlightedButtonRect] = useState<DOMRect | null>(null);

  const handleProfileTaskClick = () => {
    completeHomeTourAndGoToProfile();
    router.push('/collab/profile');
  };

  useEffect(() => {
    const updateRect = () => {
      if (profileTaskRef.current) {
        setHighlightedButtonRect(profileTaskRef.current.getBoundingClientRect());
      }
    };

    if (showAppTour) {
      // Увеличиваем задержку, чтобы компонент успел отрендериться
      const timer = setTimeout(() => {
        updateRect();
        window.addEventListener('scroll', updateRect, true);
        window.addEventListener('resize', updateRect);
      }, 500); // Увеличиваем с 100ms до 500ms

      return () => {
        clearTimeout(timer);
        window.removeEventListener('scroll', updateRect, true);
        window.removeEventListener('resize', updateRect);
      };
    } else {
      setHighlightedButtonRect(null);
    }
  }, [showAppTour]);

  if (!user || !user.role) return null;

  const role = roleContent.find(r => r.id === user.role);
  if (!role) return null;

  const handleTelegramQuestClick = () => {
    const questElement = document.getElementById('telegram-quest');
    if (questElement) {
      questElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTelegramLinkClick = () => {
    completeTelegramQuest();
    window.open('https://t.me/finam_collab', '_blank');
  };

  // Mock data for progress and badges, will be replaced with real data
  const progress = 25;
  const tasks = [
    {
      text: 'Выбери свою роль',
      completed: !!user.role,
      href: '/collab/profile',
    },
    {
      text: 'Заполни свой профиль',
      completed:
        !!user.credentials?.phone && !!user.credentials?.email,
      ref: profileTaskRef,
      onClick: handleProfileTaskClick,
    },
    {
      text: 'Выполни первый квест',
      completed: !!telegramQuestCompleted,
      onClick: handleTelegramQuestClick,
    },
    {
      text: 'Выполни QR-квест',
      completed: !!(user.scannedZones && user.scannedZones.length > 0),
      href: '/collab/map',
    },
  ];

  const completedTasksCount = tasks.filter(task => task.completed).length;
  const progressPercentage = completedTasksCount * 25;

  const handleBadgeClick = (badge: {
    imgSrc: string;
    grayImgSrc: string;
    title: string;
    displayTitle: string;
    achieved: boolean;
    description?: string;
    howToEarn?: string;
  }) => {
    setSelectedBadge({
      imgSrc: badge.imgSrc,
      grayImgSrc: badge.grayImgSrc,
      title: badge.displayTitle,
      achieved: badge.achieved,
      description: badge.description,
      howToEarn: badge.howToEarn
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBadge(null);
  };

  // Определяем полученные бейджи на основе данных пользователя
  const getUserBadges = () => {
    const userBadges: string[] = [];
    
    // Бейдж "Исследователь" - за заполнение профиля (телефон + email)
    const profileCompleted = !!user.credentials?.phone && !!user.credentials?.email;
    if (profileCompleted) {
      userBadges.push('researcher');
    }
    
    // Бейдж "Market Explorer" - за сканирование QR-кодов
    if (user.scannedZones && user.scannedZones.length > 0) {
      userBadges.push('market-explorer');
    }
    
    // Бейдж "Risk Manager" - за выполнение Telegram квеста
    if (telegramQuestCompleted) {
      userBadges.push('risk-manager');
    }
    
    // Бейдж "Algo Creator" - за выполнение всех заданий
    if (profileCompleted && user.scannedZones && user.scannedZones.length > 0 && telegramQuestCompleted) {
      userBadges.push('algo-creator');
    }
    
    return userBadges;
  };

  const userBadges = getUserBadges();

  const badges = [
    {
      imgSrc: '/assets/badges/researcher.png',
      grayImgSrc: '/assets/badges-gray/researcher gray.png',
      title: 'ИССЛЕДОВАТЕЛЬ',
      displayTitle: 'Исследователь',
      achieved: userBadges.includes('researcher'),
      description: 'За активное изучение новых технологий и подходов в трейдинге',
      howToEarn: 'Заполните профиль полностью'
    },
    {
      imgSrc: '/assets/badges/market-explorer.png',
      grayImgSrc: '/assets/badges-gray/market-explorer gray.png',
      title: 'MARKET EXPLORER',
      displayTitle: 'Market Explorer',
      achieved: userBadges.includes('market-explorer'),
      description: 'За исследование различных рынков и активов',
      howToEarn: 'Отсканируйте QR-код на карте'
    },
    {
      imgSrc: '/assets/badges/risk-manager.png',
      grayImgSrc: '/assets/badges-gray/risk-manager gray.png',
      title: 'RISK MANAGER',
      displayTitle: 'Risk Manager',
      achieved: userBadges.includes('risk-manager'),
      description: 'За эффективное управление рисками в торговле',
      howToEarn: 'Выполните Telegram квест'
    },
    {
      imgSrc: '/assets/badges/algo-creator.png',
      grayImgSrc: '/assets/badges-gray/algo-creator gray.png',
      title: 'ALGO CREATOR',
      displayTitle: 'Algo Creator',
      achieved: userBadges.includes('algo-creator'),
      description: 'За создание собственных торговых алгоритмов',
      howToEarn: 'Выполните все задания'
    },
  ];

  return (
    <div className="w-full bg-black flex justify-center">
      {showAppTour && highlightedButtonRect && (
        <HomeTour
          highlightedElementRect={highlightedButtonRect}
          onComplete={handleProfileTaskClick}
        />
      )}
      <div className="relative w-[393px]" style={{ height: '1193px' }}>
        <div
          className="absolute top-[15px] left-1/2 -translate-x-1/2 w-[390px] h-[281px] rounded-[390px] opacity-50 blur-[80px]"
          style={{
            background:
              'linear-gradient(315deg, #FAF1E6 -0.45%, #F9DEC0 15.8%, #ED9FA6 32.05%, #994B69 48.29%, rgba(51, 22, 86, 0.00) 64.54%)',
          }}
        ></div>

        <div className="absolute top-[80px] w-full">
          <h1 className="text-white text-center font-inter-tight text-[30px] font-normal leading-[110%] tracking-[-0.6px]">
            Привет, {role.title}!
          </h1>
        </div>

        <div className="absolute top-[120px] w-full px-[38.5px]">
          <p className="text-[rgba(255,255,255,0.72)] text-center font-inter text-[17px] font-normal leading-[24px] tracking-[-0.17px]">
            Ты прошел {completedTasksCount} из 4 шагов до своей первой коллаборации
          </p>
        </div>

        <div className="absolute top-[181px] left-1/2 -translate-x-1/2 flex w-[353px] pt-[12px] pb-[20px] flex-col items-center rounded-[8px] bg-[#151519]">
          <h2 className="font-inter-tight text-[24px] font-normal leading-[110%] tracking-[-0.48px] text-white">
            Выполни задания
          </h2>
          <div className="relative w-full px-[20px] mt-[15px]">
            <div className="h-[11px] self-stretch rounded-[9px] bg-[#363636]">
              <div
                className="h-full rounded-[9px] bg-[#A55AFF]"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <p className="mt-[16px] text-white text-center font-inter-tight text-[16px] font-normal leading-[110%] tracking-[-0.32px]">
            Профиль заполнен на {progressPercentage}/100%
          </p>

          <div className="flex flex-col gap-[10px] mt-[30px]">
            {tasks.map((task, index) => (
              <TaskButton
                key={index}
                href={task.href}
                text={task.text}
                completed={task.completed}
                onClick={task.onClick}
                ref={task.ref}
              />
            ))}
          </div>
        </div>

        <h2 className="absolute top-[565px] left-[20px] font-inter-tight text-[24px] font-normal leading-[110%] tracking-[-0.48px] text-white">
          Мои бейджи
        </h2>
        <div className="absolute top-[607px] left-[20px] grid grid-cols-2 gap-x-[9px] gap-y-[9px]">
          {badges.map((badge, index) => (
            <Badge
              key={index}
              imgSrc={badge.imgSrc}
              grayImgSrc={badge.grayImgSrc}
              title={badge.title}
              achieved={badge.achieved}
              onClick={() => handleBadgeClick(badge)}
            />
          ))}
        </div>

        <div
          id="telegram-quest"
          className="absolute top-[910px] left-1/2 -translate-x-1/2 w-[353px] h-[174px] p-[8px_16px_20px_16px] rounded-[8px] bg-[#1A1A1F] flex flex-col items-start"
        >
          <h3 className="mt-[8px] font-inter-tight text-[24px] text-white font-normal leading-[110%] tracking-[-0.48px]">
            Твой первый квест
          </h3>
          <p className="mt-[10px] w-[285px] text-white font-inter text-[14px] font-normal leading-[20px] tracking-[-0.056px]">
            Присоединиться к нашему Telegram коммьюнити
          </p>
          <button
            onClick={handleTelegramLinkClick}
            className="mt-[14px] self-stretch p-[16px_24px] rounded-[8px] bg-[rgba(79,79,89,0.24)] flex justify-center items-center gap-[8px]"
          >
            <span className="text-[#EBEBF2] text-center font-inter text-[17px] font-semibold leading-[24px] tracking-[-0.204px]">
              Перейти
            </span>
          </button>
        </div>
      </div>

      {/* Badge Modal */}
      {selectedBadge && (
        <BadgeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          badge={selectedBadge}
        />
      )}
    </div>
  );
};
