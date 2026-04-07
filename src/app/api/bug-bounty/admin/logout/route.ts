import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { BB_ADMIN_COOKIE_NAME } from '@/shared/lib/bug-bounty/admin-session-cookie'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.set(BB_ADMIN_COOKIE_NAME, '', { path: '/', maxAge: 0 })
  return NextResponse.json({ ok: true })
}
