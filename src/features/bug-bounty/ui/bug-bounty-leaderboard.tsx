'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { BugBountyLogo } from './bug-bounty-logo';
import { MarketingPrimaryButton } from './marketing-primary-button';
import { BugBountyReportDialog } from './bug-bounty-report-dialog';
import { BugBountyReportViewDialog } from './bug-bounty-report-view-dialog';
import { BugBountyRulesBody } from './bug-bounty-rules';

type Row = { rank: number; displayName: string; score: number; isYou?: boolean };
type LeaderboardPayload = { rows: Row[]; self: Row | null };

type MyReportItem = {
  id: string;
  title: string;
  status: string;
  statusLabel: string;
  rejectionComment: string | null;
  createdAt: string;
  reviewedAt: string | null;
};

type Props = {
  participantKey: string;
  onLeaderboardChange?: () => void;
};

export function BugBountyLeaderboard({ participantKey, onLeaderboardChange }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [self, setSelf] = useState<Row | null>(null);
  const [myReports, setMyReports] = useState<MyReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);
  const [viewReportId, setViewReportId] = useState<string | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [lbRes, mineRes] = await Promise.all([
        fetch(`/api/bug-bounty/leaderboard?participantKey=${encodeURIComponent(participantKey)}`),
        fetch(`/api/bug-bounty/my-reports?participantKey=${encodeURIComponent(participantKey)}`),
      ]);
      if (!lbRes.ok) {
        toast.error('Не удалось загрузить рейтинг');
        return;
      }
      const data = (await lbRes.json()) as LeaderboardPayload;
      setRows(data.rows ?? []);
      setSelf(data.self ?? null);

      if (mineRes.ok) {
        const mine = (await mineRes.json()) as { reports?: MyReportItem[] };
        setMyReports(
          (mine.reports ?? []).map((r) => ({
            ...r,
            rejectionComment: r.rejectionComment ?? null,
          })),
        );
      } else {
        setMyReports([]);
      }
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

  const apiSendsIsYou =
    rows.length === 0 || rows.some((r) => typeof r.isYou === 'boolean');
  const youreInTopFive = apiSendsIsYou
    ? rows.some((r) => r.isYou === true)
    : Boolean(
        self &&
          rows.some((r) => r.rank === self.rank && r.displayName === self.displayName),
      );
  const showSelfRow = Boolean(self && !youreInTopFive);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, []);

  const scrollBottomPad =
    'pb-[max(10.5rem,calc(8.75rem+env(safe-area-inset-bottom,0px)))] md:pb-[max(12rem,calc(10rem+env(safe-area-inset-bottom,0px)))]';

  const tableClass =
    'mx-auto w-full max-w-[353px] md:max-w-3xl lg:max-w-4xl';
  const rowGridClass =
    'grid h-[46px] grid-cols-[108px_minmax(0,1fr)_88px] items-center md:grid-cols-[7.5rem_minmax(0,1fr)_6.75rem]';

  const renderRow = (row: Row, keySuffix: string) => {
    const isSelf = keySuffix === 'self' || row.isYou;
    return (
    <div
      key={`${row.rank}-${row.displayName}-${keySuffix}`}
      className={`${tableClass} ${rowGridClass} rounded-[8px] font-[family-name:var(--font-inter)] text-[15px] font-normal leading-[22px] tracking-[-0.09px] md:text-base md:leading-6 [background-color:var(--icon-onbrand-secondary,rgba(0,0,0,0.56))]`}
    >
      <span className="flex h-full min-w-0 items-center justify-start gap-5 whitespace-nowrap pl-[20px]">
        <span className="shrink-0 tabular-nums text-white">{row.rank}</span>
        {isSelf && <span className="text-white/60">Вы</span>}
      </span>
      <span className="min-w-0 whitespace-nowrap pl-[calc(50%-26px)] text-left text-white">
        {row.displayName.length > 10 ? `${row.displayName.slice(0, 10)}…` : row.displayName}
      </span>
      <span className="flex h-full items-center justify-end whitespace-nowrap pr-[20px] tabular-nums text-white">
        {row.score}
      </span>
    </div>
    );
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-white">
      <BugBountyReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        participantKey={participantKey}
        onSuccess={() => {
          void load();
          onLeaderboardChange?.();
        }}
      />
      <BugBountyReportViewDialog
        open={viewReportId !== null}
        onOpenChange={(open) => {
          if (!open) setViewReportId(null);
        }}
        participantKey={participantKey}
        reportId={viewReportId}
      />

      <div
        className="pointer-events-none absolute z-0"
        style={{
          left: '50%',
          top: 'calc(32% + 130px)',
          width: '720px',
          aspectRatio: '1283.535 / 507.672',
          height: 'auto',
          transform: 'translate(-50%, -50%) rotate(-28.908deg)',
          background:
            'linear-gradient(291deg, rgba(232, 226, 218, 0.82) 0%, rgba(228, 216, 204, 0.72) 24%, rgba(218, 198, 186, 0.68) 36%, rgba(192, 152, 162, 0.62) 44%, rgba(118, 78, 98, 0.5) 52%, rgba(42, 28, 52, 0.42) 64%, rgba(42, 28, 52, 0) 78%)',
          filter: 'blur(51px)',
        }}
        aria-hidden
      />

      <div
        ref={scrollRef}
        className={`relative z-10 h-full touch-pan-y overflow-y-auto px-5 pt-[calc(50px+env(safe-area-inset-top,0px))] md:px-10 lg:px-16 ${scrollBottomPad}`}
        style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
      >
        <BugBountyLogo />
        <h1 className="mt-16 text-center font-[family-name:var(--font-inter-tight)] text-[30px] font-normal leading-[1.1] tracking-[-0.6px] md:mt-20 md:text-4xl md:tracking-[-0.8px]">
          Рейтинг
        </h1>

        <div
          className={`${tableClass} mt-6 grid grid-cols-[108px_minmax(0,1fr)_88px] items-center font-[family-name:var(--font-inter)] text-[10px] font-medium uppercase leading-7 tracking-[-0.16px] text-white/[0.56] md:mt-8 md:grid-cols-[7.5rem_minmax(0,1fr)_6.75rem] md:text-xs`}
        >
          <span className="whitespace-nowrap pl-[20px] text-left">Позиция</span>
          <span className="whitespace-nowrap text-center">Участник</span>
          <span className="whitespace-nowrap text-right">Очки</span>
        </div>

        <div className={`${tableClass} mt-3 flex flex-col gap-2 md:mt-4`}>
          {loading ? (
            <p className="py-8 text-center text-sm text-white/50">Загрузка таблицы…</p>
          ) : rows.length === 0 && !self ? (
            <p className="py-8 text-center text-sm text-white/50">
              Пока никто не набрал очков за принятые баги
            </p>
          ) : (
            <>
              {rows.length === 0 ? (
                <p className="py-2 text-center text-sm text-white/50">
                  Пока никто не набрал очков за принятые баги
                </p>
              ) : (
                rows.map((row) => renderRow(row, 'top'))
              )}
              {showSelfRow && self ? renderRow(self, 'self') : null}
            </>
          )}
        </div>

        {myReports.length > 0 ? (
          <div className={`${tableClass} mt-8`}>
            <h2 className="text-center font-[family-name:var(--font-inter-tight)] text-[17px] font-normal leading-6 tracking-[-0.17px] text-white md:text-xl">
              Мои репорты
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {myReports.map((r) => (
                <li key={r.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-0">
                  <button
                    type="button"
                    onClick={() => setViewReportId(r.id)}
                    className="w-full rounded-lg px-3 py-2.5 text-left transition hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
                  >
                    <p className="text-[15px] leading-[22px] tracking-[-0.09px] text-white">{r.title}</p>
                    <p className="mt-1 text-[12px] leading-4 text-white/55">
                      {r.statusLabel}
                      <span className="text-white/35">
                        {' · '}
                        {new Date(r.createdAt).toLocaleString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </p>
                    <p className="mt-2 text-[11px] leading-4 text-white/40">Нажмите, чтобы открыть</p>
                    {r.status === 'REJECTED' && r.rejectionComment ? (
                      <p className="mt-2 rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-2 text-[12px] leading-[1.45] text-white/80">
                        <span className="font-medium text-white/90">Комментарий модератора: </span>
                        {r.rejectionComment}
                      </p>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <h2 className="mt-8 text-center font-[family-name:var(--font-inter-tight)] text-[30px] font-normal leading-[1.1] tracking-[-0.6px] text-white md:mt-10 md:text-4xl md:tracking-[-0.8px]">
          Правила
        </h2>
        <div className={`${tableClass} mt-6 md:mt-8`}>
          <div className="text-[15px] leading-normal text-white md:text-base md:leading-relaxed">
            <BugBountyRulesBody />
          </div>
        </div>

        <div className="h-6" />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-40 flex flex-col gap-3 bg-black px-5 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] md:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-[393px] md:max-w-3xl lg:max-w-4xl">
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
