import { Request, Response, NextFunction } from 'express'
import { authService } from '../services/auth.factory'
import { sendSuccess, sendError } from '../utils/response'

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

    const outcome = await authService.login(email, password)
    if (!outcome) {
      return sendError(res, 'Credenciales incorrectas.', 401)
    }

    if (outcome.kind === 'session') {
      return sendSuccess(res, outcome.session, 'Sesión iniciada')
    }

    return sendSuccess(
      res,
      {
        twoFactorRequired: true,
        method: outcome.challenge.method,
        challengeToken: outcome.challenge.challengeToken,
        expiresAt: outcome.challenge.expiresAt,
        email: outcome.challenge.email,
      },
      'Verificación en dos pasos requerida'
    )
  } catch (err) { next(err) }
}

export const verifyTwoFactor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { challengeToken, code, recoveryCode } = req.body
    const result = await authService.verifyTwoFactor({ challengeToken, code, recoveryCode })
    return sendSuccess(res, result, 'Sesión iniciada')
  } catch (err) { next(err) }
}

export const resendTwoFactor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.resendEmailChallenge(req.body.challengeToken)
    return sendSuccess(res, result, 'Código reenviado')
  } catch (err) { next(err) }
}

export const twoFactorStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.auth) return sendError(res, 'No autorizado.', 401)
    const result = await authService.getTwoFactorStatus(req.auth.user.id)
    return sendSuccess(res, result)
  } catch (err) { next(err) }
}

export const setupTwoFactor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.auth) return sendError(res, 'No autorizado.', 401)
    const result = await authService.beginTwoFactorSetup(req.auth.user.id, req.body.method)
    return sendSuccess(res, result)
  } catch (err) { next(err) }
}

export const enableTwoFactor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.auth) return sendError(res, 'No autorizado.', 401)
    const result = await authService.enableTwoFactor(req.auth.user.id, req.body.code)
    return sendSuccess(res, result, 'Verificación en dos pasos activada')
  } catch (err) { next(err) }
}

export const disableTwoFactor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.auth) return sendError(res, 'No autorizado.', 401)
    const result = await authService.disableTwoFactor(req.auth.user.id, req.body.password)
    return sendSuccess(res, result, 'Verificación en dos pasos desactivada')
  } catch (err) { next(err) }
}

export const regenerateRecoveryCodes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.auth) return sendError(res, 'No autorizado.', 401)
    const result = await authService.regenerateRecoveryCodes(req.auth.user.id, req.body.password)
    return sendSuccess(res, result, 'Códigos de recuperación actualizados')
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
