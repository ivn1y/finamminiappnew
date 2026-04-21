import fs from 'node:fs/promises'
import path from 'node:path'
import { prisma } from '@/shared/lib/db'

export type { BugBountyAttachmentKind, BugBountyAttachmentMeta } from './report-attachments-constants'
export {
  MAX_BUG_BOUNTY_FILES,
  MAX_BUG_BOUNTY_IMAGE_BYTES,
  MAX_BUG_BOUNTY_VIDEO_BYTES,
  classifyAttachmentKind,
  isAllowedBugBountyMime,
  maxBytesForMime,
  parseBugBountyAttachmentsJson,
  isSafeBugBountyFileId,
} from './report-attachments-constants'

// Раньше файлы хранились на диске контейнера в этой папке.
// Теперь бинарники лежат в БД (BugBountyAttachmentBlob), чтобы переживать передеплой Coolify.
// Путь оставлен для обратной совместимости: при чтении используется как fallback,
// если вдруг где-то ещё остался файл на смонтированном volume'е.
export function getBugBountyUploadRoot(): string {
  return path.join(process.cwd(), 'data', 'bug-bounty-uploads')
}

export function getBugBountyReportFilePath(reportId: string, fileId: string): string {
  return path.join(getBugBountyUploadRoot(), reportId, fileId)
}

/**
 * Сохранить бинарные данные вложения в БД.
 * Если запись с таким fileId уже существует — перезаписывает (upsert).
 */
export async function writeBugBountyAttachment(
  reportId: string,
  fileId: string,
  mime: string,
  data: Buffer,
): Promise<void> {
  // Prisma 7 ожидает Uint8Array<ArrayBuffer>, а Buffer из Node типизирован как Uint8Array<ArrayBufferLike>.
  // Копируем в свежий ArrayBuffer, чтобы удовлетворить строгий тип.
  const bytes = new Uint8Array(data.byteLength)
  bytes.set(data)

  await prisma.bugBountyAttachmentBlob.upsert({
    where: { fileId },
    create: {
      fileId,
      reportId,
      mime,
      data: bytes,
    },
    update: {
      reportId,
      mime,
      data: bytes,
    },
  })
}

export type BugBountyAttachmentPayload = {
  data: Buffer
  mime: string
}

/**
 * Прочитать бинарные данные вложения.
 * 1) Сначала смотрим в БД (BugBountyAttachmentBlob).
 * 2) Если там нет — fallback на диск (для legacy-файлов, которые ещё могут лежать на volume'е).
 * Возвращает null, если файла нет ни там, ни там.
 */
export async function readBugBountyAttachment(
  reportId: string,
  fileId: string,
): Promise<BugBountyAttachmentPayload | null> {
  const blob = await prisma.bugBountyAttachmentBlob.findUnique({
    where: { fileId },
    select: { reportId: true, mime: true, data: true },
  })
  if (blob && blob.reportId === reportId) {
    return {
      data: Buffer.from(blob.data),
      mime: blob.mime,
    }
  }

  try {
    const buf = await fs.readFile(getBugBountyReportFilePath(reportId, fileId))
    return { data: buf, mime: '' }
  } catch {
    return null
  }
}

/**
 * Удалить все вложения репорта (BLOB'ы в БД + остатки на диске, если есть).
 * Используется в error-flow при неудачном создании репорта.
 */
export async function removeBugBountyReportUploads(reportId: string): Promise<void> {
  await prisma.bugBountyAttachmentBlob
    .deleteMany({ where: { reportId } })
    .catch(() => {})

  const dir = path.join(getBugBountyUploadRoot(), reportId)
  await fs.rm(dir, { recursive: true, force: true }).catch(() => {})
}
