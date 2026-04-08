import { bugBountyAssets } from './assets';
import { BugBountyLogo } from './bug-bounty-logo';
import { MarketingPrimaryButton } from './marketing-primary-button';

type Props = {
  onRules: () => void;
};

export function BugBountyWelcome({ onRules }: Props) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-black text-white md:min-h-screen">
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden md:hidden"
        aria-hidden
      >
        <img
          src={bugBountyAssets.ticketBackground}
          alt=""
          className="h-full min-h-[100dvh] w-full object-cover object-bottom"
        />
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[max(442px,50dvh)] md:hidden"
        style={{
          background:
            'linear-gradient(180deg, #000 0%, #000 50%, rgba(0, 0, 0, 0) 100%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[146px] md:hidden"
        style={{
          background:
            'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #000 54.25%)',
        }}
        aria-hidden
      />
      <div className="relative z-10 flex w-full min-w-0 flex-col px-5 pt-[calc(50px+env(safe-area-inset-top,0px))] md:mx-auto md:max-w-4xl md:px-12 md:pt-16 lg:px-16 lg:pt-20">
        <BugBountyLogo />
        {/*
          min-w-0 + w-full: иначе во flex-родителе min-width:auto не даёт сузиться — текст визуально в одну длинную строку.
          md:max-w-lg: комфортная мера строки на широком экране (~55–65 символов).
        */}
        <div className="mx-auto mt-[54px] flex w-full min-w-0 max-w-[336px] flex-col gap-[13px] text-center md:mt-12 md:max-w-lg md:gap-5">
          <h1 className="font-[family-name:var(--font-inter-tight)] text-[30px] font-normal leading-[1.1] tracking-[-0.6px] md:text-5xl md:tracking-[-1px]">
            Привет!
          </h1>
          <p className="text-balance text-[17px] font-normal leading-6 tracking-[-0.17px] text-white/[0.72] md:text-xl md:leading-8 md:tracking-normal">
            Тестируй Дневник трейдера, находи и&nbsp;фиксируй баги, и&nbsp;выигрывай VIP-билеты на&nbsp;Moscow Trading Week. Призовой фонд&nbsp;— 400&nbsp;000&nbsp;₽.
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-[316px] w-full min-w-0 px-5 pb-[max(90px,env(safe-area-inset-bottom,0px))] md:mt-16 md:mx-auto md:max-w-lg md:px-12 md:pb-16 lg:px-16">
        <MarketingPrimaryButton type="button" onClick={onRules}>
          Правила
        </MarketingPrimaryButton>
      </div>
    </div>
  );
}
