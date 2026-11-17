import { NextRequest, NextResponse } from 'next/server'
import {
  guardLinkProfiles,
  linkProfilesFailure,
  readJsonBody,
} from '@/lib/links/http'
import { createLinkProfile, listLinkProfiles } from '@/lib/links/store'
import type { LinkProfileInput } from '@/lib/links/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  const guard = await guardLinkProfiles('view')
  if (!guard.ok) return guard.response

  try {
    const profiles = await listLinkProfiles()
    const visible =
      guard.scope === 'own'
        ? profiles.filter((profile) => profile.id === guard.user.linkProfileId)
        : profiles
    return NextResponse.json({ success: true, data: { profiles: visible, scope: guard.scope } })
  } catch (error) {
    return linkProfilesFailure(error)
  }
}

export async function POST(request: NextRequest) {
  const guard = await guardLinkProfiles('create')
  if (!guard.ok) return guard.response

  const body = await readJsonBody(request)
  if (!body || typeof body !== 'object') {
    return NextResponse.json(
      { success: false, message: 'La solicitud no tiene un formato válido.' },
      { status: 400 }
    )
  }

  try {
    const profile = await createLinkProfile(body as Partial<LinkProfileInput>)
    return NextResponse.json({ success: true, data: { profile } }, { status: 201 })
  } catch (error) {
    return linkProfilesFailure(error)
  }
}
