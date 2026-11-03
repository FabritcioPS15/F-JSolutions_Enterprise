import { Request, Response, NextFunction } from 'express'
import { EmailService } from '../services/email.service'
import { helpdeskService } from '../services/helpdesk.service'
import { sendError, sendSuccess } from '../utils/response'

const emailService = new EmailService()

export const listTickets = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tickets = await helpdeskService.list()
    return sendSuccess(res, tickets)
  } catch (err) { next(err) }
}

export const createTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ticket = await helpdeskService.create(req.body)
    return sendSuccess(res, ticket, 'Consulta registrada en la mesa de ayuda.', 201)
  } catch (err) { next(err) }
}

export const updateTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ticket = await helpdeskService.update(req.params.id, req.body)
    if (!ticket) return sendError(res, 'La consulta ya no existe.', 404)
    return sendSuccess(res, ticket, 'Consulta actualizada.')
  } catch (err) { next(err) }
}

export const removeTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const removed = await helpdeskService.remove(req.params.id)
    if (!removed) return sendError(res, 'La consulta ya no existe.', 404)
    return sendSuccess(res, null, 'Consulta eliminada.')
  } catch (err) { next(err) }
}

export const replyTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ticket = await helpdeskService.findById(req.params.id)
    if (!ticket) return sendError(res, 'La consulta ya no existe.', 404)

    const result = await emailService.sendReply(ticket, req.body.subject, req.body.message)
    const updated = await helpdeskService.registerReply(ticket.id, {
      subject: req.body.subject,
      message: req.body.message,
      delivered: result.delivered,
    })

    return sendSuccess(
      res,
      { ticket: updated, delivered: result.delivered, reason: result.reason },
      result.delivered
        ? 'Respuesta enviada al cliente.'
        : 'Respuesta registrada, pero el correo no se envió.',
    )
  } catch (err) { next(err) }
}
