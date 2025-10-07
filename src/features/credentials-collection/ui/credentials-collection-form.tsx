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
          }}>{user.name || 'Введите имя...'}</p>
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
          }}>{user.credentials?.phone || 'Введите номер телефона...'}</p>
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
          }}>{user.credentials?.email || 'Введите свой E-mail'}</p>
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
          name: user.name || '',
          email: user.credentials?.email || '',
          phone: user.credentials?.phone || '',
          company: '',
          position: '',
          goals: '',
          interests: '',
        }}
      />
    </>
  );
};
