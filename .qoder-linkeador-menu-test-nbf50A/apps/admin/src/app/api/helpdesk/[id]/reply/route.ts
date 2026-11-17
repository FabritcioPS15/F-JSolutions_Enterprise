import { NextRequest } from 'next/server'
import { proxyHelpdesk } from '../../proxy'

export const dynamic = 'force-dynamic'

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params
  return proxyHelpdesk(`/${encodeURIComponent(id)}/reply`, {
    method: 'POST',
    body: await request.text(),
  })
}
