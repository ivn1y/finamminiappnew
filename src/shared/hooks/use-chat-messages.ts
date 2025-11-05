'use client';

import { useCallback } from 'react';
import { useAppStore } from '@/shared/store/app-store';
import { ChatMessage } from '@/shared/types/app';

export const useChatMessages = () => {
  const { user, addChatMessage, getChatMessages, clearChatMessages } = useAppStore();

  // Определение контекста продукта из текста сообщения
  const detectProductContext = useCallback((text: string): string | undefined => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('дневник') || lowerText.includes('journal')) {
      return 'Дневник Трейдера';
    }
    if (lowerText.includes('trade api') || lowerText.includes('api')) {
      return 'Trade API';
    }
    if (lowerText.includes('ai-скринер') || lowerText.includes('скринер')) {
      return 'AI-скринер';
    }
    if (lowerText.includes('ук') || lowerText.includes('фонд')) {
      return 'УК для алго-фондов';
    }
    if (lowerText.includes('ziplime')) {
      return 'ZipLime';
    }
    if (lowerText.includes('hyperadar')) {
      return 'HypeRadar';
    }
    if (lowerText.includes('международные рынки')) {
      return 'Международные рынки';
    }
    if (lowerText.includes('проп-трейдинг') || lowerText.includes('prop')) {
      return 'Проп-трейдинг';
    }
    
    return undefined;
  }, []);

  // Добавление сообщения с автоматическим определением контекста
  const addMessage = useCallback((
    text: string, 
    isUser: boolean, 
    customId?: string
  ): ChatMessage => {
    const message: ChatMessage = {
      id: customId || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text,
      isUser,
      timestamp: new Date().toISOString(),
      productContext: detectProductContext(text),
    };

    addChatMessage(message);
    return message;
  }, [addChatMessage, detectProductContext]);

  // Получение последних сообщений с определенным контекстом продукта
  const getMessagesByProduct = useCallback((productName: string): ChatMessage[] => {
    const messages = getChatMessages();
    return messages.filter(msg => msg.productContext === productName);
  }, [getChatMessages]);

  // Получение последнего контекста продукта из сообщений
  const getLastProductContext = useCallback((): string | undefined => {
    const messages = getChatMessages();
    // Ищем последнее сообщение с контекстом продукта
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].productContext) {
        return messages[i].productContext;
      }
    }
    return undefined;
  }, [getChatMessages]);

  // Получение статистики сообщений
  const getMessagesStats = useCallback(() => {
    const messages = getChatMessages();
    const userMessages = messages.filter(msg => msg.isUser);
    const botMessages = messages.filter(msg => !msg.isUser);
    
    // Подсчет упоминаний продуктов
    const productMentions: Record<string, number> = {};
    messages.forEach(msg => {
      if (msg.productContext) {
        productMentions[msg.productContext] = (productMentions[msg.productContext] || 0) + 1;
      }
    });

    return {
      total: messages.length,
      userMessages: userMessages.length,
      botMessages: botMessages.length,
      productMentions,
      hasMessages: messages.length > 0,
    };
  }, [getChatMessages]);

  // Синхронизация с localStorage (легкая, не нагружающая)
  const syncToStorage = useCallback(() => {
    if (typeof window === 'undefined' || !user) return;
    
    try {
      const messages = getChatMessages();
      const storageKey = `chat_messages_${user.id}`;
      
      // Сохраняем только если есть изменения
      const stored = localStorage.getItem(storageKey);
      const currentData = JSON.stringify(messages);
      
      if (stored !== currentData) {
        localStorage.setItem(storageKey, currentData);
      }
    } catch (error) {
      console.warn('Не удалось синхронизировать сообщения с localStorage:', error);
    }
  }, [user, getChatMessages]);

  // Загрузка из localStorage при инициализации
  const loadFromStorage = useCallback(() => {
    if (typeof window === 'undefined' || !user) return;
    
    try {
      const storageKey = `chat_messages_${user.id}`;
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        const messages: ChatMessage[] = JSON.parse(stored);
        // Восстанавливаем только если текущих сообщений нет
        const currentMessages = getChatMessages();
        if (currentMessages.length === 0 && messages.length > 0) {
          // Восстанавливаем по одному сообщению
          messages.forEach(msg => addChatMessage(msg));
        }
      }
    } catch (error) {
      console.warn('Не удалось загрузить сообщения из localStorage:', error);
    }
  }, [user, getChatMessages, addChatMessage]);

  return {
    // Основные методы
    addMessage,
    getChatMessages,
    clearChatMessages,
    
    // Расширенные методы
    getMessagesByProduct,
    getLastProductContext,
    getMessagesStats,
    
    // Синхронизация
    syncToStorage,
    loadFromStorage,
    
    // Утилиты
    detectProductContext,
    
    // Состояние
    hasUser: !!user,
    messagesCount: getChatMessages().length,
  };
};
