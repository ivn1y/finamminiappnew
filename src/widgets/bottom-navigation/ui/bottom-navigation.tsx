'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import './bottom-navigation.css';

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();

  const tabs = [
    { id: 'home', label: 'Главная', icon: '/assets/icons/main.png', href: '/collab/home' },
    { id: 'map', label: 'Карта', icon: '/assets/icons/map.png', href: '/collab/map' },
    { id: 'schedule', label: 'Расписание', icon: '/assets/icons/schedule.png', href: '/collab/schedule' },
    { id: 'chat', label: 'Ассистент', icon: '/assets/icons/assistant.png', href: '/collab/chat' },
    { id: 'profile', label: 'Профиль', icon: '/assets/icons/profile.png', href: '/collab/profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-2">
      <div className="bottom-nav-container">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 text-center transition-colors ${
                isActive 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="icon-container">
                <Image 
                  src={tab.icon} 
                  alt={tab.label} 
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <span className="nav-item-label">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
