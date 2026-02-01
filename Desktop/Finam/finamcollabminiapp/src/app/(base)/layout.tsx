'use client';

import type { Metadata } from 'next';

import { BottomNavigation } from '@/widgets/bottom-navigation';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/shared/store/app-store';
import { QRScanner } from '@/features/qr-scanner';
import { useEffect } from 'react';

// Feature flag для скрытия основных разделов (временное решение для привлечения лидов)
const HIDE_MAIN_SECTIONS = true;

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { openQRScanner, hideQRScanner, isUserDataInputModalOpen, showAppTour, showProfileTour, showMapTour, showScheduleTour, showAssistantTour, isOnboardingComplete, isProductModalOpen } = useAppStore();

  // Проверяем, что какой-то tour действительно показывается
  const isAnyTourActive = (showProfileTour || showMapTour || showScheduleTour || showAssistantTour) ||
    (showAppTour && pathname === '/collab/home'); // HomeTour показывается только на главной странице

  // Показываем навигацию только на страницах приложения (/collab/*), 
  // но НЕ на экранах онбординга и НЕ когда открыт модальный диалог
  // и НЕ когда скрыты основные разделы
  const showNav = pathname.startsWith('/collab') && 
                  !isUserDataInputModalOpen &&
                  !isProductModalOpen &&
                  !HIDE_MAIN_SECTIONS &&
                  !pathname.startsWith('/collab/data-input');

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
        // Если скрыты основные разделы, редиректим на страницу ввода данных
        if (HIDE_MAIN_SECTIONS) {
          router.push('/collab/data-input');
        } else {
          router.push('/collab/home');
        }
        return;
      }
      
      // Если основные разделы скрыты и пользователь пытается зайти на home, map, products, chat
      // редиректим на страницу ввода данных
      if (HIDE_MAIN_SECTIONS && isOnboardingComplete) {
        const hiddenPaths = ['/collab/home', '/collab/map', '/collab/products', '/collab/chat'];
        if (hiddenPaths.includes(pathname)) {
          router.push('/collab/data-input');
          return;
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isOnboardingComplete, pathname, router]);

  // Скрываем содержимое страниц home, map, products, chat если флаг включен
  const hiddenPaths = ['/collab/home', '/collab/map', '/collab/products', '/collab/chat'];
  const shouldHideContent = HIDE_MAIN_SECTIONS && hiddenPaths.includes(pathname);

  return (
    <div className="relative min-h-screen bg-black text-white">
      {!shouldHideContent && children}
      {showNav && <BottomNavigation activeTab={pathname} isBlocked={isAnyTourActive} />}
    </div>
  );
}
