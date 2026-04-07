import { NextRequest, NextResponse } from 'next/server'
import { BugBountyReportStatus } from '@prisma/client'
import { prisma } from '@/shared/lib/db'
import { isParticipantKey } from '@/shared/lib/bug-bounty/validate'

type ParticipantRow = {
  participantKey: string
  displayName: string
  score: number
}

function sortParticipants(a: ParticipantRow, b: ParticipantRow): number {
  if (b.score !== a.score) return b.score - a.score
  return a.displayName.localeCompare(b.displayName, 'ru')
}

export async function GET(request: NextRequest) {
  const myKeyRaw = request.nextUrl.searchParams.get('participantKey')?.trim() ?? ''
  const myKey = myKeyRaw && isParticipantKey(myKeyRaw) ? myKeyRaw : undefined

  const rows = await prisma.bugBountyParticipant.findMany({
    select: {
      participantKey: true,
      displayName: true,
      _count: {
        select: {
          reports: {
            where: { status: BugBountyReportStatus.ACCEPTED },
          },
        },
      },
    },
  })

  const ranked: ParticipantRow[] = rows
    .map((p) => ({
      participantKey: p.participantKey,
      displayName: p.displayName,
      score: p._count.reports,
    }))
    .sort(sortParticipants)

  const top = ranked.filter((p) => p.score > 0).slice(0, 50).map((p, i) => ({
    rank: i + 1,
    displayName: p.displayName,
    score: p.score,
  }))

  let self: { rank: number; displayName: string; score: number } | null = null
  if (myKey) {
    const idx = ranked.findIndex((p) => p.participantKey === myKey)
    if (idx >= 0) {
      self = {
        rank: idx + 1,
        displayName: ranked[idx].displayName,
        score: ranked[idx].score,
      }
    }
  }

  return NextResponse.json({ rows: top, self })
}
