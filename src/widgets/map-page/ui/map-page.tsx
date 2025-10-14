'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppStore } from '@/shared/store/app-store';
import { eventData } from '@/shared/data/seed';
import { QrCode, CheckCircle } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { QRScanner } from '@/features/qr-scanner';
import { QRScanResult } from '@/shared/types/qr';
import { MapTour } from '@/features/app-tour';
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
  const router = useRouter();
  const {
    eventMode,
    setQRScanner,
    showQRScanner,
    showMapTour,
    completeMapTourAndGoToSchedule,
    showScheduleTour,
  } = useAppStore();
  const [redeemedZones, setRedeemedZones] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastPrize, setLastPrize] = useState('');
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'schedule'>('map');

  useEffect(() => {
    if (showScheduleTour) {
      setActiveTab('schedule');
    }
  }, [showScheduleTour]);

  if (!eventMode) {
    return (
      <div className="min-h-screen bg-black p-6 pb-24 flex items-center justify-center">
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
      <div className="bg-black w-[393px] h-[842px] relative font-sans text-white">
      {showMapTour && <MapTour onComplete={completeMapTourAndGoToSchedule} />}
      
      {/* Tab Switcher */}
      <div
        className="absolute flex w-[353px] h-12 p-1 items-center justify-center rounded-[4px] bg-[#151519]"
        style={{ top: '110px', left: '20px' }}
      >
        <button
          onClick={() => setActiveTab('map')}
          className={`flex w-[177px] h-10 py-[3px] px-[10px] justify-center items-center rounded-lg transition-all text-white text-center`}
          style={{
            background: activeTab === 'map'
              ? 'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)'
              : 'transparent',
            boxShadow: activeTab === 'map' ? '0 2px 20px 0 rgba(0, 0, 0, 0.06)' : 'none',
            fontFamily: '"Inter Tight"',
            fontSize: '14px',
            fontWeight: 590,
            lineHeight: '18px',
            letterSpacing: '-0.08px',
          }}
        >
          Карта
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex w-[177px] h-10 py-[3px] px-[10px] justify-center items-center rounded-lg transition-all text-white text-center`}
          style={{
            background: activeTab === 'schedule'
              ? 'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)'
              : 'transparent',
            boxShadow: activeTab === 'schedule' ? '0 2px 20px 0 rgba(0, 0, 0, 0.06)' : 'none',
            fontFamily: '"Inter Tight"',
            fontSize: '14px',
            fontWeight: 590,
            lineHeight: '18px',
            letterSpacing: '-0.08px',
          }}
        >
          Расписание
        </button>
      </div>

      {activeTab === 'map' ? (
        <>
          <div className="absolute flex items-center gap-x-2 rounded-[8px] border border-solid border-[#373740] bg-[rgba(79,79,89,0.16)]"
               style={{ top: 188, left: 20, width: 353, padding: '8px 12px 8px 16px' }}>
            <p className="text-[#6F6F7C] font-sans text-[16px] font-normal leading-[24px] tracking-[-0.128px]">
              Поиск по фильтрам
            </p>
          </div>
          
          <div className="absolute" style={{ top: 271, left: 20, width: 353, height: 199 }}>
            <Image
              src="/assets/images/event-map.png"
              alt="Карта мероприятия"
              width={353}
              height={199}
              className="object-cover"
            />
          </div>

          <h2 className="absolute font-inter-tight text-[30px] font-normal leading-[110%] tracking-[-0.6px]"
              style={{ top: 480, left: 40, width: 302 }}>
            Условные обозначения
          </h2>
          
          <div className="absolute flex justify-between" style={{ top: 533, left: 31, width: 334 }}>
            <LegendItem gradient="linear-gradient(180deg, #832CE7 0%, #BE37D3 100%)" text="VIP зал" rotated />
            <LegendItem gradient="linear-gradient(180deg, #8521D6 0%, #A230AD 30.29%, #E7514D 66.35%, #FDD23B 100%)" text="сцена" rotated />
            <LegendItem gradient="linear-gradient(90deg, #7627AD 0%, #C44D43 100%)" text="вход" />
            <LegendItem gradient="#2F0A49" text="стенды" />
            <LegendItem gradient="linear-gradient(180deg, #F06141 0%, #FDD33C 100%)" text="бар" rotated />
          </div>

          <button
            onClick={() => setQRScanner(true)}
            className="absolute flex justify-center items-center rounded-[8px] text-center font-sans text-[17px] font-semibold leading-[24px] tracking-[-0.204px] text-white z-40 mb-24"
            style={{ 
              top: 646, 
              left: 20, 
              width: 353, 
              padding: '16px 24px',
              background: 'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)'
            }}
          >
            Отсканировать QR-код
          </button>
        </>
      ) : (
        <div className="absolute" style={{ top: 158, left: 0, right: 0, bottom: 0 }}>
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
