import { timingSafeEqual } from 'node:crypto'
import { Request, Response, NextFunction } from 'express'
import { env } from '../config/env'
import { sendError } from '../utils/response'

export function requireAdminKey(req: Request, res: Response, next: NextFunction) {
  const expected = Buffer.from(env.ADMIN_API_KEY)
  const provided = Buffer.from(String(req.headers['x-admin-key'] ?? ''))

  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return sendError(res, 'No autorizado para acceder a la mesa de ayuda.', 401)
  }

  next()
}
