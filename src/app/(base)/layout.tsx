'use client';

import type { Metadata } from 'next';

import { BottomNavigation } from '@/widgets/bottom-navigation';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/shared/store/app-store';
import { QRScanner } from '@/features/qr-scanner';
import { useEffect } from 'react';

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { showQRScanner, hideQRScanner, isUserDataInputModalOpen, showAppTour, showProfileTour, showMapTour, showScheduleTour, showAssistantTour, isOnboardingComplete } = useAppStore();

  // Проверяем, что какой-то tour действительно показывается
  const isAnyTourActive = (showProfileTour || showMapTour || showScheduleTour || showAssistantTour) ||
    (showAppTour && pathname === '/collab/home'); // HomeTour показывается только на главной странице

  // Показываем навигацию только на страницах приложения (/collab/*), 
  // но НЕ на экранах онбординга и НЕ когда открыт модальный диалог
  const showNav = pathname.startsWith('/collab') && 
                  !isUserDataInputModalOpen;


  // Проверка онбординга
  useEffect(() => {
    // Небольшая задержка для инициализации store
    const timer = setTimeout(() => {
      const onboardingPaths = ['/', '/onboarding', '/auth', '/privacy-policy', '/qr-test'];
      const isOnboardingPath = onboardingPaths.some(path => pathname.startsWith(path));

      // Если пользователь не завершил онбординг и не находится на странице онбординга
      if (!isOnboardingComplete && !isOnboardingPath) {
        console.log('[BaseLayout] Redirecting to onboarding - not completed');
        router.push('/onboarding');
        return;
      }

      // Если пользователь завершил онбординг и находится на главной странице или странице онбординга
      if (isOnboardingComplete && (pathname === '/' || pathname === '/onboarding')) {
        console.log('[BaseLayout] Redirecting to main app - onboarding completed');
        router.push('/collab/home');
        return;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isOnboardingComplete, pathname, router]);

  return (
    <div className="relative h-screen bg-black text-white">
      {children}
      {showNav && <BottomNavigation activeTab={pathname} isBlocked={isAnyTourActive} />}
    </div>
  );
}
