import { verifyCustomerEmail } from '@fj-solutions/contracts/customer-accounts'
import { NextRequest, NextResponse } from 'next/server'

// Enlace del correo de confirmación. Redirige siempre a la pantalla de acceso
// con un aviso, así el enlace no queda apuntando a una ruta interna.
export async function GET(request: NextRequest) {
  const token = new URL(request.url).searchParams.get('token') ?? ''
  const target = new URL('/login', request.url)

  if (!token) {
    target.searchParams.set('verificacion', 'invalida')
    return NextResponse.redirect(target, 303)
  }

  try {
    const result = await verifyCustomerEmail(token)
    if (!result.ok) {
      target.searchParams.set(
        'verificacion',
        result.reason === 'expired' ? 'expirada' : 'invalida'
      )
      return NextResponse.redirect(target, 303)
    }
    target.searchParams.set('verificado', '1')
    target.searchParams.set('correo', result.account.email)
    return NextResponse.redirect(target, 303)
  } catch (error) {
    console.error('[customer-accounts] Falló la verificación del correo:', error)
    target.searchParams.set('verificacion', 'error')
    return NextResponse.redirect(target, 303)
  }
}
