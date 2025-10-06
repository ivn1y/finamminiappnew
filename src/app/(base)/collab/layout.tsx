'use client';

import React from 'react';
import { useAppStore } from '@/shared/store/app-store';
import { Onboarding } from '@/entities/user/ui/onboarding';
import { BottomNavigation } from '@/widgets/bottom-navigation';
import { usePathname } from 'next/navigation';

export default function CollabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isOnboardingComplete } = useAppStore();

  // Show onboarding if user hasn't completed it
  if (!isOnboardingComplete || !user?.role) {
    return <Onboarding />;
  }

  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <main className="flex-1">
        {children}
      </main>
      <BottomNavigation activeTab={pathname} />
    </div>
  );
}
