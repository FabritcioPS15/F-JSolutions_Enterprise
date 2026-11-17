import { NextRequest, NextResponse } from 'next/server'
import {
  guardLinkProfiles,
  isOwnProfile,
  linkProfilesFailure,
  readJsonBody,
} from '@/lib/links/http'
import { deleteLinkProfile, updateLinkProfile } from '@/lib/links/store'
import type { LinkProfileInput } from '@/lib/links/types'

export const dynamic = 'force-dynamic'

type RouteContext = { params: Promise<{ id: string }> }

function forbidden() {
  return NextResponse.json(
    { success: false, message: 'Solo puedes administrar la página asignada a tu empresa.' },
    { status: 403 }
  )
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const guard = await guardLinkProfiles('update')
  if (!guard.ok) return guard.response

  const { id } = await context.params
  if (!isOwnProfile(guard, id)) return forbidden()

  const body = await readJsonBody(request)
  if (!body || typeof body !== 'object') {
    return NextResponse.json(
      { success: false, message: 'La solicitud no tiene un formato válido.' },
      { status: 400 }
    )
  }

  try {
    const profile = await updateLinkProfile(id, body as Partial<LinkProfileInput>)
    return NextResponse.json({ success: true, data: { profile } })
  } catch (error) {
    return linkProfilesFailure(error)
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const guard = await guardLinkProfiles('delete')
  if (!guard.ok) return guard.response

  const { id } = await context.params
  if (!isOwnProfile(guard, id)) return forbidden()

  try {
    await deleteLinkProfile(id)
    return NextResponse.json({ success: true, data: { id } })
  } catch (error) {
    return linkProfilesFailure(error)
  }
}
