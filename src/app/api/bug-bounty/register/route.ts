import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/db'
import { isParticipantKey, isReasonableEmail } from '@/shared/lib/bug-bounty/validate'

type Body = {
  participantKey?: string
  email?: string
  displayName?: string
  phone?: string
}

const MAX_NAME = 120
const MAX_PHONE = 32

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Body
    const participantKey = body.participantKey?.trim() ?? ''
    const email = body.email?.trim() ?? ''
    const displayName = body.displayName?.trim() ?? ''
    const phone = body.phone?.trim() ?? ''

    if (!isParticipantKey(participantKey)) {
      return NextResponse.json({ error: 'Некорректный ключ участника' }, { status: 400 })
    }
    if (!isReasonableEmail(email)) {
      return NextResponse.json({ error: 'Укажите корректную почту' }, { status: 400 })
    }
    if (!displayName || displayName.length > MAX_NAME) {
      return NextResponse.json({ error: 'Укажите имя для турнирной таблицы' }, { status: 400 })
    }
    if (!phone || phone.length > MAX_PHONE) {
      return NextResponse.json({ error: 'Укажите телефон для связи' }, { status: 400 })
    }

    await prisma.bugBountyParticipant.upsert({
      where: { participantKey },
      create: { participantKey, email, displayName, phone },
      update: { email, displayName, phone },
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[bug-bounty/register]', e)
    return NextResponse.json({ error: 'Не удалось сохранить данные' }, { status: 500 })
  }
}
