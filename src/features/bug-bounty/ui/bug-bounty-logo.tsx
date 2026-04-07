import { cn } from '@/shared/lib/utils';
import { bugBountyAssets } from './assets';

export function BugBountyLogo({ className }: { className?: string }) {
  return (
    <div className={cn('relative mx-auto flex w-[120px] flex-col items-center', className)}>
      <div className="relative flex h-[104px] w-full flex-col items-center pt-1">
        <img
          src={bugBountyAssets.logoUnion}
          alt=""
          width={62}
          height={58}
          className="mb-1 object-contain"
        />
        <img
          src={bugBountyAssets.logoFinamText}
          alt="Финам"
          width={106}
          height={20}
          className="object-contain"
        />
      </div>
      <p className="bg-gradient-to-r from-[#fdb938] to-[#ed6b51] bg-clip-text text-center text-[12px] font-semibold uppercase leading-[13px] tracking-[1.2px] text-transparent">
        Дневник
      </p>
    </div>
  );
}
