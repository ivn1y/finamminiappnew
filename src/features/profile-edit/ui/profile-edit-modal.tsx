'use client';

import React, { useState } from 'react';
import { User } from '@/shared/types/app';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { ProfileEditForm } from './profile-edit-form';
import { X } from 'lucide-react';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave?: (updatedUser: User) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (updatedUser: User) => {
    setIsSaving(true);
    try {
      if (onSave) {
        onSave(updatedUser);
      }
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Редактирование профиля</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              disabled={isSaving}
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <ProfileEditForm
          user={user}
          onSave={handleSave}
          onCancel={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};
