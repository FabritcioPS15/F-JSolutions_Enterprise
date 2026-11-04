import { NextFunction, Request, Response } from 'express'
import { sendPaginated, sendSuccess } from '../utils/response'
import {
  commercialService,
  type PublicQuotePayload,
  type QuotePayload,
} from '../services/commercial.service'

const quoteStatuses = [
  'draft',
  'new',
  'review',
  'sent',
  'approved',
  'rejected',
  'expired',
] as const

type QuoteStatusValue = (typeof quoteStatuses)[number]

function statusFrom(value: unknown): QuoteStatusValue | undefined {
  return quoteStatuses.includes(value as QuoteStatusValue)
    ? (value as QuoteStatusValue)
    : undefined
}

export const getQuotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Math.min(Number(req.query.limit) || 50, 100)
    const result = await commercialService.listQuotes({
      page,
      limit,
      q: typeof req.query.q === 'string' ? req.query.q : undefined,
      status: statusFrom(req.query.status),
      clientId: typeof req.query.clientId === 'string' ? req.query.clientId : undefined,
    })
    return sendPaginated(res, result.data, { page, limit, total: result.total })
  } catch (err) {
    next(err)
  }
}

export const getQuoteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quote = await commercialService.getQuote(req.params.id)
    return sendSuccess(res, quote)
  } catch (err) {
    next(err)
  }
}

export const createQuote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quote = await commercialService.createQuote(
      req.body as QuotePayload,
      req.auth?.user.id
    )
    return sendSuccess(res, quote, 'Cotización creada.', 201)
  } catch (err) {
    next(err)
  }
}

export const updateQuote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quote = await commercialService.updateQuote(
      req.params.id,
      req.body as QuotePayload,
      req.auth?.user.id
    )
    return sendSuccess(res, quote, 'Cotización actualizada.')
  } catch (err) {
    next(err)
  }
}

export const updateQuoteStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = (req.body as { status: QuoteStatusValue }).status
    const quote = await commercialService.updateQuoteStatus(
      req.params.id,
      status,
      req.auth?.user.id
    )
    return sendSuccess(res, quote, 'Estado de la cotización actualizado.')
  } catch (err) {
    next(err)
  }
}

export const deleteQuote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await commercialService.deleteQuote(req.params.id)
    return sendSuccess(res, null, 'Cotización eliminada.')
  } catch (err) {
    next(err)
  }
}

export const createPublicQuote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quote = await commercialService.createPublicQuote(req.body as PublicQuotePayload)
    return sendSuccess(
      res,
      quote,
      'Solicitud de cotización registrada. Un asesor se pondrá en contacto contigo.',
      201
    )
  } catch (err) {
    next(err)
  }
}
