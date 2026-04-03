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
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="6" viewBox="0 0 16 6" fill="none">
    <path d="M0 3C0 1.34315 1.34315 0 3 0H13C14.6569 0 16 1.34315 16 3C16 4.65685 14.6569 6 13 6H3C1.34315 6 0 4.65685 0 3Z" fill="#F9A605"/>
  </svg>
);

const UnselectedIndicator = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
    <path d="M0 3C0 1.34315 1.34315 0 3 0C4.65685 0 6 1.34315 6 3C6 4.65685 4.65685 6 3 6C1.34315 6 0 4.65685 0 3Z" fill="#C0C0CC" fillOpacity="0.56"/>
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
    <div className="fixed inset-0 w-full h-screen bg-black z-[100] flex flex-col items-center pt-[60px] overflow-hidden">
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

      <div className="w-full text-center mb-[15px]">
        <h1
          className="text-white text-[30px] font-normal leading-[110%] tracking-[-0.6px] font-inter-tight"
        >
          Кто ты?
        </h1>
        <p
          className="text-[17px] font-normal leading-6 tracking-[-0.17px] mt-[13px] font-inter"
          style={{
            color: 'rgba(255, 255, 255, 0.72)',
          }}
        >
          Выбери свою роль в экосистеме
        </p>
      </div>

      <div className="w-full">
        <RoleCarousel
          setApi={setCarouselApi}
          onRoleChange={handleRoleSelect}
          currentSlide={currentSlide}
        />
      </div>
      
      <div className="w-full text-center mt-[15px]">
        <h2 
          className="text-white text-[24px] font-normal leading-[110%] tracking-[-0.48px] font-inter-tight"
        >
          {selectedRole ? roleContent.find(r => r.id === selectedRole)?.title : ''}
        </h2>
        <p 
          className="text-[#6F6F7C] text-[14px] font-normal leading-[120%] tracking-[-0.14px] mt-[6px] max-w-[353px] mx-auto font-inter"
        >
          {selectedRole ? roleContent.find(r => r.id === selectedRole)?.description : ''}
        </p>
      </div>

      <div className="flex justify-center items-center space-x-2 mt-[20px]">
        {roleContent.map((_, index) => (
          <div key={index}>
            {index === currentSlide ? <SelectedIndicator /> : <UnselectedIndicator />}
          </div>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          top: '646px',
          bottom: '90px',
          left: '20px',
          right: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <button
          onClick={handleConfirm}
          style={{
            display: 'flex',
            width: '353px',
            padding: '16px 24px',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '8px',
            background: 'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <span
            className="text-white text-center font-inter text-[17px] font-semibold leading-[24px] tracking-[-0.204px]"
          >
            Подтвердить
          </span>
        </button>
      </div>
    </div>
  );
};
