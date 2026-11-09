import { CustomerAccountError } from '@fj-solutions/contracts/customer-accounts'
import { NextResponse } from 'next/server'
import { accessFromSession, checkPermission } from '@/lib/admin/access'
import { getSessionUser } from '@/lib/auth/session'
import type { SessionUser } from '@/lib/auth/types'

type Guarded = { user: SessionUser } | { response: NextResponse }

async function guard(action: 'view' | 'update'): Promise<Guarded> {
  const user = await getSessionUser()
  if (!user) {
    return {
      response: NextResponse.json(
        { success: false, message: 'Inicia sesión de nuevo.' },
        { status: 401 },
      ),
    }
  }
  if (!checkPermission(accessFromSession(user), 'clients', action)) {
    return {
      response: NextResponse.json(
        {
          success: false,
          message:
            action === 'view'
              ? 'Tu rol no puede consultar cuentas web.'
              : 'Tu rol no puede administrar cuentas web.',
        },
        { status: 403 },
      ),
    }
  }
  return { user }
}

export function requireCustomersViewer() {
  return guard('view')
}

export function requireCustomersEditor() {
  return guard('update')
}

export function customersFailure(error: unknown) {
  if (error instanceof CustomerAccountError) {
    return NextResponse.json({ success: false, message: error.message }, { status: error.status })
  }
  console.error('[admin/customers]', error)
  return NextResponse.json(
    { success: false, message: 'No se pudo completar la operación con cuentas web.' },
    { status: 500 },
  )
}
