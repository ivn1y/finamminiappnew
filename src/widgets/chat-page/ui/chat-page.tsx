'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, MessageSquare, UserPlus } from 'lucide-react';
import chatKB from '@/shared/data/chat-kb.json';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { useAppStore } from '@/shared/store/app-store';
import { AssistantTour } from '@/features/app-tour';
import Image from 'next/image';

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

const FinamLogoIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width='60'
		height='56'
		viewBox='0 0 60 56'
		fill='none'
	>
		<path
			d='M8.09302 24.5397C2.68642 29.1376 0.511628 34.0209 0 36.2518L6.27907 41.1318C6.7907 38.901 8.96549 34.0176 14.3721 29.4197C16.8515 27.3111 19.6377 26.2635 22.6284 25.1389C26.1591 23.8113 29.9747 22.3765 33.907 18.9625C42.4186 11.5727 44.5116 4.88005 44.5116 4.88005L38.2326 0C38.2326 0 36.1395 6.69264 27.6279 14.0824C23.6956 17.4964 19.88 18.9312 16.3493 20.2588C13.3587 21.3834 10.5725 22.4311 8.09302 24.5397Z'
			fill='url(#paint0_linear_63_6227)'
		/>
		<path
			d='M26.093 38.6226C20.6864 43.2205 18.5116 48.1038 18 50.3347L24.2791 55.2147C24.7907 52.9838 26.9655 48.1005 32.3721 43.5026C34.975 41.289 37.8338 40.1443 40.9489 38.8969C44.3041 37.5534 47.9566 36.0909 51.907 33.0454C56.7907 29.2803 60 23.8425 60 23.8425L53.7209 18.9625C53.7209 18.9625 52.8911 21.8594 45.6279 28.1653C41.6956 31.5793 37.88 33.0141 34.3493 34.3417C31.3587 35.4663 28.5725 36.514 26.093 38.6226Z'
			fill='url(#paint1_linear_63_6227)'
		/>
		<path
			d='M8.79069 43.3627C9.30232 41.1319 11.4771 36.2485 16.8837 31.6506C19.3632 29.542 22.1494 28.4944 25.14 27.3698C28.6707 26.0422 32.4863 24.6074 36.4186 21.1934C47.018 11.991 49.2558 1.95204 49.2558 1.95204L55.5349 6.83209C55.5349 6.83209 52.7442 18.1259 42.6977 26.0734C38.7435 29.2015 35.0529 30.6601 31.6574 32.0022C28.5749 33.2205 25.7355 34.3428 23.1628 36.5307C17.7562 41.1286 15.5814 46.0119 15.0698 48.2428L8.79069 43.3627Z'
			fill='url(#paint2_linear_63_6227)'
		/>
		<defs>
			<linearGradient
				id='paint0_linear_63_6227'
				x1='48.5619'
				y1='1.87761e-06'
				x2='2.60869'
				y2='1.86726e-06'
				gradientUnits='userSpaceOnUse'
			>
				<stop stopColor='#FEDA3B' />
				<stop
					offset='0.47'
					stopColor='#EF5541'
				/>
				<stop
					offset='0.815'
					stopColor='#821EE0'
				/>
				<stop
					offset='0.98'
					stopColor='#7F2A8A'
				/>
			</linearGradient>
			<linearGradient
				id='paint1_linear_63_6227'
				x1='48.5619'
				y1='1.87761e-06'
				x2='2.60869'
				y2='1.86726e-06'
				gradientUnits='userSpaceOnUse'
			>
				<stop stopColor='#FEDA3B' />
				<stop
					offset='0.47'
					stopColor='#EF5541'
				/>
				<stop
					offset='0.815'
					stopColor='#821EE0'
				/>
				<stop
					offset='0.98'
					stopColor='#7F2A8A'
				/>
			</linearGradient>
			<linearGradient
				id='paint2_linear_63_6227'
				x1='48.5619'
				y1='1.87761e-06'
				x2='2.60869'
				y2='1.86726e-06'
				gradientUnits='userSpaceOnUse'
			>
				<stop stopColor='#FEDA3B' />
				<stop
					offset='0.47'
					stopColor='#EF5541'
				/>
				<stop
					offset='0.815'
					stopColor='#821EE0'
				/>
				<stop
					offset='0.98'
					stopColor='#7F2A8A'
				/>
			</linearGradient>
		</defs>
	</svg>
);

const SendIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
    <path d="M7 17C7 17.5523 7.44772 18 8 18C8.55228 18 9 17.5523 9 17H8H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM8 17H9L9 1H8H7L7 17H8Z" fill="white"/>
  </svg>
);

// Компонент аватара пользователя
const UserAvatar: React.FC<{ userRole: string }> = ({ userRole }) => {
  const roleImageMapping: Record<string, string> = {
    trader: '/assets/roles/trader.png',
    startup: '/assets/roles/startaper.png',
    partner: '/assets/roles/partner.png',
    guest: '/assets/roles/guest.jpg',
    expert: '/assets/roles/expert.png',
  };

  const roleImage = roleImageMapping[userRole] || '/assets/roles/guest.jpg';
  
  return (
    <div className="w-8 h-8 rounded-[12px] border border-[#7b36b7] overflow-hidden">
      <Image
        src={roleImage}
        alt={`${userRole} avatar`}
        width={32}
        height={32}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

// Компонент аватара бота
const BotAvatar: React.FC = () => {
  return (
    <div className="w-8 h-8 rounded-[12px] border border-[#7b36b7] overflow-hidden flex items-center justify-center">
      <Image
        src="/assets/logos/logo.png"
        alt="Finam AI Assistant"
        width={22.584}
        height={20.8}
        style={{ flexShrink: 0 }}
      />
    </div>
  );
};


export const ChatPage: React.FC = () => {
  const { user, showAssistantTour, endAssistantTour } = useAppStore();
  const kb = chatKB as ChatKB;
  
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Проверяем, есть ли данные пользователя
  const hasUserData = user && user.name && user.credentials?.email && user.credentials?.phone;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const hasUserMessages = messages.filter(m => m.isUser).length > 0;

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

  // Функция для логирования запросов к AI-ассистенту
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
      const existingLogs = JSON.parse(localStorage.getItem('ai_assistant_logs') || '[]');
      existingLogs.push(eventData);
      localStorage.setItem('ai_assistant_logs', JSON.stringify(existingLogs));
      
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
              eventType: 'ai_assistant_request',
              data: eventData
            })
          });
        } catch (error) {
          console.warn('Failed to log to server:', error);
        }
      }
    } catch (error) {
      console.error('Failed to log AI assistant request:', error);
    }
  };

  const handleQuickButtonClick = (buttonId: string) => {
    const button = kb.quickButtons.find(b => b.id === buttonId);
    if (!button) return;

    // Завершаем AssistantTour при нажатии на быструю кнопку
    if (showAssistantTour && messages.filter(m => m.isUser).length === 0) {
      endAssistantTour();
    }

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

    // Завершаем AssistantTour при отправке первого сообщения
    if (showAssistantTour && messages.filter(m => m.isUser).length === 0) {
      endAssistantTour();
    }

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

  if (!hasUserMessages) {
		return (
			<>
        {showAssistantTour && <AssistantTour onComplete={endAssistantTour} />}
				<div className='flex flex-col items-center w-full h-screen bg-black overflow-hidden'>
					<div className='relative w-full max-w-[393px] h-[866px] mx-auto'>
						{/* Gradient Background */}
						<div
							className='absolute top-[324px] left-1/2 -translate-x-1/2 w-[284px] h-[205px] rounded-full opacity-50 blur-[120px]'
							style={{
								background:
									'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)',
							}}
						/>

						{/* Content Block */}
						<div className='absolute top-[292px] left-1/2 -translate-x-1/2 flex flex-col items-center w-full'>
							<FinamLogoIcon />
							<h1 className='mt-[7px] w-[352px] font-inter-tight text-white text-[30px] font-normal leading-[110%] tracking-[-0.6px] text-center'>
								Привет, я AI - Ассиcтент
								<span className='block'>Finam</span>
							</h1>
							<p className='mt-[14px] w-[336px] text-[rgba(255,255,255,0.72)] font-sans text-[17px] font-normal leading-[24px] tracking-[-0.17px] text-center'>
								Чему могу помочь?
							</p>
						</div>

						{/* Input Block */}
						<div className='absolute bottom-[104px] left-1/2 -translate-x-1/2 w-[353px]'>
							<div className='relative w-full h-[56px]'>
								<Input
									type='text'
									value={inputText}
									onChange={e => setInputText(e.target.value)}
									onKeyPress={handleKeyPress}
									placeholder={hasUserData ? 'Что такое Collab?' : 'Сначала заполните данные в профиле'}
									className='w-full h-full rounded-[8px] border border-[#373740] bg-[rgba(79,79,89,0.16)] p-4 pr-[56px] text-base font-normal leading-6 tracking-[-0.128px] text-white placeholder:text-[#6F6F7C] focus-visible:ring-offset-0 focus:outline-none focus:border-[#FFE479]'
									readOnly={!hasUserData}
									disabled={!hasUserData}
								/>
								{inputText.trim() && hasUserData && (
									<button
										type="button"
										onClick={handleSendMessage}
										className="absolute right-[10px] top-1/2 -translate-y-1/2 w-[36px] h-[36px] flex-shrink-0 rounded-[12px] bg-[#59307C] flex items-center justify-center"
									>
										<SendIcon />
									</button>
								)}
							</div>
						</div>
					</div>
				</div>

			</>
		);
	}

	return (
		<>
			{showAssistantTour && <AssistantTour onComplete={endAssistantTour} />}
			<div className='flex justify-center w-full h-screen bg-black overflow-hidden'>
				<div className='relative w-full max-w-[393px] h-[866px]'>
					{/* Messages Container */}
					<div className='absolute top-0 left-0 right-0 bottom-[180px] overflow-y-auto'>
						<div className='px-5 pt-[222px] pb-4 space-y-5'>
							{messages.map(message => (
								<div
									key={message.id}
									className={`flex ${
										message.isUser ? 'justify-end' : 'justify-start'
									}`}
								>
									{/* Аватар для сообщений бота */}
									{!message.isUser && (
										<div className="flex-shrink-0 mr-3 self-end">
											<BotAvatar />
										</div>
									)}
									
							<div
								className={
									message.isUser
										? 'flex max-w-[257px] bg-[#59307c] rounded-[12px_4px_12px_12px] p-[12px_10px_10px_10px] justify-center items-center gap-2.5'
										: 'flex max-w-[262px] items-center justify-center gap-2.5 rounded-[12px] bg-[#151519] p-[12px_10px]'
								}
							>
								<p className={`text-white font-inter-tight font-normal tracking-[-0.056px] whitespace-pre-line ${
									message.isUser 
										? 'text-[14px] leading-[20px]' 
										: 'text-sm leading-5'
								}`}>
									{message.text}
								</p>
							</div>

									{/* Аватар для сообщений пользователя */}
									{message.isUser && user?.role && (
										<div className="flex-shrink-0 ml-3 self-end">
											<UserAvatar userRole={user.role} />
										</div>
									)}
								</div>
							))}

							{/* Typing indicator */}
							{isTyping && (
								<div className='flex justify-start'>
									<div className="flex-shrink-0 mr-3 self-end">
										<BotAvatar />
									</div>
									<div className='max-w-[257px] rounded-[12px] bg-[#151519] p-[12px_10px]'>
										<div className='flex space-x-1'>
											<div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' />
											<div
												className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
												style={{ animationDelay: '0.1s' }}
											/>
											<div
												className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
												style={{ animationDelay: '0.2s' }}
											/>
										</div>
									</div>
								</div>
							)}

							<div ref={messagesEndRef} />
						</div>
					</div>

					{/* Input Block */}
					<div className='absolute bottom-[104px] left-0 right-0 px-5'>
						<div className='relative w-full h-[56px]'>
							<Input
								type='text'
								value={inputText}
								onChange={e => setInputText(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder={hasUserData ? 'Что такое Collab?' : 'Сначала заполните данные в профиле'}
								className='w-full h-full rounded-[8px] border border-[#373740] bg-[rgba(79,79,89,0.16)] p-4 pr-[56px] text-base font-normal leading-6 tracking-[-0.128px] text-white placeholder:text-[#6F6F7C] focus-visible:ring-offset-0 focus:outline-none focus:border-[#FFE479]'
								readOnly={!hasUserData}
							/>
							{inputText.trim() && hasUserData && (
								<button
									type="button"
									onClick={handleSendMessage}
									className="absolute right-[10px] top-1/2 -translate-y-1/2 w-[36px] h-[36px] flex-shrink-0 rounded-[12px] bg-[#59307C] flex items-center justify-center"
								>
									<SendIcon />
								</button>
							)}
						</div>
					</div>
				</div>
			</div>

		</>
	);
};
