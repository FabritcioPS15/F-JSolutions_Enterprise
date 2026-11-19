import { registerCustomerAccount } from '@fj-solutions/contracts/customer-accounts'
import { NextRequest, NextResponse } from 'next/server'
import { smtpConfigured, deliverVerificationEmail } from '@/lib/customer/mailer'
import {
  clientIp,
  failure,
  handleAccountError,
  isSameOrigin,
  readJson,
  text,
} from '@/lib/customer/http'
import { allowAttempt } from '@/lib/customer/throttle'

// Registro público de la tienda. La cuenta queda pendiente hasta que el dueño
// del correo abre el enlace de confirmación.
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return failure('Origen no autorizado.', 403)
  if (!allowAttempt(`register:${clientIp(request)}`, 8, 10 * 60 * 1000)) {
    return failure('Demasiados intentos de registro. Espera unos minutos.', 429)
  }

  const payload = await readJson(request)
  if (!payload) return failure('La solicitud no tiene un formato válido.')

  const name = text(payload.name, 120)
  const email = text(payload.email, 160)
  const phone = text(payload.phone, 40)
  const company = text(payload.company, 160)
  const documentType = payload.documentType === 'dni' || payload.documentType === 'ruc'
    ? payload.documentType
    : null
  const documentNumber = text(payload.documentNumber, 20)
  const password = typeof payload.password === 'string' ? payload.password : ''
  const confirmPassword =
    typeof payload.confirmPassword === 'string' ? payload.confirmPassword : ''
  const marketingConsent = payload.marketingConsent === true

  if (payload.acceptTerms !== true) {
    return failure('Debes aceptar los términos y la política de privacidad.')
  }
  if (password !== confirmPassword) {
    return failure('Las contraseñas no coinciden.')
  }
  if (documentType && documentNumber.length === 0) {
    return failure('Escribe el número de documento.')
  }

  try {
    const { account, email: verification } = await registerCustomerAccount({
      name,
      email,
      phone,
      company,
      documentType,
      documentNumber,
      password,
      marketingConsent,
    })

    const delivery = await deliverVerificationEmail(verification)

    return NextResponse.json({
      success: true,
      message: 'Cuenta creada. Revisa tu correo para confirmarla.',
      data: {
        // No devolvemos datos de una cuenta existente: si el correo ya estaba
        // registrado, la respuesta solo refleja lo que la persona escribió.
        account: { id: account.id, name, email },
        mailDelivery: delivery.delivery,
        // Sin SMTP configurado el correo vive en la bandeja local; mostramos el
        // enlace para poder probar el flujo sin servidor de correo.
        ...(smtpConfigured() ? {} : { verificationLink: delivery.link }),
      },
    })
  } catch (error) {
    return handleAccountError(error)
  }
}
