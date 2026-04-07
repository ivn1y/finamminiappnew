import { cn } from '@/shared/lib/utils';
import { bugBountyAssets } from './assets';

export function BugBountyLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'mx-auto flex w-[120px] items-center justify-center pr-[7.492px] pb-0 pl-[6.668px]',
        className,
      )}
    >
      <img
        src={bugBountyAssets.finamDiaryLogo}
        alt="Финам Дневник"
        className="h-auto max-h-full w-full object-contain"
      />
    </div>
  );
}
