export type TwoFactorMethod = 'TOTP' | 'EMAIL'

export type TwoFactorStatus = {
  enabled: boolean
  method: TwoFactorMethod | null
  confirmedAt: string | null
  recoveryCodesRemaining: number
}

export type TwoFactorSetupResult = {
  method: TwoFactorMethod
  email?: string
  qrDataUrl?: string
  secret?: string
  expiresAt?: string
  delivered?: boolean
}

export type SessionUser = {
  id: string
  name: string
  email: string
  role: string
  roleName: string
  permissions: string[]
  phone: string | null
  company: string | null
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}
