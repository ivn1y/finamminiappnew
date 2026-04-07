'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { BugBountyWelcome } from './bug-bounty-welcome';
import { BugBountyRules } from './bug-bounty-rules';
import { BugBountyRegistration } from './bug-bounty-registration';
import { BugBountyLeaderboard } from './bug-bounty-leaderboard';
import { BugBountyProvider, useBugBounty } from './bug-bounty-context';

type Step = 'welcome' | 'rules' | 'register' | 'leaderboard';

function BugBountyFlowInner() {
  const { participantKey, registered, loading, refresh } = useBugBounty();
  const [step, setStep] = useState<Step>('welcome');

  const handleParticipate = useCallback(() => {
    if (registered) {
      setStep('leaderboard');
      return;
    }
    setStep('register');
  }, [registered]);

  const handleRegister = useCallback(
    async (data: { email: string; displayName: string; phone: string }) => {
      if (!participantKey) {
        toast.error('Сессия не готова, обновите страницу');
        return;
      }
      const res = await fetch('/api/bug-bounty/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantKey, ...data }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        toast.error(body.error ?? 'Не удалось сохранить');
        return;
      }
      await refresh();
      setStep('leaderboard');
    },
    [participantKey, refresh],
  );

  if (loading || !participantKey) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-black text-[15px] text-white/50">
        Загрузка…
      </div>
    );
  }

  switch (step) {
    case 'welcome':
      return <BugBountyWelcome onRules={() => setStep('rules')} />;
    case 'rules':
      return <BugBountyRules onParticipate={handleParticipate} />;
    case 'register':
      return (
        <BugBountyRegistration
          onBack={() => setStep('rules')}
          onComplete={handleRegister}
        />
      );
    case 'leaderboard':
      return (
        <BugBountyLeaderboard
          participantKey={participantKey}
          onLeaderboardChange={() => refresh()}
        />
      );
    default:
      return null;
  }
}

export function BugBountyFlow() {
  return (
    <BugBountyProvider>
      <BugBountyFlowInner />
    </BugBountyProvider>
  );
}
