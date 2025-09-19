'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/lib/utils';

interface XPTooltipProps {
  children: React.ReactNode;
  currentXP: number;
  className?: string;
}

export const XPTooltip: React.FC<XPTooltipProps> = ({
  children,
  currentXP,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const currentLevel = Math.floor(currentXP / 100) + 1;
  const xpForNextLevel = currentLevel * 100;
  const xpNeeded = xpForNextLevel - currentXP;
  const progressToNext = ((currentXP % 100) / 100) * 100;

  return (
    <div 
      className={cn('relative', className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {/* Tooltip */}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg border border-gray-700 min-w-[200px]">
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
            </div>
            
            {/* Content */}
            <div className="space-y-2">
              <div className="text-center">
                <div className="text-sm font-semibold text-blue-400">
                  Уровень {currentLevel}
                </div>
                <div className="text-xs text-gray-300">
                  {currentXP} / {xpForNextLevel} XP
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressToNext}%` }}
                />
              </div>
              
              <div className="text-center text-xs text-gray-300">
                До следующего уровня: <span className="text-blue-400 font-semibold">{xpNeeded} XP</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
