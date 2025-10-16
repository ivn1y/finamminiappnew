'use client';

import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  badge: {
    imgSrc: string;
    grayImgSrc: string;
    title: string;
    achieved: boolean;
    description?: string;
    howToEarn?: string;
  };
}

export const BadgeModal = ({
  isOpen,
  onClose,
  badge
}: BadgeModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      {/* Main modal container */}
      <div 
        className="absolute"
        style={{
          width: '353px',
          height: '426px',
          borderRadius: '10px',
          background: 'var(--icon-base-default, #1A1A1F)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Badge image */}
        <div
          className="absolute"
          style={{
            top: '2px',
            left: '116px',
            width: '120px',
            height: '120px',
            aspectRatio: '1/1'
          }}
        >
          <Image
            src={badge.achieved ? badge.imgSrc : badge.grayImgSrc}
            alt={badge.title}
            width={120}
            height={120}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute"
          style={{
            top: '25px',
            right: '25px',
            width: '12px',
            height: '12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X 
            size={12} 
            className="text-[#6F6F7C]" 
          />
        </button>

        {/* Badge title */}
        <h2
          className="absolute font-inter-tight text-[28px] font-medium leading-[32px] tracking-[-0.504px] text-white text-center whitespace-nowrap"
          style={{
            top: '126px',
            left: '92px',
            right: '91px',
          }}
        >
          {badge.title}
        </h2>

        {/* Badge description */}
        <p
          className="absolute font-inter text-[17px] font-normal leading-[24px] tracking-[-0.17px] text-[#6F6F7C] text-center"
          style={{
            top: '170px',
            left: '19px',
            right: '18px',
          }}
        >
          {badge.description || 'Описание бейджа'}
        </p>

        {/* How to earn badge block */}
        <div
          className="absolute"
          style={{
            top: '238px',
            left: '19px',
            right: '18px',
            display: 'flex',
            padding: '10px 0',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '5px',
            background: '#2F2F37'
          }}
        >
          <p
            className="font-inter text-[17px] font-medium leading-[24px] tracking-[-0.17px] text-white text-center"
            style={{
              padding: '10px 0',
              margin: 0
            }}
          >
            {badge.howToEarn || 'Как получить этот бейдж'}
          </p>
        </div>

        {/* Done button */}
        <button
          onClick={onClose}
          className="absolute"
          style={{
            top: '350px',
            left: '20px',
            right: '20px',
            display: 'flex',
            padding: '16px 24px',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '8px',
            background: 'rgba(79, 79, 89, 0.24)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <span className="font-inter text-[17px] font-semibold leading-[24px] tracking-[-0.204px] text-[#EBEBF2] text-center">
            Готово
          </span>
        </button>
      </div>
    </div>
  );
};
