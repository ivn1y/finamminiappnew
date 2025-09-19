'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/shared/store/app-store';
import { eventData } from '@/shared/data/seed';
import { QrCode, CheckCircle } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { QRScanner } from '@/features/qr-scanner';
import { QRScanResult } from '@/shared/types/qr';

export const MapPage: React.FC = () => {
  const { eventMode, setQRScanner, showQRScanner } = useAppStore();
  const [redeemedZones, setRedeemedZones] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastPrize, setLastPrize] = useState('');
  const [selectedZone, setSelectedZone] = useState<any>(null);

  if (!eventMode) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 pb-24 flex items-center justify-center">
        <div className="text-center">
          <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Карта недоступна</h2>
          <p className="text-gray-600">Карта доступна только во время мероприятия</p>
        </div>
      </div>
    );
  }

  const handleZoneClick = (zone: any) => {
    console.log('🗺️ MapPage: handleZoneClick вызвана для зоны:', zone);
    if (zone.qr) {
      console.log('🗺️ MapPage: у зоны есть QR-код, открываем сканер');
      setSelectedZone(zone);
      setQRScanner(true);
    } else {
      console.log('🗺️ MapPage: у зоны нет QR-кода');
    }
  };

  const handleQRSuccess = (result: QRScanResult) => {
    console.log('🗺️ MapPage: handleQRSuccess вызвана с результатом:', result);
    const code = result.code || '';
    console.log('🗺️ MapPage: извлеченный код:', code);
    
    const zone = eventData.zones.find(z => z.qr === code);
    console.log('🗺️ MapPage: найденная зона:', zone);
    
    if (zone && !redeemedZones.includes(zone.id)) {
      console.log('🗺️ MapPage: зона найдена и не была выкуплена, добавляем в список');
      setRedeemedZones(prev => [...prev, zone.id]);
      setLastPrize(zone.prize || 'Бонус');
      setShowSuccessModal(true);
      setQRScanner(false);
      setSelectedZone(null);
      
      // Add badge, increment progress, and save scanned zone
      useAppStore.getState().addBadge('qr_scanner_badge');
      useAppStore.getState().incrementProgress();
      useAppStore.getState().addScannedZone(zone.id);
    } else if (zone) {
      console.log('🗺️ MapPage: зона уже была выкуплена');
      setQRScanner(false);
      setSelectedZone(null);
    } else {
      console.log('🗺️ MapPage: зона не найдена для кода:', code);
      setQRScanner(false);
      setSelectedZone(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Карта мероприятия</h1>
          <p className="text-lg text-gray-600">Нажмите на зону для сканирования QR-кода</p>
        </div>

        {/* Large Interactive Map */}
        <div className="relative bg-gradient-to-br from-green-100 to-blue-100 rounded-xl h-[70vh] overflow-hidden shadow-lg">
          {/* Map Background - можно заменить на реальное изображение карты */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-blue-100 to-purple-100 opacity-50"></div>
          
          {/* Interactive Zones */}
          {eventData.zones.map((zone, index) => {
            const positions = [
              { left: '15%', top: '20%' }, // Стенд Финам A
              { left: '75%', top: '30%' }, // Стенд Финам B  
              { left: '45%', top: '60%' }  // Зона стартапов
            ];
            
            return (
              <div key={zone.id}>
                {/* Zone Area - кликабельная область */}
                <div
                  className={`absolute w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all transform hover:scale-110 ${
                    redeemedZones.includes(zone.id)
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                  }`}
                  style={{
                    left: positions[index]?.left || '50%',
                    top: positions[index]?.top || '50%'
                  }}
                  onClick={() => handleZoneClick(zone)}
                >
                  {redeemedZones.includes(zone.id) ? (
                    <CheckCircle className="w-8 h-8" />
                  ) : (
                    <QrCode className="w-8 h-8" />
                  )}
                </div>
                
                {/* Zone Label */}
                <div
                  className="absolute text-sm font-semibold text-gray-800 bg-white/90 px-3 py-2 rounded-lg backdrop-blur-sm shadow-sm border border-white/20"
                  style={{
                    left: positions[index]?.left || '50%',
                    top: positions[index]?.top ? `calc(${positions[index].top} + 4rem)` : 'calc(50% + 4rem)',
                    transform: 'translateX(-50%)'
                  }}
                >
                  {zone.name}
                  {zone.prize && (
                    <div className="text-xs text-gray-600 mt-1">
                      Приз: {zone.prize}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/20">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <QrCode className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700">Доступно для сканирования</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-700">Уже отсканировано</span>
              </div>
            </div>
          </div>
        </div>

        {/* Single QR Scanner Button */}
        <div className="mt-6 text-center">
          <Button
            onClick={() => setQRScanner(true)}
            size="lg"
            className="px-8 py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <QrCode className="w-6 h-6 mr-3" />
            Сканировать QR
          </Button>
        </div>

        {/* QR Scanner */}
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

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="w-full max-w-md text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <DialogHeader>
              <DialogTitle className="text-xl mb-2">
                Поздравляем!
              </DialogTitle>
            </DialogHeader>
            <p className="text-gray-600 mb-4">
              Ты получил бейдж и бонус: <strong>{lastPrize}</strong>
            </p>
            <Button
              onClick={() => setShowSuccessModal(false)}
              className="w-full"
            >
              Отлично!
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
