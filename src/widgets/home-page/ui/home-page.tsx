'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/shared/store/app-store';
import { roleContent } from '@/shared/data/seed';
import {
  CheckFilledIcon,
  CheckUnfilledIcon,
  ArrowIcon,
  TelegramIcon,
} from '@/shared/ui/icons';
import Image from 'next/image';

const TaskButton = ({
  href,
  text,
  completed,
  onClick,
}: {
  href?: string;
  text: string;
  completed: boolean;
  onClick?: () => void;
}) => {
  const content = (
    <div
      className="relative flex w-[313px] h-[44px] items-center rounded-[4px] bg-[#1F1F25] pl-[10px]"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
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

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

const Badge = ({
  imgSrc,
  title,
  achieved,
}: {
  imgSrc: string;
  title: string;
  achieved: boolean;
}) => (
  <div
    className={`relative flex w-[172px] h-[137px] p-[8px_16px] flex-col items-start gap-[10px] rounded-[8px] bg-[#1A1A1F] ${
      achieved ? 'border border-[#FDB938]' : ''
    }`}
  >
    <div className="absolute top-[15px] left-1/2 -translate-x-1/2">
      <Image
        src={imgSrc}
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
  const { user, telegramQuestCompleted, completeTelegramQuest } = useAppStore();

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
    window.open('https://t.me/finam_invest', '_blank');
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
      href: '/collab/profile',
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

  const badges = [
    {
      imgSrc: '/assets/badges/researcher.png',
      title: 'ИССЛЕДОВАТЕЛЬ',
      achieved: true,
    },
    {
      imgSrc: '/assets/badges/market-explorer.png',
      title: 'MARKET EXPLORER',
      achieved: true,
    },
    {
      imgSrc: '/assets/badges/risk-manager.png',
      title: 'RISK MANAGER',
      achieved: false,
    },
    {
      imgSrc: '/assets/badges/algo-creator.png',
      title: 'ALGO CREATOR',
      achieved: false,
    },
  ];

  return (
    <div className="w-full bg-black flex justify-center">
      <div className="relative w-[393px] h-[1279px] overflow-hidden">
        <div
          className="absolute top-[75px] left-1/2 -translate-x-1/2 w-[390px] h-[281px] rounded-[390px] opacity-50 blur-[80px]"
          style={{
            background:
              'linear-gradient(315deg, #FAF1E6 -0.45%, #F9DEC0 15.8%, #ED9FA6 32.05%, #994B69 48.29%, rgba(51, 22, 86, 0.00) 64.54%)',
          }}
        ></div>

        <div className="absolute top-[140px] w-full">
          <h1 className="text-white text-center font-inter-tight text-[30px] font-normal leading-[110%] tracking-[-0.6px]">
            Привет, {role.title}!
          </h1>
        </div>

        <div className="absolute top-[180px] w-full px-[38.5px]">
          <p className="text-[rgba(255,255,255,0.72)] text-center font-inter text-[17px] font-normal leading-[24px] tracking-[-0.17px]">
            Ты прошел {completedTasksCount} из 4 шагов до своей первой коллаборации
          </p>
        </div>

        <div className="absolute top-[241px] left-1/2 -translate-x-1/2 flex w-[353px] pt-[12px] pb-[20px] flex-col items-center rounded-[8px] bg-[#151519]">
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
              />
            ))}
          </div>
        </div>

        <h2 className="absolute top-[625px] left-[20px] font-inter-tight text-[24px] font-normal leading-[110%] tracking-[-0.48px] text-white">
          Мои бейджи
        </h2>
        <div className="absolute top-[667px] left-[20px] grid grid-cols-2 gap-x-[9px] gap-y-[9px]">
          {badges.map((badge, index) => (
            <Badge
              key={index}
              imgSrc={badge.imgSrc}
              title={badge.title}
              achieved={badge.achieved}
            />
          ))}
        </div>

        <div
          id="telegram-quest"
          className="absolute top-[970px] left-1/2 -translate-x-1/2 w-[353px] h-[174px] p-[8px_16px_20px_16px] rounded-[8px] bg-[#1A1A1F] flex flex-col items-start"
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
            <TelegramIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
