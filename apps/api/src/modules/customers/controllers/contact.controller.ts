import { Request, Response, NextFunction } from 'express'
import { EmailService } from '../services/email.service'
import { sendSuccess } from '../utils/response'

const emailService = new EmailService()

export const sendContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await emailService.sendContactEmail(req.body)
    return sendSuccess(res, null, 'Mensaje enviado. Te contactaremos pronto.')
  } catch (err) { next(err) }
}

export const sendCotizacion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await emailService.sendCotizacionEmail(req.body)
    return sendSuccess(res, null, 'Cotizacion enviada. Te respondemos en menos de 24 horas.')
  } catch (err) { next(err) }
}