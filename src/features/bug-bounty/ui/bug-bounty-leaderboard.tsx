'use client';

import { useCallback, useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { BugBountyLogo } from './bug-bounty-logo';
import { MarketingPrimaryButton } from './marketing-primary-button';
import { bugBountyAssets } from './assets';
import { BugBountyReportDialog } from './bug-bounty-report-dialog';
import { cn } from '@/shared/lib/utils';

function scoreLabel(n: number): string {
  const m = n % 100;
  if (m >= 11 && m <= 14) return 'очков';
  const k = n % 10;
  if (k === 1) return 'очко';
  if (k >= 2 && k <= 4) return 'очка';
  return 'очков';
}

type Row = { rank: number; displayName: string; score: number };
type LeaderboardPayload = { rows: Row[]; self: Row | null };

type Props = {
  participantKey: string;
  onLeaderboardChange?: () => void;
};

export function BugBountyLeaderboard({ participantKey, onLeaderboardChange }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [self, setSelf] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/bug-bounty/leaderboard?participantKey=${encodeURIComponent(participantKey)}`,
      );
      if (!res.ok) {
        toast.error('Не удалось загрузить рейтинг');
        return;
      }
      const data = (await res.json()) as LeaderboardPayload;
      setRows(data.rows ?? []);
      setSelf(data.self ?? null);
    } finally {
      setLoading(false);
    }
  }, [participantKey]);

  useEffect(() => {
    void load();
  }, [load]);

  const openBeta = () => {
    window.open('https://beta.comon.ru', '_blank', 'noopener,noreferrer');
  };

  const isHighlighted = (row: Row) =>
    self !== null && row.rank === self.rank && row.displayName === self.displayName;

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-black text-white">
      <BugBountyReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        participantKey={participantKey}
        onSuccess={() => {
          void load();
          onLeaderboardChange?.();
        }}
      />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.35]" aria-hidden>
        <div className="relative h-[120%] w-[340%] max-w-none -rotate-[125deg]">
          <img src={bugBountyAssets.ratingBg} alt="" className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-5 pt-[calc(50px+env(safe-area-inset-top,0px))]">
        <BugBountyLogo />
        <h1 className="mt-16 text-center font-[family-name:var(--font-inter-tight)] text-[30px] font-normal leading-[1.1] tracking-[-0.6px]">
          Рейтинг
        </h1>

        <div className="mx-auto mt-6 grid w-full max-w-[353px] grid-cols-[40px_1fr_56px] px-1 text-[10px] font-medium uppercase leading-7 tracking-[-0.16px] text-white/[0.56]">
          <span className="text-left">Позиция</span>
          <span className="text-center">Участник</span>
          <span className="text-right">Очки</span>
        </div>

        <div className="mx-auto mt-3 flex w-full max-w-[353px] flex-col gap-2">
          {loading ? (
            <p className="py-8 text-center text-sm text-white/50">Загрузка таблицы…</p>
          ) : rows.length === 0 ? (
            <p className="py-8 text-center text-sm text-white/50">Пока нет участников с очками</p>
          ) : (
            rows.map((row) => (
              <div
                key={`${row.rank}-${row.displayName}`}
                className={cn(
                  'grid h-[46px] grid-cols-[40px_1fr_56px] items-center rounded-lg bg-black/60 px-4 text-[15px] font-normal leading-[22px] tracking-[-0.09px]',
                  isHighlighted(row) && 'ring-1 ring-[#fdb938]/80 bg-black/80',
                )}
              >
                <span className="text-center tabular-nums">{row.rank}</span>
                <span className="truncate text-center">{row.displayName}</span>
                <span className="text-right tabular-nums">{row.score}</span>
              </div>
            ))
          )}
        </div>

        {self && self.rank > 50 && (
          <p className="mx-auto mt-4 max-w-[353px] text-center text-sm text-white/55">
            Ваша позиция: {self.rank} · {self.score} {scoreLabel(self.score)}
          </p>
        )}

        <div className="flex-1" />
      </div>

      <div className="relative z-10 flex flex-col gap-3 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
        <div className="mx-auto w-full max-w-[393px]">
          <MarketingPrimaryButton type="button" onClick={() => setReportOpen(true)}>
            Отправить баги
          </MarketingPrimaryButton>
        </div>
        <button
          type="button"
          onClick={openBeta}
          className="mx-auto flex items-center gap-2 pb-2 text-sm text-white/55 underline-offset-4 hover:text-white/80 hover:underline"
        >
          Открыть beta.comon.ru
          <ExternalLink className="size-3.5 opacity-70" aria-hidden />
        </button>
      </div>
    </div>
  );
}
