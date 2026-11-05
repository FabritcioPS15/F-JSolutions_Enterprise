// Compila @fj-solutions/contracts solo si su salida no existe.
// Los scripts predev/prebuild de las apps lo invocan para que un clon limpio
// funcione sin ejecutar manualmente la compilación del paquete compartido.

import { existsSync, openSync, closeSync, unlinkSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const contractOutputs = [
  path.join(root, 'packages/contracts/dist/index.d.ts'),
  path.join(root, 'packages/contracts/dist/admin.d.ts'),
  path.join(root, 'packages/contracts/dist/domain.d.ts'),
  path.join(root, 'packages/contracts/dist/permissions.d.ts'),
]
const lockFile = path.join(root, 'packages/contracts/.build.lock')

const isBuilt = () => contractOutputs.every((file) => existsSync(file))

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
    process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
    ['--filter', '@fj-solutions/contracts', 'build'],
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
