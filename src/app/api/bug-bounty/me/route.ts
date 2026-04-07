import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/db'
import { isParticipantKey } from '@/shared/lib/bug-bounty/validate'

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('participantKey')?.trim() ?? ''
  if (!isParticipantKey(key)) {
    return NextResponse.json({ error: 'Некорректный ключ участника' }, { status: 400 })
  }

  const participant = await prisma.bugBountyParticipant.findUnique({
    where: { participantKey: key },
    select: { email: true, displayName: true, phone: true },
  })

  if (!participant) {
    return NextResponse.json({ registered: false })
  }

  return NextResponse.json({
    registered: true,
    email: participant.email,
    displayName: participant.displayName,
    phone: participant.phone,
  })
}
