'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Film, Paperclip, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/ui/dialog';
import { MarketingPrimaryButton } from './marketing-primary-button';
import { cn } from '@/shared/lib/utils';
import {
  MAX_BUG_BOUNTY_FILES,
  MAX_BUG_BOUNTY_VIDEO_BYTES,
  isAllowedBugBountyMime,
  maxBytesForMime,
} from '@/shared/lib/bug-bounty/report-attachments-constants';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participantKey: string;
  onSuccess: () => void;
};

type LocalAttachment = {
  file: File;
  previewUrl: string;
};

const ACCEPT_ATTR =
  'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime';

export function BugBountyReportDialog({
  open,
  onOpenChange,
  participantKey,
  onSuccess,
}: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<LocalAttachment[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentsRef = useRef<LocalAttachment[]>([]);
  attachmentsRef.current = attachments;

  const revokeAll = useCallback((list: LocalAttachment[]) => {
    for (const a of list) {
      URL.revokeObjectURL(a.previewUrl);
    }
  }, []);

  const reset = useCallback(() => {
    setTitle('');
    setDescription('');
    setAttachments((prev) => {
      revokeAll(prev);
      return [];
    });
  }, [revokeAll]);

  const handleOpenChange = (next: boolean) => {
    if (!next && !submitting) reset();
    onOpenChange(next);
  };

  useEffect(() => {
    return () => {
      revokeAll(attachmentsRef.current);
    };
  }, [revokeAll]);

  const pickFiles = () => {
    fileInputRef.current?.click();
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list?.length) return;

    setAttachments((prev) => {
      const next = [...prev];
      for (const file of list) {
        if (next.length >= MAX_BUG_BOUNTY_FILES) {
          toast.error(`Не больше ${MAX_BUG_BOUNTY_FILES} файлов`);
          break;
        }
        const mime = (file.type || '').trim().toLowerCase();
        if (mime && !isAllowedBugBountyMime(mime)) {
          toast.error('Подойдут фото (JPEG, PNG, WebP, GIF) или видео (MP4, WebM, MOV)');
          continue;
        }
        const maxB =
          mime && isAllowedBugBountyMime(mime) ? maxBytesForMime(mime) : MAX_BUG_BOUNTY_VIDEO_BYTES;
        if (file.size > maxB) {
          toast.error(
            mime.startsWith('video/')
              ? 'Видео не больше 45 МБ'
              : mime
                ? 'Фото не больше 12 МБ'
                : 'Файл слишком большой',
          );
          continue;
        }
        next.push({ file, previewUrl: URL.createObjectURL(file) });
      }
      return next;
    });
    e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return copy;
    });
  };

  const handleSubmit = async () => {
    const t = title.trim();
    const d = description.trim();
    if (!t || !d) {
      toast.error('Заполните название и описание');
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('participantKey', participantKey);
      fd.append('title', t);
      fd.append('description', d);
      for (const { file } of attachments) {
        fd.append('files', file);
      }

      const res = await fetch('/api/bug-bounty/reports', {
        method: 'POST',
        body: fd,
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        toast.error(data.error ?? 'Не удалось отправить');
        return;
      }
      toast.success('Отправлено на проверку');
      reset();
      onOpenChange(false);
      onSuccess();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          'flex max-h-[min(90dvh,calc(100dvh-1.5rem))] w-[calc(100vw-1.25rem)] max-w-[393px] flex-col gap-0 overflow-hidden border border-white/10 bg-[#121214] p-6 pb-6 pt-14 text-white md:max-h-[min(85dvh,calc(100dvh-2rem))] md:w-full md:max-w-[560px] md:p-8 md:pt-16',
          'left-1/2 top-3 -translate-x-1/2 translate-y-0 sm:top-6 md:top-[8%]',
        )}
      >
        <DialogHeader className="shrink-0 space-y-1.5 text-left">
          <DialogTitle className="text-white">Новый баг-репорт</DialogTitle>
          <DialogDescription className="text-white/60">
            После отправки репорт попадает на проверку. Очки в рейтинге начисляются только за принятые баги.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden overscroll-contain pr-0.5">
          <input
            type="text"
            placeholder="Краткое название"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
            className="h-12 w-full rounded-lg border-0 bg-[rgba(79,79,89,0.16)] px-4 text-base text-white placeholder:text-[#a4a4b2] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/25"
          />
          <textarea
            placeholder="Подробное описание, шаги воспроизведения"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
            rows={6}
            className="w-full resize-none rounded-lg border-0 bg-[rgba(79,79,89,0.16)] px-4 py-3 text-base leading-6 text-white placeholder:text-[#a4a4b2] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/25"
          />

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT_ATTR}
            multiple
            className="sr-only"
            onChange={onFileInputChange}
          />
          <button
            type="button"
            disabled={submitting || attachments.length >= MAX_BUG_BOUNTY_FILES}
            onClick={pickFiles}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 bg-[rgba(79,79,89,0.08)] text-sm text-white/80 transition hover:border-white/35 hover:bg-[rgba(79,79,89,0.14)] disabled:pointer-events-none disabled:opacity-45"
          >
            <Paperclip className="size-4 opacity-80" aria-hidden />
            Прикрепить фото или видео
            <span className="text-white/45">
              ({attachments.length}/{MAX_BUG_BOUNTY_FILES})
            </span>
          </button>

          {attachments.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {attachments.map((a, i) => {
                const isVideo = a.file.type.startsWith('video/');
                return (
                  <li
                    key={`${a.previewUrl}-${i}`}
                    className="flex items-center gap-3 rounded-lg bg-[rgba(79,79,89,0.16)] p-2 pr-3"
                  >
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-black/40">
                      {isVideo ? (
                        <div className="flex size-full items-center justify-center text-white/50">
                          <Film className="size-6" aria-hidden />
                        </div>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
                        <img
                          src={a.previewUrl}
                          alt=""
                          className="size-full object-cover"
                        />
                      )}
                    </div>
                    <p className="min-w-0 flex-1 truncate text-xs text-white/70" title={a.file.name}>
                      {a.file.name}
                    </p>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => removeAttachment(i)}
                      className="shrink-0 rounded-md p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
                      aria-label="Убрать файл"
                    >
                      <X className="size-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}

          <MarketingPrimaryButton
            type="button"
            disabled={submitting}
            onClick={() => void handleSubmit()}
          >
            {submitting ? 'Отправка…' : 'Отправить в базу'}
          </MarketingPrimaryButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
