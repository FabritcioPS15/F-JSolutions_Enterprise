import { Request, Response, NextFunction } from 'express'
import { EmailService } from '../services/email.service'
import { helpdeskService } from '../services/helpdesk.service'
import { sendSuccess } from '../utils/response'

const emailService = new EmailService()

export const sendContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ticket = await helpdeskService.create({
      ...req.body,
      channel: req.body.channel ?? 'WEB',
    })
    void emailService.notifyNewTicket(ticket)
    return sendSuccess(res, ticket, 'Consulta recibida. Te responderemos pronto.', 201)
  } catch (err) { next(err) }
}

export const sendCotizacion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await emailService.sendCotizacionEmail(req.body)
    return sendSuccess(res, null, 'Cotizacion enviada. Te respondemos en menos de 24 horas.')
  } catch (err) { next(err) }
}
