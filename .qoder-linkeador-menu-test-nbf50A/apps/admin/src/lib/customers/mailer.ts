import {
  recordOutboxEmail,
  type OutboxEmail,
  type VerificationEmail,
} from '@fj-solutions/contracts/customer-accounts'

// Reenvío de la verificación desde el panel. Usa el mismo SMTP_* que la tienda
// y, si no hay servidor configurado, deja el correo en la bandeja local.
export function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

export async function deliverVerificationEmail(email: VerificationEmail): Promise<OutboxEmail> {
  if (!smtpConfigured()) return recordOutboxEmail(email, 'outbox')

  try {
    const { createTransport } = await import('nodemailer')
    const port = Number(process.env.SMTP_PORT ?? 587)
    const transport = createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
    await transport.sendMail({
      from: process.env.EMAIL_FROM ?? 'F&J Systems <no-reply@fjsolutions.pe>',
      to: email.to,
      subject: email.subject,
      text: email.text,
    })
    return recordOutboxEmail(email, 'smtp')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo enviar el correo.'
    console.error('[admin/customers] Falló el envío SMTP:', message)
    return recordOutboxEmail(email, 'outbox', message)
  }
}
