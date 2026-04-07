import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/db'
import { isParticipantKey } from '@/shared/lib/bug-bounty/validate'

export async function GET(request: NextRequest) {
  const myKeyRaw = request.nextUrl.searchParams.get('participantKey')?.trim() ?? ''
  const myKey = myKeyRaw && isParticipantKey(myKeyRaw) ? myKeyRaw : undefined

  const rows = await prisma.bugBountyParticipant.findMany({
    select: {
      participantKey: true,
      displayName: true,
      _count: { select: { reports: true } },
    },
  })

  rows.sort((a, b) => b._count.reports - a._count.reports)

  const top = rows.slice(0, 50).map((p, i) => ({
    rank: i + 1,
    displayName: p.displayName,
    score: p._count.reports,
  }))

  let self: { rank: number; displayName: string; score: number } | null = null
  if (myKey) {
    const idx = rows.findIndex((p) => p.participantKey === myKey)
    if (idx >= 0) {
      self = {
        rank: idx + 1,
        displayName: rows[idx].displayName,
        score: rows[idx]._count.reports,
      }
    }
  }

  return NextResponse.json({ rows: top, self })
}
