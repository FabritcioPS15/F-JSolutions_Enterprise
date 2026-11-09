import type { AdminUserRole, AdminUserStatus } from '@/lib/admin/types'

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

export type ManagedUser = {
  id: string
  name: string
  email: string
  phone: string
  role: AdminUserRole
  status: AdminUserStatus
  twoFactorEnabled: boolean
  seeded: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
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
