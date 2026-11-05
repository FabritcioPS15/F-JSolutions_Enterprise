import type { NextRequest } from 'next/server'

export function isCrossOrigin(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (!origin) return false

  try {
    return new URL(origin).host !== request.headers.get('host')
  } catch {
    return true
  }
}

export function readText(value: unknown, maxLength = 200) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export function isTwoFactorMethod(value: unknown): value is 'TOTP' | 'EMAIL' {
  return value === 'TOTP' || value === 'EMAIL'
}
