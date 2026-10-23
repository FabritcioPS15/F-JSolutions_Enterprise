// ─── Producto ──────────────────────────────────────────────────────────────────
export type Product = {
  id: string
  name: string
  category: string
  brand: string
  price: number
  oldPrice?: number
  badge?: string
  image: string
  rating: number
  reviews: number
  specs: string[]
  stock: 'in' | 'low'
}

// ─── Carrito ───────────────────────────────────────────────────────────────────
export type CartItem = {
  product: Product
  quantity: number
}

export type Cart = {
  items: CartItem[]
  count: number
  total: number
}

// ─── Cotizacion ────────────────────────────────────────────────────────────────
export type CotizacionItem = {
  productId: string
  name: string
  quantity: number
  price: number
}

export type Cotizacion = {
  id?: string
  empresa: string
  contacto: string
  email: string
  telefono: string
  mensaje?: string
  items: CotizacionItem[]
  createdAt?: string
}

// ─── Blog ──────────────────────────────────────────────────────────────────────
export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  tags: string[]
  coverImage?: string
}

// ─── Servicio ──────────────────────────────────────────────────────────────────
export type Servicio = {
  slug: string
  title: string
  description: string
  icon: string
  features: string[]
  price?: string
}

// ─── Formulario de contacto ────────────────────────────────────────────────────
export type ContactForm = {
  nombre: string
  email: string
  telefono?: string
  empresa?: string
  mensaje: string
  asunto: 'ventas' | 'soporte' | 'cotizacion' | 'general'
}