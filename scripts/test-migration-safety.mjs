// Проверка безопасности миграции 20260421120000_bug_bounty_attachment_blobs.
// Сценарий:
//   1. Чистая БД.
//   2. Применяем ТОЛЬКО старые миграции (прячем новую) — имитируем прод до деплоя фикса.
//   3. Через прямой SQL заполняем БД «прод»-данными: участники + репорт с attachments JSON.
//   4. Возвращаем новую миграцию и применяем её — как это сделает Coolify на проде.
//   5. Проверяем через прямой SQL, что ВСЕ старые данные целы.
//   6. Пишем BLOB в новую таблицу и читаем обратно побайтово.
//   7. Проверяем cascade delete.
//
// Запуск: node scripts/test-migration-safety.mjs

import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import { execSync } from 'node:child_process'
import { createClient } from '@libsql/client'

const TEST_DB = './test-migration-safety.db'
const NEW_MIGRATION_DIR = './prisma/migrations/20260421120000_bug_bounty_attachment_blobs'
const HIDDEN_DIR = './prisma/migrations_hidden_20260421120000'

function sh(cmd, env = {}) {
  return execSync(cmd, {
    env: { ...process.env, ...env },
    stdio: ['inherit', 'pipe', 'pipe'],
    encoding: 'utf8',
  })
}

async function exists(p) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

function sqliteClient() {
  return createClient({ url: `file:${TEST_DB}` })
}

async function tableExists(db, name) {
  const res = await db.execute({
    sql: `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
    args: [name],
  })
  return res.rows.length > 0
}

async function countRows(db, table) {
  const res = await db.execute(`SELECT COUNT(*) as c FROM "${table}"`)
  return Number(res.rows[0].c)
}

async function assertEq(actual, expected, msg) {
  if (actual !== expected) {
    throw new Error(`${msg}: expected ${expected}, got ${actual}`)
  }
}

async function main() {
  console.log('[1/7] Чистая тестовая БД...')
  await fs.rm(TEST_DB, { force: true })
  await fs.rm(TEST_DB + '-journal', { force: true })

  console.log('[2/7] Прячем новую миграцию и применяем только "старые"...')
  if (await exists(HIDDEN_DIR)) await fs.rm(HIDDEN_DIR, { recursive: true, force: true })
  await fs.rename(NEW_MIGRATION_DIR, HIDDEN_DIR)

  try {
    sh(`npx prisma migrate deploy`, { DATABASE_URL: `file:${TEST_DB}` })

    // Проверим, что новой таблицы ещё нет
    {
      const db = sqliteClient()
      const has = await tableExists(db, 'BugBountyAttachmentBlob')
      await db.close()
      if (has) throw new Error('new table already present before applying new migration')
    }

    console.log('[3/7] Заливаем «прод»-данные напрямую через SQL (без Prisma Client)...')
    {
      const db = sqliteClient()

      const pAid = 'part_a_' + crypto.randomBytes(6).toString('hex')
      const pBid = 'part_b_' + crypto.randomBytes(6).toString('hex')
      const rOldId = 'rep_old_' + crypto.randomBytes(6).toString('hex')
      const rPlainId = 'rep_plain_' + crypto.randomBytes(6).toString('hex')
      const legacyFileId = crypto.randomUUID()

      await db.execute({
        sql: `INSERT INTO BugBountyParticipant
          (id, participantKey, email, phone, displayName, passwordHash, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        args: [pAid, 'key_a_' + crypto.randomBytes(4).toString('hex'), 'a@ex.com', '+71111111111', 'User A', 'hash_a'],
      })
      await db.execute({
        sql: `INSERT INTO BugBountyParticipant
          (id, participantKey, email, phone, displayName, passwordHash, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        args: [pBid, 'key_b_' + crypto.randomBytes(4).toString('hex'), 'b@ex.com', '+72222222222', 'User B', 'hash_b'],
      })

      const attachmentsJson = JSON.stringify([
        { id: legacyFileId, mime: 'image/png', kind: 'image', name: 'old.png' },
      ])

      await db.execute({
        sql: `INSERT INTO BugBountyReport
          (id, participantId, title, description, attachments, status, createdAt)
          VALUES (?, ?, ?, ?, ?, 'PENDING', CURRENT_TIMESTAMP)`,
        args: [rOldId, pAid, 'Старый репорт', 'описание A', attachmentsJson],
      })
      await db.execute({
        sql: `INSERT INTO BugBountyReport
          (id, participantId, title, description, status, createdAt)
          VALUES (?, ?, ?, ?, 'PENDING', CURRENT_TIMESTAMP)`,
        args: [rPlainId, pBid, 'Репорт без вложений', 'описание B'],
      })

      console.log('    до миграции:')
      console.log('      BugBountyParticipant:', await countRows(db, 'BugBountyParticipant'))
      console.log('      BugBountyReport:     ', await countRows(db, 'BugBountyReport'))

      await db.close()

      // сохраним id для дальнейших проверок
      global.__testIds = { pAid, pBid, rOldId, rPlainId, legacyFileId, attachmentsJson }
    }

    console.log('[4/7] Возвращаем новую миграцию и применяем (как это сделает Coolify)...')
    await fs.rename(HIDDEN_DIR, NEW_MIGRATION_DIR)
    sh(`npx prisma migrate deploy`, { DATABASE_URL: `file:${TEST_DB}` })

    console.log('[5/7] Проверяем, что СТАРЫЕ данные не пострадали...')
    {
      const db = sqliteClient()
      const { pAid, pBid, rOldId, rPlainId, legacyFileId, attachmentsJson } = global.__testIds

      await assertEq(await countRows(db, 'BugBountyParticipant'), 2, 'participants count')
      await assertEq(await countRows(db, 'BugBountyReport'), 2, 'reports count')
      if (!(await tableExists(db, 'BugBountyAttachmentBlob'))) {
        throw new Error('new table BugBountyAttachmentBlob was not created')
      }
      await assertEq(await countRows(db, 'BugBountyAttachmentBlob'), 0, 'new table must be empty')

      const rOld = (await db.execute({
        sql: `SELECT title, description, participantId, attachments FROM BugBountyReport WHERE id=?`,
        args: [rOldId],
      })).rows[0]
      if (!rOld) throw new Error('old report disappeared')
      await assertEq(rOld.title, 'Старый репорт', 'old report title')
      await assertEq(rOld.description, 'описание A', 'old report description')
      await assertEq(rOld.participantId, pAid, 'old report participantId')
      await assertEq(String(rOld.attachments), attachmentsJson, 'old attachments JSON preserved')

      const parsed = JSON.parse(String(rOld.attachments))
      await assertEq(parsed[0].id, legacyFileId, 'legacy file id preserved in JSON')

      const rPlain = (await db.execute({
        sql: `SELECT title, participantId FROM BugBountyReport WHERE id=?`,
        args: [rPlainId],
      })).rows[0]
      if (!rPlain) throw new Error('plain report disappeared')
      await assertEq(rPlain.participantId, pBid, 'plain report participantId')

      const pA = (await db.execute({
        sql: `SELECT email FROM BugBountyParticipant WHERE id=?`,
        args: [pAid],
      })).rows[0]
      await assertEq(pA.email, 'a@ex.com', 'participant A email')

      console.log('    OK: 2 участника, 2 репорта, attachments JSON побитово сохранился.')

      await db.close()
    }

    console.log('[6/7] Пишем BLOB в новую таблицу и читаем обратно...')
    {
      const db = sqliteClient()
      const { rOldId } = global.__testIds

      const newFileId = crypto.randomUUID()
      const payload = crypto.randomBytes(512 * 1024)
      const mime = 'image/jpeg'

      await db.execute({
        sql: `INSERT INTO BugBountyAttachmentBlob (fileId, reportId, mime, data, createdAt)
              VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        args: [newFileId, rOldId, mime, payload],
      })

      const row = (await db.execute({
        sql: `SELECT fileId, reportId, mime, data FROM BugBountyAttachmentBlob WHERE fileId=?`,
        args: [newFileId],
      })).rows[0]

      if (!row) throw new Error('blob not found after insert')
      await assertEq(row.mime, mime, 'blob mime')
      await assertEq(row.reportId, rOldId, 'blob reportId')
      const hashIn = crypto.createHash('sha256').update(payload).digest('hex')
      const hashOut = crypto.createHash('sha256').update(Buffer.from(row.data)).digest('hex')
      if (hashIn !== hashOut) throw new Error('blob content hash mismatch')

      console.log(`    OK: записал ${payload.byteLength} байт, прочитал обратно, SHA-256 совпадает.`)

      global.__testIds.newFileId = newFileId
      await db.close()
    }

    console.log('[7/7] Cascade delete: удаление репорта удаляет BLOB, НЕ трогает другие данные...')
    {
      const db = sqliteClient()
      const { rOldId, rPlainId, newFileId } = global.__testIds

      await db.execute({ sql: `PRAGMA foreign_keys = ON` })
      await db.execute({
        sql: `DELETE FROM BugBountyReport WHERE id=?`,
        args: [rOldId],
      })

      const goneBlob = (await db.execute({
        sql: `SELECT fileId FROM BugBountyAttachmentBlob WHERE fileId=?`,
        args: [newFileId],
      })).rows[0]
      if (goneBlob) throw new Error('blob was not cascade-deleted')

      const other = (await db.execute({
        sql: `SELECT id FROM BugBountyReport WHERE id=?`,
        args: [rPlainId],
      })).rows[0]
      if (!other) throw new Error('unrelated report was wrongly deleted')

      await assertEq(await countRows(db, 'BugBountyParticipant'), 2, 'participants untouched')
      console.log('    OK: BLOB удалился вместе со своим репортом, второй репорт и участники целы.')

      await db.close()
    }

    console.log('\nРЕЗУЛЬТАТ: миграция безопасна. Старые данные не теряются, новая функциональность работает.')
  } finally {
    if (!(await exists(NEW_MIGRATION_DIR)) && (await exists(HIDDEN_DIR))) {
      await fs.rename(HIDDEN_DIR, NEW_MIGRATION_DIR).catch(() => {})
    }
    await fs.rm(TEST_DB, { force: true })
    await fs.rm(TEST_DB + '-journal', { force: true })
  }
}

main().catch(async (err) => {
  console.error('\nFAIL:', err)
  if (!(await exists(NEW_MIGRATION_DIR)) && (await exists(HIDDEN_DIR))) {
    await fs.rename(HIDDEN_DIR, NEW_MIGRATION_DIR).catch(() => {})
  }
  process.exit(1)
})
