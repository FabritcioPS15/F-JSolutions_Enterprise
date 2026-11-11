import { NextRequest, NextResponse } from 'next/server'
import { SEEDED_ADMIN_ID } from '@/lib/auth/local-admin'
import { createLocalSessionToken } from '@/lib/auth/local-auth'
import { applyLocalSessionCookie } from '@/lib/auth/session'
import { touchManagedUserLogin } from '@/lib/auth/user-store'

// Entrada de desarrollo como superadministrador. En producción la ruta no existe.
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse('No encontrado', { status: 404 })
  }

  await touchManagedUserLogin(SEEDED_ADMIN_ID)

  const response = NextResponse.redirect(new URL('/', request.url))
  applyLocalSessionCookie(response, createLocalSessionToken(SEEDED_ADMIN_ID))
  return response
}
