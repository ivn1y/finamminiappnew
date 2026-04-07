import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getBugBountyAdminToken } from '@/shared/lib/bug-bounty/admin-auth'
import {
  BB_ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  getAdminSessionCookieOptions,
} from '@/shared/lib/bug-bounty/admin-session-cookie'

type Body = { token?: string }

export async function POST(request: NextRequest) {
  const expected = getBugBountyAdminToken()
  if (!expected) {
    return NextResponse.json(
      { error: 'Модерация не настроена на сервере' },
      { status: 503 },
    )
  }

  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ error: 'Ожидается JSON' }, { status: 400 })
  }

  const token = body.token?.trim() ?? ''
  if (!token || token !== expected) {
    return NextResponse.json({ error: 'Неверный токен' }, { status: 401 })
  }

  const session = createAdminSessionToken()
  if (!session) {
    return NextResponse.json({ error: 'Не удалось выдать сессию' }, { status: 503 })
  }

  const cookieStore = await cookies()
  cookieStore.set(BB_ADMIN_COOKIE_NAME, session, getAdminSessionCookieOptions())

  return NextResponse.json({ ok: true })
}
