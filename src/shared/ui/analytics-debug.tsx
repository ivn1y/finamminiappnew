'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { ScrollArea } from './scroll-area';
import { Separator } from './separator';
import { analyticsService } from '../lib/analytics-service';
import { AnalyticsEvent } from '../lib/mock-api-client';
import { unifiedApiService } from '../lib/unified-api-service';

export function AnalyticsDebug() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [chatLogs, setChatLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'analytics' | 'ai-assistant'>('analytics');

  useEffect(() => {
    loadEvents();
    loadStats();
    loadChatLogs();
  }, []);

  const loadEvents = () => {
    const localEvents = analyticsService.getLocalEvents();
    setEvents(localEvents);
  };

  const loadStats = () => {
    const eventStats = analyticsService.getEventStats();
    setStats(eventStats);
  };

  const loadChatLogs = () => {
    try {
      const logs = JSON.parse(localStorage.getItem('ai_assistant_logs') || '[]');
      setChatLogs(logs);
    } catch (error) {
      console.error('Failed to load AI assistant logs:', error);
      setChatLogs([]);
    }
  };

  const clearEvents = () => {
    analyticsService.clearLocalEvents();
    loadEvents();
    loadStats();
  };

  const clearChatLogs = () => {
    localStorage.removeItem('ai_assistant_logs');
    loadChatLogs();
  };

  const syncWithServer = async () => {
    try {
      await analyticsService.syncWithServer();
      loadEvents();
      loadStats();
      alert('События синхронизированы с сервером');
    } catch (error) {
      console.error('Failed to sync with server:', error);
      alert('Ошибка синхронизации с сервером');
    }
  };

  const exportEvents = () => {
    const eventsJson = analyticsService.exportEvents();
    const blob = new Blob([eventsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-events-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getEventTypeColor = (eventType: string) => {
    const colors = {
      role_selected: 'bg-blue-500',
      profile_submitted: 'bg-green-500',
      quest_completed: 'bg-purple-500',
      qr_scanned: 'bg-orange-500',
      badge_earned: 'bg-yellow-500',
    };
    return colors[eventType as keyof typeof colors] || 'bg-gray-500';
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ru-RU');
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          Debug ({events.length + chatLogs.length})
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96">
      <Card className="shadow-xl border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Debug Panel</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
            >
              ✕
            </Button>
          </div>
          <div className="flex space-x-2 mt-2">
            <Button
              size="sm"
              variant={activeTab === 'analytics' ? 'default' : 'outline'}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics ({events.length})
            </Button>
            <Button
              size="sm"
              variant={activeTab === 'ai-assistant' ? 'default' : 'outline'}
              onClick={() => setActiveTab('ai-assistant')}
            >
              AI-Ассистент ({chatLogs.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeTab === 'analytics' ? (
            <>
              {/* Статистика */}
              {stats && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Статистика:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Всего событий: {stats.totalEvents}</div>
                    <div>API режим: {unifiedApiService.getMode()}</div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(stats.eventsByType).map(([type, count]) => (
                      <Badge key={type} className={`${getEventTypeColor(type)} text-white text-xs`}>
                        {type}: {count as number}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Действия */}
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={loadEvents} variant="outline">
                  Обновить
                </Button>
                <Button size="sm" onClick={syncWithServer} variant="outline">
                  Синхронизировать
                </Button>
                <Button size="sm" onClick={exportEvents} variant="outline">
                  Экспорт
                </Button>
                <Button size="sm" onClick={clearEvents} variant="destructive">
                  Очистить
                </Button>
              </div>

              <Separator />

              {/* Список событий */}
              <div>
                <div className="text-sm font-medium mb-2">Последние события:</div>
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {events.slice(0, 10).map((event) => (
                      <div key={event.id} className="text-xs border rounded p-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={`${getEventTypeColor(event.eventType)} text-white text-xs`}>
                            {event.eventType}
                          </Badge>
                          <span className="text-gray-500">
                            {formatTimestamp(event.createdAt)}
                          </span>
                        </div>
                        <div className="text-gray-600">
                          User: {event.userId}
                        </div>
                        {event.data && Object.keys(event.data).length > 0 && (
                          <div className="text-gray-500 mt-1">
                            {JSON.stringify(event.data, null, 2).substring(0, 100)}...
                          </div>
                        )}
                      </div>
                    ))}
                    {events.length === 0 && (
                      <div className="text-gray-500 text-center py-4">
                        Нет событий
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </>
          ) : (
            <>
              {/* Статистика AI-ассистента */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Статистика AI-ассистента:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Всего запросов: {chatLogs.length}</div>
                  <div>Фолбэков: {chatLogs.filter(log => log.isFallback).length}</div>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Badge className="bg-green-500 text-white text-xs">
                    Ответы из KB: {chatLogs.filter(log => !log.isFallback).length}
                  </Badge>
                  <Badge className="bg-yellow-500 text-white text-xs">
                    Передано команде: {chatLogs.filter(log => log.isFallback).length}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Действия для AI-ассистента */}
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={loadChatLogs} variant="outline">
                  Обновить
                </Button>
                <Button size="sm" onClick={clearChatLogs} variant="destructive">
                  Очистить
                </Button>
              </div>

              <Separator />

              {/* Список запросов AI-ассистента */}
              <div>
                <div className="text-sm font-medium mb-2">Последние запросы:</div>
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {chatLogs.slice(0, 10).map((log, index) => (
                      <div key={index} className="text-xs border rounded p-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={`${log.isFallback ? 'bg-yellow-500' : 'bg-green-500'} text-white text-xs`}>
                            {log.isFallback ? 'Фолбэк' : 'KB'}
                          </Badge>
                          <span className="text-gray-500">
                            {formatTimestamp(log.timestamp)}
                          </span>
                        </div>
                        <div className="text-gray-600 mb-1">
                          <strong>Q:</strong> {log.query}
                        </div>
                        <div className="text-gray-500 text-xs">
                          <strong>A:</strong> {log.response.substring(0, 100)}...
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                          User: {log.userId}
                        </div>
                      </div>
                    ))}
                    {chatLogs.length === 0 && (
                      <div className="text-gray-500 text-center py-4">
                        Нет запросов к AI-ассистенту
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
