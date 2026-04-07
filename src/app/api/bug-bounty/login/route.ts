import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/db'
import { verifyPassword } from '@/shared/lib/bug-bounty/password'
import { validateEmail } from '@/shared/lib/validation'

type Body = {
  email?: string
  password?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Body
    const emailRaw = body.email?.trim() ?? ''
    const password = body.password ?? ''

    const emailValidation = validateEmail(emailRaw)
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: emailValidation.error ?? 'Укажите корректную почту' },
        { status: 400 },
      )
    }
    if (!password) {
      return NextResponse.json({ error: 'Введите пароль' }, { status: 400 })
    }

    const email = emailRaw.toLowerCase()
    const participant = await prisma.bugBountyParticipant.findUnique({
      where: { email },
      select: { participantKey: true, passwordHash: true },
    })

    if (!participant) {
      return NextResponse.json(
        { error: 'Почта не найдена', code: 'EMAIL_NOT_FOUND' },
        { status: 404 },
      )
    }

    if (!participant.passwordHash) {
      return NextResponse.json(
        {
          error: 'Пароль ещё не задан для этого аккаунта. Зарегистрируйтесь с паролем на этом устройстве.',
          code: 'PASSWORD_NOT_SET',
        },
        { status: 403 },
      )
    }

    const ok = await verifyPassword(password, participant.passwordHash)
    if (!ok) {
      return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 })
    }

    return NextResponse.json({ success: true, participantKey: participant.participantKey })
  } catch (e) {
    console.error('[bug-bounty/login]', e)
    return NextResponse.json({ error: 'Не удалось войти' }, { status: 500 })
  }
}
