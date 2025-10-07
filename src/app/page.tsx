'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/shared/store/app-store';
import { Loader } from '@/shared/ui';

export default function RootPage() {
  const router = useRouter();
  const { isOnboardingComplete } = useAppStore();

  useEffect(() => {
    if (isOnboardingComplete) {
      router.replace('/collab/home');
    } else {
      router.replace('/onboarding');
    }
  }, [isOnboardingComplete, router]);

  return <Loader />;
}
