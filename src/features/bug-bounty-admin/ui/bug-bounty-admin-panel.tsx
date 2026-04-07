'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

type Filter = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'ALL';

type ReportRow = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  reviewedAt: string | null;
  participant: {
    displayName: string;
    email: string;
    phone: string;
    participantKey: string;
  };
};

const fetchOpts: RequestInit = { credentials: 'include' };

const STATUS_TAB: { value: Filter; label: string }[] = [
  { value: 'PENDING', label: 'На проверке' },
  { value: 'ALL', label: 'Все' },
  { value: 'ACCEPTED', label: 'Принятые' },
  { value: 'REJECTED', label: 'Отклонённые' },
];

function statusClass(status: string): string {
  if (status === 'PENDING') return 'bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/30';
  if (status === 'ACCEPTED') return 'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/30';
  if (status === 'REJECTED') return 'bg-red-500/15 text-red-200 ring-1 ring-red-500/30';
  return 'bg-zinc-500/15 text-zinc-300';
}

export function BugBountyAdminPanel() {
  const [sessionLoading, setSessionLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [tokenInput, setTokenInput] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [filter, setFilter] = useState<Filter>('PENDING');
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [actingId, setActingId] = useState<string | null>(null);

  const checkSession = useCallback(async () => {
    setSessionLoading(true);
    try {
      const res = await fetch('/api/bug-bounty/admin/session', fetchOpts);
      const data = (await res.json()) as { ok?: boolean; configured?: boolean };
      setConfigured(data.configured !== false);
      setAuthenticated(!!data.ok);
    } catch {
      setAuthenticated(false);
    } finally {
      setSessionLoading(false);
    }
  }, []);

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  const loadReports = useCallback(async () => {
    setListLoading(true);
    try {
      const q = new URLSearchParams({ status: filter, limit: '200' });
      const res = await fetch(`/api/bug-bounty/admin/reports?${q}`, fetchOpts);
      const data = (await res.json()) as { error?: string; reports?: ReportRow[] };
      if (!res.ok) {
        toast.error(data.error ?? 'Не удалось загрузить список');
        setReports([]);
        return;
      }
      setReports(data.reports ?? []);
    } finally {
      setListLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (!authenticated) return;
    void loadReports();
  }, [authenticated, loadReports]);

  const handleLogin = async () => {
    const t = tokenInput.trim();
    if (!t) {
      toast.error('Введите токен');
      return;
    }
    setLoginLoading(true);
    try {
      const res = await fetch('/api/bug-bounty/admin/login', {
        ...fetchOpts,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: t }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        toast.error(data.error ?? 'Вход не удался');
        return;
      }
      setTokenInput('');
      setAuthenticated(true);
      toast.success('Сессия открыта');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/bug-bounty/admin/logout', { ...fetchOpts, method: 'POST' });
    } finally {
      setAuthenticated(false);
      setReports([]);
      toast.message('Вы вышли');
    }
  };

  const patchStatus = async (id: string, status: 'ACCEPTED' | 'REJECTED' | 'PENDING') => {
    setActingId(id);
    try {
      const res = await fetch(`/api/bug-bounty/admin/reports/${encodeURIComponent(id)}`, {
        ...fetchOpts,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        toast.error(data.error ?? 'Не удалось обновить');
        return;
      }
      await loadReports();
    } finally {
      setActingId(null);
    }
  };

  if (sessionLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500">
        Проверка сессии…
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="mx-auto max-w-md rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 text-sm text-zinc-300">
        <p className="font-medium text-zinc-100">Модерация недоступна</p>
        <p className="mt-2 text-zinc-400">
          На сервере не заданы <code className="text-zinc-300">BUG_BOUNTY_ADMIN_TOKEN</code> или{' '}
          <code className="text-zinc-300">BUG_BOUNTY_EXPORT_TOKEN</code>.
        </p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="mx-auto w-full max-w-md space-y-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">Bug bounty — модерация</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Введите секретный токен из переменных окружения сервера. Он не сохраняется в браузере
            целиком — после входа выдаётся защищённая сессия (cookie).
          </p>
        </div>
        <input
          type="password"
          autoComplete="off"
          placeholder="Токен администратора"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          disabled={loginLoading}
          className="h-11 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
        />
        <Button
          type="button"
          className="w-full"
          disabled={loginLoading}
          onClick={() => void handleLogin()}
        >
          {loginLoading ? 'Вход…' : 'Войти'}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="flex flex-col gap-3 border-b border-zinc-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">Bug bounty — модерация</h1>
          <p className="text-sm text-zinc-500">Принятие и отклонение репортов, очки только за принятые.</p>
        </div>
        <Button type="button" variant="outline" className="border-zinc-700 text-zinc-200" onClick={() => void handleLogout()}>
          Выйти
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_TAB.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setFilter(t.value)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm transition-colors',
              filter === t.value
                ? 'bg-zinc-100 text-zinc-900'
                : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800',
            )}
          >
            {t.label}
          </button>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-zinc-400"
          disabled={listLoading}
          onClick={() => void loadReports()}
        >
          Обновить
        </Button>
      </div>

      {listLoading && reports.length === 0 ? (
        <p className="text-sm text-zinc-500">Загрузка…</p>
      ) : reports.length === 0 ? (
        <p className="text-sm text-zinc-500">Нет репортов в этом фильтре.</p>
      ) : (
        <ul className="space-y-3">
          {reports.map((r) => {
            const open = expanded[r.id];
            const busy = actingId === r.id;
            return (
              <li
                key={r.id}
                className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-200"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn('rounded px-2 py-0.5 text-xs font-medium', statusClass(r.status))}>
                        {r.status}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {new Date(r.createdAt).toLocaleString('ru-RU')}
                      </span>
                    </div>
                    <p className="mt-2 font-medium text-zinc-100">{r.title}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {r.participant.displayName} · {r.participant.email} · {r.participant.phone}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {r.status !== 'ACCEPTED' ? (
                      <Button
                        type="button"
                        size="sm"
                        className="bg-emerald-700 text-white hover:bg-emerald-600"
                        disabled={busy}
                        onClick={() => void patchStatus(r.id, 'ACCEPTED')}
                      >
                        Принять
                      </Button>
                    ) : null}
                    {r.status !== 'REJECTED' ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        disabled={busy}
                        onClick={() => void patchStatus(r.id, 'REJECTED')}
                      >
                        Отклонить
                      </Button>
                    ) : null}
                    {r.status !== 'PENDING' ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="border-zinc-600"
                        disabled={busy}
                        onClick={() => void patchStatus(r.id, 'PENDING')}
                      >
                        В очередь
                      </Button>
                    ) : null}
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-2 text-xs text-zinc-500 underline-offset-2 hover:text-zinc-300 hover:underline"
                  onClick={() => setExpanded((prev) => ({ ...prev, [r.id]: !open }))}
                >
                  {open ? 'Скрыть описание' : 'Показать описание'}
                </button>
                {open ? (
                  <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-md bg-black/40 p-3 text-xs text-zinc-300">
                    {r.description}
                  </pre>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
