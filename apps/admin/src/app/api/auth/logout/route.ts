import { NextResponse } from 'next/server'
import { apiBaseUrl, clearSessionCookies, getAccessToken } from '@/lib/auth/session'

export async function POST() {
  const token = await getAccessToken()

  if (token) {
    try {
      await fetch(`${apiBaseUrl()}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
        signal: AbortSignal.timeout(5_000),
      })
    } catch {
      // El cierre local de sesión no depende de la disponibilidad de la API.
    }
  }

  const response = NextResponse.json({ success: true, message: 'Sesión cerrada' })
  clearSessionCookies(response)
  return response
}
