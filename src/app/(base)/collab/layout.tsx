'use client';

import React from 'react';
import { useAppStore } from '@/shared/store/app-store';
import { Onboarding } from '@/entities/user/ui/onboarding';
import { BottomNavigation } from '@/widgets/bottom-navigation';

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

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
