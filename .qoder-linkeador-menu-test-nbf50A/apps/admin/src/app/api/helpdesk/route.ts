import { NextRequest } from 'next/server'
import { proxyHelpdesk } from './proxy'

export const dynamic = 'force-dynamic'

export function GET() {
  return proxyHelpdesk('')
}

export async function POST(request: NextRequest) {
  return proxyHelpdesk('', {
    method: 'POST',
    body: await request.text(),
  })
}
