import { type NextRequest } from 'next/server'
import {
  BB_ADMIN_COOKIE_NAME,
  verifyAdminSessionToken,
} from '@/shared/lib/bug-bounty/admin-session-cookie'

export function getBugBountyAdminToken(): string | null {
  const admin = process.env.BUG_BOUNTY_ADMIN_TOKEN?.trim()
  const exp = process.env.BUG_BOUNTY_EXPORT_TOKEN?.trim()
  const token = (admin && admin.length > 0 ? admin : exp) ?? ''
  return token.length > 0 ? token : null
}

export function verifyBugBountyAdmin(request: NextRequest):
  | { ok: true }
  | { ok: false; status: number; body: { error: string } } {
  const expected = getBugBountyAdminToken()
  if (!expected) {
    return {
      ok: false,
      status: 503,
      body: {
        error:
          'Модерация не настроена: задайте BUG_BOUNTY_ADMIN_TOKEN или BUG_BOUNTY_EXPORT_TOKEN',
      },
    }
  }

  const sessionCookie = request.cookies.get(BB_ADMIN_COOKIE_NAME)?.value
  if (verifyAdminSessionToken(sessionCookie)) {
    return { ok: true }
  }

  const fromQuery = request.nextUrl.searchParams.get('token')?.trim()
  const fromHeader = request.headers.get('x-bug-bounty-admin-token')?.trim()
  const provided = fromQuery || fromHeader
  if (!provided || provided !== expected) {
    return { ok: false, status: 403, body: { error: 'Недоступно' } }
  }
  return { ok: true }
}
