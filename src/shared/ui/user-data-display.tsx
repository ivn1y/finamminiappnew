'use client';

import React from 'react';
import { UserData } from '@/features/user-data-input';

interface UserDataDisplayProps {
  userData: UserData | null;
  onEdit?: () => void;
  showEditButton?: boolean;
  className?: string;
}

export const UserDataDisplay: React.FC<UserDataDisplayProps> = ({
  userData,
  onEdit,
  showEditButton = false,
  className = ''
}) => {
  const hasData = userData && (userData.name || userData.email || userData.phone);

  const renderField = (label: string, value: string | undefined, isRequired: boolean = false) => (
    <div style={{ width: '100%' }}>
      <p style={{
        color: '#6F6F7C',
        fontFamily: 'Inter, sans-serif',
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: '24px',
        letterSpacing: '-0.128px',
        margin: 0,
      }}>
        {label}{isRequired ? '*' : ''}
      </p>
      <p style={{
        color: value ? '#FFF' : '#6F6F7C',
        fontFamily: 'Inter, sans-serif',
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: '24px',
        letterSpacing: '-0.128px',
        margin: '6px 0 0 0',
      }}>
        {value || 'Нажмите, чтобы заполнить данные'}
      </p>
    </div>
  );

  return (
    <div className={`user-data-display ${className}`}>
      {renderField('Имя, Фамилия', userData?.name, true)}
      {renderField('Телефон', userData?.phone)}
      {renderField('E-mail', userData?.email, true)}
      {userData?.company && renderField('Компания', userData.company)}
      {userData?.position && renderField('Должность', userData.position)}
      {userData?.goals && renderField('Цели', userData.goals)}
      {userData?.interests && renderField('Интересы', userData.interests)}
      
      {showEditButton && onEdit && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={onEdit}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #6F6F7C',
              background: 'transparent',
              color: '#FFF',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Редактировать
          </button>
        </div>
      )}
    </div>
  );
};
