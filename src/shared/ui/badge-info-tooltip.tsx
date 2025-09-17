'use client';

import React, { useState } from 'react';
import { Badge } from '@/shared/types/app';
import { HelpCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Button } from './button';

interface BadgeInfoTooltipProps {
  badge: Badge;
  isEarned: boolean;
}

export const BadgeInfoTooltip: React.FC<BadgeInfoTooltipProps> = ({
  badge,
  isEarned
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 hover:bg-blue-200 active:bg-blue-300 transition-colors">
          <HelpCircle className="w-4 h-4 text-blue-600" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {isEarned ? '🎉 Получен!' : '❓ Как получить?'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              {badge.title}
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              {badge.tooltip}
            </p>
            <div className="border-t pt-3">
              <p className="text-sm font-medium text-gray-700 mb-1">
                {isEarned ? 'Условие получения:' : 'Как получить:'}
              </p>
              <p className="text-sm text-gray-600">
                {badge.howToEarn}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={() => setIsOpen(false)}
              variant="outline"
              size="sm"
            >
              Понятно
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
