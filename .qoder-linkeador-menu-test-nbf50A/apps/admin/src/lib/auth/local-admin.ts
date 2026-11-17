import { timingSafeEqual } from 'node:crypto'

// Cuenta base del panel: se configura con variables de entorno y no se guarda
// en el almacén de usuarios para no duplicar credenciales.
const DEFAULT_EMAIL = 'admin@fjsolutions.com.pe'
const DEFAULT_NAME = 'Administrador F&J'
const DEV_PASSWORD = 'Admin12345!'

export const SEEDED_ADMIN_ID = 'usr_local_admin'

export function localAdminEmail() {
  return (process.env.SEED_ADMIN_EMAIL?.trim() || DEFAULT_EMAIL).toLowerCase()
}

export function localAdminName() {
  return process.env.SEED_ADMIN_NAME?.trim() || DEFAULT_NAME
}

export function localAdminPassword(): string | null {
  const configured = process.env.SEED_ADMIN_PASSWORD
  if (configured) return configured
  // Acceso de demostración: la contraseña por defecto también vale en el sitio
  // publicado para que el bloque público pueda iniciar sesión.
  return DEV_PASSWORD
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function verifySeededPassword(password: string) {
  const expected = localAdminPassword()
  if (!expected) return false
  return safeEqual(password, expected)
}
