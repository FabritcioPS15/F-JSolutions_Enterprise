import { NextRequest, NextResponse } from 'next/server'
import { failure, isSameOrigin } from '@/lib/customer/http'
import { clearCustomerSessionCookie } from '@/lib/customer/session'

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return failure('Origen no autorizado.', 403)

  const response = NextResponse.json({ success: true })
  clearCustomerSessionCookie(response)
  return response
}
