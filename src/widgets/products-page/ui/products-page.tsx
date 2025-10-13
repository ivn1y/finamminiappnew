'use client';

import React, { useState } from 'react';
import { ProductItem } from '@/shared/ui/product-item';
import { TraderDiaryModal } from '@/shared/ui/trader-diary-modal';
import { ZipLimeModal } from '@/shared/ui/ziplime-modal';
import { TradeAPIModal } from '@/shared/ui/tradeapi-modal';
import { AIScreenerModal } from '@/shared/ui/aiscreener-modal';
import { HypeRadarModal } from '@/shared/ui/hyperadar-modal';
import { ManagementCompanyModal } from '@/shared/ui/management-company-modal';
import { InternationalMarketsModal } from '@/shared/ui/international-markets-modal';

export const ProductsPage: React.FC = () => {
  const [isTraderDiaryModalOpen, setIsTraderDiaryModalOpen] = useState(false);
  const [isZipLimeModalOpen, setIsZipLimeModalOpen] = useState(false);
  const [isTradeAPIModalOpen, setIsTradeAPIModalOpen] = useState(false);
  const [isAIScreenerModalOpen, setIsAIScreenerModalOpen] = useState(false);
  const [isHypeRadarModalOpen, setIsHypeRadarModalOpen] = useState(false);
  const [isManagementCompanyModalOpen, setIsManagementCompanyModalOpen] = useState(false);
  const [isInternationalMarketsModalOpen, setIsInternationalMarketsModalOpen] = useState(false);

  const products = [
    { 
      title: 'Дневник трейдера', 
      onClick: () => setIsTraderDiaryModalOpen(true)
    },
    { 
      title: 'ZipLime', 
      onClick: () => setIsZipLimeModalOpen(true)
    },
    { 
      title: 'TradeAPI', 
      onClick: () => setIsTradeAPIModalOpen(true)
    },
    { 
      title: 'AI-скринер', 
      onClick: () => setIsAIScreenerModalOpen(true)
    },
    { 
      title: 'Hype Radar', 
      onClick: () => setIsHypeRadarModalOpen(true)
    },
    { 
      title: 'Управляющая компания', 
      onClick: () => setIsManagementCompanyModalOpen(true)
    },
    { 
      title: 'Международные рынки', 
      onClick: () => setIsInternationalMarketsModalOpen(true)
    },
  ];

  return (
    <div className="w-full bg-black flex justify-center min-h-screen">
      <div className="relative w-full max-w-[393px] min-h-screen px-4 sm:px-0">
        {/* Background gradient ellipse */}
        <div className="absolute h-[536px] left-[calc(50%+0.5px)] top-[calc(50%+88.5px)] translate-x-[-50%] translate-y-[-50%] w-[454px]">
          <div 
            className="absolute inset-[-29.85%_-35.24%]"
            style={{ 
              background: 'linear-gradient(315deg, rgba(126, 42, 137, 0.3) 0%, rgba(126, 42, 137, 0.1) 50%, rgba(126, 42, 137, 0.05) 100%)',
              borderRadius: '50%',
              filter: 'blur(80px)'
            }}
          />
        </div>

        {/* Header */}
        <div className="absolute box-border content-stretch flex flex-col gap-[32px] items-center left-[16px] px-[10px] py-0 top-[120px] w-[361px] sm:left-1/2 sm:-translate-x-1/2 sm:w-[calc(100%-32px)]">
          <div className="content-stretch flex flex-col items-center justify-center max-w-[336px] relative shrink-0 w-full">
            <div className="flex flex-col font-inter-tight justify-center leading-[0] not-italic relative shrink-0 text-[30px] text-center text-white tracking-[-0.6px] w-full">
              <p className="leading-[1.1] whitespace-pre-wrap">Наши продукты</p>
            </div>
          </div>
        </div>

        {/* Products container */}
        <div className="absolute bg-[#151519] box-border content-stretch flex flex-col gap-[12px] h-[510px] items-start left-1/2 pl-[20px] pr-0 py-[20px] rounded-[8px] top-[213px] translate-x-[-50%] w-[353px] sm:w-[calc(100%-32px)]">
          <div className="flex flex-col font-inter-tight justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-white tracking-[-0.48px] whitespace-nowrap">
            <p className="leading-[1.1]">Сервисы</p>
          </div>
          
          <div className="flex flex-col gap-[12px] w-full">
            {products.map((product, index) => (
              <ProductItem
                key={index}
                title={product.title}
                onClick={product.onClick}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Trader Diary Modal */}
      <TraderDiaryModal
        isOpen={isTraderDiaryModalOpen}
        onClose={() => setIsTraderDiaryModalOpen(false)}
      />
      
      {/* ZipLime Modal */}
      <ZipLimeModal
        isOpen={isZipLimeModalOpen}
        onClose={() => setIsZipLimeModalOpen(false)}
      />
      
      {/* TradeAPI Modal */}
      <TradeAPIModal
        isOpen={isTradeAPIModalOpen}
        onClose={() => setIsTradeAPIModalOpen(false)}
      />
      
      {/* AI Screener Modal */}
      <AIScreenerModal
        isOpen={isAIScreenerModalOpen}
        onClose={() => setIsAIScreenerModalOpen(false)}
      />
      
      {/* Hype Radar Modal */}
      <HypeRadarModal
        isOpen={isHypeRadarModalOpen}
        onClose={() => setIsHypeRadarModalOpen(false)}
      />
      
      {/* Management Company Modal */}
      <ManagementCompanyModal
        isOpen={isManagementCompanyModalOpen}
        onClose={() => setIsManagementCompanyModalOpen(false)}
      />
      
      {/* International Markets Modal */}
      <InternationalMarketsModal
        isOpen={isInternationalMarketsModalOpen}
        onClose={() => setIsInternationalMarketsModalOpen(false)}
      />
    </div>
  );
};



