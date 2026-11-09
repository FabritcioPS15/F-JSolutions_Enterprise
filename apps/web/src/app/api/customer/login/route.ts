import { authenticateCustomer } from '@fj-solutions/contracts/customer-accounts'
import { isEmail } from '@fj-solutions/contracts/domain'
import { NextRequest, NextResponse } from 'next/server'
import {
  clientIp,
  failure,
  handleAccountError,
  isSameOrigin,
  readJson,
  text,
} from '@/lib/customer/http'
import { applyCustomerSessionCookie } from '@/lib/customer/session'
import { allowAttempt } from '@/lib/customer/throttle'

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return failure('Origen no autorizado.', 403)

  const ip = clientIp(request)
  if (!allowAttempt(`login:${ip}`, 20, 10 * 60 * 1000)) {
    return failure('Demasiados intentos de acceso. Espera unos minutos.', 429)
  }

  const payload = await readJson(request)
  if (!payload) return failure('La solicitud no tiene un formato válido.')

  const email = text(payload.email, 160)
  const password = typeof payload.password === 'string' ? payload.password : ''

  if (!isEmail(email) || password.length === 0) {
    return failure('Ingresa tu correo y contraseña.')
  }

  try {
    const result = await authenticateCustomer(email, password)

    if (!result.ok) {
      if (result.reason === 'unverified') {
        return NextResponse.json(
          {
            success: false,
            code: 'unverified',
            message: 'Confirma tu correo para activar la cuenta. Revisa el enlace que te enviamos.',
          },
          { status: 403 }
        )
      }
      if (result.reason === 'blocked') {
        return failure('Esta cuenta está bloqueada. Escríbenos para revisar tu caso.', 403)
      }
      return failure('Correo o contraseña incorrectos.', 401)
    }

    const response = NextResponse.json({
      success: true,
      data: {
        customer: {
          id: result.account.id,
          name: result.account.name,
          email: result.account.email,
        },
      },
    })
    applyCustomerSessionCookie(response, result.account.id)
    return response
  } catch (error) {
    return handleAccountError(error)
  }
}
