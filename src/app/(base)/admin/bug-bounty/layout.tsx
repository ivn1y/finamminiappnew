import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bug bounty — модерация',
  robots: { index: false, follow: false },
};

export default function BugBountyAdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
