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

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError && err.isOperational) {
    return sendError(res, err.message, err.statusCode)
  }

  logger.error('Unexpected error:', err)
  return sendError(res, 'Internal server error', 500)
}