// Локальный e2e-тест для хранения BLOB'ов вложений bug-bounty.
// Запуск:  DATABASE_URL="file:./test-bug-bounty.db" node scripts/test-bug-bounty-blob.mjs

import crypto from 'node:crypto'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

function makePrisma() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  const adapter = new PrismaLibSql({ url })
  return new PrismaClient({ adapter })
}

async function main() {
  const prisma = makePrisma()

  const participantKey = 'test_' + crypto.randomBytes(8).toString('hex')
  const participant = await prisma.bugBountyParticipant.create({
    data: {
      participantKey,
      email: participantKey + '@example.com',
      displayName: 'Test Participant',
      passwordHash: 'x',
      phone: '+70000000000',
    },
    select: { id: true },
  })

  const report = await prisma.bugBountyReport.create({
    data: {
      participantId: participant.id,
      title: 'Test',
      description: 'test report for blob storage',
    },
    select: { id: true },
  })

  // 1) Записываем «картинку» (рандомный бинарь)
  const original = crypto.randomBytes(32 * 1024) // 32 KB
  const fileId = crypto.randomUUID()
  const bytes = new Uint8Array(original.byteLength)
  bytes.set(original)

  await prisma.bugBountyAttachmentBlob.create({
    data: {
      fileId,
      reportId: report.id,
      mime: 'image/png',
      data: bytes,
    },
  })

  // 2) Читаем обратно
  const back = await prisma.bugBountyAttachmentBlob.findUnique({
    where: { fileId },
    select: { data: true, mime: true, reportId: true },
  })

  if (!back) throw new Error('blob not found after insert')
  if (back.reportId !== report.id) throw new Error('reportId mismatch')
  if (back.mime !== 'image/png') throw new Error('mime mismatch')
  if (back.data.byteLength !== original.byteLength) {
    throw new Error(`size mismatch: ${back.data.byteLength} != ${original.byteLength}`)
  }
  const originalHash = crypto.createHash('sha256').update(original).digest('hex')
  const backHash = crypto.createHash('sha256').update(Buffer.from(back.data)).digest('hex')
  if (originalHash !== backHash) throw new Error('content hash mismatch')

  // 3) Cascade delete при удалении report'а
  await prisma.bugBountyReport.delete({ where: { id: report.id } })
  const gone = await prisma.bugBountyAttachmentBlob.findUnique({ where: { fileId } })
  if (gone) throw new Error('blob was not cascade-deleted with report')

  await prisma.bugBountyParticipant.delete({ where: { id: participant.id } })

  console.log('OK: write/read/cascade-delete all pass')
  console.log('  bytes:      ', original.byteLength)
  console.log('  sha256 in:  ', originalHash)
  console.log('  sha256 out: ', backHash)

  await prisma.$disconnect()
}

main().catch((err) => {
  console.error('FAIL:', err)
  process.exit(1)
})
