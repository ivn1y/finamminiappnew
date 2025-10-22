'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/shared/store/app-store';

interface BottomNavigationProps {
  activeTab: string;
  isBlocked?: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, isBlocked = false }) => {
  const { setQRScanner, isScheduleModalOpen } = useAppStore();

  // Скрываем навигацию, если открыто модальное окно расписания
  if (isScheduleModalOpen) {
    return null;
  }

  const tabs = [
    { id: 'home', label: 'Главная', icon: '/assets/icons/main.png?v=3', href: '/collab/home' },
    { id: 'map', label: 'Карта', icon: '/assets/icons/map.png?v=3', href: '/collab/map' },
    { id: 'products', label: 'Продукты', icon: '/assets/icons/products.png?v=3', href: '/collab/products' },
    { id: 'chat', label: 'Ассистент', icon: '/assets/icons/assistant.png?v=3', href: '/collab/chat' },
    { id: 'profile', label: 'Профиль', icon: '/assets/icons/profile.png?v=3', href: '/collab/profile' }
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
                <div className="w-[50px] h-[50px] mb-[-5px] flex items-center justify-center">
                  <img 
                    src={tab.icon} 
                    alt={tab.label} 
                    className="w-[80%] h-[80%] object-contain block"
                  />
                </div>
                <span className={`text-[9px] font-normal leading-[12px] ${isActive ? 'text-gradient' : 'text-inherit'}`}>
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
              <div className="w-[50px] h-[50px] mb-[-5px] flex items-center justify-center">
                <img 
                  src={tab.icon} 
                  alt={tab.label} 
                  className="w-[80%] h-[80%] object-contain block"
                />
              </div>
              <span className={`text-[9px] font-normal leading-[12px] ${isActive ? 'text-gradient' : 'text-inherit'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};