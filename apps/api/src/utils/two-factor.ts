import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, randomInt, timingSafeEqual } from 'crypto'
import QRCode from 'qrcode'
import { generateSecret, generateURI, verifySync } from 'otplib'
import { env } from '../config/env'

const ENCRYPTION_ALGORITHM = 'aes-256-gcm'
const TOTP_ISSUER = 'F&J Systems'
const TOTP_PERIOD_SECONDS = 30
const RECOVERY_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const RECOVERY_CODE_COUNT = 10
const RECOVERY_CODE_LENGTH = 8

function encryptionKey() {
  return createHash('sha256').update(env.TWO_FACTOR_SECRET).digest()
}

export function encryptTwoFactorSecret(secret: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv(ENCRYPTION_ALGORITHM, encryptionKey(), iv)
  const encrypted = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return [iv, tag, encrypted].map((part) => part.toString('base64url')).join('.')
}

export function decryptTwoFactorSecret(payload: string): string {
  const [ivPart, tagPart, dataPart] = payload.split('.')
  if (!ivPart || !tagPart || !dataPart) {
    throw new Error('Secreto 2FA con formato inválido')
  }

  const decipher = createDecipheriv(
    ENCRYPTION_ALGORITHM,
    encryptionKey(),
    Buffer.from(ivPart, 'base64url')
  )
  decipher.setAuthTag(Buffer.from(tagPart, 'base64url'))
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataPart, 'base64url')),
    decipher.final(),
  ])
  return decrypted.toString('utf8')
}

export function hashTwoFactorValue(value: string): string {
  return createHmac('sha256', env.TWO_FACTOR_SECRET).update(value).digest('hex')
}

export function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  if (leftBuffer.length !== rightBuffer.length) return false
  return timingSafeEqual(leftBuffer, rightBuffer)
}

export function generateEmailCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0')
}

export function generateRecoveryCodes(): string[] {
  return Array.from({ length: RECOVERY_CODE_COUNT }, () =>
    Array.from(
      { length: RECOVERY_CODE_LENGTH },
      () => RECOVERY_CODE_ALPHABET[randomInt(0, RECOVERY_CODE_ALPHABET.length)]
    ).join('')
  )
}

export function formatRecoveryCode(code: string): string {
  return `${code.slice(0, 4)}-${code.slice(4)}`
}

export function normalizeRecoveryCode(code: string): string {
  return code.replace(/[^a-z0-9]/gi, '').toUpperCase()
}

export function hashRecoveryCode(code: string): string {
  return hashTwoFactorValue(`recovery:${normalizeRecoveryCode(code)}`)
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return email
  const visible = local.slice(0, 2)
  return `${visible}${'*'.repeat(Math.max(2, local.length - visible.length))}@${domain}`
}

export function generateTotpSecret(): string {
  return generateSecret()
}

export function totpUri(email: string, secret: string): string {
  return generateURI({ issuer: TOTP_ISSUER, label: email, secret })
}

export async function totpQrDataUrl(email: string, secret: string): Promise<string> {
  return QRCode.toDataURL(totpUri(email, secret), {
    margin: 1,
    width: 240,
    errorCorrectionLevel: 'M',
  })
}

export type TotpVerification = { valid: boolean; timeStep?: number }

export function verifyTotp(code: string, secret: string, afterTimeStep?: number): TotpVerification {
  try {
    const result = verifySync({
      token: code,
      secret,
      period: TOTP_PERIOD_SECONDS,
      epochTolerance: TOTP_PERIOD_SECONDS,
      afterTimeStep,
    })
    if (!result.valid) return { valid: false }
    return { valid: true, timeStep: 'timeStep' in result ? result.timeStep : undefined }
  } catch {
    return { valid: false }
  }
}
