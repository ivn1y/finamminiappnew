import fs from 'node:fs/promises'
import path from 'node:path'

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

export function getBugBountyUploadRoot(): string {
  return path.join(process.cwd(), 'data', 'bug-bounty-uploads')
}

export function getBugBountyReportFilePath(reportId: string, fileId: string): string {
  return path.join(getBugBountyUploadRoot(), reportId, fileId)
}

export async function ensureReportUploadDir(reportId: string): Promise<string> {
  const dir = path.join(getBugBountyUploadRoot(), reportId)
  await fs.mkdir(dir, { recursive: true })
  return dir
}

export async function writeBugBountyAttachment(
  reportId: string,
  fileId: string,
  data: Buffer,
): Promise<void> {
  await ensureReportUploadDir(reportId)
  const fp = getBugBountyReportFilePath(reportId, fileId)
  await fs.writeFile(fp, data)
}

export async function removeBugBountyReportUploads(reportId: string): Promise<void> {
  const dir = path.join(getBugBountyUploadRoot(), reportId)
  await fs.rm(dir, { recursive: true, force: true })
}
