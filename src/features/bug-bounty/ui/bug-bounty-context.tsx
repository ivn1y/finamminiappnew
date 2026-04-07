'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'finam-bb-participant-key';

export type BugBountyProfile = {
  email: string;
  displayName: string;
  phone: string;
};

type BugBountyContextValue = {
  participantKey: string | null;
  profile: BugBountyProfile | null;
  registered: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
  /** После входа по почте подставляем ключ участника с сервера */
  adoptParticipantKey: (key: string) => Promise<void>;
};

const BugBountyContext = createContext<BugBountyContextValue | null>(null);

export function BugBountyProvider({ children }: { children: ReactNode }) {
  const [participantKey, setParticipantKey] = useState<string | null>(null);
  const [profile, setProfile] = useState<BugBountyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (key: string) => {
    const res = await fetch(`/api/bug-bounty/me?participantKey=${encodeURIComponent(key)}`);
    if (!res.ok) return;
    const data = (await res.json()) as {
      registered?: boolean;
      email?: string;
      displayName?: string;
      phone?: string;
    };
    if (data.registered && data.email && data.displayName && data.phone) {
      setProfile({
        email: data.email,
        displayName: data.displayName,
        phone: data.phone,
      });
    } else {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let key = localStorage.getItem(STORAGE_KEY);
      if (!key) {
        key = crypto.randomUUID();
        localStorage.setItem(STORAGE_KEY, key);
      }
      if (cancelled) return;
      setParticipantKey(key);
      try {
        await fetchProfile(key);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchProfile]);

  const refresh = useCallback(async () => {
    if (!participantKey) return;
    await fetchProfile(participantKey);
  }, [participantKey, fetchProfile]);

  const adoptParticipantKey = useCallback(
    async (key: string) => {
      localStorage.setItem(STORAGE_KEY, key);
      setParticipantKey(key);
      await fetchProfile(key);
    },
    [fetchProfile],
  );

  const value = useMemo(
    () => ({
      participantKey,
      profile,
      registered: profile !== null,
      loading,
      refresh,
      adoptParticipantKey,
    }),
    [participantKey, profile, loading, refresh, adoptParticipantKey],
  );

  return <BugBountyContext.Provider value={value}>{children}</BugBountyContext.Provider>;
}

export function useBugBounty() {
  const ctx = useContext(BugBountyContext);
  if (!ctx) {
    throw new Error('useBugBounty must be used within BugBountyProvider');
  }
  return ctx;
}
