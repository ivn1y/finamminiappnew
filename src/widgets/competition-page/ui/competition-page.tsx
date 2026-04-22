'use client';

import React from 'react';

const BUG_BOUNTY_URL = 'https://collab.generationfi.online/bugbounty';

const openBugBounty = () => {
  if (typeof window === 'undefined') return;
  const telegramOpenLink = (window as any).Telegram?.WebApp?.openLink;
  if (typeof telegramOpenLink === 'function') {
    telegramOpenLink(BUG_BOUNTY_URL);
  } else {
    window.open(BUG_BOUNTY_URL, '_blank', 'noopener,noreferrer');
  }
};

type Stat = { value: string; label: string };
type Step = { title: string; description: string };
type Reward = { title: string; description: string };

const STATS: Stat[] = [
  { value: '520 000 ₽', label: 'Призовой фонд' },
  { value: '20', label: 'Бизнес-билетов' },
  { value: '10 мая', label: 'Финал конкурса' },
];

const STEPS: Step[] = [
  {
    title: 'Зарегистрируйся',
    description: 'Создай аккаунт участника за минуту, без лишних вопросов.',
  },
  {
    title: 'Тестируй платформу',
    description: 'Находи баги на beta.comon.ru — сбои, баги UI, проблемы авторизации, опечатки.',
  },
  {
    title: 'Отправляй репорты',
    description: 'Опиши шаги, приложи скрин или видео. За каждый принятый баг — +1 очко.',
  },
  {
    title: 'Попади в топ-20',
    description: 'Лучшие участники забирают Бизнес-билеты на Moscow Trading Week.',
  },
];

const REWARDS: Reward[] = [
  {
    title: 'Бизнес-билеты',
    description: '20 билетов в бизнес-зону Moscow Trading Week — нетворкинг и доступ к закрытым сессиям.',
  },
  {
    title: 'Вклад в продукт',
    description: 'Твои находки попадут напрямую в продакт-команду Финама и сделают «Дневник трейдера» лучше.',
  },
  {
    title: 'Комьюнити и признание',
    description: 'Лидерборд в реальном времени и отдельный Telegram-канал с итогами и разборами.',
  },
];

const GoldButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}> = ({ onClick, children, icon, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full h-[52px] rounded-[12px] inline-flex items-center justify-center gap-[8px] font-inter-tight text-[16px] font-semibold tracking-[-0.32px] text-[#0D0512] transition-transform active:scale-[0.99] ${className}`}
    style={{
      background: 'linear-gradient(90deg, #FDB938 6.62%, #ED6B51 100%)',
      boxShadow: '0px 12px 32px -10px rgba(237, 107, 81, 0.55)',
    }}
  >
    {icon}
    {children}
  </button>
);

const IconArrow = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 9h10m0 0-4-4m4 4-4 4"
      stroke="#0D0512"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconBug = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 2.5a3 3 0 0 1 3 3H7a3 3 0 0 1 3-3Zm-4.5 4h9a3.5 3.5 0 0 1 3.5 3.5v.5h-2V9a1 1 0 1 0-2 0v1h-1V9a1 1 0 1 0-2 0v1H9V9a1 1 0 1 0-2 0v1H6V9a1 1 0 1 0-2 0v1H2v-.5A3.5 3.5 0 0 1 5.5 6.5Zm-.5 5.5h10v.5a5 5 0 0 1-10 0V12Zm2 5.2a1 1 0 1 1 2 0V19a1 1 0 1 1-2 0v-1.8Zm5 0a1 1 0 1 1 2 0V19a1 1 0 1 1-2 0v-1.8Z"
      fill="#0D0512"
    />
  </svg>
);

export const CompetitionPage: React.FC = () => {
  return (
    <div className="w-full bg-black overflow-x-hidden">
      <div className="flex justify-center">
        <div className="relative w-[393px] bg-black pb-[120px]" style={{ minHeight: '100vh' }}>
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[40px] w-[390px] h-[281px] rounded-[390px] opacity-40 blur-[80px]"
            style={{
              background:
                'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)',
            }}
          />

          <div className="relative z-10 pt-[32px] px-[20px]">
            <div className="inline-flex items-center gap-[8px] px-[12px] h-[28px] rounded-[14px] bg-[#1A1A1F] border border-[#2A2A32]">
              <span
                className="w-[8px] h-[8px] rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #FDB938 0%, #ED6B51 100%)',
                }}
              />
              <span className="font-inter text-[12px] font-medium tracking-[-0.024px] text-white leading-[14px]">
                Идёт Bug Bounty «Дневник трейдера»
              </span>
            </div>

            <h1 className="mt-[14px] font-inter-tight text-[32px] font-semibold leading-[110%] tracking-[-0.64px] text-white">
              Находи баги,
              <br />
              <span
                style={{
                  background: 'linear-gradient(90deg, #FDB938 6.62%, #ED6B51 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                забирай призы
              </span>
            </h1>

            <p className="mt-[12px] font-inter text-[15px] leading-[22px] tracking-[-0.03px] text-[rgba(255,255,255,0.72)]">
              Мы запустили открытое Bug Bounty новой платформы «Дневник трейдера» на beta.comon.ru. Помоги нам поймать баги, а мы поделимся Бизнес-билетами на Moscow Trading Week и призовым фондом 520 000 ₽.
            </p>
          </div>

          <div className="relative z-10 mt-[18px] px-[20px]">
            <div
              className="rounded-[14px] p-[1px]"
              style={{
                background:
                  'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)',
              }}
            >
              <div className="rounded-[13px] bg-[#0F0F13] p-[16px]">
                <div className="grid grid-cols-3 gap-[8px]">
                  {STATS.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex flex-col items-center text-center p-[10px] rounded-[10px] bg-[#141418] border border-[#1F1F25]"
                    >
                      <span className="font-inter-tight text-[16px] font-semibold leading-[20px] tracking-[-0.32px] text-white">
                        {stat.value}
                      </span>
                      <span className="mt-[4px] font-inter text-[10px] uppercase tracking-[0.06em] leading-[12px] text-[#8A8A95]">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>

                <GoldButton onClick={openBugBounty} icon={<IconBug />} className="mt-[14px]">
                  Принять участие
                </GoldButton>

                <p className="mt-[10px] text-center font-inter text-[11px] leading-[14px] text-[#8A8A95]">
                  Откроется {BUG_BOUNTY_URL.replace('https://', '')}
                </p>
              </div>
            </div>
          </div>

          <section className="relative z-10 mt-[28px] px-[20px]">
            <h2 className="font-inter-tight text-[22px] font-semibold leading-[110%] tracking-[-0.44px] text-white">
              Зачем это нужно
            </h2>
            <p className="mt-[10px] font-inter text-[14px] leading-[22px] tracking-[-0.028px] text-[rgba(255,255,255,0.78)]">
              «Дневник трейдера» — это новый сервис, который объединяет фиксацию идей, аналитику портфеля и ИИ-помощника. Мы хотим, чтобы он работал безупречно ещё до публичного релиза. Поэтому открываем платформу для трейдеров, QA и разработчиков — чтобы вы нашли всё, что мы могли упустить, а мы превратили ваши репорты в улучшения продукта.
            </p>
          </section>

          <section className="relative z-10 mt-[24px] px-[20px]">
            <h2 className="font-inter-tight text-[22px] font-semibold leading-[110%] tracking-[-0.44px] text-white">
              Как это работает
            </h2>
            <ol className="mt-[12px] flex flex-col gap-[8px]">
              {STEPS.map((step, idx) => (
                <li
                  key={step.title}
                  className="flex items-start gap-[12px] p-[14px] rounded-[12px] bg-[#141418] border border-[#1F1F25]"
                >
                  <div
                    className="shrink-0 w-[28px] h-[28px] rounded-full flex items-center justify-center font-inter-tight text-[13px] font-semibold text-[#0D0512]"
                    style={{
                      background: 'linear-gradient(90deg, #FDB938 6.62%, #ED6B51 100%)',
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-inter-tight text-[15px] font-semibold leading-[20px] tracking-[-0.3px] text-white">
                      {step.title}
                    </p>
                    <p className="mt-[2px] font-inter text-[13px] leading-[18px] tracking-[-0.026px] text-[rgba(255,255,255,0.72)]">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="relative z-10 mt-[24px] px-[20px]">
            <h2 className="font-inter-tight text-[22px] font-semibold leading-[110%] tracking-[-0.44px] text-white">
              Что ты получаешь
            </h2>
            <div className="mt-[12px] flex flex-col gap-[10px]">
              {REWARDS.map((reward) => (
                <div
                  key={reward.title}
                  className="p-[14px] rounded-[12px] bg-[#151519]"
                >
                  <p className="font-inter-tight text-[15px] font-semibold leading-[20px] tracking-[-0.3px] text-white">
                    {reward.title}
                  </p>
                  <p className="mt-[4px] font-inter text-[13px] leading-[18px] tracking-[-0.026px] text-[rgba(255,255,255,0.72)]">
                    {reward.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="relative z-10 mt-[28px] px-[20px]">
            <div
              className="rounded-[16px] p-[1px]"
              style={{
                background:
                  'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)',
              }}
            >
              <div className="rounded-[15px] bg-[#0F0F13] p-[20px] text-center">
                <p className="font-inter-tight text-[22px] font-semibold leading-[110%] tracking-[-0.44px] text-white">
                  Готов ловить баги?
                </p>
                <p className="mt-[8px] font-inter text-[13px] leading-[18px] tracking-[-0.026px] text-[rgba(255,255,255,0.72)]">
                  Регистрация, правила и форма отчёта — на странице конкурса. Конкурс идёт до 10 мая включительно.
                </p>
                <GoldButton onClick={openBugBounty} icon={<IconArrow />} className="mt-[16px]">
                  Перейти к Bug Bounty
                </GoldButton>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
