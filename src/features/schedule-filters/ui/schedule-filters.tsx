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
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const applyFilters = useCallback(() => {
    const query = searchTerm.toLowerCase().trim();

    if (!query) {
      onFilterChange(null);
      return;
    }

    const filteredEvents = events.filter(event =>
      event.speakers.some(speaker =>
        speaker.toLowerCase().includes(query)
      ) ||
      event.title.toLowerCase().includes(query) ||
      (event.description && event.description.toLowerCase().includes(query))
    );

    onFilterChange(filteredEvents);
  }, [events, onFilterChange, searchTerm]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      applyFilters();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [applyFilters]);

  const dynamicStyles = isFocused
    ? {
        border: '1px solid #FFE479',
        background: 'rgba(79, 79, 89, 0.00)',
      }
    : {
        border: '1px solid #373740',
        background: 'rgba(79, 79, 89, 0.16)',
      };

  return (
    <div className="relative flex w-full items-center">
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Поиск по фильтрам"
        className="w-full bg-transparent rounded-lg text-white px-4 py-2"
        style={{
          ...dynamicStyles,
          padding: '8px 12px 8px 16px',
          color: 'var(---input-placeholder, #6F6F7C)',
          borderRadius: '8px',
        }}
      />
    </div>
  );
};
