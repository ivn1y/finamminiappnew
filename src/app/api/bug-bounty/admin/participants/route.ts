import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/db'
import { verifyBugBountyAdmin } from '@/shared/lib/bug-bounty/admin-auth'

/**
 * Все зарегистрированные участники bug bounty (без паролей).
 * GET /api/bug-bounty/admin/participants?limit=500
 */
export async function GET(request: NextRequest) {
  const auth = verifyBugBountyAdmin(request)
  if (!auth.ok) {
    return NextResponse.json(auth.body, { status: auth.status })
  }

  const limitRaw = request.nextUrl.searchParams.get('limit')
  const limit = Math.min(2000, Math.max(1, Number.parseInt(limitRaw ?? '500', 10) || 500))

  const rows = await prisma.bugBountyParticipant.findMany({
    select: {
      id: true,
      email: true,
      displayName: true,
      phone: true,
      participantKey: true,
      createdAt: true,
      updatedAt: true,
      passwordHash: true,
      _count: { select: { reports: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return NextResponse.json({
    participants: rows.map((p) => ({
      id: p.id,
      email: p.email,
      displayName: p.displayName,
      phone: p.phone,
      participantKey: p.participantKey,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      hasPassword: p.passwordHash != null && p.passwordHash.length > 0,
      reportsCount: p._count.reports,
    })),
  })
}
