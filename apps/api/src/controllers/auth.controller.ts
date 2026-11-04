import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/auth.service'
import { prismaAuthRepository } from '../repositories/prisma-auth.repository'
import { sendSuccess, sendError } from '../utils/response'

const authService = new AuthService(prismaAuthRepository)

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, phone, company, roleKey } = req.body
    const result = await authService.register({ name, email, password, phone, company, roleKey })
    return sendSuccess(res, result, 'Cuenta creada correctamente', 201)
  } catch (err) { next(err) }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    if (typeof email !== 'string' || typeof password !== 'string') {
      return sendError(res, 'Credenciales incorrectas.', 401)
    }

    const result = await authService.login(email, password)
    if (!result) {
      return sendError(res, 'Credenciales incorrectas.', 401)
    }

    return sendSuccess(res, result, 'Sesión iniciada')
  } catch (err) { next(err) }
}

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.body?.refreshToken
    if (typeof token !== 'string' || token.length === 0) {
      return sendError(res, 'La sesión expiró. Inicia sesión nuevamente.', 401)
    }

    const result = await authService.refresh(token)
    return sendSuccess(res, result)
  } catch (err) { next(err) }
}

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.auth) {
      return sendError(res, 'No autorizado.', 401)
    }

    return sendSuccess(res, req.auth.user)
  } catch (err) { next(err) }
}

export const logout = (_req: Request, res: Response) => {
  // Los JWT son stateless: el cliente descarta los tokens y la cookie de sesión.
  return sendSuccess(res, null, 'Sesión cerrada')
}
