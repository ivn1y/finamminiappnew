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
import { BadgeModal, TelegramChannelBlock } from '@/shared/ui';
import Image from 'next/image';
import { HomeTour } from '@/features/app-tour';
import { useSubscriptionCheck } from '@/features/telegram-subscription-check';

const TaskButton = React.forwardRef<HTMLDivElement, {
  href?: string;
  text: string;
  completed: boolean;
  onClick?: () => void;
}>(({ href, text, completed, onClick }, ref) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      e.stopPropagation();
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
      achieved ? 'p-[1px]' : ''
    }`}
    onClick={onClick}
  >
    {achieved && (
      <div 
        className="absolute inset-0 rounded-[8px] p-[1px]"
        style={{
          background: 'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)'
        }}
      >
        <div className="w-full h-full rounded-[7px] bg-[#1A1A1F]"></div>
      </div>
    )}
    <div className={`absolute top-[15px] left-1/2 -translate-x-1/2 ${achieved ? 'z-10' : ''}`}>
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
        achieved ? 'text-white z-10' : 'text-[#6F6F7C]'
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

  // Проверка подписки на Telegram канал
  // Автоматически проверяем каждые 5 секунд, если пользователь еще не подписан
  const { isSubscribed, isLoading: isCheckingSubscription, checkSubscription } = useSubscriptionCheck(
    'finam_collab',
    undefined,
    true, // autoCheck
    telegramQuestCompleted ? 0 : 5000 // проверяем каждые 5 секунд, если квест не выполнен
  );

  const handleProfileTaskClick = () => {
    // Проверяем, выполнено ли задание "Заполни свой профиль"
    const isProfileCompleted = !!user?.credentials?.phone && !!user?.credentials?.email;
    
    // Если профиль уже заполнен, просто переходим на страницу профиля без запуска тура
    if (isProfileCompleted) {
      router.push('/collab/profile');
    } else {
      // Если профиль не заполнен, запускаем тур
      completeHomeTourAndGoToProfile();
      router.push('/collab/profile');
    }
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

  // Автоматически обновляем статус квеста при успешной проверке подписки
  useEffect(() => {
    if (isSubscribed && !telegramQuestCompleted) {
      completeTelegramQuest();
    }
  }, [isSubscribed, telegramQuestCompleted, completeTelegramQuest]);

  const handleTelegramQuestClick = async () => {
    // Открываем канал
    window.open('https://t.me/finam_collab', '_blank');
    
    // Проверяем подписку через небольшую задержку (пользователь должен успеть подписаться)
    setTimeout(async () => {
      await checkSubscription();
    }, 2000);
  };

  const handleTelegramLinkClick = () => {
    // Если уже подписан, просто отмечаем квест как выполненный
    if (isSubscribed) {
      completeTelegramQuest();
    }
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
      completed: !!telegramQuestCompleted || isSubscribed,
      onClick: handleTelegramQuestClick,
    },
  ];

  const completedTasksCount = tasks.filter(task => task.completed).length;
  const progressPercentage = Math.round((completedTasksCount / tasks.length) * 100);

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
      imgSrc: '/assets/badges/researcher.png?v=5',
      grayImgSrc: '/assets/badges-gray/researcher gray.png?v=5',
      title: 'ИССЛЕДОВАТЕЛЬ',
      displayTitle: 'Исследователь',
      achieved: userBadges.includes('researcher'),
      description: 'За активное изучение новых технологий и подходов в трейдинге',
      howToEarn: 'Заполни профиль полностью'
    },
    {
      imgSrc: '/assets/badges/risk-manager.png?v=5',
      grayImgSrc: '/assets/badges-gray/risk-manager gray.png?v=5',
      title: 'МЕНЕДЖЕР РИСКОВ',
      displayTitle: 'Менеджер Рисков',
      achieved: userBadges.includes('risk-manager'),
      description: 'За эффективное управление рисками в торговле',
      howToEarn: 'Вступи в сообщество'
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
      <div className="relative w-[393px]" style={{ height: '1167px' }}>
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
            Ты прошел {completedTasksCount} из {tasks.length} шагов до своей первой коллаборации
          </p>
        </div>

        <div id="tasks-section" className="absolute top-[181px] left-1/2 -translate-x-1/2 flex w-[353px] pt-[12px] pb-[20px] flex-col items-center rounded-[8px] bg-[#151519]">
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
                href={task.onClick ? undefined : task.href}
                text={task.text}
                completed={task.completed}
                onClick={task.onClick}
                ref={task.ref}
              />
            ))}
          </div>
        </div>

        {/* Raffle Block */}
        <div 
          className="absolute top-[510px] left-[20px] right-[20px] flex flex-col justify-center items-start gap-[15px] overflow-hidden rounded-[8px] cursor-pointer bg-[#1A1A1F]"
          style={{
            padding: '26px 22px 26px 165px',
            backgroundImage: 'url(/assets/products/tickets.png?v=2)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'left center',
            backgroundSize: 'cover',
          }}
          onClick={() => window.open('https://finam.ru/landing/mtw', '_blank')}
        >
          <p className="font-inter-tight font-medium text-[20px] text-white leading-[23px] tracking-[-0.32px]">
            Разыгрываем Билет в VIP-зону
          </p>
          <button
            className="inline-flex h-[26px] px-[8px] justify-center items-center rounded-[8px] bg-white font-inter font-medium text-[12px] text-[#1A1A1F] leading-[16px] tracking-[-0.024px] whitespace-nowrap"
            onClick={(e) => {
              e.stopPropagation();
              window.open('https://finam.ru/landing/mtw', '_blank');
            }}
          >
            Узнать подробности
          </button>
        </div>

        <h2 className="absolute top-[685px] left-[20px] font-inter-tight text-[24px] font-normal leading-[110%] tracking-[-0.48px] text-white">
          Мои бейджи
        </h2>
        <div className="absolute top-[727px] left-[20px] grid grid-cols-2 gap-x-[9px] gap-y-[9px]">
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
          className="absolute top-[884px] left-1/2 -translate-x-1/2"
        >
          <TelegramChannelBlock 
            onClick={handleTelegramLinkClick} 
            title="Твой первый квест"
            description="Расскажи о себе в сообществе Финам Коллаб"
          />
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
