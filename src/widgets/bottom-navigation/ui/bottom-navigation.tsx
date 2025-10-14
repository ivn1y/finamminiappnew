'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/shared/store/app-store';

interface BottomNavigationProps {
  activeTab: string;
  isBlocked?: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, isBlocked = false }) => {
  const { setQRScanner } = useAppStore();

  const tabs = [
    { id: 'home', label: 'Главная', icon: '/assets/icons/main.png?v=2', href: '/collab/home' },
    { id: 'map', label: 'Карта', icon: '/assets/icons/map.png?v=2', href: '/collab/map' },
    { id: 'products', label: 'Продукты', icon: '/assets/icons/products.png?v=2', href: '/collab/products' },
    { id: 'chat', label: 'Ассистент', icon: '/assets/icons/assistant.png?v=2', href: '/collab/chat' },
    { id: 'profile', label: 'Профиль', icon: '/assets/icons/profile.png?v=2', href: '/collab/profile' }
  ];

  const handleLinkClick = () => {
    setQRScanner(false);
  };

  return (
    <nav 
      className="bottom-navigation fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-2" 
      style={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50
      }}
    >
      <div 
        className="flex w-[353px] h-[69px] justify-center items-center flex-shrink-0 rounded-[12px] bg-[#0D0512] pt-[2px] px-[12px] pb-[10px]"
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
                className={`flex flex-1 flex-col items-center justify-center text-center transition-colors cursor-not-allowed ${
                  isActive 
                    ? 'text-white' 
                    : 'text-gray-400'
                }`}
              >
                <div className="w-8 h-8 mb-0.5 flex items-center justify-center">
                  <img 
                    src={tab.icon} 
                    alt={tab.label} 
                    className="w-8 h-8 object-contain block"
                  />
                </div>
                <span className="text-[10px] font-normal leading-[14px] text-inherit">
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
              className={`flex flex-1 flex-col items-center justify-center text-center transition-colors ${
                isActive 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="w-8 h-8 mb-0.5 flex items-center justify-center">
                <img 
                  src={tab.icon} 
                  alt={tab.label} 
                  className="w-8 h-8 object-contain block"
                />
              </div>
              <span className="text-[10px] font-normal leading-[14px] text-inherit">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};