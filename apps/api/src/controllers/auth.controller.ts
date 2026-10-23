import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/auth.service'
import { sendSuccess, sendError } from '../utils/response'

const authService = new AuthService()

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body)
    return sendSuccess(res, result, 'Cuenta creada exitosamente', 201)
  } catch (err) { next(err) }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body.email, req.body.password)
    if (!result) return sendError(res, 'Credenciales incorrectas', 401)
    return sendSuccess(res, result, 'Sesion iniciada')
  } catch (err) { next(err) }
}

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.refresh(req.body.refreshToken)
    return sendSuccess(res, result)
  } catch (err) { next(err) }
}

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.findById(req.user!.sub)
    return sendSuccess(res, user)
  } catch (err) { next(err) }
}

export const logout = (_req: Request, res: Response) => {
  // Con JWT stateless, el logout lo maneja el cliente borrando el token
  return sendSuccess(res, null, 'Sesion cerrada')
}