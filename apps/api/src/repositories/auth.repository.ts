export type AuthUserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

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
}
