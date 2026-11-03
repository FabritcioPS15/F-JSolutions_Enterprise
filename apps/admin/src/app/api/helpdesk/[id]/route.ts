import { NextRequest } from 'next/server'
import { proxyHelpdesk } from '../proxy'

export const dynamic = 'force-dynamic'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params
  return proxyHelpdesk(`/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: await request.text(),
  })
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params
  return proxyHelpdesk(`/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
