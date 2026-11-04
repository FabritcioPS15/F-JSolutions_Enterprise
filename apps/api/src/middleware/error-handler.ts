import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'
import { sendError } from '../utils/response'

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public isOperational: boolean = true
  ) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

function isDatabaseUnavailable(err: Error) {
  const code = (err as { code?: string }).code
  return err.name === 'PrismaClientInitializationError' || code === 'P1000' || code === 'P1001'
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError && err.isOperational) {
    return sendError(res, err.message, err.statusCode)
  }

  if (isDatabaseUnavailable(err)) {
    logger.error('Database unavailable:', err.message)
    return sendError(
      res,
      'La base de datos no está disponible. Verifica DATABASE_URL y que PostgreSQL esté activo.',
      503
    )
  }

  if ((err as { code?: string }).code === 'P2002') {
    return sendError(
      res,
      'Ya existe un registro con ese identificador, slug o nombre único.',
      409
    )
  }

  logger.error('Unexpected error:', err)
  return sendError(res, 'Internal server error', 500)
}