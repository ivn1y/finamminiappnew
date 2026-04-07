import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/db'
import { isParticipantKey } from '@/shared/lib/bug-bounty/validate'
import { hashPassword } from '@/shared/lib/bug-bounty/password'
import { validateEmail, validatePhone } from '@/shared/lib/validation'

type Body = {
  participantKey?: string
  email?: string
  displayName?: string
  phone?: string
  password?: string
}

const MAX_NAME = 120
const MAX_PHONE = 32
const MIN_PASSWORD = 8

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Body
    const participantKey = body.participantKey?.trim() ?? ''
    const email = body.email?.trim() ?? ''
    const displayName = body.displayName?.trim() ?? ''
    const phone = body.phone?.trim() ?? ''
    const password = body.password ?? ''

    if (!isParticipantKey(participantKey)) {
      return NextResponse.json({ error: 'Некорректный ключ участника' }, { status: 400 })
    }
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: emailValidation.error ?? 'Укажите корректную почту' },
        { status: 400 },
      )
    }
    if (!displayName || displayName.length > MAX_NAME) {
      return NextResponse.json({ error: 'Укажите имя для турнирной таблицы' }, { status: 400 })
    }
    const phoneValidation = validatePhone(phone)
    if (!phoneValidation.isValid) {
      return NextResponse.json(
        { error: phoneValidation.error ?? 'Укажите корректный номер телефона' },
        { status: 400 },
      )
    }
    const phoneStored = phoneValidation.formatted ?? phone
    if (phoneStored.length > MAX_PHONE) {
      return NextResponse.json({ error: 'Номер телефона слишком длинный' }, { status: 400 })
    }
    if (password.length < MIN_PASSWORD) {
      return NextResponse.json(
        { error: `Пароль не короче ${MIN_PASSWORD} символов` },
        { status: 400 },
      )
    }

    const emailNorm = email.trim().toLowerCase()
    const taken = await prisma.bugBountyParticipant.findUnique({
      where: { email: emailNorm },
      select: { participantKey: true },
    })
    if (taken && taken.participantKey !== participantKey) {
      return NextResponse.json(
        { error: 'Эта почта уже занята. Войдите под этой почтой.' },
        { status: 409 },
      )
    }

    const passwordHash = await hashPassword(password)

    await prisma.bugBountyParticipant.upsert({
      where: { participantKey },
      create: {
        participantKey,
        email: emailNorm,
        displayName,
        phone: phoneStored,
        passwordHash,
      },
      update: { email: emailNorm, displayName, phone: phoneStored, passwordHash },
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[bug-bounty/register]', e)
    return NextResponse.json({ error: 'Не удалось сохранить данные' }, { status: 500 })
  }
}
