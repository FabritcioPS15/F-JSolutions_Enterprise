import { NextResponse } from 'next/server'
import { accessFromSession, checkPermission } from '@/lib/admin/access'
import type { AdminUserRole, AdminUserStatus } from '@/lib/admin/types'
import { getSessionUser } from './session'
import type { SessionUser } from './types'
import { ManagedUserError, type ManagedUserInput } from './user-store'

type Guarded = { user: SessionUser } | { response: NextResponse }

export async function requireUsersViewer(): Promise<Guarded> {
  const user = await getSessionUser()
  if (!user) {
    return {
      response: NextResponse.json(
        { success: false, message: 'Inicia sesión de nuevo.' },
        { status: 401 },
      ),
    }
  }
  if (!checkPermission(accessFromSession(user), 'users', 'view')) {
    return {
      response: NextResponse.json(
        { success: false, message: 'Tu rol no puede consultar usuarios.' },
        { status: 403 },
      ),
    }
  }
  return { user }
}

export async function requireSuperadmin(): Promise<Guarded> {
  const user = await getSessionUser()
  if (!user) {
    return {
      response: NextResponse.json(
        { success: false, message: 'Inicia sesión de nuevo.' },
        { status: 401 },
      ),
    }
  }
  if (user.role !== 'superadmin') {
    return {
      response: NextResponse.json(
        { success: false, message: 'Solo el superadministrador puede administrar cuentas.' },
        { status: 403 },
      ),
    }
  }
  return { user }
}

export function parseUserBody(value: unknown): Partial<ManagedUserInput> {
  const raw = (value ?? {}) as Record<string, unknown>
  const patch: Partial<ManagedUserInput> = {}
  if (typeof raw.name === 'string') patch.name = raw.name
  if (typeof raw.email === 'string') patch.email = raw.email
  if (typeof raw.phone === 'string') patch.phone = raw.phone
  if (typeof raw.role === 'string') patch.role = raw.role as AdminUserRole
  if (typeof raw.status === 'string') patch.status = raw.status as AdminUserStatus
  if (typeof raw.twoFactorEnabled === 'boolean') patch.twoFactorEnabled = raw.twoFactorEnabled
  if (typeof raw.password === 'string' && raw.password.length > 0) patch.password = raw.password
  return patch
}

export function usersFailure(error: unknown) {
  if (error instanceof ManagedUserError) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.status },
    )
  }
  console.error('[admin/users]', error)
  return NextResponse.json(
    { success: false, message: 'No se pudo completar la operación con usuarios.' },
    { status: 500 },
  )
}
