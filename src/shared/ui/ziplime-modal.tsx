'use client';

import React from 'react';

interface ZipLimeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZipLimeModal: React.FC<ZipLimeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#1a1a1f] z-50 overflow-y-auto">
      <div className="w-full min-h-full flex flex-col px-[20px]">
        {/* Product icon - отступ от верха 48px */}
        <div className="flex justify-center pt-[48px]">
          <div className="w-[150px] h-[150px] relative flex-shrink-0">
            <img
              src="/assets/products/ZipLime.png"
              alt="ZipLime"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        </div>

        {/* Title - отступ от изображения 9px */}
        <div className="flex justify-center mt-[9px]">
          <h2 className="text-[28px] font-medium text-white text-center leading-[32px] tracking-[-0.504px] font-inter">
            ZipLime
          </h2>
        </div>

        {/* Description - отступ от текста 40px */}
        <div className="mt-[40px]">
          <div className="bg-[#2f2f37] rounded-[5px] p-[12px] w-full">
            <p className="text-[17px] font-medium text-white leading-[24px] tracking-[-0.17px] font-inter">
              AI бектестер позволяющий легко проверять рыночные гипотезы
            </p>
          </div>
        </div>

        {/* Website button - отступ от блока с текстом 20px */}
        <button 
          onClick={() => window.open('https://telegra.ph/ZipLime-10-28', '_blank')}
          className="w-full h-[56px] bg-[rgba(79,79,89,0.24)] rounded-[8px] flex items-center justify-center hover:bg-[rgba(79,79,89,0.4)] transition-colors mt-[20px]"
        >
          <span className="text-[17px] font-semibold text-[#ebebf2] leading-[24px] tracking-[-0.204px] font-inter">
            Гайд по продукту
          </span>
        </button>

        {/* Speaker contact button - отступ от кнопки "Гайд по продукту" 10px */}
        <button 
          onClick={() => window.open('https://t.me/arbuzovv', '_blank')}
          className="w-full h-[56px] btn-gradient transition-opacity hover:opacity-90 mt-[10px]"
        >
          <span className="text-[17px] font-semibold text-white leading-[24px] tracking-[-0.204px] font-inter">
            Связь со спикером
          </span>
        </button>

        {/* Back button - отступ от кнопки "Связь со спикером" 108px */}
        <div className="mt-[108px] pb-[40px]">
          <button
            onClick={onClose}
            className="w-full h-[56px] bg-[rgba(79,79,89,0.24)] rounded-[8px] flex items-center justify-center hover:bg-[rgba(79,79,89,0.4)] transition-colors"
          >
            <span className="text-[17px] font-semibold text-[#ebebf2] leading-[24px] tracking-[-0.204px] font-inter">
              Назад
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
