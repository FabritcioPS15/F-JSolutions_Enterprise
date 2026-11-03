import nodemailer, { type Transporter } from 'nodemailer'
import { env } from '../config/env'
import { logger } from '../utils/logger'
import type { HelpdeskTicket } from './helpdesk.service'

interface ContactInput {
  nombre: string
  email: string
  telefono?: string
  empresa?: string
  asunto: 'ventas' | 'soporte' | 'cotizacion' | 'general'
  mensaje: string
}

interface CotizacionInput {
  empresa: string
  contacto: string
  email: string
  telefono: string
  mensaje?: string
  items?: Array<{
    productId: string
    quantity: number
  }>
}

function cleanHeader(value: string) {
  return value.replace(/[\r\n]+/g, ' ').slice(0, 160)
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function replyHtml(ticket: HelpdeskTicket, message: string) {
  const body = escapeHtml(message).replace(/\r?\n/g, '<br />')
  return `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:24px;background:#f1f5f9;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
      <tr>
        <td style="background:#0f172a;padding:20px 24px;">
          <p style="margin:0;font-size:16px;font-weight:700;color:#ffffff;">F&amp;J Systems</p>
          <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;">Soporte y soluciones tecnológicas</p>
        </td>
      </tr>
      <tr>
        <td style="padding:24px;">
          <p style="margin:0 0 16px;font-size:13px;color:#475569;">
            Respuesta a la consulta <strong style="color:#0f172a;">${escapeHtml(ticket.code)}</strong>
          </p>
          <div style="font-size:14px;line-height:1.6;color:#334155;">${body}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px;background:#f8fafc;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:11px;color:#64748b;">
            Este correo responde a la consulta enviada desde nuestro sitio web.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export class EmailService {
  private transporter: Transporter | null

  constructor() {
    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
      })
    } else {
      this.transporter = null
    }
  }

  get configured() {
    return Boolean(this.transporter)
  }

  async notifyNewTicket(ticket: HelpdeskTicket): Promise<void> {
    const subject = cleanHeader(`Nueva consulta web — ${ticket.asunto}`)
    const text = [
      `Código: ${ticket.code}`,
      `Nombre: ${ticket.nombre}`,
      `Empresa: ${ticket.empresa || '—'}`,
      `Correo: ${ticket.email}`,
      `Teléfono: ${ticket.telefono || '—'}`,
      `Asunto: ${ticket.asunto}`,
      '',
      ticket.mensaje,
      '',
      'Responde desde el panel: Mesa de ayuda.',
    ].join('\n')

    if (!this.transporter || !env.SMTP_USER) {
      logger.info(
        `[EmailService] Nueva consulta ${ticket.code} de ${ticket.nombre} (${ticket.email}). SMTP no configurado; notificación omitida.`
      )
      return
    }

    try {
      await this.transporter.sendMail({
        from: env.EMAIL_FROM,
        to: env.SMTP_USER,
        subject,
        text,
      })
    } catch (error) {
      logger.error('[EmailService] No se pudo enviar la notificación interna:', error)
    }
  }

  async sendReply(
    ticket: HelpdeskTicket,
    subject: string,
    message: string
  ): Promise<{ delivered: boolean; reason?: string }> {
    if (!this.transporter) {
      logger.info(
        `[EmailService] Respuesta para ${ticket.code} registrada, pero SMTP no está configurado.`
      )
      return { delivered: false, reason: 'SMTP no configurado' }
    }

    try {
      await this.transporter.sendMail({
        from: env.EMAIL_FROM,
        to: ticket.email,
        replyTo: env.SMTP_USER,
        subject: cleanHeader(subject),
        text: message,
        html: replyHtml(ticket, message),
      })
      return { delivered: true }
    } catch (error) {
      logger.error('[EmailService] No se pudo enviar la respuesta al cliente:', error)
      return { delivered: false, reason: 'No se pudo enviar el correo' }
    }
  }

  async sendContactEmail(data: ContactInput): Promise<boolean> {
    logger.info(
      `[EmailService] Mensaje de contacto de ${data.nombre} (${data.email}) - Asunto: ${data.asunto}`
    )
    return true
  }

  async sendCotizacionEmail(data: CotizacionInput): Promise<boolean> {
    logger.info(
      `[EmailService] Solicitud de cotización de ${data.empresa} - Contacto: ${data.contacto} (${data.email})`
    )
    return true
  }
}
