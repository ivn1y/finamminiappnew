import { BugBountyReportStatus } from '@prisma/client'

export const BUG_BOUNTY_STATUS_LABEL: Record<BugBountyReportStatus, string> = {
  [BugBountyReportStatus.PENDING]: 'На проверке',
  [BugBountyReportStatus.ACCEPTED]: 'Принят',
  [BugBountyReportStatus.REJECTED]: 'Отклонён',
}

export function isBugBountyReportStatus(v: string): v is BugBountyReportStatus {
  return (Object.values(BugBountyReportStatus) as string[]).includes(v)
}
