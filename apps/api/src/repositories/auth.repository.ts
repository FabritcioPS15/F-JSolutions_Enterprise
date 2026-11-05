export type AuthUserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
export type AuthTwoFactorMethod = 'TOTP' | 'EMAIL'

export type AuthRoleRecord = {
  id: string
  key: string
  name: string
}

export type AuthUserRecord = {
  id: string
  name: string
  email: string
  passwordHash: string
  phone: string | null
  company: string | null
  status: AuthUserStatus
  lastLoginAt: Date | null
  createdAt: Date
  updatedAt: Date
  role: AuthRoleRecord
  permissions: string[]
  twoFactorEnabled: boolean
  twoFactorMethod: AuthTwoFactorMethod | null
  twoFactorSecret: string | null
  twoFactorPendingSecret: string | null
  twoFactorConfirmedAt: Date | null
  twoFactorLastStep: number | null
}

export type TwoFactorUpdate = {
  enabled?: boolean
  method?: AuthTwoFactorMethod | null
  secret?: string | null
  pendingSecret?: string | null
  confirmedAt?: Date | null
  lastStep?: number | null
}

export type CreateAuthUserInput = {
  name: string
  email: string
  passwordHash: string
  phone?: string | null
  company?: string | null
  roleId: string
}

export interface AuthRepository {
  findByEmail(email: string): Promise<AuthUserRecord | null>
  findById(id: string): Promise<AuthUserRecord | null>
  findRoleByKey(key: string): Promise<AuthRoleRecord | null>
  createUser(input: CreateAuthUserInput): Promise<AuthUserRecord>
  touchLastLogin(id: string): Promise<void>
  updateTwoFactor(id: string, data: TwoFactorUpdate): Promise<void>
}
