'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { BugBountyWelcome } from './bug-bounty-welcome';
import { BugBountyRules } from './bug-bounty-rules';
import { BugBountyLogin } from './bug-bounty-login';
import {
  BugBountyRegistration,
  type BugBountyRegisterCompleteResult,
} from './bug-bounty-registration';
import { BugBountyLeaderboard } from './bug-bounty-leaderboard';
import { BugBountyProvider, useBugBounty } from './bug-bounty-context';

type Step = 'welcome' | 'rules' | 'login' | 'register' | 'leaderboard';

function BugBountyFlowInner() {
  const { participantKey, registered, loading, refresh, adoptParticipantKey } = useBugBounty();
  const [step, setStep] = useState<Step>('welcome');
  const [registerEmailPrefill, setRegisterEmailPrefill] = useState('');

  const handleParticipate = useCallback(() => {
    if (registered) {
      setStep('leaderboard');
      return;
    }
    setRegisterEmailPrefill('');
    setStep('register');
  }, [registered]);

  const handleRegister = useCallback(
    async (data: {
      email: string;
      displayName: string;
      phone: string;
      password: string;
    }): Promise<BugBountyRegisterCompleteResult> => {
      if (!participantKey) {
        toast.error('Сессия не готова, обновите страницу');
        return { success: false };
      }
      const res = await fetch('/api/bug-bounty/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantKey, ...data }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        if (res.status === 409) {
          return {
            success: false,
            email:
              body.error ??
              'Эта почта уже занята. Войдите под этой почтой.',
          };
        }
        toast.error(body.error ?? 'Не удалось сохранить');
        return { success: false };
      }
      await refresh();
      setStep('leaderboard');
      return { success: true };
    },
    [participantKey, refresh],
  );

  if (loading || !participantKey) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-black text-[15px] text-white/50 md:min-h-screen md:text-base">
        Загрузка…
      </div>
    );
  }

  // Ключ и профиль восстанавливаются из localStorage и /api/bug-bounty/me, а шаг — нет.
  // Без этого после обновления страницы снова показывался бы welcome/rules.
  const activeStep: Step = registered ? 'leaderboard' : step;

  switch (activeStep) {
    case 'welcome':
      return <BugBountyWelcome onRules={() => setStep('rules')} />;
    case 'rules':
      return <BugBountyRules onParticipate={handleParticipate} />;
    case 'login':
      return (
        <BugBountyLogin
          onBack={() => setStep('register')}
          onSuccess={async (key) => {
            await adoptParticipantKey(key);
            setStep('leaderboard');
          }}
          onGoRegister={(prefill) => {
            setRegisterEmailPrefill(prefill);
            setStep('register');
          }}
        />
      );
    case 'register':
      return (
        <BugBountyRegistration
          initialEmail={registerEmailPrefill}
          onBack={() => setStep('rules')}
          onGoLogin={() => setStep('login')}
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
