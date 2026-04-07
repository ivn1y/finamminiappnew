import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { marketingGradientBg } from './assets';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function MarketingPrimaryButton({ className, children, type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      className={cn(
        'flex h-14 w-full items-center justify-center rounded-lg px-6 py-4 text-[17px] font-medium tracking-[-0.2px] text-white',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      style={{ backgroundImage: marketingGradientBg }}
      {...rest}
    >
      {children}
    </button>
  );
}
