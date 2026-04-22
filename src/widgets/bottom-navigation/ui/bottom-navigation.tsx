'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/shared/store/app-store';

interface BottomNavigationProps {
  activeTab: string;
  isBlocked?: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, isBlocked = false }) => {
  const { setQRScanner, isScheduleModalOpen, showQRScanner, isChatInputFocused } = useAppStore();

  // Скрываем навигацию, если открыто модальное окно расписания, QR-сканер или input в чате в фокусе
  if (isScheduleModalOpen || showQRScanner || isChatInputFocused) {
    return null;
  }

  const tabs = [
    { id: 'home', label: 'Главная', icon: '/assets/icons/main.png', iconGray: '/assets/icons/main_gray.svg', href: '/collab/home' },
    { id: 'competition', label: 'Багбаунти', icon: '/assets/icons/competition.png', iconGray: '/assets/icons/competition_gray.svg', href: '/collab/competition' },
    { id: 'products', label: 'Продукты', icon: '/assets/icons/products.png', iconGray: '/assets/icons/products_gray.svg', href: '/collab/products' },
    { id: 'chat', label: 'Вебинар', icon: '/assets/icons/assistant.png', iconGray: '/assets/icons/assistant_gray.svg', href: '/collab/chat' },
    { id: 'profile', label: 'Профиль', icon: '/assets/icons/profile.png', iconGray: '/assets/icons/profile_gray.svg', href: '/collab/profile' }
  ];

  const handleLinkClick = () => {
    setQRScanner(false);
  };

  return (
    <nav 
      className="bottom-navigation fixed bottom-0 left-0 right-0 z-50 flex justify-center"
    >
      <div 
        className="flex w-[353px] h-[69px] items-center justify-between flex-shrink-0 rounded-[12px] bg-[#0D0512] pt-[2px] px-[12px] pb-[10px]"
        style={{
          opacity: isBlocked ? 0.5 : 1
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.href;
          
          if (isBlocked) {
            return (
              <div
                key={tab.id}
                className={`flex w-[50px] h-[57px] shrink-0 flex-col items-center justify-center text-center transition-colors cursor-not-allowed ${
                  isActive 
                    ? '' 
                    : 'text-gray-400'
                }`}
              >
                <div className="w-[50px] h-[50px] mb-[-5px] flex items-center justify-center relative">
                  <img 
                    src={tab.iconGray} 
                    alt={tab.label} 
                    className="object-contain block w-[22px] h-[22px] absolute transition-all duration-300 ease-in-out"
                    style={{ opacity: isActive ? 0 : 1 }}
                  />
                  <img 
                    src={tab.icon} 
                    alt={tab.label} 
                    className="object-contain block aspect-square absolute transition-all duration-300 ease-in-out"
                    style={{ 
                      opacity: isActive ? 1 : 0,
                      width: isActive ? '46px' : '22px',
                      height: isActive ? '46px' : '22px'
                    }}
                  />
                </div>
                <span 
                  className="text-[7px] font-normal leading-[12px] tracking-[0.112px] uppercase text-center transition-all duration-300 ease-in-out"
                  style={isActive ? {
                    background: 'linear-gradient(90deg, #FDB938 6.62%, #ED6B51 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  } : {}}
                >
                  {tab.label}
                </span>
              </div>
            );
          }
          
          return (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={handleLinkClick}
              className={`flex w-[50px] h-[57px] shrink-0 flex-col items-center justify-center text-center transition-colors ${
                isActive 
                  ? '' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="w-[50px] h-[50px] mb-[-5px] flex items-center justify-center relative">
                <img 
                  src={tab.iconGray} 
                  alt={tab.label} 
                  className="object-contain block w-[22px] h-[22px] absolute transition-all duration-300 ease-in-out"
                  style={{ opacity: isActive ? 0 : 1 }}
                />
                <img 
                  src={tab.icon} 
                  alt={tab.label} 
                  className="object-contain block aspect-square absolute transition-all duration-300 ease-in-out"
                  style={{ 
                    opacity: isActive ? 1 : 0,
                    width: isActive ? '46px' : '22px',
                    height: isActive ? '46px' : '22px'
                  }}
                />
              </div>
              <span 
                className="text-[7px] font-normal leading-[12px] tracking-[0.112px] uppercase text-center transition-all duration-300 ease-in-out"
                style={isActive ? {
                  background: 'linear-gradient(90deg, #FDB938 6.62%, #ED6B51 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                } : {}}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};