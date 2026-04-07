const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isParticipantKey(value: string): boolean {
  return UUID_RE.test(value.trim())
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isReasonableEmail(value: string): boolean {
  const s = value.trim()
  return s.length <= 254 && EMAIL_RE.test(s)
}

export function csvEscapeCell(value: string): string {
  const t = value.replace(/"/g, '""')
  if (/[",\n\r]/.test(t)) return `"${t}"`
  return t
}
