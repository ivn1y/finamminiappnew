'use client';

import React from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { MessageCircle, User } from 'lucide-react';

export const CuratorContacts: React.FC = () => {
  const handleTelegramClick = () => {
    // Открываем Telegram в новом окне
    window.open('https://t.me/timisworking', '_blank');
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Контакты твоего куратора
            </h3>
            <p className="text-xs text-gray-600 mb-2">
              Твой куратор - Тимур Солдатенков, Project Manager в ФГ "Финам" с ним можно связаться по юзернейму{' '}
              <a 
                href="https://t.me/timisworking" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline font-medium"
              >
                @timisworking
              </a>
            </p>
            
            <Button
              onClick={handleTelegramClick}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-auto"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              Написать в Telegram
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
