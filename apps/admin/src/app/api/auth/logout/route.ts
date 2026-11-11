import { NextRequest, NextResponse } from 'next/server'
import { clearSessionCookies, isSecureRequest } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true, message: 'Sesión cerrada' })
  clearSessionCookies(response, isSecureRequest(request))
  return response
}
