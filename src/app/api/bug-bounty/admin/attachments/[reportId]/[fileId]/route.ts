import fs from 'node:fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/db'
import { verifyBugBountyAdmin } from '@/shared/lib/bug-bounty/admin-auth'
import { getBugBountyReportFilePath } from '@/shared/lib/bug-bounty/report-attachments'
import {
  isSafeBugBountyFileId,
  parseBugBountyAttachmentsJson,
} from '@/shared/lib/bug-bounty/report-attachments-constants'

export const runtime = 'nodejs'

type RouteCtx = { params: Promise<{ reportId: string; fileId: string }> }

export async function GET(request: NextRequest, ctx: RouteCtx) {
  const auth = verifyBugBountyAdmin(request)
  if (!auth.ok) {
    return NextResponse.json(auth.body, { status: auth.status })
  }

  const { reportId, fileId: rawFileId } = await ctx.params
  const fileId = decodeURIComponent(rawFileId)

  if (!reportId || !isSafeBugBountyFileId(fileId)) {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 })
  }

  const report = await prisma.bugBountyReport.findUnique({
    where: { id: reportId },
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

  const filePath = getBugBountyReportFilePath(reportId, fileId)
  try {
    const buf = await fs.readFile(filePath)
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': meta.mime,
        'Cache-Control': 'private, max-age=3600',
        'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(meta.name)}`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Файл недоступен' }, { status: 404 })
  }
}
