'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { bugBountyAssets, marketingGradientBg } from './assets';

type Props = {
  onBack: () => void;
  onComplete: (data: { email: string; displayName: string; phone: string }) => Promise<void>;
};

export function BugBountyRegistration({ onBack, onComplete }: Props) {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && displayName.trim().length > 0 && phone.trim().length > 0;
  }, [email, displayName, phone]);

  const handleDone = async () => {
    if (!canSubmit || saving) return;
    setSaving(true);
    try {
      await onComplete({
        email: email.trim(),
        displayName: displayName.trim(),
        phone: phone.trim(),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-black text-white">
      <div className="pointer-events-none absolute left-1/2 top-[18%] w-[284px] -translate-x-1/2 -translate-y-1/2" aria-hidden>
        <img src={bugBountyAssets.regEllipse1} alt="" className="h-auto w-full opacity-90" />
      </div>
      <div className="pointer-events-none absolute bottom-[8%] right-[-20px] w-[132px]" aria-hidden>
        <img src={bugBountyAssets.regEllipse2} alt="" className="h-auto w-full opacity-80" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[393px] flex-1 px-5 pt-[171px]">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-inter-tight)] text-[30px] font-normal leading-[1.1] tracking-[-0.6px]">
            Быстрая регистрация
          </h1>
          <p className="mt-1 text-[17px] leading-6 tracking-[-0.17px] text-white/[0.72]">
            Расскажи о себе в нескольких словах
          </p>
        </div>

        <div className="mt-16 flex flex-col gap-4">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Почта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={saving}
            className="h-14 w-full rounded-lg border-0 bg-[rgba(79,79,89,0.16)] px-4 text-base leading-6 tracking-[-0.128px] text-white placeholder:text-[#a4a4b2] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/25 disabled:opacity-60"
          />
          <input
            type="text"
            autoComplete="nickname"
            placeholder="Имя для турнирной таблицы"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={saving}
            className="h-14 w-full rounded-lg border-0 bg-[rgba(79,79,89,0.16)] px-4 text-base leading-6 tracking-[-0.128px] text-white placeholder:text-[#a4a4b2] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/25 disabled:opacity-60"
          />
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Номер телефона для связи"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={saving}
            className="h-14 w-full rounded-lg border-0 bg-[rgba(79,79,89,0.16)] px-4 text-base leading-6 tracking-[-0.128px] text-white placeholder:text-[#a4a4b2] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/25 disabled:opacity-60"
          />
        </div>
      </div>

      <div className="relative z-10 mt-auto w-full px-5 pb-[max(10px,env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto flex w-full max-w-[393px] items-center justify-between gap-[10px]">
          <button
            type="button"
            onClick={onBack}
            disabled={saving}
            className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-[#242426] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 disabled:opacity-50"
            aria-label="Назад"
          >
            <ChevronLeft className="size-6" strokeWidth={2} />
          </button>
          <button
            type="button"
            disabled={!canSubmit || saving}
            onClick={() => void handleDone()}
            className={cn(
              'flex h-14 flex-1 items-center justify-center rounded-lg text-[17px] font-semibold tracking-[-0.204px] transition-opacity',
              canSubmit && !saving
                ? 'text-white'
                : 'cursor-not-allowed bg-[rgba(192,192,204,0.16)] text-[#c0c0cc]',
            )}
            style={canSubmit && !saving ? { backgroundImage: marketingGradientBg } : undefined}
          >
            {saving ? 'Сохранение…' : 'Готово'}
          </button>
        </div>
      </div>
    </div>
  );
}
