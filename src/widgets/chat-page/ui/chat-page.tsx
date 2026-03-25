'use client';

import chatKB from '@/shared/data/chat-kb.json';
import { useAppStore } from '@/shared/store/app-store';
import { Input } from '@/shared/ui/input';
import { Suggestions, Suggestion } from '@/shared/ui/suggestions';
import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useBooking } from '@/shared/hooks/use-booking';
import { useChatMessages } from '@/shared/hooks/use-chat-messages';

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

// FSM: типы и модель узлов сценария (на основе mermaid)
type ChatOption = {
  id: string;
  label: string;
  next: string;
  requiresProfile?: boolean;
};

type ChatNode = {
  id: string;
  message: string;
  options?: ChatOption[];
  kind?: 'router' | 'regular';
};

const FinamLogoIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 60 56'
		fill='none'
		className={className}
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
  const roleIconMapping: Record<string, string> = {
    trader: '/assets/icons/assistant/Trader.png',
    startup: '/assets/icons/assistant/Startuper.png',
    partner: '/assets/icons/assistant/Partner.png',
    guest: '/assets/icons/assistant/Guest.png',
    expert: '/assets/icons/assistant/Expert.png',
  };

  const roleIcon = roleIconMapping[userRole] || '/assets/icons/assistant/Guest.png';
  
  return (
    <div className="relative h-8 w-8 overflow-hidden rounded-[12px] border border-[#7b36b7] bg-[#151519]">
      <Image
        src={roleIcon}
        alt={`${userRole} avatar`}
        fill
        className="object-cover"
      />
    </div>
  );
};

// Компонент аватара бота
const BotAvatar: React.FC = () => {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-[12px] border border-solid border-[#CD81FF] bg-[#151519] p-1.5">
      <FinamLogoIcon className="h-full w-full" />
    </div>
  );
};


export const ChatPage: React.FC = () => {
  const { user } = useAppStore();
  const { submitBooking, isSubmitting } = useBooking();
  const { addMessage, loadFromStorage, syncToStorage, getLastProductContext } = useChatMessages();
  
  const kb = chatKB as ChatKB;
  
  const [useMessages, setMessages] = useState<Message[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [isChatOpened, setIsChatOpened] = useState(false);
  // Мемоизируем userContext чтобы избежать пересоздания при каждом рендере
  const userContext = useMemo(() => ({
    userId: user?.id || 'anonymous',
    name: user?.name || '',
    email: user?.credentials?.email || '',
    phone: user?.credentials?.phone || '',
    role: user?.role || '',
  }), [user?.id, user?.name, user?.credentials?.email, user?.credentials?.phone, user?.role]);

  const { messages: aiMessages, sendMessage, status, addToolResult } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat/proxy',
      body: {
        userContext
      }
    })
  });
  const mappedAiMessages = useMemo<Message[]>(
    () =>
      aiMessages
        .map((m: any, index: number) => {
          // Извлекаем текст из parts массива
          let text = '';
          if (m.parts && Array.isArray(m.parts)) {
            const textParts = m.parts.filter((p: any) => p.type === 'text' && p.text);
            text = textParts.map((p: any) => p.text).join('\n');
          } else if (m.content) {
            text = m.content;
          }
          
          // Используем текущее время для новых сообщений
          const timestamp = m.createdAt ? new Date(m.createdAt) : new Date(Date.now() + index);
          
          return {
        id: m.id,
            text,
        isUser: m.role === 'user',
            timestamp,
          };
        })
        .filter(m => m.text && m.text.trim() !== ''), // Фильтруем пустые сообщения
    [aiMessages]
  );
  
  // Объединяем и сортируем по timestamp для хронологического порядка
  const messages = useMemo(() => {
    const combined = [...useMessages, ...mappedAiMessages];
    return combined.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [useMessages, mappedAiMessages]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const STORAGE_KEYS = {
    messages: 'chat_fsm_messages',
    node: 'chat_fsm_current_node',
    isChatOpened: 'chat_fsm_is_chat_opened',
  } as const;

  // Функция для определения продукта по контексту сообщений
  const getProductContextFromMessages = (): string => {
    // Сначала пробуем получить последний контекст из store
    const lastContext = getLastProductContext();
    if (lastContext) {
      return lastContext;
    }
    
    // Если в store нет контекста, анализируем текущие сообщения
    const recentMessages = messages.slice(-10); // Берем последние 10 сообщений
    const messageText = recentMessages.map(m => m.text.toLowerCase()).join(' ');
    
    if (messageText.includes('дневник') || messageText.includes('journal')) {
      return 'Дневник Трейдера';
    }
    if (messageText.includes('trade api') || messageText.includes('api')) {
      return 'Trade API';
    }
    if (messageText.includes('ai-скринер') || messageText.includes('скринер')) {
      return 'AI-скринер';
    }
    if (messageText.includes('ук') || messageText.includes('фонд')) {
      return 'УК для алго-фондов';
    }
    if (messageText.includes('ziplime')) {
      return 'ZipLime';
    }
    if (messageText.includes('hyperadar')) {
      return 'Hype Radar';
    }
    if (messageText.includes('международные рынки')) {
      return 'Международные рынки';
    }
    
    return 'Общая консультация';
  };

  // FSM: описание сценария на основе mermaid
  const nodes: Record<string, ChatNode> = {
    greet: {
      id: 'greet',
      message:
        'Привет! Я твой персональный ассистент, и я помогу быстро разобраться в наших продуктах.\n\nЯ могу рассказать тебе о следующих продуктах:\n• Дневник Трейдера\n• Trade API\n• AI-скринер\n• УК — инфраструктура для алго-фондов\n• Проп-трейдинг\n• ZipLime\n• Hype Radar\n• Международные рынки\n\nПро какой продукт хочешь узнать подробнее?',
      options: [
        { id: 'C', label: 'Дневник трейдера', next: 'journal_intro' },
        { id: 'D', label: 'Trade API', next: 'trade_intro' },
        { id: 'n1', label: 'AI-скринер', next: 'ai_intro' },
        { id: 'n2', label: 'УК для алго-фондов', next: 'amc_intro' },
        { id: 'n3', label: 'ZipLime', next: 'ziplime_intro' },
        { id: 'n4', label: 'Hype Radar', next: 'hyperadar_intro' },
        { id: 'n5', label: 'Международные рынки', next: 'international_markets_intro' },
      ],
    },
    menu_more: {
      id: 'menu_more',
      message:
        'Окей, понял тебя. Давай тогда расскажу про другие продукты. У нас есть:\n• Дневник трейдера\n• Trade API\n• AI-скринер\n• УК\n• Международные рынки\n• ZipLime\n• Hype Radar\n\nЧто выберешь?',
      options: [
        { id: 'C', label: 'Дневник трейдера', next: 'journal_intro' },
        { id: 'D', label: 'Trade API', next: 'trade_intro' },
        { id: 'n1', label: 'AI-скринер', next: 'ai_intro' },
        { id: 'n2', label: 'УК', next: 'amc_intro' },
        { id: 'n3', label: 'ZipLime', next: 'ziplime_intro' },
        { id: 'n4', label: 'Hype Radar', next: 'hyperadar_intro' },
        { id: 'n5', label: 'Международные рынки', next: 'international_markets_intro' },
      ],
    },
    journal_intro: {
      id: 'journal_intro',
      message:
        'Дневник Трейдера — цифровой журнал сделок и идей: учёт позиций, импорт операций и аналитика эффективности. Полезен, чтобы:\n- фиксировать сделки и выводы за секунды;\n- получать визуальную аналитику P/L и рисков;\n- генерировать отчёты для дисциплины.\n\nМогу рассказать подробнее о продукте или записать тебя в бета-тест.',
      options: [
        { id: 'n8', label: 'Расскажи подробнее', next: 'journal_more' },
        { id: 'n9', label: 'Запиши на бета-тест', next: 'profile_check', requiresProfile: true },
        { id: 'n7', label: 'Не интересно', next: 'menu_more' },
      ],
    },
    journal_more: {
      id: 'journal_more',
      message:
        'Сделки импортируются через брокерский счёт / CSV / API. Также можно подключить автозаметки.\nСейчас продукт в бете и предоставляется бесплатно. Готов записаться в группу бета-теста?',
      options: [
        { id: 'n24', label: 'Да', next: 'profile_check', requiresProfile: true },
        { id: 'n23', label: 'Нет', next: 'journal_beta_convince' },
      ],
    },
    journal_beta_convince: {
      id: 'journal_beta_convince',
      message:
        'Бета не требует от тебя ничего: попробуешь в любое время и сможешь повлиять на развитие. Точно не хочешь записаться?',
      options: [
        { id: 'n27', label: 'Хочу', next: 'profile_check', requiresProfile: true },
        { id: 'n26', label: 'Не хочу', next: 'menu_more' },
      ],
    },
    trade_intro: {
      id: 'trade_intro',
      message:
        'Trade API — инструмент для торговли и автоматизации. Подключай алгоритмы и приложения к инфраструктуре Финам. Могу рассказать подробнее или передать контакты для подключения.',
      options: [
        { id: 'n29', label: 'Подробнее', next: 'trade_more' },
        { id: 'n31', label: 'Хочу подключиться', next: 'profile_check', requiresProfile: true },
        { id: 'n30', label: 'Не интересно', next: 'menu_more' },
      ],
    },
    trade_more: {
      id: 'trade_more',
      message:
        'Идеально для тех, кто торгует по алгоритмам. Чем мы отличаемся:\n• Американские акции и ETF (9 000)\n• Американские фьючерсы (топ-10)\n• Американские опционы (2 000 базовых активов)\n• Опционы на фьючерсы в РФ\n\nПодключиться к нашему API?',
      options: [
        { id: 'n33', label: 'Да', next: 'profile_check', requiresProfile: true },
        { id: 'n34', label: 'Нет', next: 'trade_convince' },
      ],
    },
    trade_convince: {
      id: 'trade_convince',
      message:
        'Trade API позволяет работать быстрее других. Точно не хочешь подключиться?',
      options: [
        { id: 'n36', label: 'Хочу', next: 'profile_check', requiresProfile: true },
        { id: 'n37', label: 'Не хочу', next: 'menu_more' },
      ],
    },
    ai_intro: {
      id: 'ai_intro',
      message:
        'AI-скринер — инструмент, который помогает быстро находить идеи и управлять рисками. Данные → инсайты → решения. Рассказать подробнее?',
      options: [
        { id: 'n40', label: 'Подробнее', next: 'ai_more' },
        { id: 'n42', label: 'Начать использовать', next: 'profile_check', requiresProfile: true },
        { id: 'n39', label: 'Не интересно', next: 'menu_more' },
      ],
    },
    ai_more: {
      id: 'ai_more',
      message:
        'Онлайн-платформа для поиска и анализа, где AI агрегирует данные и ранжирует активы по привлекательности и риску. Начать использовать AI-скринер?',
      options: [
        { id: 'n43', label: 'Да', next: 'profile_check', requiresProfile: true },
        { id: 'n44', label: 'Нет', next: 'ai_convince' },
      ],
    },
    ai_convince: {
      id: 'ai_convince',
      message:
        'AI-скринер строит прогноз на год вперёд, учитывая историю, мультипликаторы и макроэкономику. Точно не хочешь попробовать?',
      options: [
        { id: 'n46', label: 'Хочу', next: 'profile_check', requiresProfile: true },
        { id: 'n47', label: 'Не хочу', next: 'menu_more' },
      ],
    },
    amc_intro: {
      id: 'amc_intro',
      message:
        'Платформа для запуска и ведения алготрейдинговых фондов: инфраструктура, лицензии и IT-решения. Рассказать подробнее?',
      options: [
        { id: 'n49', label: 'Да', next: 'amc_more' },
        { id: 'n51', label: 'Хочу связаться с командой', next: 'profile_check', requiresProfile: true },
        { id: 'n50', label: 'Нет', next: 'menu_more' },
      ],
    },
    amc_more: {
      id: 'amc_more',
      message:
        'Следующие шаги:\n• Определите стратегию и активы\n• Выберите форму фонда (ЗПИФ/ИПИФ/корп. оболочка)\n• Оставьте заявку — команда УК проведёт через юридическую и техническую настройку\n\nГотов запустить фонд с УК Финама?',
      options: [
        { id: 'n53', label: 'Да', next: 'profile_check', requiresProfile: true },
        { id: 'n54', label: 'Нет', next: 'menu_more' },
      ],
    },
    ziplime_intro: {
      id: 'ziplime_intro',
      message:
        'ZipLime — платформа для создания и тестирования алгоритмических стратегий с поддержкой ИИ. Рассказать подробнее?',
      options: [
        { id: 'n57', label: 'Да, давай', next: 'ziplime_more' },
        { id: 'n58', label: 'Хочу подключиться', next: 'profile_check', requiresProfile: true },
        { id: 'n56', label: 'Нет', next: 'menu_more' },
      ],
    },
    ziplime_more: {
      id: 'ziplime_more',
      message:
        'ZipLime закрывает цикл: данные → гипотезы → бэктест → оценка рисков → тестовый счёт → реальная торговля → улучшение моделей. Хочешь подключиться?',
      options: [
        { id: 'n60', label: 'Да', next: 'profile_check', requiresProfile: true },
        { id: 'n61', label: 'Нет', next: 'menu_more' },
      ],
    },
    hyperadar_intro: {
      id: 'hyperadar_intro',
      message:
        'Hype Radar превращает хаос новостей и соцмедиа в инструмент прогнозирования: помогает находить тренды, анализировать их силу и действовать до того, как об этом узнает весь рынок. Рассказать подробнее?',
      options: [
        { id: 'n62', label: 'Подробнее', next: 'hyperadar_more' },
        { id: 'n63', label: 'Хочу использовать', next: 'profile_check', requiresProfile: true },
        { id: 'n64', label: 'Не интересно', next: 'menu_more' },
      ],
    },
    hyperadar_more: {
      id: 'hyperadar_more',
      message:
        'Hype Radar - это инструмент, который помогает трейдерам и инвесторам раньше других замечать и оценивать рыночные тренды, объединяя аналитику данных, социальные сигналы и динамику интереса в едином интерфейсе. Хочешь записаться на ЗБТ?',
      options: [
        { id: 'n65', label: 'Да', next: 'profile_check', requiresProfile: true },
        { id: 'n66', label: 'Нет', next: 'menu_more' },
      ],
    },
    international_markets_intro: {
      id: 'international_markets_intro',
      message:
        'Ты торгуешь на российском рынке и чувствуешь, что возможностей становится меньше? Тогда пора смотреть шире — туда, где ликвидность, объёмы и драйверы роста. Но есть нюанс: прямой доступ к крупнейшим мировым биржам из России сегодня даёт только один брокер.\n\n«Финам» — единственный в РФ, кто обеспечивает реальный доступ к американским и азиатским рынкам: NYSE, NASDAQ, CME, Гонконг, Шанхай, Шэньчжэнь.',
      options: [
        { id: 'n67', label: 'Подробнее', next: 'international_markets_more' },
        { id: 'n68', label: 'Хочу подключиться', next: 'profile_check', requiresProfile: true },
        { id: 'n69', label: 'Не интересно', next: 'menu_more' },
      ],
    },
    international_markets_more: {
      id: 'international_markets_more',
      message:
        'Что это даёт тебе:\n\n- 7200+ акций США, включая лидеров роста (FAANG) и ETF.\n\n- Американские опционы: от классических до нулевого дня (0DTE) — идеальны для активных стратегий.\n\n- 50+ товарных фьючерсов на CME — от золота до нефти.\n\n- 3500+ азиатских акций с волатильностью до 25% и арбитражем A/H-акций до 15%.\n\n- Поддержка продвинутых опционных стратегий: стрэддлы, спреды, бабочки, кондоры.\n\nХочешь получить доступ?',
      options: [
        { id: 'n70', label: 'Да', next: 'profile_check', requiresProfile: true },
        { id: 'n71', label: 'Нет', next: 'menu_more' },
      ],
    },
    profile_check: { id: 'profile_check', message: '', kind: 'router' },
    profile_ok: {
      id: 'profile_ok',
      message:
        'Супер! Я записал тебя в группу/передал контакт. Рассказать про другие продукты ФИНАМа? Например, про УК или проп-трейдинг.',
      options: [
        { id: 'n19', label: 'Да, расскажи ещё', next: 'menu_more' },
        { id: 'n20', label: 'Нет, спасибо', next: 'goodbye' },
      ],
    },
    profile_missing: {
      id: 'profile_missing',
      message:
        'Чтобы я смог записать тебя, отправь, пожалуйста, данные о себе в профиле. Мы не будем спамить или передавать данные третьим лицам.',
      options: [
        { id: 'n12', label: 'Данные заполнены', next: 'profile_ok' },
        { id: 'n16', label: 'Не хочу заполнять', next: 'profile_refuse' },
      ],
    },
    profile_refuse: {
      id: 'profile_refuse',
      message:
        'Понимаю. Без данных не сможем добавить в группу/подключить продукт. Заполненные анкеты обрабатываем быстрее и даём больше возможностей для коллабораций.',
      options: [
        { id: 'n22', label: 'К другим продуктам', next: 'menu_more' },
      ],
    },
    goodbye: {
      id: 'goodbye',
      message:
        'Понял тебя. Если появятся вопросы по продуктам — обязательно пиши мне.',
      options: [
        { id: 'back_menu', label: 'К другим продуктам', next: 'menu_more' },
      ],
    },
  };


  // Проверяем, есть ли данные пользователя
  const hasUserData = user && user.name && user.credentials?.email && user.credentials?.phone;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Восстановление состояния из sessionStorage
  useEffect(() => {
    try {
      const rawMessages = sessionStorage.getItem(STORAGE_KEYS.messages);
      const rawNode = sessionStorage.getItem(STORAGE_KEYS.node);
      const rawIsChatOpened = sessionStorage.getItem(STORAGE_KEYS.isChatOpened);
      
      if (rawMessages) {
        const parsed: Message[] = JSON.parse(rawMessages).map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
        setMessages(parsed);
        // Если есть сообщения, открываем чат
        if (parsed.length > 0) {
          setIsChatOpened(true);
        }
      }
      if (rawNode) {
        setCurrentNodeId(rawNode);
      }
      // Восстанавливаем состояние открытия чата
      if (rawIsChatOpened === 'true') {
        setIsChatOpened(true);
      }
    } catch (_) {
      // ignore
    }
  }, []);

  // Сохранение состояния в sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(useMessages));
      if (currentNodeId) sessionStorage.setItem(STORAGE_KEYS.node, currentNodeId);
      sessionStorage.setItem(STORAGE_KEYS.isChatOpened, String(isChatOpened));
    } catch (_) {
      // ignore
    }
  }, [useMessages, currentNodeId, isChatOpened]);

  // Инициализация начального узла/сообщения убрана - сообщение появляется только при клике на input

  // Обработчик открытия чата при клике на input
  const handleInputFocus = () => {
    setIsInputFocused(true);
    setIsChatOpened(true);
    
    // Прокрутка к полю ввода при фокусе (для мобильных устройств)
    requestAnimationFrame(() => {
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }, 300); // Небольшая задержка для появления клавиатуры
    });
    
    // Проверяем, есть ли уже приветственное сообщение в useMessages
    const hasGreetMessage = useMessages.some(m => 
      !m.isUser && m.text.includes('Привет! Я твой персональный ассистент')
    );
    
    // Если нет приветственного сообщения, добавляем его
    if (!hasGreetMessage) {
      const node = nodes.greet;
      const botMessage: Message = {
        id: `${Date.now()}_greet`,
        text: node.message,
        isUser: false,
        timestamp: new Date(),
      };
      
      // Добавляем приветственное сообщение
      setMessages(prev => {
        // Проверяем, нет ли уже такого сообщения в текущем состоянии
        const alreadyExists = prev.some(m => 
          !m.isUser && m.text.includes('Привет! Я твой персональный ассистент')
        );
        if (!alreadyExists) {
          // Если сообщений нет, добавляем приветственное, иначе добавляем в начало
          if (prev.length === 0) {
            return [botMessage];
          }
          // Добавляем в начало, чтобы приветствие было первым
          return [botMessage, ...prev];
        }
        return prev;
      });
      
      // Устанавливаем currentNodeId, если его еще нет
      if (!currentNodeId) {
        setCurrentNodeId(node.id);
      }
    }
  };

  // Проверка: если чат открыт, но нет приветственного сообщения, добавляем его
  useEffect(() => {
    if (isChatOpened) {
      // Проверяем, есть ли уже приветственное сообщение
      const hasGreetMessage = useMessages.some(m => 
        !m.isUser && m.text.includes('Привет! Я твой персональный ассистент')
      );
      
      if (!hasGreetMessage) {
        const node = nodes.greet;
        const botMessage: Message = {
          id: `${Date.now()}_greet`,
          text: node.message,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => {
          // Проверяем еще раз, нет ли уже такого сообщения
          const alreadyExists = prev.some(m => 
            !m.isUser && m.text.includes('Привет! Я твой персональный ассистент')
          );
          if (!alreadyExists) {
            // Если сообщений нет, добавляем приветственное, иначе добавляем в начало
            if (prev.length === 0) {
              return [botMessage];
            }
            // Добавляем в начало, чтобы приветствие было первым
            return [botMessage, ...prev];
          }
          return prev;
        });
        if (!currentNodeId) {
          setCurrentNodeId(node.id);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChatOpened, useMessages.length]);

  // Индикатор набора по статусу useChat
  useEffect(() => {
    setIsTyping(status === 'streaming');
  }, [status]);

  // Загрузка сообщений из localStorage при инициализации
  useEffect(() => {
    if (user) {
      loadFromStorage();
    }
  }, [user, loadFromStorage]);

  // Синхронизация сообщений с localStorage (легкая, не нагружающая)
  useEffect(() => {
    if (messages.length > 0) {
      // Дебаунс для избежания частых записей
      const timeoutId = setTimeout(() => {
        syncToStorage();
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [messages.length, syncToStorage]);

  // Сохранение сообщений в store при изменении
  useEffect(() => {
    messages.forEach(message => {
      // Добавляем только новые сообщения (проверяем по ID)
      addMessage(message.text, message.isUser, message.id);
    });
  }, [messages, addMessage]);

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

  // Обработчик touchStart для отслеживания начала касания
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };

  // Обработчик touchEnd для определения, был ли это клик или скролл
  const handleTouchEnd = (e: React.TouchEvent, option: ChatOption) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
    const deltaTime = Date.now() - touchStartRef.current.time;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Если движение было больше 10px или длилось больше 300ms - это скролл, не клик
    if (distance > 10 || deltaTime > 300) {
      touchStartRef.current = null;
      return;
    }

    // Это был клик - выполняем действие
    e.preventDefault();
    handleOptionSelect(option);
    touchStartRef.current = null;
  };

  // FSM: обработчик выбора опции
  const handleOptionSelect = (option: ChatOption) => {
    // Открываем чат при выборе опции
    setIsChatOpened(true);

    const userMessage: Message = {
      id: `${Date.now()}_user_opt`,
      text: option.label,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    if (option.requiresProfile) {
      setCurrentNodeId('profile_check');
      setTimeout(async () => {
        const nextId = hasUserData ? 'profile_ok' : 'profile_missing';
        const node = nodes[nextId];
        
        // Если переходим в profile_ok, отправляем заявку в CRM
        if (nextId === 'profile_ok' && hasUserData && user) {
          console.log('📝 Отправка заявки из FSM чата для пользователя:', user.id);
          
          // Определяем продукт по предыдущему контексту
          const productContext = getProductContextFromMessages();
          const bookingMessage = `Заявка на запись из чата. Продукт: ${productContext}. Пользователь: ${user.name || user.id}`;
          
          try {
            await submitBooking(bookingMessage);
            console.log('✅ Заявка из FSM чата успешно отправлена');
          } catch (error) {
            console.error('❌ Ошибка отправки заявки из FSM чата:', error);
          }
        }
        
        const botMessage: Message = {
          id: `${Date.now()}_${nextId}`,
          text: node.message,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
        setCurrentNodeId(node.id);
      }, 400);
      return;
    }

    const nextNode = nodes[option.next];
    if (!nextNode) return;
    setIsTyping(true);
    setTimeout(async () => {
      // Если переходим в profile_ok из profile_missing, также отправляем заявку
      if (option.next === 'profile_ok' && hasUserData && user) {
        console.log('📝 Отправка заявки из profile_missing для пользователя:', user.id);
        
        const productContext = getProductContextFromMessages();
        const bookingMessage = `Заявка на запись из чата. Продукт: ${productContext}. Пользователь: ${user.name || user.id}`;
        
        try {
          await submitBooking(bookingMessage);
          console.log('✅ Заявка из profile_missing успешно отправлена');
        } catch (error) {
          console.error('❌ Ошибка отправки заявки из profile_missing:', error);
        }
      }
      
      const botMessage: Message = {
        id: `${Date.now()}_${nextNode.id}`,
        text: nextNode.message,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setCurrentNodeId(nextNode.id);
      setIsTyping(false);
    }, 500);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const query = inputText.trim();
    
    // Открываем чат при отправке сообщения
    setIsChatOpened(true);
    
    // Сбрасываем FSM на стартовый узел при свободном вводе
    setCurrentNodeId('greet');
    
    // Отправляем в AI (сообщение пользователя и ответ придут в aiMessages)
    setInputText('');
    sendMessage({
      role: 'user',
      parts: [{ type: 'text', text: query }]
    } as any);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!hasUserMessages && !isChatOpened) {
	return (
		<>
			<div className='w-full bg-black flex justify-center overflow-x-hidden'>
				<div className='bg-black w-[393px] relative font-sans text-white' style={{ height: '816px' }}>
						{/* Gradient Background */}
						<div
							className='absolute top-[274px] left-1/2 -translate-x-1/2 w-[284px] h-[205px] rounded-full opacity-50 blur-[120px]'
							style={{
								background:
									'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)',
							}}
						/>

						{/* Content Block */}
						<div className='absolute top-[242px] left-1/2 -translate-x-1/2 flex flex-col items-center w-full'>
							<FinamLogoIcon className="h-[56px] w-[60px]" />
							<h1 className='mt-[7px] w-[352px] font-inter text-white text-[30px] font-normal leading-[110%] tracking-[-0.6px] text-center'>
								Привет, я AI - Ассиcтент
								<span className='block'>Финам</span>
							</h1>
							<p className='mt-[14px] w-[336px] text-[rgba(255,255,255,0.72)] font-inter text-[17px] font-normal leading-[24px] tracking-[-0.17px] text-center'>
								Чему могу помочь?
							</p>
						</div>

						{/* FSM Options Block - Start Screen (показывается только при фокусе на input) */}
						{isInputFocused && currentNodeId && nodes[currentNodeId]?.options && nodes[currentNodeId]?.options!.length > 0 && (
							<div className='absolute bottom-[180px] left-1/2 -translate-x-1/2 w-[353px]'>
								<Suggestions>
									{nodes[currentNodeId]!.options!.map((opt) => (
										<Suggestion
											key={opt.id}
											suggestion={opt.label}
											onMouseDown={(e: React.MouseEvent) => {
												e.preventDefault();
												handleOptionSelect(opt);
											}}
											onTouchStart={handleTouchStart}
											onTouchEnd={(e: React.TouchEvent) => handleTouchEnd(e, opt)}
											className='rounded-[10px] bg-[#151519] border-[#373740] text-white hover:bg-[#1f1f25] px-3 py-2'
										>
											{opt.label}
										</Suggestion>
									))}
								</Suggestions>
							</div>
						)}

						{/* Input Block */}
						<div className='absolute bottom-[109px] left-1/2 -translate-x-1/2 w-[353px]'>
							<div className='relative w-full h-[56px]'>
								{isInputFocused && (
									<div 
										className="absolute inset-0"
										style={{
											background: 'linear-gradient(90deg, #FEDA3B, #EF5541, #801FDB, #7E2A89)',
											borderRadius: '8px',
											padding: '2px',
										}}
									>
										<div 
											className="w-full h-full"
											style={{
												backgroundColor: '#1A1A1F',
												borderRadius: '6px',
											}}
										/>
									</div>
								)}
								<Input
									type='text'
									value={inputText}
									onChange={e => setInputText(e.target.value)}
									onKeyPress={handleKeyPress}
									onFocus={handleInputFocus}
									onBlur={handleInputBlur}
									placeholder={hasUserData ? 'Напишите сообщение...' : 'Сначала заполните данные в профиле'}
									className='w-full h-full rounded-[8px] border border-[#373740] bg-[rgba(79,79,89,0.16)] p-4 pr-[56px] text-base font-normal leading-6 tracking-[-0.128px] text-white placeholder:text-[#6F6F7C] focus-visible:ring-offset-0 focus:outline-none focus:border-transparent font-inter relative z-10'
									readOnly={!hasUserData}
									disabled={!hasUserData}
									style={{
										background: isInputFocused ? 'transparent' : 'rgba(79,79,89,0.16)',
										border: isInputFocused ? '1px solid transparent' : '1px solid #373740',
									}}
								/>
								{inputText.trim() && hasUserData && (
									<button
										type="button"
										onClick={handleSendMessage}
										className="absolute right-[10px] top-1/2 -translate-y-1/2 w-[36px] h-[36px] flex-shrink-0 rounded-[12px] bg-[#59307C] flex items-center justify-center z-20"
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
			<div className='w-full bg-black flex justify-center overflow-x-hidden'>
				<div className='bg-black w-[393px] relative font-sans text-white overflow-x-hidden' style={{ height: '816px' }}>
					{/* Messages Container */}
					<div className='absolute top-0 left-0 right-0 bottom-[220px] overflow-y-auto'>
						<div className='px-5 pt-[172px] pb-4 space-y-5'>
							{messages.map(message => (
								<div
									key={message.id}
									className={`flex ${
										message.isUser ? 'justify-end' : 'justify-start'
									}`}
								>
									{/* Аватар для сообщений бота */}
									{!message.isUser && (
										<div className="flex-shrink-0 mr-3 self-start">
											<BotAvatar />
										</div>
									)}
									
							<div
								className={
									message.isUser
										? 'flex max-w-[248px] flex-col items-end gap-2.5 rounded-br-lg rounded-bl-lg rounded-tl-lg rounded-tr-sm bg-[#59307C] px-[14px] py-[10px]'
										: 'flex max-w-[202px] items-center justify-center gap-2.5 rounded-tl-[4px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px] bg-[#151519] px-[10px] py-[12px]'
								}
							>
								<p className={`whitespace-pre-line font-normal tracking-[-0.056px] text-white ${
									message.isUser 
										? 'text-[14px] leading-[20px]' 
										: 'text-sm leading-5'
								}`}>
									{message.text}
								</p>
							</div>

									{/* Аватар для сообщений пользователя */}
									{message.isUser && user?.role && (
										<div className="flex-shrink-0 ml-3 self-start">
											<UserAvatar userRole={user.role} />
										</div>
									)}
								</div>
							))}

							{/* Typing indicator */}
							{isTyping && (
								<div className='flex justify-start'>
									<div className="flex-shrink-0 mr-3 self-start">
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

				{/* FSM Options Block */}
				{currentNodeId && nodes[currentNodeId]?.options && nodes[currentNodeId]?.options!.length > 0 && (
					<div className='absolute bottom-[180px] left-1/2 -translate-x-1/2 w-[353px]'>
						<Suggestions>
							{nodes[currentNodeId]!.options!.map((opt) => (
								<Suggestion
									key={opt.id}
									suggestion={opt.label}
									onMouseDown={(e: React.MouseEvent) => {
										e.preventDefault();
										handleOptionSelect(opt);
									}}
									onTouchStart={handleTouchStart}
									onTouchEnd={(e: React.TouchEvent) => handleTouchEnd(e, opt)}
									className='rounded-[10px] bg-[#151519] border-[#373740] text-white hover:bg-[#1f1f25] px-3 py-2'
								>
									{opt.label}
								</Suggestion>
							))}
						</Suggestions>
					</div>
				)}

					{/* Input Block */}
					<div className='absolute bottom-[109px] left-1/2 -translate-x-1/2 w-[353px]'>
						<div className='relative w-full h-[56px]'>
							{isInputFocused && (
								<div 
									className="absolute inset-0"
									style={{
										background: 'linear-gradient(90deg, #FEDA3B, #EF5541, #801FDB, #7E2A89)',
										borderRadius: '8px',
										padding: '2px',
									}}
								>
									<div 
										className="w-full h-full"
										style={{
											backgroundColor: '#1A1A1F',
											borderRadius: '6px',
										}}
									/>
								</div>
							)}
							<Input
								type='text'
								value={inputText}
								onChange={e => setInputText(e.target.value)}
								onKeyPress={handleKeyPress}
								onFocus={handleInputFocus}
								onBlur={handleInputBlur}
								placeholder={hasUserData ? 'Напишите сообщение...' : 'Сначала заполните данные в профиле'}
								className='w-full h-full rounded-[8px] border border-[#373740] bg-[rgba(79,79,89,0.16)] p-4 pr-[56px] text-base font-normal leading-6 tracking-[-0.128px] text-white placeholder:text-[#6F6F7C] focus-visible:ring-offset-0 focus:outline-none focus:border-transparent font-inter relative z-10'
								readOnly={!hasUserData}
								style={{
									background: isInputFocused ? 'transparent' : 'rgba(79,79,89,0.16)',
									border: isInputFocused ? '1px solid transparent' : '1px solid #373740',
								}}
							/>
							{inputText.trim() && hasUserData && (
								<button
									type="button"
									onClick={handleSendMessage}
									className="absolute right-[10px] top-1/2 -translate-y-1/2 w-[36px] h-[36px] flex-shrink-0 rounded-[12px] bg-[#59307C] flex items-center justify-center z-20"
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
