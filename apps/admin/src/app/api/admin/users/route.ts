import { NextRequest, NextResponse } from 'next/server'
import {
  createManagedUser,
  listManagedUsers,
  type ManagedUserInput,
} from '@/lib/auth/user-store'
import {
  parseUserBody,
  requireSuperadmin,
  requireUsersViewer,
  usersFailure,
} from '@/lib/auth/users-http'

export const dynamic = 'force-dynamic'

export async function GET() {
  const guard = await requireUsersViewer()
  if ('response' in guard) return guard.response

  try {
    return NextResponse.json({ success: true, data: { users: await listManagedUsers() } })
  } catch (error) {
    return usersFailure(error)
  }
}

export async function POST(request: NextRequest) {
  // El registro público no existe: solo el superadministrador crea cuentas.
  const guard = await requireSuperadmin()
  if ('response' in guard) return guard.response

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, message: 'La solicitud no tiene un formato válido.' },
      { status: 400 },
    )
  }

  const patch = parseUserBody(body)
  const input: ManagedUserInput = {
    name: patch.name ?? '',
    email: patch.email ?? '',
    phone: patch.phone ?? '',
    role: patch.role ?? 'ventas',
    status: patch.status ?? 'active',
    twoFactorEnabled: patch.twoFactorEnabled ?? false,
    password: patch.password,
  }

  try {
    const user = await createManagedUser(input)
    return NextResponse.json({ success: true, data: { user } }, { status: 201 })
  } catch (error) {
    return usersFailure(error)
  }
}
