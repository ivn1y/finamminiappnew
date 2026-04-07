'use client';

import { BugBountyFlow } from '@/features/bug-bounty';

/**
 * Отдельный поток вне основного онбординга («Поехали»).
 * Макеты: Figma miniapp (экран приветствия node 441:5542 и связанные фреймы).
 */
export default function BugBountyPage() {
  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-[393px] bg-black">
      <BugBountyFlow />
    </div>
  );
}
