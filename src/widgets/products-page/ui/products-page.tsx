'use client';

import React from 'react';

export const ProductsPage: React.FC = () => {
  return (
    <div className="bg-black w-[393px] h-[903px] mx-auto relative font-sans text-white">
      <h1 className="absolute text-center font-inter-tight text-[30px] font-normal leading-[110%] tracking-[-0.6px]"
          style={{ top: 100, left: 19, right: 20, width: 354 }}
      >
        Продукты
      </h1>
      
      <p className="absolute text-center text-[rgba(255,255,255,0.72)] font-sans text-[17px] font-normal leading-[24px] tracking-[-0.17px]"
         style={{ top: 147, left: 38, right: 39, width: 316 }}>
        Изучите наши продукты и услуги
      </p>

      <div className="absolute flex items-center justify-center"
           style={{ top: 300, left: 20, right: 20 }}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Скоро здесь</h2>
          <p className="text-gray-400">Раздел продуктов находится в разработке</p>
        </div>
      </div>
    </div>
  );
};

