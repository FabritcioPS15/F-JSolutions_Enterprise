// ─── Usuario ──────────────────────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'customer' | 'staff'
  phone?: string
  company?: string
  createdAt: Date
  updatedAt: Date
}

// ─── Producto ─────────────────────────────────────────────────────────────────
export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  oldPrice?: number
  stock: number
  category: string
  brand: string
  images: string[]
  specs: Record<string, string>
  badge?: string
  rating: number
  reviews: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// ─── Orden ────────────────────────────────────────────────────────────────────
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  subtotal: number
}

export interface Order {
  id: string
  userId?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: OrderItem[]
  subtotal: number
  igv: number
  total: number
  status: OrderStatus
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// ─── Cotizacion ───────────────────────────────────────────────────────────────
export interface Cotizacion {
  id: string
  empresa: string
  contacto: string
  email: string
  telefono: string
  mensaje?: string
  items: OrderItem[]
  status: 'pending' | 'reviewed' | 'sent' | 'accepted' | 'rejected'
  createdAt: Date
}

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
  role: User['role']
  iat?: number
  exp?: number
}