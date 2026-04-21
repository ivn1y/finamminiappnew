import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/db'
import { readBugBountyAttachment } from '@/shared/lib/bug-bounty/report-attachments'
import {
  isSafeBugBountyFileId,
  parseBugBountyAttachmentsJson,
} from '@/shared/lib/bug-bounty/report-attachments-constants'
import { isParticipantKey } from '@/shared/lib/bug-bounty/validate'

export const runtime = 'nodejs'

type RouteCtx = { params: Promise<{ reportId: string; fileId: string }> }

function isReasonableReportId(id: string): boolean {
  const t = id.trim()
  return t.length >= 10 && t.length <= 64 && /^[a-z0-9_-]+$/i.test(t)
}

export async function GET(request: NextRequest, ctx: RouteCtx) {
  const key = request.nextUrl.searchParams.get('participantKey')?.trim() ?? ''
  if (!isParticipantKey(key)) {
    return NextResponse.json({ error: 'Некорректный ключ участника' }, { status: 400 })
  }

  const { reportId: rawReportId, fileId: rawFileId } = await ctx.params
  const reportId = decodeURIComponent(rawReportId ?? '').trim()
  const fileId = decodeURIComponent(rawFileId ?? '').trim()

  if (!isReasonableReportId(reportId) || !isSafeBugBountyFileId(fileId)) {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 })
  }

  const participant = await prisma.bugBountyParticipant.findUnique({
    where: { participantKey: key },
    select: { id: true },
  })

  if (!participant) {
    return NextResponse.json({ error: 'Нет доступа' }, { status: 403 })
  }

  const report = await prisma.bugBountyReport.findFirst({
    where: { id: reportId, participantId: participant.id },
    select: { attachments: true },
  })

  if (!report) {
    return NextResponse.json({ error: 'Не найдено' }, { status: 404 })
  }

  const list = parseBugBountyAttachmentsJson(report.attachments)
  const meta = list.find((a) => a.id === fileId)
  if (!meta) {
    return NextResponse.json({ error: 'Не найдено' }, { status: 404 })
  }

  const payload = await readBugBountyAttachment(reportId, fileId)
  if (!payload) {
    return NextResponse.json({ error: 'Файл недоступен' }, { status: 404 })
  }

  return new NextResponse(new Uint8Array(payload.data), {
    status: 200,
    headers: {
      'Content-Type': payload.mime || meta.mime,
      'Cache-Control': 'private, max-age=3600',
      'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(meta.name)}`,
    },
  })
}
