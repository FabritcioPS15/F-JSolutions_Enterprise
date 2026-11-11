import { NextRequest, NextResponse } from 'next/server'
import { safeNextPath } from '@/lib/customer/http'
import {
  devAccessEnabled,
  ensureDevCustomer,
  isDevCustomerKind,
} from '@/lib/customer/dev-access'
import { applyCustomerSessionCookie } from '@/lib/customer/session'

// Acceso directo con cuentas de prueba. En producción la ruta no existe.
export async function GET(request: NextRequest) {
  if (!devAccessEnabled()) {
    return new NextResponse('No encontrado', { status: 404 })
  }

  const url = new URL(request.url)
  const kind = url.searchParams.get('as')
  if (!isDevCustomerKind(kind)) {
    return NextResponse.redirect(new URL('/login?acceso=invalido', url))
  }

  try {
    const account = await ensureDevCustomer(kind)
    const response = NextResponse.redirect(
      new URL(safeNextPath(url.searchParams.get('next')), url)
    )
    applyCustomerSessionCookie(response, account.id)
    return response
  } catch (error) {
    console.error('[dev-access] No se pudo abrir la cuenta de prueba:', error)
    return NextResponse.redirect(new URL('/login?acceso=error', url))
  }
}
