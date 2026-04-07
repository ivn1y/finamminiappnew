'use client';

import { useState } from 'react';
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

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participantKey: string;
  onSuccess: () => void;
};

export function BugBountyReportDialog({
  open,
  onOpenChange,
  participantKey,
  onSuccess,
}: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setTitle('');
    setDescription('');
  };

  const handleOpenChange = (next: boolean) => {
    if (!next && !submitting) reset();
    onOpenChange(next);
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
      const res = await fetch('/api/bug-bounty/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantKey, title: t, description: d }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        toast.error(data.error ?? 'Не удалось отправить');
        return;
      }
      toast.success('Репорт сохранён');
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
          'max-h-[90dvh] max-w-[393px] overflow-y-auto border border-white/10 bg-[#121214] text-white',
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-white">Новый баг-репорт</DialogTitle>
          <DialogDescription className="text-white/60">
            Опишите проблему — данные попадут в базу для разбора организаторами.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-2">
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
