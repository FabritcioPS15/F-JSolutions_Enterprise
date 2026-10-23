// Exportar tipos compartidos desde el paquete contracts
export * from '@fj-solutions/contracts'

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ─── JWT Payload ──────────────────────────────────────────────────────────────
export interface JwtPayload {
  sub: string
  email: string
  role: 'admin' | 'customer' | 'staff'
  iat?: number
  exp?: number
}