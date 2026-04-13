/**
 * Ensures a production build exists before `next start`.
 * `routes-manifest.json` is only created by `next build`; without it, `next start` throws ENOENT.
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

const manifestPath = path.join(repoRoot, '.next', 'routes-manifest.json')

function runNpmScript(script) {
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const result = spawnSync(npm, ['run', script], {
    stdio: 'inherit',
    cwd: repoRoot,
    env: process.env,
  })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

if (!fs.existsSync(manifestPath)) {
  console.warn(
    '[@generationfi/web] Нет прод-сборки (.next/routes-manifest.json). Запускаю npm run build…'
  )
  runNpmScript('build')
}

const nextCli = require.resolve('next/dist/bin/next')
const startArgs = [nextCli, 'start', ...process.argv.slice(2)]
const start = spawnSync(process.execPath, startArgs, {
  stdio: 'inherit',
  cwd: repoRoot,
  env: process.env,
})

process.exit(start.status ?? 1)
