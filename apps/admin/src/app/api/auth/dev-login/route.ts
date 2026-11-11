import { NextRequest, NextResponse } from 'next/server'
import { SEEDED_ADMIN_ID } from '@/lib/auth/local-admin'
import { createLocalSessionToken } from '@/lib/auth/local-auth'
import { applyLocalSessionCookie } from '@/lib/auth/session'
import { touchManagedUserLogin } from '@/lib/auth/user-store'

// Entrada de demostración como superadministrador, disponible en cualquier
// entorno para que el panel se pueda probar desde el sitio publicado.
export async function GET(request: NextRequest) {
  await touchManagedUserLogin(SEEDED_ADMIN_ID)

  const response = NextResponse.redirect(new URL('/', request.url))
  applyLocalSessionCookie(response, createLocalSessionToken(SEEDED_ADMIN_ID))
  return response
}
