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
