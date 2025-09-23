'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, MessageCircle, User, Calendar } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();

  const tabs = [
    { id: 'home', label: 'Главная', icon: Home, href: '/collab/home' },
    { id: 'map', label: 'Карта', icon: Map, href: '/collab/map' },
    { id: 'schedule', label: 'Расписание', icon: Calendar, href: '/collab/schedule' },
    { id: 'chat', label: 'AI-Ассистент', icon: MessageCircle, href: '/collab/chat' },
    { id: 'profile', label: 'Я', icon: User, href: '/collab/profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = pathname === tab.href;
          
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <IconComponent className={`w-5 h-5 mb-1 ${isActive ? 'text-blue-600' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-blue-600' : ''}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
