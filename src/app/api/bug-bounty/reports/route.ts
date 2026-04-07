import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/db'
import { isParticipantKey } from '@/shared/lib/bug-bounty/validate'

type Body = {
  participantKey?: string
  title?: string
  description?: string
}

const MAX_TITLE = 200
const MAX_DESC = 12_000

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Body
    const participantKey = body.participantKey?.trim() ?? ''
    const title = body.title?.trim() ?? ''
    const description = body.description?.trim() ?? ''

    if (!isParticipantKey(participantKey)) {
      return NextResponse.json({ error: 'Некорректный ключ участника' }, { status: 400 })
    }
    if (!title || title.length > MAX_TITLE) {
      return NextResponse.json({ error: 'Укажите название бага' }, { status: 400 })
    }
    if (!description || description.length > MAX_DESC) {
      return NextResponse.json({ error: 'Добавьте описание' }, { status: 400 })
    }

    const participant = await prisma.bugBountyParticipant.findUnique({
      where: { participantKey },
      select: { id: true },
    })

    if (!participant) {
      return NextResponse.json({ error: 'Сначала пройдите регистрацию' }, { status: 403 })
    }

    const report = await prisma.bugBountyReport.create({
      data: {
        participantId: participant.id,
        title,
        description,
      },
      select: { id: true, createdAt: true },
    })

    return NextResponse.json({ success: true, id: report.id, createdAt: report.createdAt })
  } catch (e) {
    console.error('[bug-bounty/reports]', e)
    return NextResponse.json({ error: 'Не удалось сохранить репорт' }, { status: 500 })
  }
}
