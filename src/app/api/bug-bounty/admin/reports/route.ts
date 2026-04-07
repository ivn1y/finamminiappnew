import { NextRequest, NextResponse } from 'next/server'
import { BugBountyReportStatus } from '@prisma/client'
import { prisma } from '@/shared/lib/db'
import { verifyBugBountyAdmin } from '@/shared/lib/bug-bounty/admin-auth'
import { isBugBountyReportStatus } from '@/shared/lib/bug-bounty/report-status'

/**
 * Список репортов для модерации.
 * GET /api/bug-bounty/admin/reports?token=...&status=PENDING|ACCEPTED|REJECTED|ALL&limit=100
 */
export async function GET(request: NextRequest) {
  const auth = verifyBugBountyAdmin(request)
  if (!auth.ok) {
    return NextResponse.json(auth.body, { status: auth.status })
  }

  const statusParam = request.nextUrl.searchParams.get('status')?.trim().toUpperCase() ?? 'ALL'
  const limitRaw = request.nextUrl.searchParams.get('limit')
  const limit = Math.min(500, Math.max(1, Number.parseInt(limitRaw ?? '100', 10) || 100))

  const where =
    statusParam !== 'ALL' && isBugBountyReportStatus(statusParam)
      ? { status: statusParam as BugBountyReportStatus }
      : {}

  const reports = await prisma.bugBountyReport.findMany({
    where,
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      createdAt: true,
      reviewedAt: true,
      participant: {
        select: {
          displayName: true,
          email: true,
          phone: true,
          participantKey: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
    take: limit,
  })

  return NextResponse.json({
    reports: reports.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
      reviewedAt: r.reviewedAt?.toISOString() ?? null,
      participant: r.participant,
    })),
  })
}
