import { NextRequest, NextResponse } from 'next/server'
import { BugBountyReportStatus } from '@prisma/client'
import { prisma } from '@/shared/lib/db'
import { verifyBugBountyAdmin } from '@/shared/lib/bug-bounty/admin-auth'
import { isBugBountyReportStatus } from '@/shared/lib/bug-bounty/report-status'

const MAX_REJECTION_COMMENT = 2000

type Body = {
  status?: string
  rejectionComment?: string | null
}

/**
 * Смена статуса репорта (модерация).
 * PATCH /api/bug-bounty/admin/reports/:id?token=...
 * Body: { "status": "ACCEPTED" | "REJECTED" | "PENDING", "rejectionComment"?: string }
 * При REJECTED комментарий (опционально) сохраняется и виден участнику; при ACCEPTED/PENDING очищается.
 */
export async function PATCH(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = verifyBugBountyAdmin(request)
  if (!auth.ok) {
    return NextResponse.json(auth.body, { status: auth.status })
  }

  const { id } = await ctx.params
  if (!id?.trim()) {
    return NextResponse.json({ error: 'Некорректный id' }, { status: 400 })
  }

  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ error: 'Ожидается JSON' }, { status: 400 })
  }

  const nextStatus = body.status?.trim().toUpperCase()
  if (!nextStatus || !isBugBountyReportStatus(nextStatus)) {
    return NextResponse.json(
      { error: 'Укажите status: PENDING, ACCEPTED или REJECTED' },
      { status: 400 },
    )
  }

  const status = nextStatus as BugBountyReportStatus
  const reviewedAt =
    status === BugBountyReportStatus.PENDING ? null : new Date()

  let rejectionComment: string | null = null
  if (status === BugBountyReportStatus.REJECTED) {
    const raw = body.rejectionComment
    if (raw === undefined || raw === null) {
      rejectionComment = null
    } else if (typeof raw === 'string') {
      const t = raw.trim()
      if (t.length > MAX_REJECTION_COMMENT) {
        return NextResponse.json(
          { error: `Комментарий не длиннее ${MAX_REJECTION_COMMENT} символов` },
          { status: 400 },
        )
      }
      rejectionComment = t.length > 0 ? t : null
    } else {
      return NextResponse.json({ error: 'Некорректный rejectionComment' }, { status: 400 })
    }
  }

  try {
    const updated = await prisma.bugBountyReport.update({
      where: { id },
      data: {
        status,
        reviewedAt,
        rejectionComment:
          status === BugBountyReportStatus.REJECTED ? rejectionComment : null,
      },
      select: {
        id: true,
        status: true,
        reviewedAt: true,
        rejectionComment: true,
      },
    })
    return NextResponse.json({
      success: true,
      id: updated.id,
      status: updated.status,
      reviewedAt: updated.reviewedAt?.toISOString() ?? null,
      rejectionComment: updated.rejectionComment,
    })
  } catch {
    return NextResponse.json({ error: 'Репорт не найден' }, { status: 404 })
  }
}
