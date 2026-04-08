'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { validateEmail, validatePhone } from '@/shared/lib/validation';
import { marketingGradientBg } from './assets';

const MIN_PASSWORD = 8;

type Props = {
  initialEmail?: string;
  onBack: () => void;
  onComplete: (data: {
    email: string;
    displayName: string;
    phone: string;
    password: string;
  }) => Promise<void>;
};

export function BugBountyRegistration({ initialEmail, onBack, onComplete }: Props) {
  const [email, setEmail] = useState(initialEmail ?? '');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<'email' | 'phone' | 'password', string>>>({});

  const canSubmit = useMemo(() => {
    if (!displayName.trim() || !email.trim() || !phone.trim() || password.length < MIN_PASSWORD) {
      return false;
    }
    return validateEmail(email).isValid && validatePhone(phone).isValid;
  }, [email, displayName, phone, password]);

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    if (value.trim() === '') {
      setErrors((prev) => ({ ...prev, email: undefined }));
      return;
    }
    const r = validateEmail(value);
    setErrors((prev) => ({ ...prev, email: r.isValid ? undefined : r.error }));
  }, []);

  useEffect(() => {
    if (initialEmail?.trim()) {
      setEmail(initialEmail.trim());
    }
  }, [initialEmail]);

  const handlePhoneChange = useCallback((value: string) => {
    setPhone(value);
    if (value.trim() === '') {
      setErrors((prev) => ({ ...prev, phone: undefined }));
      return;
    }
    const r = validatePhone(value);
    if (!r.isValid) {
      setErrors((prev) => ({ ...prev, phone: r.error }));
      return;
    }
    setErrors((prev) => ({ ...prev, phone: undefined }));
    const digitsOnly = value.replace(/\D/g, '');
    const isRussianStyle11 =
      !value.trim().startsWith('+') &&
      digitsOnly.length === 11 &&
      (digitsOnly.startsWith('8') || digitsOnly.startsWith('7'));
    const isCompleteInternationalNumber = value.trim().startsWith('+') && digitsOnly.length >= 10;
    if (r.formatted && (isRussianStyle11 || isCompleteInternationalNumber)) {
      setPhone(r.formatted);
    }
  }, []);

  const passwordTooShort = password.length > 0 && password.length < MIN_PASSWORD;
  const showPasswordHelp = password.length === 0 || passwordTooShort || !!errors.password;

  const handleDone = async () => {
    if (!canSubmit || saving) return;
    const emailRes = validateEmail(email.trim());
    const phoneRes = validatePhone(phone.trim());
    if (password.length < MIN_PASSWORD) {
      setErrors((prev) => ({
        ...prev,
        password: `Введите не менее ${MIN_PASSWORD} символов`,
      }));
      return;
    }
    if (!emailRes.isValid || !phoneRes.isValid) {
      setErrors({
        ...(emailRes.isValid ? {} : { email: emailRes.error }),
        ...(phoneRes.isValid ? {} : { phone: phoneRes.error }),
      });
      return;
    }
    setSaving(true);
    try {
      await onComplete({
        email: email.trim().toLowerCase(),
        displayName: displayName.trim(),
        phone: phoneRes.formatted ?? phone.trim(),
        password,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black text-white pb-[10%]"
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
            Быстрая регистрация
          </h1>
          <p className="mt-1 text-[17px] leading-6 tracking-[-0.17px] text-white/[0.72]">
            Расскажи о себе в нескольких словах
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Почта"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              disabled={saving}
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
            type="text"
            autoComplete="nickname"
            placeholder="Имя для турнирной таблицы"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={saving}
            className="h-14 w-full rounded-lg border-0 bg-[rgba(79,79,89,0.16)] px-4 text-base leading-6 tracking-[-0.128px] text-white placeholder:text-[#a4a4b2] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/25 disabled:opacity-60"
          />
          <div className="flex flex-col gap-1">
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+7 912 345-67-89"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              disabled={saving}
              aria-invalid={!!errors.phone}
              className={cn(
                'h-14 w-full rounded-lg border-0 bg-[rgba(79,79,89,0.16)] px-4 text-base leading-6 tracking-[-0.128px] text-white placeholder:text-[#a4a4b2] focus-visible:outline-none focus-visible:ring-1 disabled:opacity-60',
                errors.phone ? 'ring-1 ring-[#EF5541]/80 focus-visible:ring-[#EF5541]/80' : 'focus-visible:ring-white/25',
              )}
            />
            {errors.phone ? (
              <p className="px-1 text-[12px] leading-4 text-[#EF5541]">{errors.phone}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1">
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              disabled={saving}
              aria-invalid={!!errors.password || passwordTooShort}
              aria-describedby={showPasswordHelp ? 'bb-reg-password-help' : undefined}
              className={cn(
                'h-14 w-full rounded-lg border-0 bg-[rgba(79,79,89,0.16)] px-4 text-base leading-6 tracking-[-0.128px] text-white placeholder:text-[#a4a4b2] focus-visible:outline-none focus-visible:ring-1 disabled:opacity-60',
                errors.password || passwordTooShort
                  ? 'ring-1 ring-[#EF5541]/80 focus-visible:ring-[#EF5541]/80'
                  : 'focus-visible:ring-white/25',
              )}
            />
            {showPasswordHelp ? (
              <p
                id="bb-reg-password-help"
                className={cn(
                  'px-1 text-[12px] leading-4',
                  errors.password || passwordTooShort ? 'text-[#EF5541]' : 'text-white/[0.5]',
                )}
              >
                {errors.password ??
                  (passwordTooShort
                    ? `Введите не менее ${MIN_PASSWORD} символов`
                    : `Пароль — не менее ${MIN_PASSWORD} символов`)}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-[10px]">
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
