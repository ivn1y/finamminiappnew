export type BugBountyAttachmentKind = 'image' | 'video'

export type BugBountyAttachmentMeta = {
  id: string
  mime: string
  kind: BugBountyAttachmentKind
  name: string
}

export const MAX_BUG_BOUNTY_FILES = 5
export const MAX_BUG_BOUNTY_IMAGE_BYTES = 12 * 1024 * 1024
export const MAX_BUG_BOUNTY_VIDEO_BYTES = 45 * 1024 * 1024

const IMAGE_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])
const VIDEO_MIMES = new Set(['video/mp4', 'video/webm', 'video/quicktime'])

const FILE_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function classifyAttachmentKind(mime: string): BugBountyAttachmentKind | null {
  if (IMAGE_MIMES.has(mime)) return 'image'
  if (VIDEO_MIMES.has(mime)) return 'video'
  return null
}

export function isAllowedBugBountyMime(mime: string): boolean {
  return classifyAttachmentKind(mime) !== null
}

export function maxBytesForMime(mime: string): number {
  return classifyAttachmentKind(mime) === 'video'
    ? MAX_BUG_BOUNTY_VIDEO_BYTES
    : MAX_BUG_BOUNTY_IMAGE_BYTES
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

export function parseBugBountyAttachmentsJson(raw: unknown): BugBountyAttachmentMeta[] {
  let data: unknown = raw
  if (typeof data === 'string') {
    const t = data.trim()
    if (!t || t === 'null') return []
    try {
      data = JSON.parse(t) as unknown
    } catch {
      return []
    }
  }
  if (data == null) return []
  if (!Array.isArray(data)) return []
  const out: BugBountyAttachmentMeta[] = []
  for (const item of data) {
    if (!isRecord(item)) continue
    const id = typeof item.id === 'string' ? item.id : ''
    const mime = typeof item.mime === 'string' ? item.mime : ''
    const kind = item.kind === 'image' || item.kind === 'video' ? item.kind : null
    const nameRaw = typeof item.name === 'string' ? item.name.slice(0, 240).trim() : ''
    const name = nameRaw.length > 0 ? nameRaw : 'вложение'
    if (!id || !mime || !kind) continue
    if (!FILE_ID_RE.test(id)) continue
    if (!isAllowedBugBountyMime(mime)) continue
    if (classifyAttachmentKind(mime) !== kind) continue
    out.push({ id, mime, kind, name })
  }
  return out
}

export function isSafeBugBountyFileId(fileId: string): boolean {
  return FILE_ID_RE.test(fileId)
}
