'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UserRole } from '@/shared/types/app';
import { roleContent } from '@/shared/data/seed';
import { Target, Users, Building2, Lightbulb, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';

const roleIcons = {
  trader: Target,
  startup: Lightbulb,
  expert: Users,
  partner: Building2,
  guest: User
};

interface RoleCarouselProps {
  selectedRole: UserRole | null;
  onRoleSelect: (role: UserRole) => void;
  className?: string;
}

export const RoleCarousel: React.FC<RoleCarouselProps> = ({
  selectedRole,
  onRoleSelect,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Находим индекс выбранной роли
  useEffect(() => {
    if (selectedRole) {
      const roleIndex = roleContent.findIndex(role => role.id === selectedRole);
      if (roleIndex !== -1) {
        setCurrentIndex(roleIndex);
      }
    }
  }, [selectedRole]);

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => (prev === 0 ? roleContent.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => (prev === roleContent.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleRoleClick = (role: UserRole) => {
    onRoleSelect(role);
  };

  // Touch handlers для свайпов
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
  };

  const getVisibleRoles = () => {
    const roles = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + roleContent.length) % roleContent.length;
      roles.push({
        ...roleContent[index],
        position: i,
        isActive: i === 0
      });
    }
    return roles;
  };

  const visibleRoles = getVisibleRoles();

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Кто ты?</h1>
        <p className="text-gray-600">Выбери свою роль в экосистеме</p>
      </div>

      {/* Carousel Container */}
      <div 
        className="relative h-80 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          ref={carouselRef}
          className="relative h-full flex items-center justify-center"
        >
          {visibleRoles.map((role, index) => {
            const IconComponent = roleIcons[role.id];
            const isSelected = selectedRole === role.id;
            
            // Определяем стили в зависимости от позиции
            let cardStyles = '';
            let iconStyles = '';
            let textStyles = '';
            
            if (role.position === -1) {
              // Левая карточка (предыдущая)
              cardStyles = 'opacity-40 scale-75 transform -translate-x-16';
              iconStyles = 'w-8 h-8';
              textStyles = 'text-sm';
            } else if (role.position === 0) {
              // Центральная карточка (активная)
              cardStyles = 'opacity-100 scale-100 z-10';
              iconStyles = 'w-12 h-12';
              textStyles = 'text-base';
            } else if (role.position === 1) {
              // Правая карточка (следующая)
              cardStyles = 'opacity-40 scale-75 transform translate-x-16';
              iconStyles = 'w-8 h-8';
              textStyles = 'text-sm';
            }

            return (
              <div
                key={`${role.id}-${role.position}`}
                className={`absolute transition-all duration-500 ease-out cursor-pointer ${cardStyles}`}
                onClick={() => handleRoleClick(role.id)}
                style={{
                  transform: `translateX(${role.position * 200}px) scale(${role.position === 0 ? 1 : 0.8})`,
                  zIndex: role.position === 0 ? 10 : 5,
                  filter: role.position === 0 ? 'none' : 'blur(1px)'
                }}
              >
                <div
                  className={`bg-white rounded-xl p-6 shadow-lg border-2 transition-all duration-300 ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-blue-200' 
                      : 'border-transparent hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className={`bg-blue-100 rounded-lg flex items-center justify-center transition-all duration-300 ${iconStyles}`}>
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-center">
                      <h3 className={`font-semibold text-gray-900 transition-all duration-300 ${textStyles}`}>
                        {role.title}
                      </h3>
                      <p className={`text-blue-600 font-medium transition-all duration-300 ${textStyles}`}>
                        {role.subtitle}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center space-x-4 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          disabled={isTransitioning}
          className="w-12 h-12 rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        
        {/* Dots Indicator */}
        <div className="flex space-x-2">
          {roleContent.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setCurrentIndex(index);
                setTimeout(() => setIsTransitioning(false), 300);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-blue-500 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={isTransitioning}
          className="w-12 h-12 rounded-full"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Selected Role Info */}
      {selectedRole && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-center">
            <p className="text-sm text-blue-800">
              Выбрана роль: <span className="font-semibold">
                {roleContent.find(r => r.id === selectedRole)?.title}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Mobile Swipe Hint */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 md:hidden">
          Свайпните влево или вправо для переключения ролей
        </p>
      </div>
    </div>
  );
};
