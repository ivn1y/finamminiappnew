'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/shared/store/app-store';
import { UserDataInputModal, type UserData } from '@/features/user-data-input';

export const DataInputPage: React.FC = () => {
  const router = useRouter();
  const { user, updateUser, openUserDataInputModal, closeUserDataInputModal, isUserDataInputModalOpen } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Автоматически открываем модальное окно при загрузке страницы
    // Используем небольшую задержку, чтобы store успел инициализироваться
    const timer = setTimeout(() => {
      openUserDataInputModal();
      setIsModalOpen(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [openUserDataInputModal]);

  const handleUserDataSave = (data: UserData) => {
    if (user) {
      updateUser({
        credentials: {
          email: data.email,
          phone: data.phone,
        },
        name: data.name,
      });
    }
    
    // Не закрываем модальное окно сразу - показываем экран благодарности
    // closeUserDataInputModal();
    // setIsModalOpen(false);
    
    // После сохранения данных можно перейти на главную страницу
    // или оставить пользователя на этой странице
    // router.push('/collab/home');
  };

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-[393px] h-full bg-black relative">
        {/* User Data Input Modal */}
        <UserDataInputModal
          isOpen={isUserDataInputModalOpen || isModalOpen}
          onClose={() => {
            closeUserDataInputModal();
            setIsModalOpen(false);
          }}
          onSave={handleUserDataSave}
          initialData={{
            name: user?.name || '',
            email: user?.credentials?.email || '',
            phone: user?.credentials?.phone || '',
            company: '',
            position: '',
            goals: '',
            interests: '',
          }}
          requiredFields={['name', 'email', 'phone']}
        />
      </div>
    </div>
  );
};
