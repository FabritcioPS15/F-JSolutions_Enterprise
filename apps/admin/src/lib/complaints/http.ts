import { ComplaintError } from '@fj-solutions/contracts/complaints-book'
import { NextResponse } from 'next/server'
import { accessFromSession, checkPermission } from '@/lib/admin/access'
import { getSessionUser } from '@/lib/auth/session'

type Guarded = { ok: true } | { ok: false; response: NextResponse }

export async function guardComplaints(action: 'view' | 'update' | 'reply'): Promise<Guarded> {
  const user = await getSessionUser()
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: 'Inicia sesión de nuevo.' },
        { status: 401 },
      ),
    }
  }
  if (!checkPermission(accessFromSession(user), 'complaints', action)) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          success: false,
          message:
            action === 'view'
              ? 'Tu rol no puede consultar el libro de reclamaciones.'
              : 'Tu rol no puede atender reclamos.',
        },
        { status: 403 },
      ),
    }
  }
  return { ok: true }
}

export function complaintsFailure(error: unknown) {
  if (error instanceof ComplaintError) {
    return NextResponse.json({ success: false, message: error.message }, { status: error.status })
  }
  console.error('[admin/complaints]', error)
  return NextResponse.json(
    { success: false, message: 'No se pudo completar la operación con el libro de reclamaciones.' },
    { status: 500 },
  )
}
