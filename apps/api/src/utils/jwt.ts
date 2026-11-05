import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { JwtPayload } from '../types'

export type TwoFactorMethod = 'TOTP' | 'EMAIL'

export type TwoFactorTokenPayload = {
  sub: string
  method: TwoFactorMethod
  scope: '2fa'
  iat?: number
  exp?: number
}

const TWO_FACTOR_TOKEN_TTL = '10m'

export function signToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions)
}

export function signTwoFactorToken(payload: { sub: string; method: TwoFactorMethod }): string {
  const body: Omit<TwoFactorTokenPayload, 'iat' | 'exp'> = { ...payload, scope: '2fa' }
  return jwt.sign(body, env.TWO_FACTOR_SECRET, { expiresIn: TWO_FACTOR_TOKEN_TTL })
}

export function verifyTwoFactorToken(token: string): TwoFactorTokenPayload {
  const payload = jwt.verify(token, env.TWO_FACTOR_SECRET) as TwoFactorTokenPayload

  if (
    payload.scope !== '2fa' ||
    (payload.method !== 'TOTP' && payload.method !== 'EMAIL') ||
    typeof payload.sub !== 'string'
  ) {
    throw new Error('Token de verificación inválido')
  }

  return payload
}

export function signRefreshToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions)
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload
}