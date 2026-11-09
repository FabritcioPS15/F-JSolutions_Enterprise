import { NextRequest, NextResponse } from 'next/server'
import { clearAccessCache } from '@/lib/auth/guard'
import { deleteManagedUser, updateManagedUser } from '@/lib/auth/user-store'
import { parseUserBody, requireSuperadmin, usersFailure } from '@/lib/auth/users-http'

export const dynamic = 'force-dynamic'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, context: RouteContext) {
  const guard = await requireSuperadmin()
  if ('response' in guard) return guard.response

  const { id } = await context.params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, message: 'La solicitud no tiene un formato válido.' },
      { status: 400 },
    )
  }

  try {
    const user = await updateManagedUser(id, parseUserBody(body))
    clearAccessCache()
    return NextResponse.json({ success: true, data: { user } })
  } catch (error) {
    return usersFailure(error)
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const guard = await requireSuperadmin()
  if ('response' in guard) return guard.response

  const { id } = await context.params

  try {
    await deleteManagedUser(id)
    clearAccessCache()
    return NextResponse.json({ success: true, data: { id } })
  } catch (error) {
    return usersFailure(error)
  }
}
