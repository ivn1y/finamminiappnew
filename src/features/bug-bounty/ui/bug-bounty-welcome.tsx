import { bugBountyAssets } from './assets';
import { BugBountyLogo } from './bug-bounty-logo';
import { MarketingPrimaryButton } from './marketing-primary-button';

type Props = {
  onRules: () => void;
};

export function BugBountyWelcome({ onRules }: Props) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-black text-white">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <img
          src={bugBountyAssets.ticketBackground}
          alt=""
          className="h-full min-h-[100dvh] w-full object-cover object-bottom"
        />
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[max(442px,50dvh)]"
        style={{
          background:
            'linear-gradient(180deg, #000 0%, #000 50%, rgba(0, 0, 0, 0) 100%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[146px]"
        style={{
          background:
            'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #000 54.25%)',
        }}
        aria-hidden
      />
      <div className="relative z-10 flex flex-col px-5 pt-[calc(50px+env(safe-area-inset-top,0px))]">
        <BugBountyLogo />
        <div className="mx-auto mt-[54px] flex max-w-[336px] flex-col gap-[13px] text-center">
          <h1 className="font-[family-name:var(--font-inter-tight)] text-[30px] font-normal leading-[1.1] tracking-[-0.6px]">
            Привет!
          </h1>
          <p className="text-[17px] font-normal leading-6 tracking-[-0.17px] text-white/[0.72]">
            Тестируй Дневник трейдера, находи и&nbsp;фиксируй баги, и&nbsp;выигрывай VIP-билеты на&nbsp;Moscow Trading Week. Призовой фонд&nbsp;— 400&nbsp;000&nbsp;₽.
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-[316px] px-5 pb-[max(90px,env(safe-area-inset-bottom,0px))]">
        <MarketingPrimaryButton type="button" onClick={onRules}>
          Правила
        </MarketingPrimaryButton>
      </div>
    </div>
  );
}
