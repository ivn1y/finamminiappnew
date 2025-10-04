'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Search, User, X, ChevronDown, ChevronUp } from 'lucide-react';
import { ScheduleEvent } from '@/shared/types/app';

interface ScheduleFiltersProps {
  events: ScheduleEvent[];
  onFilterChange: (filteredEvents: ScheduleEvent[] | null) => void;
}

export const ScheduleFilters: React.FC<ScheduleFiltersProps> = ({
  events,
  onFilterChange
}) => {
  const [speakerFilter, setSpeakerFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const applyFilters = useCallback(() => {
    const speakerQuery = speakerFilter.toLowerCase().trim();
    const titleQuery = titleFilter.toLowerCase().trim();

    if (!speakerQuery && !titleQuery) {
      onFilterChange(null);
      return;
    }

    let filteredEvents = events;

    // Фильтр по спикеру
    if (speakerQuery) {
      filteredEvents = filteredEvents.filter(event =>
        event.speakers.some(speaker =>
          speaker.toLowerCase().includes(speakerQuery)
        )
      );
    }

    // Фильтр по названию и описанию
    if (titleQuery) {
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
  };

  const hasActiveFilters = speakerFilter.trim() || titleFilter.trim();

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-2 rounded-lg border border-[#373740] bg-[rgba(79,79,89,0.16)] px-4 py-2"
        style={{
            padding: '8px 12px 8px 16px',
        }}
      >
        <span
          className="font-sans text-base font-normal leading-6 tracking-[-0.128px]"
          style={{ color: 'var(---input-placeholder, #6F6F7C)' }}
        >
          Поиск по фильтрам
        </span>
      </button>

      {isExpanded && (
        <Card className="mt-2 bg-[#1E1E22] border-[#373740] text-white">
          <CardHeader>
            <CardTitle>Фильтры</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="speaker-filter" className="block text-sm font-medium mb-2">
                  Поиск по спикеру
                </label>
                <Input
                  id="speaker-filter"
                  type="text"
                  value={speakerFilter}
                  onChange={(e) => setSpeakerFilter(e.target.value)}
                  placeholder="Имя спикера..."
                  className="bg-transparent border-[#373740] text-white"
                />
              </div>

              <div>
                <label htmlFor="title-filter" className="block text-sm font-medium mb-2">
                  Поиск по названию или теме
                </label>
                <Input
                  id="title-filter"
                  type="text"
                  value={titleFilter}
                  onChange={(e) => setTitleFilter(e.target.value)}
                  placeholder="Тема выступления..."
                  className="bg-transparent border-[#373740] text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
