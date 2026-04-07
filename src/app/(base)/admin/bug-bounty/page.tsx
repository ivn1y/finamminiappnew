'use client';

import { BugBountyAdminPanel } from '@/features/bug-bounty-admin/ui/bug-bounty-admin-panel';

export default function BugBountyAdminPage() {
  return (
    <div className="min-h-[100dvh] bg-zinc-950 px-4 py-8 text-zinc-100 md:px-8">
      <BugBountyAdminPanel />
    </div>
  );
}
