'use client';

import React from 'react';
import Image from 'next/image';

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  badge: {
    imgSrc: string;
    grayImgSrc: string;
    title: string;
    achieved: boolean;
    description?: string;
    howToEarn?: string;
  };
}

export const BadgeModal = ({
  isOpen,
  onClose,
  badge
}: BadgeModalProps) => {
  const isTelegramQuestButton = badge.howToEarn?.toLowerCase().includes('telegram') || 
                                badge.howToEarn?.toLowerCase().includes('телеграм') ||
                                badge.howToEarn === 'Выполни Telegram квест' ||
                                badge.howToEarn?.includes('Telegram квест') ||
                                badge.howToEarn?.toLowerCase().includes('сообщество') ||
                                badge.howToEarn === 'Вступи в сообщество';
  
  const isAllTasksButton = badge.howToEarn?.toLowerCase().includes('выполни все задания') ||
                           badge.howToEarn === 'Выполни все задания';
  
  const isActiveButton = isTelegramQuestButton || isAllTasksButton;
  
  const handleHowToEarnClick = () => {
    if (isTelegramQuestButton) {
      onClose();
      window.open('https://t.me/finam_collab', '_blank');
    } else if (isAllTasksButton) {
      onClose();
      setTimeout(() => {
        const tasksSection = document.getElementById('tasks-section');
        if (tasksSection) {
          tasksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      {/* Main modal container */}
      <div 
        className="absolute"
        style={{
          width: '353px',
          height: '426px',
          borderRadius: '10px',
          background: 'var(--icon-base-default, #1A1A1F)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Badge image */}
        <div
          className="absolute"
          style={{
            top: '2px',
            left: '116px',
            width: '120px',
            height: '120px',
            aspectRatio: '1/1'
          }}
        >
          <Image
            src={badge.achieved ? badge.imgSrc : badge.grayImgSrc}
            alt={badge.title}
            width={120}
            height={120}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-[15px] right-[15px] p-[4px] rounded-full hover:bg-gray-700 transition-colors"
        >
          <div className="w-[20px] h-[20px] flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>

        {/* Badge title */}
        <h2
          className="absolute font-inter-tight text-[28px] font-medium leading-[32px] tracking-[-0.504px] text-white text-center"
          style={{
            top: '126px',
            left: '0',
            right: '0',
          }}
        >
          {badge.title}
        </h2>

        {/* Badge description */}
        <p
          className="absolute font-inter text-[17px] font-normal leading-[24px] tracking-[-0.17px] text-[#6F6F7C] text-center"
          style={{
            top: '170px',
            left: '19px',
            right: '18px',
          }}
        >
          {badge.description || 'Описание бейджа'}
        </p>

        {/* How to earn badge block */}
        <div
          className="absolute"
          onClick={isActiveButton ? handleHowToEarnClick : undefined}
          style={{
            top: '238px',
            left: '19px',
            right: '18px',
            display: 'flex',
            padding: '10px 0',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '5px',
            background: '#2F2F37',
            cursor: isActiveButton ? 'pointer' : 'default'
          }}
        >
          <p
            className="font-inter text-[17px] font-medium leading-[24px] tracking-[-0.17px] text-white text-center"
            style={{
              padding: '10px 0',
              margin: 0
            }}
          >
            {badge.howToEarn || 'Как получить этот бейдж'}
          </p>
        </div>

        {/* Done button */}
        <button
          onClick={onClose}
          className="absolute"
          style={{
            top: '350px',
            left: '20px',
            right: '20px',
            display: 'flex',
            padding: '16px 24px',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 'var(--radius-buttonL, 8px)',
            background: 'var(--Marketing-Gradient-BG-01, linear-gradient(305deg, var(--gradients-bg-01-start, #FEDA3B) -2.67%, var(--gradients-bg-01-middle1, #EF5541) 38.9%, var(--gradients-bg-01-middle2, #801FDB) 77.17%, var(--gradients-bg-01-end, #7E2A89) 98.46%))',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <span className="font-inter text-[17px] font-semibold leading-[24px] tracking-[-0.204px] text-white text-center">
            Готово
          </span>
        </button>
      </div>
    </div>
  );
};
