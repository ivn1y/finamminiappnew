'use client';

import { useCallback, useEffect, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { cn } from '@/shared/lib/utils';

type Filter = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'ALL';

type ReportRow = {
  id: string;
  title: string;
  description: string;
  attachments: {
    id: string;
    mime: string;
    kind: string;
    name: string;
    url: string;
  }[];
  status: string;
  rejectionComment: string | null;
  createdAt: string;
  reviewedAt: string | null;
  participant: {
    displayName: string;
    email: string;
    phone: string;
    participantKey: string;
  };
};

type ParticipantRow = {
  id: string;
  email: string;
  displayName: string;
  phone: string;
  participantKey: string;
  createdAt: string;
  updatedAt: string;
  hasPassword: boolean;
  reportsCount: number;
};

type AdminSection = 'reports' | 'participants';

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

  const [section, setSection] = useState<AdminSection>('reports');
  const [filter, setFilter] = useState<Filter>('PENDING');
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [participants, setParticipants] = useState<ParticipantRow[]>([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [actingId, setActingId] = useState<string | null>(null);
  const [mediaViewer, setMediaViewer] = useState<{
    url: string;
    kind: 'image' | 'video';
    name: string;
  } | null>(null);
  const [rejectTarget, setRejectTarget] = useState<{ id: string; title: string } | null>(null);
  const [rejectComment, setRejectComment] = useState('');

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
      setReports(
        (data.reports ?? []).map((row) => ({
          ...row,
          attachments: row.attachments ?? [],
          rejectionComment: row.rejectionComment ?? null,
        })),
      );
    } finally {
      setListLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (!authenticated || section !== 'reports') return;
    void loadReports();
  }, [authenticated, section, loadReports]);

  const loadParticipants = useCallback(async () => {
    setParticipantsLoading(true);
    try {
      const res = await fetch('/api/bug-bounty/admin/participants?limit=2000', fetchOpts);
      const data = (await res.json()) as { error?: string; participants?: ParticipantRow[] };
      if (!res.ok) {
        toast.error(data.error ?? 'Не удалось загрузить участников');
        setParticipants([]);
        return;
      }
      setParticipants(data.participants ?? []);
    } finally {
      setParticipantsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authenticated || section !== 'participants') return;
    void loadParticipants();
  }, [authenticated, section, loadParticipants]);

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
      setParticipants([]);
      toast.message('Вы вышли');
    }
  };

  const patchReport = async (
    id: string,
    status: 'ACCEPTED' | 'REJECTED' | 'PENDING',
    rejectionCommentForReject?: string | null,
  ): Promise<boolean> => {
    setActingId(id);
    try {
      const body: { status: string; rejectionComment?: string | null } = { status };
      if (status === 'REJECTED') {
        body.rejectionComment = rejectionCommentForReject ?? null;
      }
      const res = await fetch(`/api/bug-bounty/admin/reports/${encodeURIComponent(id)}`, {
        ...fetchOpts,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        toast.error(data.error ?? 'Не удалось обновить');
        return false;
      }
      await loadReports();
      return true;
    } finally {
      setActingId(null);
    }
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    const ok = await patchReport(rejectTarget.id, 'REJECTED', rejectComment.trim() || null);
    if (ok) {
      setRejectTarget(null);
      setRejectComment('');
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
    <>
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-col gap-3 border-b border-zinc-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">Bug bounty — модерация</h1>
          <p className="text-sm text-zinc-500">
            Репорты и список зарегистрированных на странице bug bounty участников.
          </p>
        </div>
        <Button type="button" variant="outline" className="border-zinc-700 text-zinc-200" onClick={() => void handleLogout()}>
          Выйти
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-zinc-800/80 pb-4">
        <button
          type="button"
          onClick={() => setSection('reports')}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm transition-colors',
            section === 'reports'
              ? 'bg-zinc-100 text-zinc-900'
              : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800',
          )}
        >
          Репорты
        </button>
        <button
          type="button"
          onClick={() => setSection('participants')}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm transition-colors',
            section === 'participants'
              ? 'bg-zinc-100 text-zinc-900'
              : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800',
          )}
        >
          Участники
        </button>
      </div>

      {section === 'reports' ? (
        <>
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
                        {r.status === 'REJECTED' && r.rejectionComment ? (
                          <p className="mt-2 rounded-md bg-red-950/40 px-2 py-1.5 text-xs text-red-100/90 ring-1 ring-red-500/25">
                            <span className="font-medium text-red-200/90">Комментарий участнику: </span>
                            {r.rejectionComment}
                          </p>
                        ) : null}
                        <p className="mt-1 text-xs text-zinc-500">
                          {r.participant.displayName} · {r.participant.email} · {r.participant.phone}
                        </p>
                        {r.attachments.length > 0 ? (
                          <div className="mt-3 rounded-lg border border-zinc-800/80 bg-black/25 p-3">
                            <p className="mb-2 text-xs font-medium text-zinc-400">
                              Вложения{' '}
                              <span className="font-normal text-zinc-500">({r.attachments.length})</span>
                            </p>
                            <ul className="flex max-w-full flex-row gap-3 overflow-x-auto overscroll-x-contain pb-1">
                              {r.attachments.map((att) => (
                                <li
                                  key={att.id}
                                  className="w-[min(100%,280px)] shrink-0 rounded-md border border-zinc-800 bg-zinc-950/80 p-2"
                                >
                                  <div className="mb-2 flex items-center justify-between gap-2">
                                    <p
                                      className="min-w-0 truncate text-[11px] text-zinc-500"
                                      title={att.name}
                                    >
                                      {att.name}
                                    </p>
                                    <button
                                      type="button"
                                      className="flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                                      onClick={() =>
                                        setMediaViewer({
                                          url: att.url,
                                          kind: att.kind === 'video' ? 'video' : 'image',
                                          name: att.name,
                                        })
                                      }
                                    >
                                      <Maximize2 className="size-3" aria-hidden />
                                      На весь экран
                                    </button>
                                  </div>
                                  {att.kind === 'image' ? (
                                    <button
                                      type="button"
                                      className="block w-full cursor-zoom-in text-left"
                                      onClick={() =>
                                        setMediaViewer({
                                          url: att.url,
                                          kind: 'image',
                                          name: att.name,
                                        })
                                      }
                                    >
                                      {/* eslint-disable-next-line @next/next/no-img-element -- same-origin admin attachment URL */}
                                      <img
                                        src={att.url}
                                        alt={att.name}
                                        className="max-h-52 w-full rounded object-contain"
                                      />
                                    </button>
                                  ) : (
                                    <div className="space-y-1.5">
                                      <video
                                        src={att.url}
                                        controls
                                        className="max-h-52 w-full rounded bg-black"
                                        preload="metadata"
                                      />
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2">
                        {r.status !== 'ACCEPTED' ? (
                          <Button
                            type="button"
                            size="sm"
                            className="bg-emerald-700 text-white hover:bg-emerald-600"
                            disabled={busy}
                            onClick={() => void patchReport(r.id, 'ACCEPTED')}
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
                            onClick={() => {
                              setRejectTarget({ id: r.id, title: r.title });
                              setRejectComment('');
                            }}
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
                            onClick={() => void patchReport(r.id, 'PENDING')}
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
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-zinc-500">
              Всего: <span className="text-zinc-300">{participants.length}</span>
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-zinc-400"
              disabled={participantsLoading}
              onClick={() => void loadParticipants()}
            >
              Обновить
            </Button>
          </div>

          {participantsLoading && participants.length === 0 ? (
            <p className="text-sm text-zinc-500">Загрузка…</p>
          ) : participants.length === 0 ? (
            <p className="text-sm text-zinc-500">Пока никто не зарегистрировался.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-zinc-800">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm text-zinc-200">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-500">
                    <th className="px-3 py-2 font-medium">Имя</th>
                    <th className="px-3 py-2 font-medium">Почта</th>
                    <th className="px-3 py-2 font-medium">Телефон</th>
                    <th className="px-3 py-2 font-medium">Репортов</th>
                    <th className="px-3 py-2 font-medium">Пароль</th>
                    <th className="px-3 py-2 font-medium">Регистрация</th>
                    <th className="px-3 py-2 font-medium">Ключ</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p) => (
                    <tr key={p.id} className="border-b border-zinc-800/80 last:border-0 hover:bg-zinc-900/30">
                      <td className="max-w-[140px] truncate px-3 py-2 font-medium text-zinc-100" title={p.displayName}>
                        {p.displayName}
                      </td>
                      <td className="max-w-[180px] truncate px-3 py-2 text-zinc-300" title={p.email}>
                        {p.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-zinc-400">{p.phone}</td>
                      <td className="px-3 py-2 text-zinc-400">{p.reportsCount}</td>
                      <td className="px-3 py-2 text-zinc-400">{p.hasPassword ? 'да' : 'нет'}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-zinc-500">
                        {new Date(p.createdAt).toLocaleString('ru-RU')}
                      </td>
                      <td
                        className="max-w-[100px] cursor-default truncate px-3 py-2 font-mono text-xs text-zinc-500"
                        title={p.participantKey}
                      >
                        {p.participantKey}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>

    <Dialog open={mediaViewer !== null} onOpenChange={(o) => !o && setMediaViewer(null)}>
      <DialogContent
        className={cn(
          'h-[100dvh] max-h-[100dvh] w-screen max-w-[100vw] gap-0 overflow-hidden border-0 bg-zinc-950 p-0 shadow-2xl',
          'left-0 top-0 translate-x-0 translate-y-0 rounded-none sm:left-0 sm:top-0 sm:max-w-[100vw] sm:translate-x-0 sm:translate-y-0',
        )}
        aria-describedby={undefined}
      >
        {mediaViewer ? (
          <>
            <DialogTitle className="sr-only">{mediaViewer.name}</DialogTitle>
            <div className="flex h-[calc(100dvh-3rem)] min-h-0 w-full items-center justify-center p-3 pt-14">
              {mediaViewer.kind === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element -- fullscreen viewer
                <img
                  src={mediaViewer.url}
                  alt={mediaViewer.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <video
                  src={mediaViewer.url}
                  controls
                  playsInline
                  className="max-h-full max-w-full"
                  preload="metadata"
                />
              )}
            </div>
            <p className="absolute bottom-3 left-1/2 max-w-[min(90vw,32rem)] -translate-x-1/2 truncate px-2 text-center text-xs text-zinc-500">
              {mediaViewer.name}
            </p>
          </>
        ) : null}
      </DialogContent>
    </Dialog>

    <Dialog
      open={rejectTarget !== null}
      onOpenChange={(o) => {
        if (!o) {
          setRejectTarget(null);
          setRejectComment('');
        }
      }}
    >
      <DialogContent className="border-zinc-800 bg-zinc-900 text-zinc-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Отклонить репорт</DialogTitle>
          <DialogDescription className="text-zinc-400">
            {rejectTarget ? (
              <>
                <span className="font-medium text-zinc-300">{rejectTarget.title}</span>
                <span className="mt-2 block">
                  Комментарий увидит участник рядом с этим репортом в разделе «Мои репорты» (необязательно).
                </span>
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>
        <textarea
          value={rejectComment}
          onChange={(e) => setRejectComment(e.target.value)}
          placeholder="Например: дубликат, не воспроизводится, вне области программы…"
          rows={4}
          maxLength={2000}
          className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
        />
        <p className="text-xs text-zinc-500">{rejectComment.length} / 2000</p>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            className="border-zinc-600"
            onClick={() => {
              setRejectTarget(null);
              setRejectComment('');
            }}
          >
            Отмена
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={actingId !== null && rejectTarget !== null && actingId === rejectTarget.id}
            onClick={() => void confirmReject()}
          >
            Отклонить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
