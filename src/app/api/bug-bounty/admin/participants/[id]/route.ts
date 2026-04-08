import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/db'
import { hashPassword } from '@/shared/lib/bug-bounty/password'
import { verifyBugBountyAdmin } from '@/shared/lib/bug-bounty/admin-auth'

const MIN_PASSWORD = 8

type Body = {
  password?: string
}

/**
 * Ручной сброс пароля участника (поддержка / пилот).
 * PATCH /api/bug-bounty/admin/participants/:id
 * Body: { "password": "новый пароль" }
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

  const password = body.password ?? ''
  if (typeof password !== 'string' || password.length < MIN_PASSWORD) {
    return NextResponse.json(
      { error: `Пароль не короче ${MIN_PASSWORD} символов` },
      { status: 400 },
    )
  }

  try {
    const passwordHash = await hashPassword(password)
    await prisma.bugBountyParticipant.update({
      where: { id },
      data: { passwordHash },
      select: { id: true },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Участник не найден' }, { status: 404 })
  }
}
