'use client';

import React from 'react';
import { TelegramChannelBlock } from '@/shared/ui/telegram-channel-block';

const FinamDiaryLogo = () => (
  <img 
    src="/assets/logos/finamdiary.svg" 
    alt="Финам Дневник" 
    width={153} 
    height={40}
  />
);

interface ProductCardProps {
  backgroundImage: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  buttonText: string;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  backgroundImage,
  title,
  subtitle,
  buttonText,
  onClick,
}) => (
  <div 
    className="h-[180px] rounded-[8px] overflow-hidden relative cursor-pointer"
    onClick={onClick}
  >
    <div 
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    />
    <div 
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(90deg, rgba(13,10,15,0) 0%, rgba(13,10,15,0.3) 45%, rgba(13,10,15,0.7) 70%)',
      }}
    />
    <div className="absolute right-0 top-0 bottom-0 w-[188px] flex flex-col justify-center pr-[20px]">
      <div className="mb-[8px]">{title}</div>
      <p className="font-inter text-[14px] text-[#a4a4b2] leading-[20px] tracking-[-0.224px] mb-[16px]">
        {subtitle}
      </p>
      <button
        className="inline-flex h-[26px] px-[8px] justify-center items-center rounded-[8px] bg-white font-inter font-medium text-[12px] text-[#1A1A1F] leading-[16px] tracking-[-0.024px] whitespace-nowrap self-start"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        {buttonText}
      </button>
    </div>
  </div>
);

export const ProductsPage: React.FC = () => {
  return (
    <div className="w-full bg-black overflow-x-hidden">
      <div className="flex justify-center">
        <div
          className="relative w-[393px] bg-black pb-[120px]"
          style={{ minHeight: '100vh' }}
        >
          {/* Background gradient ellipses */}
          <div
            className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[942px] h-[907px] pointer-events-none opacity-50"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(153, 75, 105, 0.4) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
          <div
            className="absolute top-[100px] left-1/2 -translate-x-1/2 w-[454px] h-[536px] pointer-events-none opacity-30"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(237, 159, 166, 0.5) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />

          {/* Content */}
          <div className="relative px-5">
            {/* Header */}
            <div className="pt-[80px] text-center">
              <h1 className="text-[30px] font-inter-tight text-white leading-[1.1] tracking-[-0.6px]">
                Наши продукты
              </h1>
            </div>

            {/* Product Cards */}
            <div className="mt-[20px] flex flex-col gap-[20px]">
              {/* Finam Diary Card */}
              <ProductCard
                backgroundImage="/assets/products/finamdiarybackground.png"
                title={<FinamDiaryLogo />}
                subtitle={<>Ваш AI-компаньон<br />для трейдинга</>}
                buttonText="Попробовать бесплатно"
                onClick={() => window.open('http://beta.comon.ru/landing?utm_source=miniapp&utm_medium=button&utm_campaign=beta', '_blank')}
              />

              {/* Partner Program Card */}
              <ProductCard
                backgroundImage="/assets/products/partnersbackground.png"
                title={
                  <h3 className="font-inter-tight font-medium text-[20px] text-white leading-[23px] tracking-[-0.32px]">
                    Партнерская программа
                  </h3>
                }
                subtitle={<>Для финтех блогеров<br />от Финам</>}
                buttonText="Узнать условия"
                onClick={() => window.open('https://www.finam.ru/landings/finamx/', '_blank')}
              />

              {/* Prediction Market Card */}
              <ProductCard
                backgroundImage="/assets/products/prediction-bg.png"
                title={
                  <h3 className="font-inter-tight font-medium text-[20px] text-white leading-[23px] tracking-[-0.32px]">
                    Prediction Market
                  </h3>
                }
                subtitle={<>Зарабатывай<br />на прогнозировании<br />событий</>}
                buttonText="Выбрать исход"
                onClick={() => window.open('https://t.me/predictmarket_bot', '_blank')}
              />
            </div>

            {/* Telegram Channel Block */}
            <div className="mt-[20px]">
              <TelegramChannelBlock />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



