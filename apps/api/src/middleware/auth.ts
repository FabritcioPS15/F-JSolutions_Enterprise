import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { sendError } from '../utils/response'
import { JwtPayload } from '../types'

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return sendError(res, 'Unauthorized - no token provided', 401)
  }

  const token = authHeader.split(' ')[1]
  try {
    req.user = verifyToken(token)
    next()
  } catch {
    return sendError(res, 'Unauthorized - invalid or expired token', 401)
  }
}

export function requireRole(...roles: JwtPayload['role'][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, 'Forbidden - insufficient permissions', 403)
    }
    next()
  }
}