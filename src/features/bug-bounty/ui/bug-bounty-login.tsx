'use client';

import { useCallback, useMemo, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';
import { validateEmail } from '@/shared/lib/validation';
import { marketingGradientBg } from './assets';

type Props = {
  onBack: () => void;
  onSuccess: (participantKey: string) => void;
  onGoRegister: (emailPrefill: string) => void;
};

export function BugBountyLogin({ onBack, onSuccess, onGoRegister }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<'email' | 'password' | 'form', string>>>({});

  const canSubmit = useMemo(() => {
    if (!email.trim() || !password) return false;
    return validateEmail(email).isValid;
  }, [email, password]);

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    if (value.trim() === '') {
      setErrors((prev) => ({ ...prev, email: undefined, form: undefined }));
      return;
    }
    const r = validateEmail(value);
    setErrors((prev) => ({ ...prev, email: r.isValid ? undefined : r.error, form: undefined }));
  }, []);

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    const emailRes = validateEmail(email.trim());
    if (!emailRes.isValid) {
      setErrors((prev) => ({ ...prev, email: emailRes.error }));
      return;
    }
    setSubmitting(true);
    setErrors({});
    try {
      const res = await fetch('/api/bug-bounty/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        error?: string;
        code?: string;
        participantKey?: string;
      };
      if (res.ok && body.participantKey) {
        onSuccess(body.participantKey);
        return;
      }
      if (res.status === 404 && body.code === 'EMAIL_NOT_FOUND') {
        toast.info('Такой почты нет — заполните регистрацию');
        onGoRegister(email.trim());
        return;
      }
      setErrors((prev) => ({
        ...prev,
        form: body.error ?? 'Не удалось войти',
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black text-white pb-[12%]"
      style={{ touchAction: 'none' }}
    >
      <div
        className="pointer-events-none absolute left-[55px] top-[101px] z-0 h-[205px] w-[284px] rounded-[284px] opacity-[0.38] blur-[80px]"
        style={{
          background: 'var(--gradients-button-marketing-end-default, #59307C)',
        }}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-[393px] px-5">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-inter-tight)] text-[30px] font-normal leading-[1.1] tracking-[-0.6px]">
            Вход
          </h1>
          <p className="mt-1 text-[17px] leading-6 tracking-[-0.17px] text-white/[0.72]">
            Введите почту и пароль
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {errors.form ? (
            <p className="px-1 text-center text-[12px] leading-4 text-[#EF5541]">{errors.form}</p>
          ) : null}
          <div className="flex flex-col gap-1">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Почта"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              disabled={submitting}
              aria-invalid={!!errors.email}
              className={cn(
                'h-14 w-full rounded-lg border-0 bg-[rgba(79,79,89,0.16)] px-4 text-base leading-6 tracking-[-0.128px] text-white placeholder:text-[#a4a4b2] focus-visible:outline-none focus-visible:ring-1 disabled:opacity-60',
                errors.email ? 'ring-1 ring-[#EF5541]/80 focus-visible:ring-[#EF5541]/80' : 'focus-visible:ring-white/25',
              )}
            />
            {errors.email ? (
              <p className="px-1 text-[12px] leading-4 text-[#EF5541]">{errors.email}</p>
            ) : null}
          </div>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, form: undefined }));
            }}
            disabled={submitting}
            className="h-14 w-full rounded-lg border-0 bg-[rgba(79,79,89,0.16)] px-4 text-base leading-6 tracking-[-0.128px] text-white placeholder:text-[#a4a4b2] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/25 disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => onGoRegister(email.trim())}
            className="mt-1 text-center text-[15px] leading-5 tracking-[-0.15px] text-white/[0.52] underline-offset-2 hover:text-white/[0.72] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/25"
          >
            Нет аккаунта? Зарегистрироваться
          </button>
        </div>

        <div className="mt-5 flex items-center gap-[10px]">
          <button
            type="button"
            onClick={onBack}
            disabled={submitting}
            className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-[#242426] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 disabled:opacity-50"
            aria-label="Назад"
          >
            <ChevronLeft className="size-6" strokeWidth={2} />
          </button>
          <button
            type="button"
            disabled={!canSubmit || submitting}
            onClick={() => void handleSubmit()}
            className={cn(
              'flex h-14 flex-1 items-center justify-center rounded-lg text-[17px] font-semibold tracking-[-0.204px] transition-opacity',
              canSubmit && !submitting
                ? 'text-white'
                : 'cursor-not-allowed bg-[rgba(192,192,204,0.16)] text-[#c0c0cc]',
            )}
            style={canSubmit && !submitting ? { backgroundImage: marketingGradientBg } : undefined}
          >
            {submitting ? 'Вход…' : 'Войти'}
          </button>
        </div>
      </div>
    </div>
  );
}
