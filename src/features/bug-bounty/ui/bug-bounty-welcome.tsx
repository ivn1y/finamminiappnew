import { BugBountyLogo } from './bug-bounty-logo';
import { MarketingPrimaryButton } from './marketing-primary-button';
import { bugBountyAssets } from './assets';

type Props = {
  onRules: () => void;
};

export function BugBountyWelcome({ onRules }: Props) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-black text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src={bugBountyAssets.welcomeTicket}
          alt=""
          className="absolute left-1/2 top-[18%] h-[min(78vh,640px)] w-auto max-w-none -translate-x-1/2 object-contain opacity-95"
        />
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(50vh,442px)] bg-gradient-to-b from-transparent via-black/20 to-black"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-black"
        aria-hidden
      />
      <div className="pointer-events-none absolute bottom-[22%] left-1/2 w-[284px] -translate-x-1/2" aria-hidden>
        <img src={bugBountyAssets.ellipseGlow} alt="" className="h-auto w-full opacity-90" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-5 pt-[50px]">
        <BugBountyLogo />
        <div className="mx-auto mt-10 max-w-[336px] text-center">
          <h1 className="font-[family-name:var(--font-inter-tight)] text-[30px] font-normal leading-[1.1] tracking-[-0.6px]">
            Привет!
          </h1>
          <p className="mt-[13px] text-[17px] font-normal leading-6 tracking-[-0.17px] text-white/[0.72]">
            Дневник Трейдера проводит конкурс <br />
            и дарит билеты на Moscow Trading Week, если вы поможете нам протестировать нашу платформу.
          </p>
        </div>
        <div className="flex-1" />
      </div>

      <div className="relative z-10 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
        <MarketingPrimaryButton type="button" onClick={onRules}>
          Правила
        </MarketingPrimaryButton>
      </div>
    </div>
  );
}
