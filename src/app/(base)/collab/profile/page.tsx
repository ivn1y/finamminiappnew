'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Динамический импорт ProfilePage для предотвращения ошибок загрузки чанков
const ProfilePage = dynamic(() => import('@/widgets/profile-page').then(mod => ({ default: mod.ProfilePage })), {
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
    </div>
  ),
  ssr: false
});

export default function ProfilePageRoute() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    }>
      <ProfilePage />
    </Suspense>
  );
}
