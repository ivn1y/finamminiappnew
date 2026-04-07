import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  BB_ADMIN_COOKIE_NAME,
  verifyAdminSessionToken,
} from '@/shared/lib/bug-bounty/admin-session-cookie'
import { getBugBountyAdminToken } from '@/shared/lib/bug-bounty/admin-auth'

export async function GET() {
  if (!getBugBountyAdminToken()) {
    return NextResponse.json({ ok: false, configured: false })
  }
  const cookieStore = await cookies()
  const raw = cookieStore.get(BB_ADMIN_COOKIE_NAME)?.value
  const ok = verifyAdminSessionToken(raw)
  return NextResponse.json({ ok, configured: true })
}
