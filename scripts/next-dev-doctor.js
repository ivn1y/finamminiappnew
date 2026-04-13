/**
 * Диагностика: корень проекта, наличие manifest, занятость порта 3000.
 * Запуск: npm run dev:doctor
 */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const repoRoot = path.resolve(__dirname, '..')
const nextDir = path.join(repoRoot, '.next')
const manifest = path.join(nextDir, 'routes-manifest.json')

console.log('--- next dev doctor ---')
console.log('Корень репозитория (по расположению скрипта):', repoRoot)
console.log('process.cwd() (откуда вызвали npm/node):', process.cwd())
console.log('.next существует:', fs.existsSync(nextDir))
console.log('routes-manifest.json:', fs.existsSync(manifest) ? 'есть' : 'НЕТ')
try {
  const out = execSync('lsof -nP -iTCP:3000 -sTCP:LISTEN 2>/dev/null || true', {
    encoding: 'utf8',
  }).trim()
  console.log('Порт 3000 (LISTEN):', out || '(ничего не слушает)')
} catch {
  console.log('Порт 3000: не удалось проверить (lsof)')
}
console.log('-----------------------')
