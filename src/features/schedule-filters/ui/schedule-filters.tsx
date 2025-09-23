'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Search, User, X, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(false);

  const applyFilters = useCallback(() => {
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
  }, [events, onFilterChange, speakerFilter, titleFilter]);

  // Автоматический поиск при изменении фильтров
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      applyFilters();
    }, 300); // Задержка 300мс для избежания слишком частых поисков

    return () => clearTimeout(timeoutId);
  }, [applyFilters]);

  const clearFilters = () => {
    setSpeakerFilter('');
    setTitleFilter('');
    onFilterChange(events);
  };

  const hasActiveFilters = speakerFilter.trim() || titleFilter.trim();

  return (
    <Card className="mb-6">
      <CardHeader 
        className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-blue-600" />
            <span>Фильтры</span>
            {hasActiveFilters && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Активны
              </span>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </CardTitle>
      </CardHeader>
      
      {isExpanded && (
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

            {/* Кнопка очистки */}
            {hasActiveFilters && (
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  size="sm"
                >
                  <X className="w-4 h-4 mr-1" />
                  Очистить фильтры
                </Button>
              </div>
            )}

            {/* Информация о результатах */}
            {hasActiveFilters && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">
                  Поиск выполняется автоматически при вводе
                </p>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
