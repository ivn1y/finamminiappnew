'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Search, User, X } from 'lucide-react';
import { ScheduleEvent } from '@/shared/types/app';

interface ScheduleFiltersProps {
  events: ScheduleEvent[];
  onFilterChange: (filteredEvents: ScheduleEvent[]) => void;
}

export const ScheduleFilters: React.FC<ScheduleFiltersProps> = ({
  events,
  onFilterChange
}) => {
  const [speakerFilter, setSpeakerFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('');

  const applyFilters = () => {
    let filteredEvents = events;

    // Фильтр по спикеру
    if (speakerFilter.trim()) {
      const speakerQuery = speakerFilter.toLowerCase().trim();
      filteredEvents = filteredEvents.filter(event =>
        event.speakers.some(speaker =>
          speaker.toLowerCase().includes(speakerQuery)
        )
      );
    }

    // Фильтр по названию и описанию
    if (titleFilter.trim()) {
      const titleQuery = titleFilter.toLowerCase().trim();
      filteredEvents = filteredEvents.filter(event =>
        event.title.toLowerCase().includes(titleQuery) ||
        (event.description && event.description.toLowerCase().includes(titleQuery))
      );
    }

    onFilterChange(filteredEvents);
  };

  const clearFilters = () => {
    setSpeakerFilter('');
    setTitleFilter('');
    onFilterChange(events);
  };

  const hasActiveFilters = speakerFilter.trim() || titleFilter.trim();

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Search className="w-5 h-5 text-blue-600" />
          <span>Фильтры</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Фильтр по спикеру */}
          <div>
            <label htmlFor="speaker-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Поиск по спикеру
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="speaker-filter"
                type="text"
                value={speakerFilter}
                onChange={(e) => setSpeakerFilter(e.target.value)}
                placeholder="Например: Ибрагим, Антон Клевцов..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Фильтр по названию */}
          <div>
            <label htmlFor="title-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Поиск по названию или теме
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="title-filter"
                type="text"
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
                placeholder="Например: Трейдинг, Криптовалюта, ФРС..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Кнопки управления */}
          <div className="flex space-x-2">
            <Button
              onClick={applyFilters}
              className="flex-1"
              disabled={!hasActiveFilters}
            >
              <Search className="w-4 h-4 mr-1" />
              Применить фильтры
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-1" />
                Очистить
              </Button>
            )}
          </div>

          {/* Информация о результатах */}
          {hasActiveFilters && (
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <p>
                Найдено событий: <span className="font-medium">{events.length}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Нажмите "Применить фильтры" для поиска
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
