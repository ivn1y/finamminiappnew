import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/db'
import { isParticipantKey } from '@/shared/lib/bug-bounty/validate'
import { BUG_BOUNTY_STATUS_LABEL } from '@/shared/lib/bug-bounty/report-status'

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('participantKey')?.trim() ?? ''
  if (!isParticipantKey(key)) {
    return NextResponse.json({ error: 'Некорректный ключ участника' }, { status: 400 })
  }

  const participant = await prisma.bugBountyParticipant.findUnique({
    where: { participantKey: key },
    select: { id: true },
  })

  if (!participant) {
    return NextResponse.json({ error: 'Сначала пройдите регистрацию' }, { status: 403 })
  }

  const reports = await prisma.bugBountyReport.findMany({
    where: { participantId: participant.id },
    select: {
      id: true,
      title: true,
      status: true,
      rejectionComment: true,
      createdAt: true,
      reviewedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({
    reports: reports.map((r) => ({
      id: r.id,
      title: r.title,
      status: r.status,
      statusLabel: BUG_BOUNTY_STATUS_LABEL[r.status],
      rejectionComment:
        r.status === 'REJECTED' && r.rejectionComment?.trim()
          ? r.rejectionComment.trim()
          : null,
      createdAt: r.createdAt.toISOString(),
      reviewedAt: r.reviewedAt?.toISOString() ?? null,
    })),
  })
}
