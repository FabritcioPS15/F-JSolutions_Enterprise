export enum Role {
  CUSTOMER = 'CUSTOMER',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum QuoteStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  company?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number;
  stock: number;
  brand: string;
  images: string[];
  specs?: Record<string, any>;
  badge?: string;
  rating: number;
  reviews: number;
  isActive: boolean;
  categoryId: string;
  category?: Category;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId?: string;
  user?: User;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  subtotal: number;
  igv: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QuoteItem {
  productId: string;
  name: string;
  quantity: number;
}

export interface Quote {
  id: string;
  empresa: string;
  contacto: string;
  email: string;
  telefono: string;
  mensaje?: string;
  items?: QuoteItem[];
  status: QuoteStatus;
  createdAt: Date;
}

export interface ContactMessage {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
  asunto: string;
  mensaje: string;
  createdAt: Date;
}
