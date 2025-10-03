'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/shared/types/app';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';

interface CredentialsCollectionFormProps {
  user: User;
  onSave: (credentials: { name?: string; phone?: string; email?: string }) => void;
  role: {
    title: string;
    subtitle: string;
  };
}

export const CredentialsCollectionForm: React.FC<CredentialsCollectionFormProps> = ({ user, onSave, role }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.credentials?.phone || '',
    email: user.credentials?.email || '',
  });

  useEffect(() => {
    setFormData({
      name: user.name || '',
      phone: user.credentials?.phone || '',
      email: user.credentials?.email || '',
    });
  }, [user]);

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name || '',
      phone: user.credentials?.phone || '',
      email: user.credentials?.email || '',
    });
  };

  const userRole = role.title;

  const renderDisplayView = () => (
    <>
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
    </>
  );

  const renderEditView = () => (
    <div className="flex flex-col gap-4 w-full">
      {/* Name Field */}
      <div>
        <label style={{ color: '#6F6F7C', fontSize: '14px' }}>Имя, Фамилия*</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Введите имя..."
          className="bg-transparent border-gray-600 text-white mt-1"
        />
      </div>
      {/* Phone Field */}
      <div>
        <label style={{ color: '#6F6F7C', fontSize: '14px' }}>Телефон</label>
        <Input
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Введите номер телефона..."
          className="bg-transparent border-gray-600 text-white mt-1"
        />
      </div>
      {/* Email Field */}
      <div>
        <label style={{ color: '#6F6F7C', fontSize: '14px' }}>E-mail*</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Введите свой E-mail"
          className="bg-transparent border-gray-600 text-white mt-1"
        />
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <Button 
          variant="ghost" 
          onClick={handleCancel}
          style={{ color: '#FFF', fontFamily: '"Inter Tight", sans-serif' }}
        >
          Отмена
        </Button>
        <Button 
          onClick={handleSave}
          style={{ color: '#FFF', fontFamily: '"Inter Tight", sans-serif' }}
        >
          Сохранить
        </Button>
      </div>
    </div>
  );

  return (
    <div
      onClick={() => !isEditing && setIsEditing(true)}
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
        cursor: isEditing ? 'default' : 'pointer',
      }}
    >
      {isEditing ? renderEditView() : renderDisplayView()}
    </div>
  );
};
