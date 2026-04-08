import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/db'
import { BUG_BOUNTY_STATUS_LABEL } from '@/shared/lib/bug-bounty/report-status'
import { parseBugBountyAttachmentsJson } from '@/shared/lib/bug-bounty/report-attachments-constants'
import { isParticipantKey } from '@/shared/lib/bug-bounty/validate'

type RouteCtx = { params: Promise<{ reportId: string }> }

function isReasonableReportId(id: string): boolean {
  const t = id.trim()
  return t.length >= 10 && t.length <= 64 && /^[a-z0-9_-]+$/i.test(t)
}

export async function GET(request: NextRequest, ctx: RouteCtx) {
  const key = request.nextUrl.searchParams.get('participantKey')?.trim() ?? ''
  if (!isParticipantKey(key)) {
    return NextResponse.json({ error: 'Некорректный ключ участника' }, { status: 400 })
  }

  const { reportId: rawId } = await ctx.params
  const reportId = decodeURIComponent(rawId ?? '').trim()
  if (!isReasonableReportId(reportId)) {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 })
  }

  const participant = await prisma.bugBountyParticipant.findUnique({
    where: { participantKey: key },
    select: { id: true },
  })

  if (!participant) {
    return NextResponse.json({ error: 'Сначала пройдите регистрацию' }, { status: 403 })
  }

  const report = await prisma.bugBountyReport.findFirst({
    where: { id: reportId, participantId: participant.id },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      rejectionComment: true,
      createdAt: true,
      reviewedAt: true,
      attachments: true,
    },
  })

  if (!report) {
    return NextResponse.json({ error: 'Репорт не найден' }, { status: 404 })
  }

  const attachments = parseBugBountyAttachmentsJson(report.attachments)

  return NextResponse.json({
    report: {
      id: report.id,
      title: report.title,
      description: report.description,
      status: report.status,
      statusLabel: BUG_BOUNTY_STATUS_LABEL[report.status],
      rejectionComment:
        report.status === 'REJECTED' && report.rejectionComment?.trim()
          ? report.rejectionComment.trim()
          : null,
      createdAt: report.createdAt.toISOString(),
      reviewedAt: report.reviewedAt?.toISOString() ?? null,
      attachments: attachments.map((a) => ({
        id: a.id,
        mime: a.mime,
        kind: a.kind,
        name: a.name,
      })),
    },
  })
}
