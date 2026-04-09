'use client';

import { useEffect, useRef } from 'react';
import { MarketingPrimaryButton } from './marketing-primary-button';

type Props = {
  onParticipate: () => void;
};

const rulesTopGlowBackground =
  'var(--Marketing-Gradient-BG-01, linear-gradient(305deg, var(--gradients-bg-01-start, #FEDA3B) -2.67%, var(--gradients-bg-01-middle1, #EF5541) 38.9%, var(--gradients-bg-01-middle2, #801FDB) 77.17%, var(--gradients-bg-01-end, #7E2A89) 98.46%))';

export function BugBountyRules({ onParticipate }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="fixed inset-0 overflow-y-auto bg-black text-white"
      style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'none' }}
    >
      <div className="relative min-h-full">
        <div
          className="pointer-events-none absolute right-[105px] top-[-66px] z-0 h-[260px] w-[375px] rounded-[375px] opacity-[0.16] blur-[50px]"
          style={{ background: rulesTopGlowBackground }}
          aria-hidden
        />

        <div className="relative z-10 flex flex-col pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-24">
          <h1 className="px-5 pt-[46px] font-[family-name:var(--font-inter-tight)] text-[30px] font-normal leading-[1.1] tracking-[-0.6px] md:mx-auto md:max-w-4xl md:px-8 md:pt-20 md:text-center md:text-4xl md:leading-[1.15] md:tracking-[-0.8px] lg:px-12">
            Условия участия в конкурсе Дневник Трейдера
          </h1>

          <div className="mt-6 px-5 md:mt-10 md:px-8 lg:px-12">
            <div className="max-w-[353px] text-[16px] leading-normal text-white md:mx-auto md:max-w-3xl md:text-lg md:leading-relaxed">
              <BugBountyRulesBody />
            </div>
          </div>

          <div className="mt-10 px-5 md:mt-14 md:px-8 lg:px-12">
            <div className="mx-auto w-full max-w-[393px] md:max-w-md">
              <MarketingPrimaryButton type="button" onClick={onParticipate}>
                Участвовать
              </MarketingPrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BugBountyRulesBody() {
  const linkGradient = 'linear-gradient(90deg, rgb(255, 149, 0) 0%, rgb(255, 137, 0) 40%, rgb(242, 61, 0) 56%, rgb(165, 90, 255) 90%)';

  return (
    <div className="flex flex-col gap-6 font-[family-name:var(--font-inter-tight)]">
      <div>
        <p className="font-bold">1. Участники</p>
        <p className="mt-1 font-normal">
          Все пользователи, прошедшие регистрацию в&nbsp;рамках конкурса.
        </p>
      </div>

      <div>
        <p className="font-bold">2. Что считается багом</p>
        <p className="mt-1 font-normal">
          Любая воспроизводимая ошибка на{' '}
          <a
            href="https://beta.comon.ru"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-clip-text text-transparent underline decoration-white/35 underline-offset-[3px] outline-offset-4 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/50"
            style={{ backgroundImage: linkGradient, WebkitBackgroundClip: 'text', backgroundClip: 'text' }}
          >
            beta.comon.ru
          </a>
          : сбои в&nbsp;работе функций, некорректное отображение, проблемы с&nbsp;авторизацией, опечатки в&nbsp;контенте.
        </p>
      </div>

      <div>
        <p className="font-bold">3. Требования к&nbsp;репорту</p>
        <p className="mt-1 font-normal">
          Название и&nbsp;подробное описание бага. Скриншоты и&nbsp;видео приветствуются. Дубликаты не&nbsp;засчитываются. Намеренные атаки на&nbsp;платформу&nbsp;— дисквалификация.
        </p>
      </div>

      <div>
        <p className="font-bold">4. Система оценки</p>
        <p className="mt-1 font-normal">
          Принятый баг&nbsp;— +1&nbsp;очко. Дубли и&nbsp;отклонённые репорты очков не&nbsp;приносят. Организаторы вправе скорректировать оценку с&nbsp;обоснованием.
        </p>
      </div>

      <div>
        <p className="font-bold">5. Призовой фонд&nbsp;— 520&nbsp;000&nbsp;₽</p>
        <p className="mt-1 font-normal">
          20&nbsp;VIP-билетов на&nbsp;Moscow Trading Week&nbsp;— 20-ти участникам с&nbsp;наибольшим количеством очков.
        </p>
      </div>

      <div>
        <p className="font-bold">6. Сроки проведения и&nbsp;решения организаторов</p>
        <p className="mt-1 font-normal">
          Конкурс проводится с&nbsp;10 по&nbsp;30&nbsp;апреля включительно. Итоги подведем в&nbsp;нашем сообществе в&nbsp;
          <a
            href="https://t.me/+sT39l5GVcGljOTdi"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-clip-text text-transparent underline decoration-white/35 underline-offset-[3px] outline-offset-4 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/50"
            style={{ backgroundImage: linkGradient, WebkitBackgroundClip: 'text', backgroundClip: 'text' }}
          >
            Telegram
          </a>
          . Решения организаторов окончательны и&nbsp;обжалованию не&nbsp;подлежат.
        </p>
      </div>
    </div>
  );
}
