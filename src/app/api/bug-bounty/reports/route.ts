import { randomUUID } from 'node:crypto'
import { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/db'
import { isParticipantKey } from '@/shared/lib/bug-bounty/validate'
import {
  MAX_BUG_BOUNTY_FILES,
  classifyAttachmentKind,
  isAllowedBugBountyMime,
  maxBytesForMime,
  removeBugBountyReportUploads,
  writeBugBountyAttachment,
} from '@/shared/lib/bug-bounty/report-attachments'
import type { BugBountyAttachmentMeta } from '@/shared/lib/bug-bounty/report-attachments'
import {
  isFormDataBlobLike,
  sniffAttachmentMime,
} from '@/shared/lib/bug-bounty/sniff-attachment-mime'

export const runtime = 'nodejs'

type JsonBody = {
  participantKey?: string
  title?: string
  description?: string
}

const MAX_TITLE = 200
const MAX_DESC = 12_000

function fileNameFromBlob(b: Blob & { name?: string }): string {
  const n = typeof b.name === 'string' ? b.name : 'attachment'
  return n.replace(/[/\\]/g, '_').slice(0, 200)
}

async function createReportWithOptionalFiles(
  participantId: string,
  title: string,
  description: string,
  fileParts: (Blob & { name?: string })[],
): Promise<{ id: string; createdAt: Date }> {
  const report = await prisma.bugBountyReport.create({
    data: {
      participantId,
      title,
      description,
    },
    select: { id: true, createdAt: true },
  })

  const metas: BugBountyAttachmentMeta[] = []

  try {
    for (const file of fileParts) {
      if (metas.length >= MAX_BUG_BOUNTY_FILES) break
      const buf = Buffer.from(await file.arrayBuffer())
      let mime = (file.type || '').trim().toLowerCase()
      if (!isAllowedBugBountyMime(mime)) {
        const sniffed = sniffAttachmentMime(buf.subarray(0, Math.min(buf.length, 64)))
        if (sniffed) mime = sniffed
      }
      if (!isAllowedBugBountyMime(mime)) {
        throw new Error('BAD_FILE_TYPE')
      }
      const kind = classifyAttachmentKind(mime)
      if (!kind) {
        throw new Error('BAD_FILE_TYPE')
      }
      const maxB = maxBytesForMime(mime)
      if (buf.length > maxB) {
        throw new Error('FILE_TOO_LARGE')
      }
      const fileId = randomUUID()
      const name = fileNameFromBlob(file)
      await writeBugBountyAttachment(report.id, fileId, buf)
      metas.push({ id: fileId, mime, kind, name })
    }

    if (metas.length > 0) {
      await prisma.bugBountyReport.update({
        where: { id: report.id },
        data: { attachments: metas as Prisma.InputJsonValue },
      })
    }
  } catch (e) {
    await removeBugBountyReportUploads(report.id).catch(() => {})
    await prisma.bugBountyReport.delete({ where: { id: report.id } }).catch(() => {})
    throw e
  }

  return report
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') ?? ''

    let participantKey = ''
    let title = ''
    let description = ''
    let files: (Blob & { name?: string })[] = []

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData()
      participantKey = String(form.get('participantKey') ?? '').trim()
      title = String(form.get('title') ?? '').trim()
      description = String(form.get('description') ?? '').trim()
      const raw = form.getAll('files')
      files = raw.filter(isFormDataBlobLike) as (Blob & { name?: string })[]
      if (files.length > MAX_BUG_BOUNTY_FILES) {
        return NextResponse.json(
          { error: `Не больше ${MAX_BUG_BOUNTY_FILES} файлов` },
          { status: 400 },
        )
      }
    } else {
      const body = (await request.json()) as JsonBody
      participantKey = body.participantKey?.trim() ?? ''
      title = body.title?.trim() ?? ''
      description = body.description?.trim() ?? ''
    }

    if (!isParticipantKey(participantKey)) {
      return NextResponse.json({ error: 'Некорректный ключ участника' }, { status: 400 })
    }
    if (!title || title.length > MAX_TITLE) {
      return NextResponse.json({ error: 'Укажите название бага' }, { status: 400 })
    }
    if (!description || description.length > MAX_DESC) {
      return NextResponse.json({ error: 'Добавьте описание' }, { status: 400 })
    }

    const participant = await prisma.bugBountyParticipant.findUnique({
      where: { participantKey },
      select: { id: true },
    })

    if (!participant) {
      return NextResponse.json({ error: 'Сначала пройдите регистрацию' }, { status: 403 })
    }

    const report = await createReportWithOptionalFiles(participant.id, title, description, files)

    return NextResponse.json({ success: true, id: report.id, createdAt: report.createdAt })
  } catch (e) {
    const msg = (e as Error).message
    if (msg === 'BAD_FILE_TYPE') {
      return NextResponse.json(
        { error: 'Допустимы фото (JPEG, PNG, WebP, GIF) и видео (MP4, WebM, MOV)' },
        { status: 400 },
      )
    }
    if (msg === 'FILE_TOO_LARGE') {
      return NextResponse.json(
        { error: 'Файл слишком большой: до 12 МБ для фото, до 45 МБ для видео' },
        { status: 400 },
      )
    }
    console.error('[bug-bounty/reports]', e)
    return NextResponse.json({ error: 'Не удалось сохранить репорт' }, { status: 500 })
  }
}
