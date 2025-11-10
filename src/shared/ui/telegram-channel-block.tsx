'use client';

import React from 'react';

interface TelegramChannelBlockProps {
  className?: string;
  onClick?: () => void;
  title?: string;
  description?: string;
}

export const TelegramChannelBlock: React.FC<TelegramChannelBlockProps> = ({
  className = '',
  onClick,
  title = 'Telegram канал',
  description = 'Присоединиться к нашему Telegram комьюнити'
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.open('https://t.me/finam_collab', '_blank');
    }
  };

  return (
    <div
      className={`relative w-[353px] h-[174px] rounded-[8px] bg-[#1A1A1F] ${className}`}
    >
      <h3 className="absolute top-[16px] left-[16px] right-[140px] font-inter-tight text-[24px] text-white font-normal leading-[110%] tracking-[-0.48px]">
        {title}
      </h3>
      <p className="absolute top-[50px] left-[16px] right-[52px] text-white font-inter text-[14px] font-normal leading-[20px] tracking-[-0.056px]">
        {description}
      </p>
      <button
        onClick={handleClick}
        className="absolute bottom-[20px] left-[16px] right-[16px] p-[16px_24px] rounded-[8px] bg-[rgba(79,79,89,0.24)] flex justify-center items-center gap-[8px] hover:bg-[rgba(79,79,89,0.4)] transition-colors"
      >
        <span className="text-[#EBEBF2] text-center font-inter text-[17px] font-semibold leading-[24px] tracking-[-0.204px]">
          Перейти
        </span>
      </button>
    </div>
  );
};

