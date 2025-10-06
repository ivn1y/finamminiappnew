'use client';

import type { Metadata } from 'next';
import { WebAppConfigurator } from '@/widgets/telegram/ui/config';
import { WebAppLoader } from '@/widgets/telegram/ui/loader';

import { BottomNavigation } from '@/widgets/bottom-navigation';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/shared/store/app-store';

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { showQRScanner, showAppTour, isOnboardingComplete } = useAppStore();

  const noNavPaths = ['/onboarding', '/auth'];
  const showNav = isOnboardingComplete && !noNavPaths.some(p => pathname.startsWith(p));

  const mainContentClass = showQRScanner
    ? 'h-screen overflow-hidden'
    : 'flex-1 overflow-y-auto';

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <WebAppLoader />
      <WebAppConfigurator />
      <main
        className={mainContentClass}
        style={{ overflow: showAppTour ? 'hidden' : 'auto' }}
      >
        {children}
      </main>
      {!showQRScanner && showNav && <BottomNavigation activeTab={pathname} />}
    </div>
  );
}
