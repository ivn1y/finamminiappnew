'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/shared/store/app-store';
import { eventData } from '@/shared/data/seed';
import { MapPin, Calendar, QrCode, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { QRScanner } from '@/features/qr-scanner';

export const MapPage: React.FC = () => {
  const { eventMode, setQRScanner, showQRScanner } = useAppStore();
  const [redeemedZones, setRedeemedZones] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastPrize, setLastPrize] = useState('');

  if (!eventMode) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 pb-24 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Карта недоступна</h2>
          <p className="text-gray-600">Карта доступна только во время мероприятия</p>
        </div>
      </div>
    );
  }

  const handleZoneClick = (zone: any) => {
    if (zone.qr) {
      setQRScanner(true);
    }
  };

  const handleQRSuccess = (code: string) => {
    const zone = eventData.zones.find(z => z.qr === code);
    if (zone && !redeemedZones.includes(zone.id)) {
      setRedeemedZones(prev => [...prev, zone.id]);
      setLastPrize(zone.prize || 'Бонус');
      setShowSuccessModal(true);
      setQRScanner(false);
      
      // Add badge and increment progress
      useAppStore.getState().addBadge('explorer');
      useAppStore.getState().incrementProgress();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-24">
      <div className="max-w-md mx-auto lg:max-w-4xl xl:max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Карта</h1>
          <p className="text-lg text-gray-600">Найди зоны и отсканируй QR-коды</p>
        </div>

        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="map" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Карта</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Расписание</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle>Карта зон</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Simple map representation */}
                <div className="relative bg-gradient-to-br from-green-100 to-blue-100 rounded-lg h-64 mb-4 overflow-hidden">
                  {eventData.zones.map((zone, index) => (
                    <div
                      key={zone.id}
                      className={`absolute w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                        redeemedZones.includes(zone.id)
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                      style={{
                        left: `${20 + (index * 25)}%`,
                        top: `${30 + (index * 20)}%`
                      }}
                      onClick={() => handleZoneClick(zone)}
                    >
                      {redeemedZones.includes(zone.id) ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                    </div>
                  ))}
                  
                  {/* Zone labels */}
                  {eventData.zones.map((zone, index) => (
                    <div
                      key={`label-${zone.id}`}
                      className="absolute text-xs font-medium text-gray-700 bg-white/80 px-2 py-1 rounded backdrop-blur-sm"
                      style={{
                        left: `${20 + (index * 25)}%`,
                        top: `${50 + (index * 20)}%`
                      }}
                    >
                      {zone.name}
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  {eventData.zones.map((zone) => (
                    <Card
                      key={zone.id}
                      className={`cursor-pointer transition-colors ${
                        redeemedZones.includes(zone.id)
                          ? 'border-green-500 bg-green-50'
                          : 'hover:border-blue-500'
                      }`}
                      onClick={() => handleZoneClick(zone)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{zone.name}</h4>
                            {zone.prize && (
                              <p className="text-sm text-gray-600">Приз: {zone.prize}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {redeemedZones.includes(zone.id) ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <QrCode className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Расписание</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {eventData.schedule.map((event) => (
                    <div key={event.id} className="border-l-4 border-blue-600 pl-4 py-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-600">{event.stage}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-blue-600">{event.time}</p>
                          {event.durationMin && (
                            <p className="text-xs text-gray-500">{event.durationMin} мин</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* QR Scanner */}
        {showQRScanner && (
          <QRScanner
            onSuccess={handleQRSuccess}
            onClose={() => setQRScanner(false)}
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
