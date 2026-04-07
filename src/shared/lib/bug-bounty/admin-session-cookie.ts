import { createHmac, timingSafeEqual } from 'crypto'

export const BB_ADMIN_COOKIE_NAME = 'bb_admin_sess'

const COOKIE_MAX_AGE_SEC = 7 * 24 * 60 * 60

function adminTokenFromEnv(): string | null {
  return process.env.BUG_BOUNTY_ADMIN_TOKEN ?? process.env.BUG_BOUNTY_EXPORT_TOKEN ?? null
}

function signingKey(): string | null {
  const t = adminTokenFromEnv()
  return t ? `${t}\x00bb-admin-sess-v1` : null
}

export function createAdminSessionToken(): string | null {
  const secret = signingKey()
  if (!secret) return null
  const exp = Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE_SEC
  const payload = Buffer.from(JSON.stringify({ exp, v: 1 }), 'utf8').toString('base64url')
  const sig = createHmac('sha256', secret).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

export function verifyAdminSessionToken(token: string | undefined | null): boolean {
  if (!token) return false
  const secret = signingKey()
  if (!secret) return false
  const dot = token.lastIndexOf('.')
  if (dot <= 0) return false
  const payload = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const expectedSig = createHmac('sha256', secret).update(payload).digest('base64url')
  if (sig.length !== expectedSig.length) return false
  try {
    if (!timingSafeEqual(Buffer.from(sig, 'utf8'), Buffer.from(expectedSig, 'utf8'))) return false
  } catch {
    return false
  }
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      exp?: number
      v?: number
    }
    if (data.v !== 1 || typeof data.exp !== 'number') return false
    if (data.exp < Math.floor(Date.now() / 1000)) return false
    return true
  } catch {
    return false
  }
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: COOKIE_MAX_AGE_SEC,
  }
}
