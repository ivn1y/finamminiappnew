'use client';

import React, { useState } from 'react';
import { ProductItem } from '@/shared/ui/product-item';
import { TelegramChannelBlock } from '@/shared/ui/telegram-channel-block';
import { TraderDiaryModal } from '@/shared/ui/trader-diary-modal';
import { ZipLimeModal } from '@/shared/ui/ziplime-modal';
import { TradeAPIModal } from '@/shared/ui/tradeapi-modal';
import { AIScreenerModal } from '@/shared/ui/aiscreener-modal';
import { HypeRadarModal } from '@/shared/ui/hyperadar-modal';
import { ManagementCompanyModal } from '@/shared/ui/management-company-modal';
import { InternationalMarketsModal } from '@/shared/ui/international-markets-modal';
import { ComonModal } from '@/shared/ui/comon-modal';
import { EducationalCenterModal } from '@/shared/ui/educational-center-modal';
import { useAppStore } from '@/shared/store/app-store';

type ModalType = 
  | 'traderDiary'
  | 'zipLime'
  | 'tradeAPI'
  | 'aiScreener'
  | 'hypeRadar'
  | 'managementCompany'
  | 'internationalMarkets'
  | 'comon'
  | 'educationalCenter'
  | null;

export const ProductsPage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const { openProductModal, closeProductModal } = useAppStore();

  const handleOpenModal = (modal: ModalType) => {
    setActiveModal(modal);
    openProductModal();
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    closeProductModal();
  };

  const products = [
    { 
      title: 'Дневник трейдера', 
      onClick: () => handleOpenModal('traderDiary')
    },
    { 
      title: 'ZipLime', 
      onClick: () => handleOpenModal('zipLime')
    },
    { 
      title: 'TradeAPI', 
      onClick: () => handleOpenModal('tradeAPI')
    },
    { 
      title: 'AI-скринер', 
      onClick: () => handleOpenModal('aiScreener')
    },
    { 
      title: 'Hype Radar', 
      onClick: () => handleOpenModal('hypeRadar')
    },
    { 
      title: 'Управляющая компания', 
      onClick: () => handleOpenModal('managementCompany')
    },
    { 
      title: 'Международные рынки', 
      onClick: () => handleOpenModal('internationalMarkets')
    },
    { 
      title: 'Автоследование', 
      onClick: () => handleOpenModal('comon')
    },
    { 
      title: 'Учебный Центр', 
      onClick: () => handleOpenModal('educationalCenter')
    },
  ];

  return (
    <div className="w-full bg-black flex justify-center overflow-x-hidden">
      <div className="relative w-[393px]" style={{ minHeight: 'calc(100vh - 109px)' }}>
        {/* Background gradient ellipse - same as home page */}
        <div
          className="absolute top-[15px] left-1/2 -translate-x-1/2 w-[390px] h-[281px] rounded-[390px] opacity-50 blur-[80px]"
          style={{
            background:
              'linear-gradient(315deg, #FAF1E6 -0.45%, #F9DEC0 15.8%, #ED9FA6 32.05%, #994B69 48.29%, rgba(51, 22, 86, 0.00) 64.54%)',
          }}
        ></div>

        {/* Scrollable content */}
        <div className="relative overflow-y-auto px-4" style={{ scrollBehavior: 'smooth', height: 'calc(100vh - 80px)' }}>
          {/* Header */}
          <div className="mt-[60px] text-center">
            <h1 className="text-[30px] font-inter-tight text-white leading-tight tracking-[-0.6px]">
              Наши продукты
            </h1>
          </div>

          {/* Products container */}
          <div className="mt-[32px] bg-[#151519] rounded-[8px] p-5" style={{ paddingBottom: '20px' }}>
            <h2 className="font-inter-tight text-[24px] text-white tracking-[-0.48px] leading-tight mb-3">
              Сервисы
            </h2>
            <div className="flex flex-col gap-3">
              {products.map((product, index) => (
                <ProductItem
                  key={index}
                  title={product.title}
                  onClick={product.onClick}
                />
              ))}
            </div>
          </div>

          {/* Finam Collab Block */}
          <div className="mt-5 bg-[#1a1a1f] rounded-lg p-4">
            <h2 className="font-inter-tight text-[24px] text-white tracking-[-0.48px] leading-tight mb-2">
              Финам Collab
            </h2>
            <p className="font-inter text-[14px] text-white tracking-[-0.056px] leading-5 mb-2 w-[285px]">
              Узнай про все продукты Finam Collab
            </p>
            <button 
              onClick={() => window.open('https://collab.finam.ru/?utm_source=finam.collab-bot&utm_medium=referral&utm_campaign=app_collab_rf_native_content.app.users___referral&utm_content=button-site', '_blank')}
              className="w-full h-12 bg-[rgba(79,79,89,0.24)] rounded-lg flex items-center justify-center hover:bg-[rgba(79,79,89,0.4)] transition-colors"
            >
              <span className="font-inter font-semibold text-[#ebebf2] text-[17px] text-center tracking-[-0.204px] leading-6">
                Перейти
              </span>
            </button>
          </div>

          {/* Telegram Channel Block */}
          <div className="mt-5">
            <TelegramChannelBlock />
          </div>

          {/* Bottom spacer - ensures 109px gap from last block to bottom of page */}
          <div style={{ height: '109px' }} />
        </div>
      </div>
      
      {/* --- Modals --- */}

      {/* Trader Diary Modal */}
      <TraderDiaryModal
        isOpen={activeModal === 'traderDiary'}
        onClose={handleCloseModal}
      />
      
      {/* ZipLime Modal */}
      <ZipLimeModal
        isOpen={activeModal === 'zipLime'}
        onClose={handleCloseModal}
      />
      
      {/* TradeAPI Modal */}
      <TradeAPIModal
        isOpen={activeModal === 'tradeAPI'}
        onClose={handleCloseModal}
      />
      
      {/* AI Screener Modal */}
      <AIScreenerModal
        isOpen={activeModal === 'aiScreener'}
        onClose={handleCloseModal}
      />
      
      {/* Hype Radar Modal */}
      <HypeRadarModal
        isOpen={activeModal === 'hypeRadar'}
        onClose={handleCloseModal}
      />
      
      {/* Management Company Modal */}
      <ManagementCompanyModal
        isOpen={activeModal === 'managementCompany'}
        onClose={handleCloseModal}
      />
      
      {/* International Markets Modal */}
      <InternationalMarketsModal
        isOpen={activeModal === 'internationalMarkets'}
        onClose={handleCloseModal}
      />
      
      {/* Comon Modal */}
      <ComonModal
        isOpen={activeModal === 'comon'}
        onClose={handleCloseModal}
      />
      
      {/* Educational Center Modal */}
      <EducationalCenterModal
        isOpen={activeModal === 'educationalCenter'}
        onClose={handleCloseModal}
      />
    </div>
  );
};



