import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/db'
import { csvEscapeCell } from '@/shared/lib/bug-bounty/validate'
import { parseBugBountyAttachmentsJson } from '@/shared/lib/bug-bounty/report-attachments-constants'

/**
 * Выгрузка репортов для Excel (CSV с UTF-8 BOM).
 * Вызов: GET /api/bug-bounty/export?token=BUG_BOUNTY_EXPORT_TOKEN
 * Опционально: &from=YYYY-MM-DD&to=YYYY-MM-DD (фильтр по дате createdAt, UTC).
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? ''
  const expected = process.env.BUG_BOUNTY_EXPORT_TOKEN

  if (!expected) {
    return NextResponse.json(
      { error: 'Экспорт не настроен: задайте BUG_BOUNTY_EXPORT_TOKEN в окружении' },
      { status: 503 },
    )
  }
  if (token !== expected) {
    return NextResponse.json({ error: 'Недоступно' }, { status: 403 })
  }

  const from = request.nextUrl.searchParams.get('from')
  const to = request.nextUrl.searchParams.get('to')

  const createdAt: { gte?: Date; lte?: Date } = {}
  if (from) {
    const gte = new Date(`${from}T00:00:00.000Z`)
    if (!Number.isNaN(gte.getTime())) createdAt.gte = gte
  }
  if (to) {
    const lte = new Date(`${to}T23:59:59.999Z`)
    if (!Number.isNaN(lte.getTime())) createdAt.lte = lte
  }

  const hasDateBounds = createdAt.gte !== undefined || createdAt.lte !== undefined

  const reports = await prisma.bugBountyReport.findMany({
    where: hasDateBounds ? { createdAt } : undefined,
    include: {
      participant: {
        select: {
          email: true,
          displayName: true,
          phone: true,
          participantKey: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  const header = [
    'createdAt',
    'status',
    'reviewedAt',
    'rejectionComment',
    'email',
    'displayName',
    'phone',
    'title',
    'description',
    'attachmentsJson',
    'participantKey',
    'reportId',
  ]

  const lines = [
    header.join(','),
    ...reports.map((r) =>
      [
        r.createdAt.toISOString(),
        r.status,
        r.reviewedAt?.toISOString() ?? '',
        r.rejectionComment ?? '',
        r.participant.email,
        r.participant.displayName,
        r.participant.phone,
        r.title,
        r.description,
        JSON.stringify(parseBugBountyAttachmentsJson(r.attachments)),
        r.participant.participantKey,
        r.id,
      ]
        .map((c) => csvEscapeCell(String(c)))
        .join(','),
    ),
  ]

  const csv = `\uFEFF${lines.join('\n')}`
  const suffix = from && to ? `${from}_${to}` : from || to || 'all'
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="bug-bounty-reports-${suffix}.csv"`,
    },
  })
}
