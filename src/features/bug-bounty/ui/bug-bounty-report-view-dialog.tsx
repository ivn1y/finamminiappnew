'use client';

import { useCallback, useEffect, useState } from 'react';
import { Film } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { cn } from '@/shared/lib/utils';
import type { BugBountyAttachmentMeta } from '@/shared/lib/bug-bounty/report-attachments-constants';

type ReportDetail = {
  id: string;
  title: string;
  description: string;
  status: string;
  statusLabel: string;
  rejectionComment: string | null;
  createdAt: string;
  reviewedAt: string | null;
  attachments: BugBountyAttachmentMeta[];
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participantKey: string;
  reportId: string | null;
};

function attachmentSrc(reportId: string, fileId: string, participantKey: string): string {
  const q = new URLSearchParams({ participantKey });
  return `/api/bug-bounty/my-attachments/${encodeURIComponent(reportId)}/${encodeURIComponent(fileId)}?${q}`;
}

export function BugBountyReportViewDialog({ open, onOpenChange, participantKey, reportId }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<ReportDetail | null>(null);

  const reset = useCallback(() => {
    setReport(null);
    setError(null);
    setLoading(false);
  }, []);

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  useEffect(() => {
    if (!open || !reportId) {
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    setReport(null);
    const q = new URLSearchParams({ participantKey });
    void fetch(`/api/bug-bounty/my-reports/${encodeURIComponent(reportId)}?${q}`)
      .then(async (res) => {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
          report?: ReportDetail;
        };
        if (!res.ok) {
          throw new Error(body.error ?? 'Не удалось загрузить');
        }
        if (!body.report) {
          throw new Error('Пустой ответ');
        }
        return body.report;
      })
      .then((r) => {
        if (!cancelled) setReport(r);
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Не удалось загрузить');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, reportId, participantKey]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          'flex max-h-[min(90dvh,calc(100dvh-1.5rem))] w-[calc(100vw-1.25rem)] max-w-[393px] flex-col gap-0 overflow-hidden border border-white/10 bg-[#121214] p-6 text-white md:max-h-[min(85dvh,calc(100dvh-2rem))] md:w-full md:max-w-[560px] md:p-8',
          'left-1/2 top-3 -translate-x-1/2 translate-y-0 sm:top-6 md:top-[8%]',
          '[&>button]:right-6 [&>button]:top-6 md:[&>button]:right-8 md:[&>button]:top-8',
        )}
      >
        <DialogHeader className="shrink-0 space-y-1.5 pr-12 text-left md:pr-14">
          <DialogTitle className="text-lg font-semibold leading-tight text-white">
            {loading ? 'Загрузка…' : report?.title ?? 'Репорт'}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="text-sm text-white/55">
              {report ? (
                <>
                  <span>{report.statusLabel}</span>
                  <span className="text-white/35">
                    {' · '}
                    {new Date(report.createdAt).toLocaleString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {report.reviewedAt ? (
                    <span className="mt-1 block text-white/40">
                      Рассмотрен:{' '}
                      {new Date(report.reviewedAt).toLocaleString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  ) : null}
                </>
              ) : (
                <span>Ваш отправленный репорт</span>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden overscroll-contain pr-0.5">
          {error ? <p className="text-sm text-[#EF5541]">{error}</p> : null}

          {loading ? (
            <p className="text-sm text-white/50">Загружаем описание и вложения…</p>
          ) : null}

          {!loading && report ? (
            <>
              {report.status === 'REJECTED' && report.rejectionComment ? (
                <p className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2.5 text-[13px] leading-[1.45] text-white/85">
                  <span className="font-medium text-white">Комментарий модератора: </span>
                  {report.rejectionComment}
                </p>
              ) : null}

              <div>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-white/45">
                  Описание
                </p>
                <p className="whitespace-pre-wrap break-words text-[15px] leading-[1.5] text-white/90">
                  {report.description}
                </p>
              </div>

              {report.attachments.length > 0 ? (
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/45">
                    Вложения
                  </p>
                  <ul className="flex flex-col gap-3">
                    {report.attachments.map((a) => {
                      const src = attachmentSrc(report.id, a.id, participantKey);
                      return (
                        <li
                          key={a.id}
                          className="overflow-hidden rounded-lg border border-white/10 bg-black/30"
                        >
                          {a.kind === 'image' ? (
                            // eslint-disable-next-line @next/next/no-img-element -- API URL with auth query
                            <a href={src} target="_blank" rel="noopener noreferrer" className="block">
                              <img
                                src={src}
                                alt={a.name}
                                className="max-h-[min(50dvh,360px)] w-full object-contain"
                              />
                            </a>
                          ) : (
                            <div className="p-3">
                              <div className="mb-2 flex items-center gap-2 text-sm text-white/70">
                                <Film className="size-4 shrink-0 opacity-80" aria-hidden />
                                <span className="min-w-0 truncate">{a.name}</span>
                              </div>
                              <video
                                src={src}
                                controls
                                className="max-h-[min(50dvh,360px)] w-full rounded-md bg-black"
                                preload="metadata"
                              />
                            </div>
                          )}
                          {a.kind === 'image' ? (
                            <p className="truncate px-2 py-1.5 text-center text-xs text-white/50">
                              {a.name}
                            </p>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
