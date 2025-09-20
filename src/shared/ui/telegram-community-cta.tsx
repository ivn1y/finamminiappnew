'use client';

import React from 'react';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';

interface TelegramCommunityCTAProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export const TelegramCommunityCTA: React.FC<TelegramCommunityCTAProps> = ({
  className = '',
  variant = 'default'
}) => {
  const handleJoinCommunity = () => {
    window.open('https://t.me/finam_invest', '_blank');
  };

  if (variant === 'compact') {
    return (
      <div className={`${className}`}>
        <Button
          onClick={handleJoinCommunity}
          variant="outline"
          className="w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Вступай в сообщество Collab</span>
          <ExternalLink className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">
              Вступай в сообщество Collab
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Присоединяйся к нашему Telegram сообществу для обсуждений и новостей
            </p>
          </div>
          <Button
            onClick={handleJoinCommunity}
            size="sm"
            className="flex-shrink-0"
          >
            Присоединиться
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
