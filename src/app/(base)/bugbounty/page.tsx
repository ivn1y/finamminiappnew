'use client';

import { BugBountyFlow } from '@/features/bug-bounty';

/**
 * Отдельный поток вне основного онбординга («Поехали»).
 * Макеты: Figma miniapp (экран приветствия node 441:5542 и связанные фреймы).
 */
export default function BugBountyPage() {
  return (
    <div className="min-h-[100dvh] w-full bg-black" style={{ overscrollBehavior: 'none' }}>
      {/*
        Мобилка: узкая колонка по макету. md+: на всю ширину окна — отдельные md:-стили внутри экранов.
      */}
      <div className="relative mx-auto min-h-[100dvh] w-full max-w-[393px] bg-black md:mx-0 md:max-w-none">
        <BugBountyFlow />
      </div>
    </div>
  );
}
