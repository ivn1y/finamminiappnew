'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/shared/store/app-store';
import { Loader } from '@/shared/ui';

export default function RootPage() {
  const router = useRouter();
  const { isNewUser } = useAppStore();

  useEffect(() => {
    const checkUserStatus = () => {
      if (isNewUser()) {
        router.replace('/onboarding');
      } else {
        router.replace('/collab/home');
      }
    };

    checkUserStatus();
  }, [router]);

  return <Loader />;
}