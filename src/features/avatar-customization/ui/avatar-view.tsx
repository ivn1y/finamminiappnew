'use client';

import React, { useState } from 'react';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Edit3, Target, Users, Building2, Lightbulb } from 'lucide-react';
import { User } from '@/shared/types/app';
import { getCharacterAsset, getFrameAsset, getAccessoryAsset } from '@/shared/lib/avatar-assets';

interface AvatarViewProps {
  user: User;
  onCustomize: () => void;
  className?: string;
}

export const AvatarView: React.FC<AvatarViewProps> = ({
  user,
  onCustomize,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);
  
  const characterAsset = getCharacterAsset(user.role!);
  const frameAsset = user.avatar?.frameId ? getFrameAsset(user.avatar.frameId) : null;
  const accessories = user.avatar?.accessories?.map(id => getAccessoryAsset(id)).filter(Boolean) || [];

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case 'trader': return Target;
      case 'startup': return Lightbulb;
      case 'expert': return Users;
      case 'partner': return Building2;
      default: return Target;
    }
  };

  const RoleIcon = getRoleIcon(user.role!);

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Avatar Container */}
      <div className="relative">
        {/* Frame overlay if applied */}
        {frameAsset && (
          <div className="absolute inset-0 rounded-full border-4 border-yellow-400 shadow-lg animate-pulse">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-600/20"></div>
            <img
              src={frameAsset.image}
              alt={frameAsset.name}
              className="absolute inset-0 w-full h-full object-cover rounded-full"
              onError={() => setImageError(true)}
            />
          </div>
        )}
        
        {/* Main Avatar */}
        <Avatar className="w-24 h-24 relative z-10 group-hover:scale-105 transition-transform duration-200">
          {!imageError && characterAsset.image ? (
            <img
              src={characterAsset.image}
              alt={characterAsset.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <AvatarFallback 
              className="text-white text-4xl font-bold"
              style={{
                background: `linear-gradient(135deg, ${characterAsset.theme.primary}, ${characterAsset.theme.secondary})`
              }}
            >
              <RoleIcon className="w-12 h-12" />
            </AvatarFallback>
          )}
        </Avatar>

        {/* Accessories overlay */}
        {accessories.length > 0 && (
          <div className="absolute inset-0 z-20">
            {accessories.map((accessory, index) => {
              if (!accessory) return null;
              
              const positionClasses = {
                top: '-top-2 left-1/2 transform -translate-x-1/2',
                bottom: '-bottom-2 left-1/2 transform -translate-x-1/2',
                left: '-left-2 top-1/2 transform -translate-y-1/2',
                right: '-right-2 top-1/2 transform -translate-y-1/2',
                center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
              };

              return (
                <div
                  key={index}
                  className={`absolute ${positionClasses[accessory.position]} w-6 h-6`}
                >
                  <img
                    src={accessory.image}
                    alt={accessory.name}
                    className="w-full h-full object-contain"
                    onError={() => {
                      // Fallback to emoji if image fails
                      const emojiMap: Record<string, string> = {
                        'amulet_1': '🔮',
                        'hat_1': '🎩',
                        'crown_1': '👑',
                        'glasses_1': '👓',
                        'medal_1': '🏅',
                        'cape_1': '🦸'
                      };
                      return emojiMap[accessory.id] || '✨';
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Hidden Customize Button - clickable area in center */}
        <button
          className="absolute inset-0 w-full h-full rounded-full z-30 cursor-pointer hover:bg-black/5 transition-all duration-200 group"
          onClick={onCustomize}
          title="Нажмите для кастомизации аватара"
        >
          {/* Subtle hover indicator */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-blue-300/50 transition-all duration-200" />
          
          {/* Edit icon appears on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-8 h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
