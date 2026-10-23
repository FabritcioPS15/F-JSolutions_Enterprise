import { logger } from '../utils/logger'

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

export class EmailService {
  async sendContactEmail(data: ContactInput): Promise<boolean> {
    logger.info(`[EmailService] Nuevo mensaje de contacto recibido de ${data.nombre} (${data.email}) - Asunto: ${data.asunto}`)
    // En producción se integraría con Resend, SendGrid o Nodemailer SMTP
    return true
  }

  async sendCotizacionEmail(data: CotizacionInput): Promise<boolean> {
    logger.info(`[EmailService] Nueva solicitud de cotización recibida de ${data.empresa} - Contacto: ${data.contacto} (${data.email})`)
    // En producción envía notificación interna y acuse de recibo al cliente
    return true
  }
}
