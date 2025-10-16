'use client';

import React from 'react';

interface InternationalMarketsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InternationalMarketsModal: React.FC<InternationalMarketsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end justify-center z-50 px-4">
      <div 
        className="bg-[#1a1a1f] rounded-[8px] w-full max-w-[353px] relative mb-[22px] overflow-y-auto"
        style={{ maxHeight: 'calc(100% - 140px)' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-[15px] right-[15px] p-[4px] rounded-full hover:bg-gray-700 transition-colors"
        >
          <div className="w-[20px] h-[20px] flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>

        {/* Product icon */}
        <div className="flex justify-center pt-[27px] pb-[7px] px-[7px]">
          <div className="w-[120px] h-[120px] relative">
            <img
              src="/assets/products/mezhdunarodnyerinki.png?v=2"
              alt="Международные рынки"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Title */}
        <div className="flex justify-center mt-[3px]">
          <h2 className="text-[28px] font-medium text-white text-center leading-[32px] tracking-[-0.504px] font-inter">
            Международные<br />рынки
          </h2>
        </div>

        {/* Content */}
        <div className="px-[20px] mt-[35px] space-y-[9px]">
          {/* Description */}
          <div className="bg-[#2f2f37] rounded-[5px] p-[12px]">
            <p className="text-[17px] font-medium text-white leading-[24px] tracking-[-0.17px] font-inter">
              Возможности торговли на американских и азиатских рынках. Единственный брокер в России, соединяющий вас с глобальной альфой
            </p>
          </div>

          {/* Website button */}
          <button className="w-full h-[56px] bg-[rgba(79,79,89,0.24)] rounded-[8px] flex items-center justify-center hover:bg-[rgba(79,79,89,0.4)] transition-colors">
            <span className="text-[17px] font-semibold text-[#ebebf2] leading-[24px] tracking-[-0.204px] font-inter">
              Гайд по продукту
            </span>
          </button>

          {/* Speaker contact button */}
          <button className="w-full h-[56px] btn-gradient transition-opacity hover:opacity-90">
            <span className="text-[17px] font-semibold text-white leading-[24px] tracking-[-0.204px] font-inter">
              Связь со спикером
            </span>
          </button>
        </div>

        {/* Done button */}
        <div className="px-[20px] pt-[40px] pb-[20px]">
          <button
            onClick={onClose}
            className="w-full h-[56px] bg-[rgba(79,79,89,0.24)] rounded-[8px] flex items-center justify-center hover:bg-[rgba(79,79,89,0.4)] transition-colors"
          >
            <span className="text-[17px] font-semibold text-[#ebebf2] leading-[24px] tracking-[-0.204px] font-inter">
              Готово
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
