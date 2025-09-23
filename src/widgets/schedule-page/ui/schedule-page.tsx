'use client';

import React, { useState } from 'react';
import { scheduleData } from '@/shared/data/seed';
import { ScheduleEvent } from '@/shared/types/app';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { TelegramCommunityCTA } from '@/shared/ui/telegram-community-cta';
import { ScheduleFilters } from '@/features/schedule-filters';
import { Clock, Users, Mic, Coffee, Utensils, Users2, Calendar, Search } from 'lucide-react';

export const SchedulePage: React.FC = () => {
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<ScheduleEvent[]>(scheduleData.events);

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'Выступление':
        return <Mic className="w-4 h-4" />;
      case 'Панель':
        return <Users className="w-4 h-4" />;
      case 'Круглый стол':
        return <Users2 className="w-4 h-4" />;
      case 'Кофе-брейк':
        return <Coffee className="w-4 h-4" />;
      case 'Обед':
        return <Utensils className="w-4 h-4" />;
      case 'After Party':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'Выступление':
        return 'bg-blue-100 text-blue-800';
      case 'Панель':
        return 'bg-green-100 text-green-800';
      case 'Круглый стол':
        return 'bg-purple-100 text-purple-800';
      case 'Кофе-брейк':
        return 'bg-orange-100 text-orange-800';
      case 'Обед':
        return 'bg-red-100 text-red-800';
      case 'After Party':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const blocks = Array.from(new Set(scheduleData.events.map(event => event.block).filter(Boolean)));
  
  const handleFilterChange = (events: ScheduleEvent[]) => {
    setFilteredEvents(events);
  };

  const displayEvents = selectedBlock 
    ? filteredEvents.filter(event => event.block === selectedBlock)
    : filteredEvents;

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Расписание конференции</h1>
          <p className="text-lg text-gray-600">TradeID 2025 - Все события дня</p>
        </div>

        {/* Block Filter */}
        {blocks.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedBlock(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedBlock === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Все блоки
              </button>
              {blocks.map((block) => (
                <button
                  key={block}
                  onClick={() => block && setSelectedBlock(block)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedBlock === block
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {block}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Schedule Filters */}
        <ScheduleFilters
          events={scheduleData.events}
          onFilterChange={handleFilterChange}
        />

        {/* Events Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Найдено событий: <span className="font-medium text-gray-900">{displayEvents.length}</span>
            {selectedBlock && (
              <span className="ml-2 text-blue-600">
                в блоке "{selectedBlock}"
              </span>
            )}
          </p>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {displayEvents.length > 0 ? (
            displayEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </div>
                      <Badge className={getFormatColor(event.format)}>
                        <div className="flex items-center gap-1">
                          {getFormatIcon(event.format)}
                          {event.format}
                        </div>
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    
                    {event.description && (
                      <p className="text-gray-600 mb-3">
                        {event.description}
                      </p>
                    )}
                    
                    {event.speakers.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {event.speakers.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    События не найдены
                  </h3>
                  <p className="text-gray-600">
                    Попробуйте изменить фильтры или выбрать другой блок
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Telegram Community CTA */}
        <div className="mt-8">
          <TelegramCommunityCTA />
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Обновлено: {new Date().toLocaleDateString('ru-RU')}
          </p>
        </div>
      </div>
    </div>
  );
};
