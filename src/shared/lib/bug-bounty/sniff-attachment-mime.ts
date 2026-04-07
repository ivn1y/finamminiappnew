/** First bytes → MIME for bug-bounty uploads (fallback when browser sends empty/wrong type). */
export function sniffAttachmentMime(buf: Uint8Array): string | null {
  if (buf.length < 12) return null
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg'
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'image/png'
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return 'image/gif'
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46) {
    if (buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return 'image/webp'
  }
  if (buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70) {
    const brand = String.fromCharCode(buf[8], buf[9], buf[10], buf[11]).toLowerCase()
    if (brand === 'qt  ' || brand.startsWith('qt')) return 'video/quicktime'
    return 'video/mp4'
  }
  if (buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) return 'video/webm'
  return null
}

export function isFormDataBlobLike(
  value: unknown,
): value is Blob & { name?: string } {
  if (typeof value !== 'object' || value === null) return false
  const b = value as Blob
  if (typeof b.arrayBuffer !== 'function') return false
  if (typeof b.size !== 'number') return false
  return true
}
