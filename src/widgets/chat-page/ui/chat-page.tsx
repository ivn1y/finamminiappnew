'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageSquare } from 'lucide-react';
import chatKB from '@/shared/data/chat-kb.json';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { useAppStore } from '@/shared/store/app-store';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isFallback?: boolean;
}

interface ChatKB {
  faq: Array<{
    id: string;
    question: string;
    answer: string;
    keywords: string[];
    category: string;
  }>;
  quickButtons: Array<{
    id: string;
    text: string;
  }>;
  fallbackMessage: string;
  welcomeMessage: string;
}

export const ChatPage: React.FC = () => {
  const { user } = useAppStore();
  const kb = chatKB as ChatKB;
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: kb.welcomeMessage,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Функция для поиска ответа в KB
  const findAnswerInKB = (query: string): string | null => {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Сначала ищем точное совпадение по ID
    const exactMatch = kb.faq.find(item => item.id === normalizedQuery);
    if (exactMatch) {
      return exactMatch.answer;
    }
    
    // Затем ищем по ключевым словам
    for (const item of kb.faq) {
      const hasKeywordMatch = item.keywords.some(keyword => 
        normalizedQuery.includes(keyword.toLowerCase())
      );
      
      if (hasKeywordMatch) {
        return item.answer;
      }
    }
    
    // Поиск по частичному совпадению в вопросе
    for (const item of kb.faq) {
      if (item.question.toLowerCase().includes(normalizedQuery) || 
          normalizedQuery.includes(item.question.toLowerCase())) {
        return item.answer;
      }
    }
    
    return null;
  };

  // Функция для логирования запросов
  const logChatRequest = async (query: string, response: string, isFallback: boolean = false) => {
    try {
      const eventData = {
        query,
        response,
        isFallback,
        userId: user?.id || 'anonymous',
        timestamp: new Date().toISOString()
      };
      
      // Логируем в localStorage
      const existingLogs = JSON.parse(localStorage.getItem('chat_logs') || '[]');
      existingLogs.push(eventData);
      localStorage.setItem('chat_logs', JSON.stringify(existingLogs));
      
      // Отправляем на сервер (если доступен)
      if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_USE_MOCK_API === 'true') {
        try {
          await fetch('http://localhost:3001/api/logEvent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user?.id || 'anonymous',
              eventType: 'chat_request',
              data: eventData
            })
          });
        } catch (error) {
          console.warn('Failed to log to server:', error);
        }
      }
    } catch (error) {
      console.error('Failed to log chat request:', error);
    }
  };

  const handleQuickButtonClick = (buttonId: string) => {
    const button = kb.quickButtons.find(b => b.id === buttonId);
    if (!button) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: button.text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Ищем ответ в KB
    setTimeout(() => {
      const answer = findAnswerInKB(buttonId);
      const response = answer || kb.fallbackMessage;
      const isFallback = !answer;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
        isFallback
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Логируем запрос
      logChatRequest(button.text, response, isFallback);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const query = inputText.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: query,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Ищем ответ в KB
    setTimeout(() => {
      const answer = findAnswerInKB(query);
      const response = answer || kb.fallbackMessage;
      const isFallback = !answer;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
        isFallback
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Логируем запрос
      logChatRequest(query, response, isFallback);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback className="bg-blue-600 text-white">
              <Bot className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">AI-ассистент</h1>
            <p className="text-base text-gray-500">Finam Collab</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
              message.isUser ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <Avatar className="w-8 h-8">
                <AvatarFallback className={
                  message.isUser 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }>
                  {message.isUser ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </AvatarFallback>
              </Avatar>
              
              <div className={`rounded-lg px-4 py-2 ${
                message.isUser
                  ? 'bg-blue-600 text-white'
                  : message.isFallback
                  ? 'bg-yellow-50 text-yellow-900 border border-yellow-200'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}>
                <p className="text-base whitespace-pre-line">{message.text}</p>
                {message.isFallback && (
                  <div className="mt-2 text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                    Передано команде
                  </div>
                )}
                <p className={`text-sm mt-2 ${
                  message.isUser ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gray-200 text-gray-600">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="mb-4">
          <p className="text-base text-gray-600 mb-4">Быстрые вопросы:</p>
          <div className="grid grid-cols-2 gap-2">
            {kb.quickButtons.map((button) => (
              <Button
                key={button.id}
                variant="ghost"
                onClick={() => handleQuickButtonClick(button.id)}
                className="text-left justify-start h-auto p-3 bg-gray-50 hover:bg-gray-100"
              >
                <p className="text-sm font-medium text-gray-900">{button.text}</p>
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="flex space-x-2">
          <Input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Напишите сообщение..."
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            size="icon"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
