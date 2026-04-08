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

        <div className="relative z-10 flex flex-col pb-[max(2rem,env(safe-area-inset-bottom))]">
          <h1 className="px-5 pt-[46px] font-[family-name:var(--font-inter-tight)] text-[30px] font-normal leading-[1.1] tracking-[-0.6px]">
            Условия участия в конкурсе Дневника Трейдера
          </h1>

          <div className="mt-6 px-5">
            <div className="max-w-[353px] text-[16px] leading-normal text-white">
              <RulesBody />
            </div>
          </div>

          <div className="mt-10 px-5">
            <div className="mx-auto w-full max-w-[393px]">
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

function RulesBody() {
  return (
    <>
      <p className="mb-0">
        <span className="font-[family-name:var(--font-inter-tight)] font-bold">1. Участники</span>
        <span className="font-[family-name:var(--font-inter-tight)] font-normal">
          <br />
          К участию допускаются все желающие, прошедшие регистрацию в боте.
          <br />
          <br />
        </span>
        <span className="font-[family-name:var(--font-inter-tight)] font-bold">2. Что считается багом</span>
        <span className="font-[family-name:var(--font-inter-tight)] font-normal">
          <br />
          Любая ошибка на платформе{' '}
        </span>
        <a
          href="https://beta.comon.ru"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-clip-text font-[family-name:var(--font-inter-tight)] font-normal text-transparent underline decoration-white/35 underline-offset-[3px] outline-offset-4 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/50"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgb(255, 149, 0) 0%, rgb(255, 137, 0) 40%, rgb(242, 61, 0) 56%, rgb(165, 90, 255) 90%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
          }}
        >
          beta.comon.ru
        </a>
        <span className="font-[family-name:var(--font-inter-tight)] font-normal">
          : некорректное отображение, сбой функциональности, проблемы с авторизацией, опечатки в контенте и т.д.
          <br />
          <br />
        </span>
        <span className="font-[family-name:var(--font-inter-tight)] font-bold">3. Правила подачи</span>
        <span className="font-[family-name:var(--font-inter-tight)] font-normal">
          <br />• Каждый баг-репорт должен содержать название и подробное описание{' '}
        </span>
      </p>
      <p className="mb-0 font-[family-name:var(--font-inter-tight)] font-normal">
        • Приветствуются скриншоты и видео
        <br />
        с воспроизведением бага{' '}
      </p>
      <p className="mb-0 font-[family-name:var(--font-inter-tight)] font-normal">• Дубликаты не засчитываются </p>
      <p className="mb-0 font-[family-name:var(--font-inter-tight)] font-normal">
        • Намеренные атаки на платформу запрещены{' '}
      </p>
      <p className="mb-0">
        <span className="font-[family-name:var(--font-inter-tight)] font-normal">
          <br />
        </span>
        <span className="font-[family-name:var(--font-inter-tight)] font-bold">4. Оценка и очки</span>
        <span className="font-[family-name:var(--font-inter-tight)] font-normal">
          <br />
          • Принятый баг — +1 очко{' '}
        </span>
      </p>
      <p className="mb-0 font-[family-name:var(--font-inter-tight)] font-normal">
        • Отклонённые и дублирующие репорты очков не приносят{' '}
      </p>
      <p className="mb-0">
        <span className="font-[family-name:var(--font-inter-tight)] font-normal">
          • Организаторы вправе изменить оценку
          <br />
          с обоснованием
          <br />
          <br />
        </span>
        <span className="font-[family-name:var(--font-inter-tight)] font-bold">5. Призы</span>
        <span className="font-[family-name:var(--font-inter-tight)] font-normal">
          <br />
          • 1-е место: 2 билета на Moscow Trading Week{' '}
        </span>
      </p>
      <p className="mb-0 font-[family-name:var(--font-inter-tight)] font-normal">
        • 2-е место: 1 билет на Moscow Trading Week{' '}
      </p>
      <p>
        <span className="font-[family-name:var(--font-inter-tight)] font-normal">
          • 3-е место: Мерч от организаторов
          <br />
          <br />
        </span>
        <span className="font-[family-name:var(--font-inter-tight)] font-bold">6. Решения организаторов</span>
        <span className="font-[family-name:var(--font-inter-tight)] font-normal">
          <br />
          Решения жюри по спорным вопросам являются окончательными.
        </span>
      </p>
    </>
  );
}
