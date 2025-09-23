'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/shared/store/app-store';
import { Map, QrCode, Users, ChevronRight, Gift } from 'lucide-react';
import { roleContent } from '@/shared/data/seed';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';

export const HomePage: React.FC = () => {
  const { user, eventMode } = useAppStore();

  if (!user || !user.role) return null;

  const role = roleContent.find(r => r.id === user.role);
  if (!role) return null;


  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-24">
      <div className="max-w-md mx-auto lg:max-w-4xl xl:max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Привет, {role.title}!
          </h1>
          <p className="text-lg text-gray-600">
            Добро пожаловать в Finam Collab
          </p>
        </div>


        {/* Action Cards */}
        <div className="space-y-4 mb-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
          {/* Заполни профиль */}
          <Link href="/collab/profile">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-5">
                  <div className="w-16 h-16 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <Users className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">Заполни профиль</h3>
                    <p className="text-gray-600 text-base">Расскажи о себе и своих целях</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Открой карту */}
          <Link href="/collab/map">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-5">
                  <div className="w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center">
                    <Map className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">Открой карту</h3>
                    <p className="text-gray-600 text-base">Найди стенды и события</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Сканируй QR */}
          <Link href="/collab/map">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-5">
                  <div className="w-16 h-16 bg-yellow-50 rounded-lg flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">Сканируй QR</h3>
                    <p className="text-gray-600 text-base">Найди зоны и получи призы</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Присоединяйся к коммьюнити */}
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => window.open('https://t.me/finam_invest', '_blank')}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-5">
                <div className="w-16 h-16 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Присоединяйся к коммьюнити</h3>
                  <p className="text-gray-600 text-base">Telegram канал</p>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Daily Quest */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <Gift className="w-8 h-8 text-yellow-600" />
              <h3 className="text-xl font-semibold text-gray-900">Задание на сегодня</h3>
            </div>
            
            <div 
              className="bg-blue-50 hover:bg-blue-100 rounded-lg p-6 cursor-pointer transition-colors duration-200 ease-in-out"
              onClick={() => window.open('https://t.me/finam_invest', '_blank')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.open('https://t.me/finam_invest', '_blank');
                }
              }}
            >
              <h4 className="text-lg font-medium text-blue-600 mb-3">Присоединиться к нашему Telegram коммьюнити</h4>
              <p className="text-gray-700 text-base mb-4">Стань частью сообщества Finam Invest и получи доступ к эксклюзивным материалам, обсуждениям и новостям</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Награда: Доступ к коммьюнити</span>
                <div className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium text-sm">
                  Присоединиться
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
