import { NextResponse } from 'next/server'
import { accessFromSession, checkPermission } from '@/lib/admin/access'
import { getSessionUser } from '@/lib/auth/session'
import type { SessionUser } from '@/lib/auth/types'
import { LinkProfileError } from './store'

// Las cuentas de empresa solo administran la página que se les asignó; el resto
// de roles con permiso sobre AllMyLinks ven todas las páginas.
export type LinkProfilesScope = 'all' | 'own'

type Guarded =
  | { ok: true; user: SessionUser; scope: LinkProfilesScope }
  | { ok: false; response: NextResponse }

const actionMessages: Record<string, string> = {
  view: 'Tu rol no puede consultar las páginas AllMyLinks.',
  create: 'Tu rol no puede crear páginas AllMyLinks.',
  update: 'Tu rol no puede editar las páginas AllMyLinks.',
  delete: 'Tu rol no puede eliminar páginas AllMyLinks.',
  publish: 'Tu rol no puede publicar páginas AllMyLinks.',
}

export async function guardLinkProfiles(
  action: 'view' | 'create' | 'update' | 'delete' | 'publish' = 'view'
): Promise<Guarded> {
  const user = await getSessionUser()
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: 'Inicia sesión de nuevo.' },
        { status: 401 }
      ),
    }
  }

  const access = accessFromSession(user)
  if (!checkPermission(access, 'links', action)) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: actionMessages[action] ?? actionMessages.view },
        { status: 403 }
      ),
    }
  }

  const canManageAll = checkPermission(access, 'links', 'create')
  const scope: LinkProfilesScope =
    user.linkProfileId && !canManageAll ? 'own' : 'all'

  return { ok: true, user, scope }
}

export function isOwnProfile(guard: Extract<Guarded, { ok: true }>, id: string) {
  return guard.scope === 'all' || guard.user.linkProfileId === id
}

export function linkProfilesFailure(error: unknown) {
  if (error instanceof LinkProfileError) {
    return NextResponse.json({ success: false, message: error.message }, { status: error.status })
  }
  console.error('[admin/link-profiles]', error)
  return NextResponse.json(
    { success: false, message: 'No se pudo completar la operación con las páginas AllMyLinks.' },
    { status: 500 }
  )
}

export async function readJsonBody(request: Request): Promise<unknown | null> {
  try {
    return await request.json()
  } catch {
    return null
  }
}
