import { NextRequest, NextResponse } from 'next/server'
import { SEEDED_ADMIN_ID } from '@/lib/auth/local-admin'
import { createLocalSessionToken } from '@/lib/auth/local-auth'
import { applyLocalSessionCookie, isSecureRequest } from '@/lib/auth/session'
import { touchManagedUserLogin } from '@/lib/auth/user-store'

export const dynamic = 'force-dynamic'

// Entrada de demostración como superadministrador, disponible en cualquier
// entorno para que el panel se pueda probar desde el sitio publicado.
export async function GET(request: NextRequest) {
  await touchManagedUserLogin(SEEDED_ADMIN_ID)

  // Redirección relativa: detrás de un proxy request.url puede apuntar al host
  // interno y llevar al navegador a localhost.
  const response = new NextResponse(null, {
    status: 307,
    headers: { location: '/' },
  })
  applyLocalSessionCookie(response, createLocalSessionToken(SEEDED_ADMIN_ID), {
    secure: isSecureRequest(request),
  })
  return response
}
