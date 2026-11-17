import { NextResponse } from 'next/server'
import { accessFromSession, checkPermission, type Access } from '@/lib/admin/access'
import { getAccessToken, getSessionUser } from './session'

// El panel llama a la API a través de estos proxies, así que la autorización no
// puede depender de lo que la UI pintó: cada proxy verifica el permiso antes de
// reenviar. La sesión se cachea unos segundos porque /auth/me se consultarían
// varias veces por pantalla.
const CACHE_TTL_MS = 30_000
const MAX_CACHED_SESSIONS = 200

const sessionCache = new Map<string, { expiresAt: number; access: Access | null }>()

function remember(token: string, access: Access | null) {
  if (sessionCache.size >= MAX_CACHED_SESSIONS) sessionCache.clear()
  sessionCache.set(token, { expiresAt: Date.now() + CACHE_TTL_MS, access })
}

export function clearAccessCache() {
  sessionCache.clear()
}

export async function resolveAccess(): Promise<Access | null> {
  const token = await getAccessToken()
  if (!token) return null

  const cached = sessionCache.get(token)
  if (cached && cached.expiresAt > Date.now()) return cached.access

  const access = accessFromSession(await getSessionUser())
  remember(token, access)
  return access
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, message: 'No autorizado: inicia sesión de nuevo.' },
    { status: 401 }
  )
}

export function forbiddenResponse(permission: string) {
  return NextResponse.json(
    {
      success: false,
      code: 'missing_permission',
      permission,
      message: 'Tu rol no tiene permiso para esta acción en el panel.',
    },
    { status: 403 }
  )
}

export type GuardResult = { ok: true; access: Access } | { ok: false; response: NextResponse }

export async function guardPermission(module: string, action: string): Promise<GuardResult> {
  const access = await resolveAccess()
  if (!access) return { ok: false, response: unauthorizedResponse() }
  if (!checkPermission(access, module, action)) {
    return { ok: false, response: forbiddenResponse(`${module}.${action}`) }
  }
  return { ok: true, access }
}
