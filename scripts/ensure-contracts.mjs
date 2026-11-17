// Los scripts predev/prebuild comparten este bloqueo para compilar los contratos.

import { existsSync, openSync, closeSync, readdirSync, statSync, unlinkSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceDir = path.join(root, 'packages/contracts/src')
const outputDir = path.join(root, 'packages/contracts/dist')
const lockFile = path.join(root, 'packages/contracts/.build.lock')

const isBuilt = () => readdirSync(sourceDir).filter((file) => file.endsWith('.ts')).every((file) => {
  const sourceTime = statSync(path.join(sourceDir, file)).mtimeMs
  const name = file.slice(0, -3)
  return ['.js', '.d.ts'].every((extension) => {
    const output = path.join(outputDir, `${name}${extension}`)
    return existsSync(output) && statSync(output).mtimeMs >= sourceTime
  })
})

if (isBuilt()) process.exit(0)

let ownsLock = false
try {
  closeSync(openSync(lockFile, 'wx'))
  ownsLock = true
} catch {
  // Otro proceso está compilando; esperamos a que termine.
  for (let attempt = 0; attempt < 120; attempt += 1) {
    await delay(250)
    if (isBuilt()) process.exit(0)
    if (!existsSync(lockFile)) break
  }
  console.error('[contracts] No se pudo compilar @fj-solutions/contracts.')
  process.exit(1)
}

try {
  const result = spawnSync(
    process.platform === 'win32' ? 'cmd.exe' : 'pnpm',
    process.platform === 'win32'
      ? ['/d', '/s', '/c', 'pnpm --filter @fj-solutions/contracts build']
      : ['--filter', '@fj-solutions/contracts', 'build'],
    { cwd: root, stdio: 'inherit' }
  )
  process.exitCode = result.status ?? 1
} finally {
  if (ownsLock) {
    try {
      unlinkSync(lockFile)
    } catch {
      // El lock ya no existe; no hay nada que limpiar.
    }
  }
}
