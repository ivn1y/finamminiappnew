'use client';

import React from 'react';

type Speaker = {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
  gradient: string;
};

const SPEAKERS: Speaker[] = [
  {
    id: 'tarverdiev',
    name: 'Максим Тарвердиев',
    role: 'Преподаватель',
    bio:
      'Начал карьеру в сфере в 2019 году. Максим — квалифицированный инвестор, до прихода в «Финам» занимался анализом глобальных финансовых рынков и макроэкономики.',
    initials: 'МТ',
    gradient:
      'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)',
  },
  {
    id: 'blagirev',
    name: 'Вячеслав Благирев',
    role: 'Директор по инновационному развитию продуктов ФГ «Финам»',
    bio:
      'Имеет 20-летний опыт работы с технологиями и цифровыми продуктами. Запустил более 65 проектов, автор книг Digital Book, читает лекции в вузах по цифровизации и web 3.0.',
    initials: 'ВБ',
    gradient:
      'linear-gradient(305deg, #FDB938 -2.67%, #ED6B51 38.9%, #A55AFF 77.17%, #7E2A89 98.46%)',
  },
];

const PROGRAM_ITEMS = [
  'Канва идей и ИИ-помощник для принятия решений',
  'Новости по тикерам и как связывать их с торговыми идеями',
  'Создание и тестирование стратегий',
  'Аналитика портфеля и разбор ошибок',
];

const Tag: React.FC<{ variant?: 'free' | 'default'; children: React.ReactNode }> = ({
  variant = 'default',
  children,
}) => {
  const base =
    'inline-flex items-center h-[24px] px-[10px] rounded-[6px] font-inter text-[12px] font-medium leading-[14px] tracking-[-0.024px]';
  if (variant === 'free') {
    return (
      <span
        className={`${base} text-[#0D0512]`}
        style={{
          background: 'linear-gradient(90deg, #FDB938 6.62%, #ED6B51 100%)',
        }}
      >
        {children}
      </span>
    );
  }
  return (
    <span className={`${base} bg-[#1F1F25] text-white border border-[#2A2A32]`}>
      {children}
    </span>
  );
};

const SpeakerChip: React.FC<{ name: string; gradient: string; initials: string }> = ({
  name,
  gradient,
  initials,
}) => (
  <div className="inline-flex items-center gap-[8px] h-[32px] pl-[3px] pr-[12px] rounded-[16px] bg-[#1F1F25] border border-[#2A2A32]">
    <div
      className="flex w-[26px] h-[26px] items-center justify-center rounded-full font-inter text-[10px] font-semibold text-white"
      style={{ background: gradient }}
    >
      {initials}
    </div>
    <span className="font-inter text-[13px] leading-[16px] text-white tracking-[-0.026px]">
      {name}
    </span>
  </div>
);

const InfoPill: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({
  label,
  value,
  icon,
}) => (
  <div className="flex-1 min-w-0 flex flex-col gap-[6px] p-[12px] rounded-[10px] bg-[#141418] border border-[#1F1F25]">
    <div className="flex items-center gap-[6px] text-[#8A8A95]">
      <span className="w-[14px] h-[14px] flex items-center justify-center">{icon}</span>
      <span className="font-inter text-[10px] uppercase tracking-[0.08em] leading-[12px]">
        {label}
      </span>
    </div>
    <span className="font-inter-tight text-[18px] font-semibold leading-[22px] tracking-[-0.36px] text-white">
      {value}
    </span>
  </div>
);

const SpeakerCard: React.FC<{ speaker: Speaker }> = ({ speaker }) => (
  <div className="flex w-full p-[14px] gap-[14px] rounded-[12px] bg-[#151519]">
    <div
      className="shrink-0 flex items-center justify-center w-[56px] h-[56px] rounded-full font-inter-tight text-[18px] font-semibold text-white"
      style={{ background: speaker.gradient }}
    >
      {speaker.initials}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-inter-tight text-[16px] font-semibold leading-[20px] tracking-[-0.32px] text-white">
        {speaker.name}
      </p>
      <p className="mt-[2px] font-inter text-[12px] leading-[16px] tracking-[-0.024px] text-[#8A8A95]">
        {speaker.role}
      </p>
      <p className="mt-[10px] font-inter text-[13px] leading-[18px] tracking-[-0.026px] text-[rgba(255,255,255,0.78)]">
        {speaker.bio}
      </p>
    </div>
  </div>
);

const IconWallet = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2 4a1.5 1.5 0 0 1 1.5-1.5h7A1.5 1.5 0 0 1 12 4v1H3.5A1.5 1.5 0 0 0 2 6.5V4Zm0 2.5A1.5 1.5 0 0 1 3.5 5H11a1 1 0 0 1 1 1v4.5A1.5 1.5 0 0 1 10.5 12h-7A1.5 1.5 0 0 1 2 10.5v-4Zm7.25 2.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
      fill="currentColor"
    />
  </svg>
);

const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M7 4.2V7l1.8 1.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const IconPlay = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 3.5 12 8l-7 4.5v-9Z" fill="#0D0512" />
  </svg>
);

export const WebinarPage: React.FC = () => {
  return (
    <div className="w-full bg-black flex justify-center pb-[96px]">
      <div className="relative w-[393px] pt-[24px]">
        {/* Декоративный градиентный блик в шапке */}
        <div
          aria-hidden
          className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-[360px] h-[240px] rounded-[360px] opacity-40 blur-[80px] pointer-events-none"
          style={{
            background:
              'linear-gradient(315deg, #FAF1E6 -0.45%, #F9DEC0 15.8%, #ED9FA6 32.05%, #994B69 48.29%, rgba(51, 22, 86, 0.00) 64.54%)',
          }}
        />

        {/* Заголовок секции */}
        <div className="relative px-[20px]">
          <p className="font-inter text-[12px] uppercase tracking-[0.14em] text-[#8A8A95] leading-[14px]">
            Вебинар
          </p>
          <h1 className="mt-[8px] font-inter-tight text-[26px] font-semibold leading-[110%] tracking-[-0.52px] text-white">
            Дневник трейдера — как фиксировать идеи, тестировать стратегии и принимать решения с помощью ИИ
          </h1>
          <p className="mt-[12px] font-inter text-[14px] leading-[20px] tracking-[-0.028px] text-[rgba(255,255,255,0.72)]">
            Узнайте, как «Дневник трейдера» с ИИ поможет структурировать информацию, создавать и тестировать стратегии, анализировать портфель и быстрее принимать решения без лишних эмоций.
          </p>
        </div>

        {/* Карточка с тегами, авторами и CTA */}
        <div className="relative mt-[18px] mx-[20px]">
          <div
            className="rounded-[14px] p-[1px]"
            style={{
              background:
                'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)',
            }}
          >
            <div className="rounded-[13px] bg-[#0F0F13] p-[16px]">
              <div className="flex flex-wrap gap-[6px]">
                <Tag variant="free">Бесплатно</Tag>
                <Tag>Вебинар</Tag>
              </div>

              <p className="mt-[16px] font-inter text-[12px] uppercase tracking-[0.08em] leading-[14px] text-[#8A8A95]">
                Спикеры
              </p>
              <div className="mt-[8px] flex flex-wrap gap-[8px]">
                {SPEAKERS.map((s) => (
                  <SpeakerChip
                    key={s.id}
                    name={s.name}
                    gradient={s.gradient}
                    initials={s.initials}
                  />
                ))}
              </div>

              <div className="mt-[16px] flex gap-[8px]">
                <InfoPill label="Стоимость" value="0 ₽" icon={<IconWallet />} />
                <InfoPill label="Длительность" value="60 минут" icon={<IconClock />} />
              </div>

              <button
                type="button"
                className="mt-[16px] w-full h-[48px] rounded-[12px] inline-flex items-center justify-center gap-[8px] font-inter-tight text-[15px] font-semibold tracking-[-0.3px] text-[#0D0512]"
                style={{
                  background: 'linear-gradient(90deg, #FDB938 6.62%, #ED6B51 100%)',
                }}
              >
                <IconPlay />
                Записаться на вебинар
              </button>
            </div>
          </div>
        </div>

        {/* О чём этот вебинар */}
        <section className="mt-[28px] px-[20px]">
          <h2 className="font-inter-tight text-[22px] font-semibold leading-[110%] tracking-[-0.44px] text-white">
            О чём этот вебинар
          </h2>
          <div className="mt-[12px] flex flex-col gap-[12px]">
            <p className="font-inter text-[14px] leading-[22px] tracking-[-0.028px] text-[rgba(255,255,255,0.78)]">
              Современный трейдер ежедневно сталкивается с огромным потоком информации — рыночные идеи, новости, графики, заметки — всё требует внимания и структурирования. Как не потеряться в этом информационном шуме и извлекать максимальную пользу для своих решений? Настало время вывести свой торговый процесс на новый уровень.
            </p>
            <p className="font-inter text-[14px] leading-[22px] tracking-[-0.028px] text-[rgba(255,255,255,0.78)]">
              На вебинаре узнаете, как использовать сервис{' '}
              <span
                className="font-semibold"
                style={{
                  background: 'linear-gradient(90deg, #FDB938 6.62%, #ED6B51 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                «Дневник трейдера»
              </span>
              {' '}— он объединяет мощные инструменты фиксации, анализа и автоматизации рабочих процессов с поддержкой искусственного интеллекта. Покажем, как превратить ваши наблюдения и гипотезы в эффективные торговые стратегии, ускорить принятие решений и снизить влияние эмоций на результаты.
            </p>
          </div>
        </section>

        {/* В программе */}
        <section className="mt-[24px] px-[20px]">
          <h2 className="font-inter-tight text-[22px] font-semibold leading-[110%] tracking-[-0.44px] text-white">
            В программе
          </h2>
          <ul className="mt-[12px] flex flex-col gap-[8px]">
            {PROGRAM_ITEMS.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-[12px] p-[12px] rounded-[10px] bg-[#141418] border border-[#1F1F25]"
              >
                <div
                  className="shrink-0 w-[24px] h-[24px] rounded-full flex items-center justify-center font-inter-tight text-[12px] font-semibold text-[#0D0512]"
                  style={{
                    background:
                      'linear-gradient(90deg, #FDB938 6.62%, #ED6B51 100%)',
                  }}
                >
                  {idx + 1}
                </div>
                <span className="font-inter text-[14px] leading-[20px] tracking-[-0.028px] text-white">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Авторы вебинара */}
        <section className="mt-[24px] px-[20px]">
          <h2 className="font-inter-tight text-[22px] font-semibold leading-[110%] tracking-[-0.44px] text-white">
            Авторы вебинара
          </h2>
          <div className="mt-[12px] flex flex-col gap-[10px]">
            {SPEAKERS.map((s) => (
              <SpeakerCard key={s.id} speaker={s} />
            ))}
          </div>
        </section>

        {/* Нижний CTA */}
        <section className="mt-[28px] px-[20px]">
          <div
            className="rounded-[16px] p-[1px]"
            style={{
              background:
                'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)',
            }}
          >
            <div className="rounded-[15px] bg-[#0F0F13] p-[20px] text-center">
              <p className="font-inter-tight text-[22px] font-semibold leading-[110%] tracking-[-0.44px] text-white">
                Готов прокачать торговый процесс?
              </p>
              <p className="mt-[8px] font-inter text-[13px] leading-[18px] tracking-[-0.026px] text-[rgba(255,255,255,0.72)]">
                Запишись на бесплатный вебинар и узнай, как «Дневник трейдера» с ИИ помогает фиксировать идеи и принимать решения быстрее.
              </p>
              <button
                type="button"
                className="mt-[16px] w-full h-[52px] rounded-[12px] inline-flex items-center justify-center gap-[8px] font-inter-tight text-[16px] font-semibold tracking-[-0.32px] text-[#0D0512] transition-transform active:scale-[0.99]"
                style={{
                  background: 'linear-gradient(90deg, #FDB938 6.62%, #ED6B51 100%)',
                  boxShadow:
                    '0px 12px 32px -10px rgba(237, 107, 81, 0.55)',
                }}
              >
                <IconPlay />
                Записаться на вебинар
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
