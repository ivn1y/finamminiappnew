'use client';

import { useRouter } from 'next/navigation';
import { ConsentPersonalDataOverlay } from '@/features/bug-bounty/ui/consent-personal-data-overlay';

export default function ConsentPersonalDataPage() {
  const router = useRouter();

  return <ConsentPersonalDataOverlay onClose={() => router.back()} />;
}
