/**
 * Wrapper around `next dev`:
 * - NEXT_DEV_CLEAN=1 — полностью удаляет .next (если залип кэш / странные ошибки).
 * - Иначе: если .next есть, но нет dev-manifest'ов — удаляет .next (типичный битый кэш).
 * Затем запускает Next CLI с теми же аргументами (например `dev --port 3000`).
 *
 * Примечание: при старте Next сам чистит .next и какое-то время пишет manifest — дождись
 * строки «Ready» в терминале перед опросом страницы, и не держи второй `next dev` на том же порту.
 */
const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const repoRoot = path.resolve(__dirname, '..')
try {
  process.chdir(repoRoot)
} catch (e) {
  console.error('[@generationfi/web] Не удалось сделать chdir в корень проекта:', repoRoot)
  console.error(e)
  process.exit(1)
}

const nextDir = path.join(repoRoot, '.next')
const manifestPath = path.join(nextDir, 'routes-manifest.json')
const prerenderPath = path.join(nextDir, 'prerender-manifest.json')

function wipeNext(reason) {
  if (!fs.existsSync(nextDir)) return
  console.warn(`[@generationfi/web] ${reason} — удаляю каталог .next`)
  fs.rmSync(nextDir, { recursive: true, force: true })
}

if (process.env.NEXT_DEV_CLEAN === '1') {
  wipeNext('NEXT_DEV_CLEAN=1')
} else if (fs.existsSync(nextDir)) {
  const incomplete =
    !fs.existsSync(manifestPath) || !fs.existsSync(prerenderPath)
  if (incomplete) {
    wipeNext('Неполная dev-сборка (.next без manifest)')
  }
}

const nextCli = require.resolve('next/dist/bin/next')
const args = process.argv.slice(2)
if (args.length === 0) {
  console.error(
    '[@generationfi/web] Передай команду, например: node scripts/run-next-dev.js dev --port 3000'
  )
  process.exit(1)
}

const r = spawnSync(process.execPath, [nextCli, ...args], {
  stdio: 'inherit',
  cwd: repoRoot,
  env: process.env,
})

process.exit(r.status ?? 1)
