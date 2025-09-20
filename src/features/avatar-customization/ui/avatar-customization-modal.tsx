'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { X, Lock, Check } from 'lucide-react';
import { User } from '@/shared/types/app';
import { 
  frameAssets, 
  accessoryAssets, 
  getUnlockedFrames, 
  getUnlockedAccessories,
  getCharacterAsset 
} from '@/shared/lib/avatar-assets';

interface AvatarCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (avatarData: { frameId?: string; accessories?: string[] }) => void;
}

// Get unlocked assets based on user progress
const getAvailableFrames = (user: User) => {
  const userLevel = Math.floor(user.xp / 100) + 1;
  return getUnlockedFrames(user.badges, userLevel);
};

const getAvailableAccessories = (user: User) => {
  const userLevel = Math.floor(user.xp / 100) + 1;
  return getUnlockedAccessories(user.badges, userLevel);
};

export const AvatarCustomizationModal: React.FC<AvatarCustomizationModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave
}) => {
  const [selectedFrame, setSelectedFrame] = useState(user.avatar?.frameId || '');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>(user.avatar?.accessories || []);
  const [imageError, setImageError] = useState(false);

  const availableFrames = getAvailableFrames(user);
  const availableAccessories = getAvailableAccessories(user);
  const characterAsset = getCharacterAsset(user.role!);

  const handleFrameSelect = (frameId: string) => {
    const frame = availableFrames.find(f => f.id === frameId);
    if (frame?.unlocked) {
      setSelectedFrame(frameId);
    }
  };

  const handleAccessoryToggle = (accessoryId: string) => {
    const accessory = availableAccessories.find(a => a.id === accessoryId);
    if (!accessory?.unlocked) return;

    setSelectedAccessories(prev => 
      prev.includes(accessoryId) 
        ? prev.filter(id => id !== accessoryId)
        : [...prev, accessoryId]
    );
  };

  const handleSave = () => {
    onSave({
      frameId: selectedFrame || undefined,
      accessories: selectedAccessories
    });
    onClose();
  };

  const handleClose = () => {
    setSelectedFrame(user.avatar?.frameId || '');
    setSelectedAccessories(user.avatar?.accessories || []);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            Кастомизация аватара
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview */}
          <Card className="bg-gray-50">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-4">Предварительный просмотр</h3>
              <div className="relative inline-block">
                {/* Frame preview */}
                {selectedFrame && (
                  <div className="absolute inset-0 rounded-full border-4 border-yellow-400 shadow-lg">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-600/20"></div>
                    <img
                      src={availableFrames.find(f => f.id === selectedFrame)?.image}
                      alt="Frame preview"
                      className="absolute inset-0 w-full h-full object-cover rounded-full"
                      onError={() => setImageError(true)}
                    />
                  </div>
                )}
                
                {/* Avatar preview */}
                <div className="w-20 h-20 rounded-full relative z-10 overflow-hidden">
                  {!imageError && characterAsset.image ? (
                    <img
                      src={characterAsset.image}
                      alt={characterAsset.name}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center text-white text-2xl font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${characterAsset.theme.primary}, ${characterAsset.theme.secondary})`
                      }}
                    >
                      👤
                    </div>
                  )}
                </div>

                {/* Accessories preview */}
                {selectedAccessories.map((accessoryId, index) => {
                  const accessory = availableAccessories.find(a => a.id === accessoryId);
                  if (!accessory) return null;
                  
                  const positionClasses = {
                    top: '-top-1 left-1/2 transform -translate-x-1/2',
                    bottom: '-bottom-1 left-1/2 transform -translate-x-1/2',
                    left: '-left-1 top-1/2 transform -translate-y-1/2',
                    right: '-right-1 top-1/2 transform -translate-y-1/2',
                    center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                  };

                  return (
                    <div
                      key={index}
                      className={`absolute ${positionClasses[accessory.position]} w-4 h-4 z-20`}
                    >
                      <img
                        src={accessory.image}
                        alt={accessory.name}
                        className="w-full h-full object-contain"
                        onError={() => {
                          // Fallback to emoji
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
            </CardContent>
          </Card>

          {/* Frames Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Рамки</h3>
            <div className="grid grid-cols-2 gap-3">
              {availableFrames.map((frame) => (
                <Card
                  key={frame.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedFrame === frame.id
                      ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                      : frame.unlocked
                      ? 'hover:shadow-md hover:border-gray-300'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() => handleFrameSelect(frame.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{frame.name}</h4>
                      {!frame.unlocked && <Lock className="w-4 h-4 text-gray-400" />}
                      {selectedFrame === frame.id && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full overflow-hidden">
                      <img
                        src={frame.image}
                        alt={frame.name}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    </div>
                    <p className="text-sm text-gray-600">{frame.description}</p>
                    {!frame.unlocked && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        Заблокировано
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Accessories Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Аксессуары</h3>
            <div className="grid grid-cols-2 gap-3">
              {availableAccessories.map((accessory) => (
                <Card
                  key={accessory.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedAccessories.includes(accessory.id)
                      ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                      : accessory.unlocked
                      ? 'hover:shadow-md hover:border-gray-300'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() => handleAccessoryToggle(accessory.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{accessory.name}</h4>
                      {!accessory.unlocked && <Lock className="w-4 h-4 text-gray-400" />}
                      {selectedAccessories.includes(accessory.id) && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                      <img
                        src={accessory.image}
                        alt={accessory.name}
                        className="w-full h-full object-contain"
                        onError={() => {
                          // Fallback to emoji
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
                    <p className="text-sm text-gray-600">{accessory.description}</p>
                    {!accessory.unlocked && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        Заблокировано
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Применить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
