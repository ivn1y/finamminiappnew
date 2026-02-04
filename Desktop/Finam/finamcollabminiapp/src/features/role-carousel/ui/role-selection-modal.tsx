'use client';

import React, { useState, useEffect } from 'react';
import { UserRole } from '@/shared/types/app';
import { roleContent } from '@/shared/data/seed';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (role: UserRole) => void;
  currentRole: UserRole | null;
}

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentRole,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(currentRole || null);

  useEffect(() => {
    if (currentRole) {
      setSelectedRole(currentRole);
    }
  }, [currentRole]);

  if (!isOpen) {
    return null;
  }

  // Фильтруем роли - показываем только нужные (без guest)
  const availableRoles = roleContent.filter(role => 
    ['trader', 'startup', 'expert', 'partner', 'scout'].includes(role.id)
  );

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    // Сразу выбираем роль без дополнительного подтверждения
    onSelect(role);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#000',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '60px',
        paddingBottom: '40px',
        overflowY: 'auto',
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '44px',
          right: '20px',
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '32px',
          cursor: 'pointer',
          zIndex: 10,
          padding: 0,
          lineHeight: 1,
        }}
      >
        &times;
      </button>

      <div style={{ width: '100%', textAlign: 'center', marginBottom: '40px' }}>
        <h1
          style={{
            color: '#fff',
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: '30px',
            fontWeight: 400,
            lineHeight: '110%',
            letterSpacing: '-0.6px',
            margin: 0,
          }}
        >
          Кто ты?
        </h1>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.72)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '17px',
            fontWeight: 400,
            lineHeight: '24px',
            letterSpacing: '-0.17px',
            marginTop: '13px',
          }}
        >
          Выбери свою роль в экосистеме
        </p>
      </div>

      {/* Список ролей */}
      <div style={{ width: '100%', maxWidth: '353px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
        {availableRoles.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                padding: '16px 24px',
                background: isSelected
                  ? 'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)'
                  : '#59307C',
                border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <span
                style={{
                  color: '#fff',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '17px',
                  fontWeight: 500,
                  lineHeight: '24px',
                  letterSpacing: '-0.204px',
                }}
              >
                {role.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

