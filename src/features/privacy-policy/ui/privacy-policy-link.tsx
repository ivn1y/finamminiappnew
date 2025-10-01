'use client';

import React, { useState } from 'react';
import { PrivacyPolicyModal } from './privacy-policy-modal';

interface PrivacyPolicyLinkProps {
  className?: string;
  children: React.ReactNode;
}

export const PrivacyPolicyLink: React.FC<PrivacyPolicyLinkProps> = ({ 
  className = '', 
  children 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <>
      <span
        onClick={handleClick}
        className={`cursor-pointer hover:opacity-80 transition-opacity inline ${className}`}
        style={{ display: 'inline' }}
      >
        {children}
      </span>
      
      <PrivacyPolicyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};
