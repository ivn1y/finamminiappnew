import { NextRequest, NextResponse } from 'next/server'
import { BugBountyReportStatus } from '@prisma/client'
import { prisma } from '@/shared/lib/db'
import { verifyBugBountyAdmin } from '@/shared/lib/bug-bounty/admin-auth'
import { isBugBountyReportStatus } from '@/shared/lib/bug-bounty/report-status'

type Body = {
  status?: string
}

/**
 * Смена статуса репорта (модерация).
 * PATCH /api/bug-bounty/admin/reports/:id?token=...
 * Body: { "status": "ACCEPTED" | "REJECTED" } — вернуть в очередь: { "status": "PENDING" }
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

  try {
    const updated = await prisma.bugBountyReport.update({
      where: { id },
      data: { status, reviewedAt },
      select: {
        id: true,
        status: true,
        reviewedAt: true,
      },
    })
    return NextResponse.json({
      success: true,
      id: updated.id,
      status: updated.status,
      reviewedAt: updated.reviewedAt?.toISOString() ?? null,
    })
  } catch {
    return NextResponse.json({ error: 'Репорт не найден' }, { status: 404 })
  }
}
