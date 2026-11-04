import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { sendError } from '../utils/response'
import { JwtPayload } from '../types'
import { prismaAuthRepository } from '../repositories/prisma-auth.repository'
import { AuthService, type SafeAuthUser } from '../services/auth.service'

const authService = new AuthService(prismaAuthRepository)

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
      auth?: {
        user: SafeAuthUser
        permissions: string[]
      }
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return sendError(res, 'No autorizado: falta el token de acceso.', 401)
  }

  let payload: JwtPayload
  try {
    payload = verifyToken(authHeader.slice(7).trim())
  } catch {
    return sendError(res, 'No autorizado: token inválido o expirado.', 401)
  }

  try {
    const user = await authService.getSessionUser(payload.sub)
    if (!user) {
      return sendError(res, 'No autorizado: la cuenta no existe o está inactiva.', 401)
    }

    req.auth = { user, permissions: user.permissions }
    req.user = {
      ...payload,
      sub: user.id,
      email: user.email,
      role: user.role,
    }

    return next()
  } catch (error) {
    return next(error)
  }
}

export async function optionalAuthenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return next()
  return authenticate(req, res, next)
}

export function requirePermission(...required: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return sendError(res, 'No autorizado: se requiere una sesión válida.', 401)
    }

    const granted = new Set(req.auth.permissions)
    const allowed = required.every((permission) => granted.has(permission))

    if (!allowed) {
      return sendError(res, 'No tienes permisos para realizar esta acción.', 403)
    }

    return next()
  }
}
