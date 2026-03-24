'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useAppStore } from '@/shared/store/app-store';
import { eventData } from '@/shared/data/seed';
import { QrCode, CheckCircle, Maximize } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/shared/ui/dialog';
import { QRScanner } from '@/features/qr-scanner';
import { QRScanResult } from '@/shared/types/qr';
import { SchedulePage } from '@/widgets/schedule-page';

const LegendItem: React.FC<{
  gradient: string;
  text: string;
  rotated?: boolean;
}> = ({ gradient, text, rotated }) => (
  <div className="flex flex-col items-center gap-y-1.5">
    <div
      className="w-[35px] h-[35px] rounded-[6px] flex-shrink-0"
      style={{
        background: gradient,
        transform: rotated ? 'rotate(-90deg)' : 'none',
      }}
    />
    <p className="text-white text-center font-inter-tight text-[14px] font-normal leading-[110%] tracking-[-0.28px]">
      {text}
    </p>
  </div>
);

export const MapPage: React.FC = () => {
  const {
    eventMode,
    setQRScanner,
    showQRScanner,
  } = useAppStore();
  const [redeemedZones, setRedeemedZones] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastPrize, setLastPrize] = useState('');
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'schedule'>('map');
  const [isMapFullScreen, setIsMapFullScreen] = useState(false);

  if (!eventMode) {
    return (
      <div className="min-h-screen bg-black p-6 flex items-center justify-center">
        <div className="text-center">
          <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Карта недоступна</h2>
          <p className="text-gray-400">Карта доступна только во время мероприятия</p>
        </div>
      </div>
    );
  }

  const handleQRSuccess = (result: QRScanResult) => {
    const code = result.code || '';

    if (code === 'FINAM:123help') {
      setLastPrize('Секретный бонус');
      setShowSuccessModal(true);
      setQRScanner(false);
      useAppStore.getState().addBadge('qr_scanner_badge');
      useAppStore.getState().incrementProgress();
      useAppStore.getState().addScannedZone('manual_code_zone');
      return;
    }

    const zone = eventData.zones.find(z => z.qr === code);
    if (zone && !redeemedZones.includes(zone.id)) {
      setRedeemedZones(prev => [...prev, zone.id]);
      setLastPrize(zone.prize || 'Бонус');
      setShowSuccessModal(true);
      setQRScanner(false);
      setSelectedZone(null);
      useAppStore.getState().addBadge('qr_scanner_badge');
      useAppStore.getState().incrementProgress();
      useAppStore.getState().addScannedZone(zone.id);
    } else if (zone) {
      setQRScanner(false);
      setSelectedZone(null);
    }
  };

  return (
    <div className="w-full bg-black flex justify-center overflow-x-hidden">
      <div className="bg-black w-[393px] relative font-sans text-white" style={{ height: '867px' }}>
      {/* Tab Switcher */}
      <div
        className="absolute flex w-[353px] h-12 p-1 items-center justify-center rounded-[4px] bg-[#151519]"
        style={{ top: '50px', left: '20px' }}
      >
        <button
          onClick={() => setActiveTab('map')}
          className={`flex w-[177px] h-10 py-[3px] px-[10px] justify-center items-center rounded-lg transition-all text-white text-center font-inter text-[14px] font-medium leading-[18px] tracking-[-0.08px]`}
          style={{
            background: activeTab === 'map'
              ? 'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)'
              : 'transparent',
            boxShadow: activeTab === 'map' ? '0 2px 20px 0 rgba(0, 0, 0, 0.06)' : 'none',
          }}
        >
          Карта
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex w-[177px] h-10 py-[3px] px-[10px] justify-center items-center rounded-lg transition-all text-white text-center font-inter text-[14px] font-medium leading-[18px] tracking-[-0.08px]`}
          style={{
            background: activeTab === 'schedule'
              ? 'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)'
              : 'transparent',
            boxShadow: activeTab === 'schedule' ? '0 2px 20px 0 rgba(0, 0, 0, 0.06)' : 'none',
          }}
        >
          Расписание
        </button>
      </div>

      {activeTab === 'map' ? (
        <>
          <div
            className="absolute overflow-hidden rounded-lg border border-solid cursor-grab active:cursor-grabbing"
            style={{ 
              top: 128, 
              left: 20, 
              width: 353, 
              height: 356,
              borderColor: 'var(--bg-brand-default, #FFC759)',
              borderRadius: '8px'
            }}
          >
            <TransformWrapper
                initialScale={2.2}
                initialPositionX={-400}
                initialPositionY={-300}
                minScale={1}
                maxScale={8}
                panning={{
                  wheelPanning: false,
                }}
                doubleClick={{
                  disabled: true,
                }}
              >
                <TransformComponent
                  wrapperStyle={{ width: '100%', height: '100%' }}
                >
                  <Image
                    src="/assets/images/event-map.png"
                    alt="Карта мероприятия"
                    width={7680}
                    height={4320}
                    quality={100}
                  />
                </TransformComponent>
              </TransformWrapper>
              <button
              onClick={() => setIsMapFullScreen(true)}
              className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-md text-white z-10 hover:bg-black/75 transition-colors"
              aria-label="Развернуть карту"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>

          <h2 className="absolute font-inter-tight text-[24px] font-normal leading-[110%] tracking-[-0.48px] text-white"
              style={{ top: 516, left: 20, width: 302 }}>
            Условные обозначения
          </h2>
          
          <div className="absolute flex justify-between" style={{ top: 569, left: 20, width: 334 }}>
            <LegendItem gradient="#551181" text="VIP зал" rotated />
            <LegendItem gradient="#200b3a" text="Стенды" />
            <LegendItem gradient="#cf8d2d" text="Финам" />
            <LegendItem gradient="#7a412d" text="Бар" rotated />
          </div>
        </>
      ) : (
        <div className="absolute" style={{ top: 98, left: 0, right: 0, bottom: 0 }}>
          <SchedulePage />
        </div>
      )}

      {showQRScanner && (
        <QRScanner
          onSuccess={handleQRSuccess}
          onClose={() => {
            setQRScanner(false);
            setSelectedZone(null);
          }}
          userId="demo-user"
        />
      )}

      <Dialog open={isMapFullScreen} onOpenChange={setIsMapFullScreen}>
        <DialogContent className="w-screen h-screen max-w-none sm:rounded-none p-0 bg-black/80 backdrop-blur-sm border-0 [&>button]:hidden">
          <div
            className="relative flex h-full w-full items-center justify-center p-4"
            onClick={() => setIsMapFullScreen(false)}
          >
            <Image
              src="/assets/images/event-map.png"
              alt="Карта мероприятия"
              width={7680}
              height={4320}
              style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }}
              quality={100}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="w-full max-w-md text-center bg-gray-800 border-gray-700">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <DialogHeader>
            <DialogTitle className="text-xl mb-2 text-white">
              Поздравляем!
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-300 mb-4">
            Ты получил бейдж и бонус: <strong>{lastPrize}</strong>
          </p>
          <Button
            onClick={() => setShowSuccessModal(false)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Отлично!
          </Button>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};
