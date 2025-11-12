'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/shared/types/app';
import { UserDataInputModal, type UserData } from '@/features/user-data-input';
import { useAppStore } from '@/shared/store/app-store';

interface CredentialsCollectionFormProps {
  user: User;
  onSave: (credentials: { name?: string; phone?: string; email?: string }) => void;
  role: {
    title: string;
    subtitle: string;
  };
}

export const CredentialsCollectionForm: React.FC<CredentialsCollectionFormProps> = ({ user, onSave, role }) => {
  const { isUserDataInputModalOpen, openUserDataInputModal, closeUserDataInputModal } = useAppStore();

  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.credentials?.phone || '',
    email: user.credentials?.email || '',
  });

  const previousRoleRef = React.useRef(user.role);

  // Обновляем formData только если роль не изменилась
  // При смене роли сохраняем текущие данные формы, чтобы пользователь не потерял введенные данные
  useEffect(() => {
    const roleChanged = previousRoleRef.current !== user.role;
    
    // Если роль не изменилась, обновляем данные как обычно
    if (!roleChanged) {
      setFormData({
        name: user.name || '',
        phone: user.credentials?.phone || '',
        email: user.credentials?.email || '',
      });
    } else {
      // Если роль изменилась, сохраняем текущие данные формы
      // Не сбрасываем их, чтобы пользователь не потерял введенные данные
      previousRoleRef.current = user.role;
    }
  }, [user]);
  
  const handleUserDataSave = (data: UserData) => {
    // Сохраняем через родительский компонент
    onSave({
      name: data.name,
      phone: data.phone,
      email: data.email,
    });
    
    closeUserDataInputModal();
  };

  const userRole = role.title;

  return (
    <>
      <div
        onClick={openUserDataInputModal}
        style={{
          display: 'flex',
          minHeight: '320px',
          padding: '20px 16px',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '20px',
          borderRadius: '8px',
          background: '#1A1A1F',
          width: '353px',
          boxSizing: 'border-box',
          cursor: 'pointer',
        }}
      >
        {/* Name Field */}
        <div style={{ width: '100%' }}>
          <p style={{
            color: '#6F6F7C',
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '24px',
            letterSpacing: '-0.128px',
            margin: 0,
          }}>Имя, Фамилия*</p>
          <p style={{
            color: user.name ? '#FFF' : '#6F6F7C',
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '24px',
            letterSpacing: '-0.128px',
            margin: '6px 0 0 0',
          }}>{formData.name || 'Введите имя...'}</p>
        </div>

        {/* Phone Field */}
        <div style={{ width: '100%' }}>
          <p style={{
            color: '#6F6F7C',
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '24px',
            letterSpacing: '-0.128px',
            margin: 0,
          }}>Телефон</p>
          <p style={{
            color: user.credentials?.phone ? '#FFF' : '#6F6F7C',
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '24px',
            letterSpacing: '-0.128px',
            margin: '6px 0 0 0',
          }}>{formData.phone || 'Введите номер телефона...'}</p>
        </div>

        {/* Email Field */}
        <div style={{ width: '100%' }}>
          <p style={{
            color: '#6F6F7C',
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '24px',
            letterSpacing: '-0.128px',
            margin: 0,
          }}>E-mail*</p>
          <p style={{
            color: user.credentials?.email ? '#FFF' : '#6F6F7C',
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '24px',
            letterSpacing: '-0.128px',
            margin: '6px 0 0 0',
          }}>{formData.email || 'Введите свой E-mail'}</p>
        </div>

        {/* Role Field */}
        <div style={{ width: '100%' }}>
          <p style={{
            color: '#6F6F7C',
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '24px',
            letterSpacing: '-0.128px',
            margin: 0,
          }}>Роль</p>
          <p style={{
            color: '#FFF',
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '24px',
            letterSpacing: '-0.128px',
            margin: '6px 0 0 0',
          }}>{userRole}</p>
        </div>
      </div>

      {/* User Data Input Modal */}
      <UserDataInputModal
        isOpen={isUserDataInputModalOpen}
        onClose={closeUserDataInputModal}
        onSave={handleUserDataSave}
        initialData={{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: '',
          position: '',
          goals: '',
          interests: '',
        }}
        onDataChange={(newData) => setFormData(prev => ({...prev, ...newData}))}
        requiredFields={['name', 'email', 'phone']}
      />
    </>
  );
};
