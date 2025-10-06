'use client';

import type { Metadata } from 'next';
import { WebAppConfigurator } from '@/widgets/telegram/ui/config';
import { WebAppLoader } from '@/widgets/telegram/ui/loader';

import { BottomNavigation } from '@/widgets/bottom-navigation';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/shared/store/app-store';
import { QRScanner } from '@/features/qr-scanner';

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { showQRScanner, hideQRScanner, isUserDataInputModalOpen, showAppTour, showProfileTour, showMapTour, showScheduleTour, showAssistantTour } = useAppStore();

  const noNavPaths = ['/auth', '/onboarding', '/qr-test', '/privacy-policy'];

  const showNav = !noNavPaths.some(path => pathname.startsWith(path)) && !isUserDataInputModalOpen;

  const mainContentClass = showQRScanner
    ? 'h-screen overflow-hidden'
    : 'flex-1 overflow-y-auto';

  // Проверяем, что какой-то tour действительно показывается
  // Для HomeTour нужна дополнительная проверка на highlightedButtonRect
  const isAnyTourActive = (showProfileTour || showMapTour || showScheduleTour || showAssistantTour) ||
    (showAppTour && pathname === '/collab/home'); // HomeTour показывается только на главной странице

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <WebAppLoader />
      <WebAppConfigurator />
      <main
        className={mainContentClass}
        style={{ overflow: isAnyTourActive ? 'hidden' : 'auto' }}
      >
        {children}
      </main>
      {showNav && <BottomNavigation activeTab={pathname} />}
    </div>
  );
}
