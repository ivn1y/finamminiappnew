'use client';

import React, { useState, useEffect } from 'react';
import { UserRole } from '@/shared/types/app';
import { roleContent } from '@/shared/data/seed';
import { RoleCarousel } from './role-carousel';
import {
  CarouselApi,
} from '@/shared/ui/carousel';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (role: UserRole) => void;
  currentRole: UserRole | null;
}

const SelectedIndicator = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="4" cy="4" r="4" fill="#FEDA3B"/>
  </svg>
);

const UnselectedIndicator = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="4" cy="4" r="4" fill="#C0C0CC" fillOpacity="0.56"/>
  </svg>
);

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentRole,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(currentRole || 'trader');
  const [carouselApi, setCarouselApi] = useState<CarouselApi | undefined>();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (currentRole) {
      const roleIndex = roleContent.findIndex(r => r.id === currentRole);
      if (roleIndex !== -1) {
        setCurrentSlide(roleIndex);
        setSelectedRole(currentRole);
      }
    }
  }, [currentRole]);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const handleSelect = () => {
      const newIndex = carouselApi.selectedScrollSnap();
      setCurrentSlide(newIndex);
      const newRole = roleContent[newIndex].id;
      setSelectedRole(newRole);
    };

    carouselApi.on('select', handleSelect);
    
    // Устанавливаем начальный слайд
    const initialIndex = currentRole 
      ? roleContent.findIndex(r => r.id === currentRole)
      : 0;
    if (initialIndex !== -1) {
      carouselApi.scrollTo(initialIndex);
    }

    return () => {
      carouselApi.off('select', handleSelect);
    };
  }, [carouselApi, currentRole]);

  if (!isOpen) {
    return null;
  }

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleConfirm = () => {
    if (selectedRole) {
      onSelect(selectedRole);
      onClose();
    }
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
        overflow: 'hidden',
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

      <div style={{ width: '100%', textAlign: 'center', marginBottom: '15px' }}>
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
          Выбери роль
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

      <div style={{ width: '100%' }}>
        <RoleCarousel
          setApi={setCarouselApi}
          onRoleChange={handleRoleSelect}
          currentSlide={currentSlide}
        />
      </div>
      
      <div style={{ width: '100%', textAlign: 'center', marginTop: '15px' }}>
        <h2 
          style={{
            color: '#fff',
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: '24px',
            fontWeight: 400,
            lineHeight: '110%',
            letterSpacing: '-0.48px',
            margin: 0,
          }}
        >
          {selectedRole ? roleContent.find(r => r.id === selectedRole)?.title : ''}
        </h2>
        <p 
          style={{
            color: '#6F6F7C',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '120%',
            letterSpacing: '-0.14px',
            marginTop: '6px',
            maxWidth: '353px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {selectedRole ? roleContent.find(r => r.id === selectedRole)?.description : ''}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
        {roleContent.map((_, index) => (
          <div key={index}>
            {index === currentSlide ? <SelectedIndicator /> : <UnselectedIndicator />}
          </div>
        ))}
      </div>

      <button
        onClick={handleConfirm}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '338px',
          padding: '16px 24px',
          borderRadius: '8px',
          background: 'linear-gradient(305deg, #feda3b -2.67%, #ef5541 38.9%, #801fdb 77.17%, #7e2a89 98.46%)',
          border: 'none',
          color: '#fff',
          fontFamily: 'Inter, sans-serif',
          fontSize: '17px',
          fontWeight: 600,
          lineHeight: '24px',
          letterSpacing: '-0.204px',
          cursor: 'pointer',
        }}
      >
        Подтвердить
      </button>
    </div>
  );
};

