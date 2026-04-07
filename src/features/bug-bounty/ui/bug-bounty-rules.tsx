import { MarketingPrimaryButton } from './marketing-primary-button';
import { bugBountyAssets } from './assets';

type Props = {
  onParticipate: () => void;
};

export function BugBountyRules({ onParticipate }: Props) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-black text-white">
      <div className="pointer-events-none absolute left-[-87px] top-[-66px] h-[260px] w-[375px] opacity-80" aria-hidden>
        <img src={bugBountyAssets.rulesTopGlow} alt="" className="h-full w-full object-cover" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <h1 className="px-5 pt-[46px] font-[family-name:var(--font-inter-tight)] text-[30px] font-normal leading-[1.1] tracking-[-0.6px]">
          Условия участия в конкурсе Дневника Трейдера
        </h1>

        <div className="mt-6 flex-1 overflow-y-auto overscroll-contain px-5 pb-36">
          <div className="max-w-[353px] text-[16px] leading-normal text-white">
            <RulesBody />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black via-black to-transparent px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-10">
        <div className="mx-auto w-full max-w-[393px]">
          <MarketingPrimaryButton type="button" onClick={onParticipate}>
            Участвовать
          </MarketingPrimaryButton>
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
        <span
          className="bg-clip-text font-[family-name:var(--font-inter-tight)] font-normal text-transparent"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgb(255, 149, 0) 0%, rgb(255, 137, 0) 40%, rgb(242, 61, 0) 56%, rgb(165, 90, 255) 90%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
          }}
        >
          beta.comon.ru
        </span>
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
