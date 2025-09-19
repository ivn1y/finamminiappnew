'use client';

import React, { useState } from 'react';
import { QRScanner } from '@/features/qr-scanner';
import { QRScanResult } from '@/shared/types/qr';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { QrCode, Trophy, Zap, History, Trash2 } from 'lucide-react';

export default function QRTestPage() {
  const [showScanner, setShowScanner] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<QRScanResult | null>(null);
  const [testCodes] = useState([
    'FINAM:TRADER_2024',
    'FINAM:STARTUP_ZONE_A',
    'FINAM:EXPERT_MENTOR_2024',
    'FINAM:PARTNER_BUSINESS',
    'FINAM:EVENT_MAIN_STAGE',
    'FINAM:ZONE_NETWORKING',
    'FINAM:DEMO_PITCH_2024'
  ]);

  // Используем локальное состояние вместо отдельного хука
  const [state, setState] = useState({
    totalScanned: 0,
    totalXP: 0,
    badgesEarned: [] as string[],
    scanHistory: [] as any[]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQRSuccess = (result: QRScanResult) => {
    setLastScanResult(result);
    setShowScanner(false);
    
    // Обновляем локальное состояние
    if (result.success) {
      setState(prev => ({
        ...prev,
        totalScanned: prev.totalScanned + 1,
        totalXP: prev.totalXP + (result.reward?.xp || 0),
        badgesEarned: result.reward?.badge 
          ? [...prev.badgesEarned, result.reward.badge]
          : prev.badgesEarned,
        scanHistory: [...prev.scanHistory, result]
      }));
    }
  };

  const handleTestCode = async (code: string) => {
    // Имитация сканирования тестового кода
    const result: QRScanResult = {
      success: true,
      code,
      reward: {
        xp: 50,
        badge: 'test_badge',
        message: `Тестовый код отсканирован! (+50 XP)`,
        isNewBadge: true
      }
    };
    setLastScanResult(result);
    
    // Обновляем локальное состояние
    setState(prev => ({
      ...prev,
      totalScanned: prev.totalScanned + 1,
      totalXP: prev.totalXP + 50,
      badgesEarned: [...prev.badgesEarned, 'test_badge'],
      scanHistory: [...prev.scanHistory, result]
    }));
  };

  const handleClearHistory = async () => {
    setState({
      totalScanned: 0,
      totalXP: 0,
      badgesEarned: [],
      scanHistory: []
    });
    setLastScanResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">QR-сканер - Тестирование</h1>
          <p className="text-lg text-gray-600">Тестирование функциональности QR-сканера</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Отсканировано</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{state.totalScanned}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Общий XP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{state.totalXP}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Бейджи</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{state.badgesEarned.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <QrCode className="w-5 h-5" />
                <span>Сканер</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => setShowScanner(true)}
                className="w-full"
                size="lg"
              >
                <QrCode className="w-5 h-5 mr-2" />
                Открыть QR-сканер
              </Button>
              
              <Button 
                onClick={handleClearHistory}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Очистить историю
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Тестовые коды</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {testCodes.map((code, index) => (
                  <Button
                    key={index}
                    onClick={() => handleTestCode(code)}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs font-mono"
                  >
                    {code}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Last Scan Result */}
        {lastScanResult && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span>Последний результат</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Код:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {lastScanResult.code}
                  </code>
                </div>
                
                {lastScanResult.success ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Награда:</span>
                      <span className="text-green-600">{lastScanResult.reward?.message}</span>
                    </div>
                    
                    {lastScanResult.reward?.badge && (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Бейдж:</span>
                        <Badge variant="secondary">
                          {lastScanResult.reward.badge}
                        </Badge>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-red-600">
                    <span className="font-medium">Ошибка:</span> {lastScanResult.error}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scan History */}
        {state.scanHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="w-5 h-5" />
                <span>История сканирования</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {state.scanHistory.map((scan, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      scan.success 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <code className="text-sm font-mono">{scan.code}</code>
                        {scan.success ? (
                          <div className="text-sm text-green-600 mt-1">
                            {scan.reward?.message}
                          </div>
                        ) : (
                          <div className="text-sm text-red-600 mt-1">
                            {scan.error}
                          </div>
                        )}
                      </div>
                      {scan.reward?.badge && (
                        <Badge variant="secondary" className="ml-2">
                          {scan.reward.badge}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card className="mt-8 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-red-600">
                <strong>Ошибка:</strong> {error}
              </div>
            </CardContent>
          </Card>
        )}

        {/* QR Scanner Modal */}
        {showScanner && (
          <QRScanner
            onSuccess={handleQRSuccess}
            onClose={() => setShowScanner(false)}
            userId="test-user"
          />
        )}
      </div>
    </div>
  );
}
