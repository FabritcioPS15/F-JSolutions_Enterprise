import { resendCustomerVerificationByEmail } from '@fj-solutions/contracts/customer-accounts'
import { isEmail } from '@fj-solutions/contracts/domain'
import { NextRequest, NextResponse } from 'next/server'
import { deliverVerificationEmail, smtpConfigured } from '@/lib/customer/mailer'
import { clientIp, failure, isSameOrigin, readJson, text } from '@/lib/customer/http'
import { allowAttempt } from '@/lib/customer/throttle'

// Reenvío desde la pantalla de acceso. La respuesta es siempre la misma para
// no revelar si un correo tiene cuenta pendiente.
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return failure('Origen no autorizado.', 403)
  if (!allowAttempt(`resend:${clientIp(request)}`, 5, 10 * 60 * 1000)) {
    return failure('Demasiados reenvíos. Espera unos minutos.', 429)
  }

  const payload = await readJson(request)
  if (!payload) return failure('La solicitud no tiene un formato válido.')

  const email = text(payload.email, 160)
  if (!isEmail(email)) return failure('Escribe un correo válido.')

  try {
    const verification = await resendCustomerVerificationByEmail(email)
    let verificationLink: string | undefined

    if (verification) {
      const delivery = await deliverVerificationEmail(verification)
      if (!smtpConfigured()) verificationLink = delivery.link
    }

    return NextResponse.json({
      success: true,
      message: 'Si el correo tiene una cuenta pendiente, te enviamos un enlace nuevo.',
      ...(verificationLink ? { data: { verificationLink } } : {}),
    })
  } catch (error) {
    console.error('[customer-accounts] Falló el reenvío de verificación:', error)
    return failure('No pudimos reenviar el correo. Inténtalo más tarde.', 500)
  }
}
