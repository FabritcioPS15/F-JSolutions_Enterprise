import { NextFunction, Request, Response } from 'express'
import { sendPaginated, sendSuccess } from '../utils/response'
import { commercialService, type ClientPayload } from '../services/commercial.service'

export const getClients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Math.min(Number(req.query.limit) || 50, 100)
    const result = await commercialService.listClients({
      page,
      limit,
      q: typeof req.query.q === 'string' ? req.query.q : undefined,
      status:
        req.query.status === 'active' || req.query.status === 'inactive'
          ? req.query.status
          : undefined,
      segment:
        req.query.segment === 'empresa' || req.query.segment === 'persona'
          ? req.query.segment
          : undefined,
    })
    return sendPaginated(res, result.data, { page, limit, total: result.total })
  } catch (err) {
    next(err)
  }
}

export const getClientById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = await commercialService.getClient(req.params.id)
    return sendSuccess(res, client)
  } catch (err) {
    next(err)
  }
}

export const createClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = await commercialService.createClient(req.body as ClientPayload)
    return sendSuccess(res, client, 'Cliente registrado.', 201)
  } catch (err) {
    next(err)
  }
}

export const updateClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = await commercialService.updateClient(
      req.params.id,
      req.body as ClientPayload
    )
    return sendSuccess(res, client, 'Cliente actualizado.')
  } catch (err) {
    next(err)
  }
}

export const deleteClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await commercialService.deleteClient(req.params.id)
    return sendSuccess(res, null, 'Cliente eliminado.')
  } catch (err) {
    next(err)
  }
}
