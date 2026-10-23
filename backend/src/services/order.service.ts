import { Order, OrderStatus, Cotizacion } from '../types'

interface CreateOrderInput {
  userId?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: Array<{
    productId: string
    quantity: number
  }>
  notes?: string
}

interface CreateCotizacionInput {
  empresa: string
  contacto: string
  email: string
  telefono: string
  mensaje?: string
  items?: Array<{
    productId: string
    quantity: number
  }>
}

export class OrderService {
  private mockOrders: Order[] = []
  private mockCotizaciones: Cotizacion[] = []

  async createOrder(data: CreateOrderInput): Promise<Order> {
    const items = data.items.map((item) => {
      const price = 1500 // Precio mock o resuelto de base de datos
      return {
        productId: item.productId,
        name: `Producto ${item.productId}`,
        price,
        quantity: item.quantity,
        subtotal: price * item.quantity,
      }
    })

    const subtotal = items.reduce((acc, curr) => acc + curr.subtotal, 0)
    const igv = Math.round(subtotal * 0.18 * 100) / 100
    const total = subtotal + igv

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      userId: data.userId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      items,
      subtotal,
      igv,
      total,
      status: 'pending',
      notes: data.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.mockOrders.unshift(newOrder)
    return newOrder
  }

  async getOrders(userId?: string): Promise<Order[]> {
    if (userId) {
      return this.mockOrders.filter((o) => o.userId === userId)
    }
    return this.mockOrders
  }

  async getOrderById(id: string): Promise<Order | null> {
    const order = this.mockOrders.find((o) => o.id === id)
    return order || null
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    const order = this.mockOrders.find((o) => o.id === id)
    if (!order) return null
    order.status = status
    order.updatedAt = new Date()
    return order
  }

  async createCotizacion(data: CreateCotizacionInput): Promise<Cotizacion> {
    const items = (data.items || []).map((item) => ({
      productId: item.productId,
      name: `Producto ${item.productId}`,
      price: 0,
      quantity: item.quantity,
      subtotal: 0,
    }))

    const cotizacion: Cotizacion = {
      id: `cot_${Date.now()}`,
      empresa: data.empresa,
      contacto: data.contacto,
      email: data.email,
      telefono: data.telefono,
      mensaje: data.mensaje,
      items,
      status: 'pending',
      createdAt: new Date(),
    }

    this.mockCotizaciones.unshift(cotizacion)
    return cotizacion
  }

  async getCotizaciones(): Promise<Cotizacion[]> {
    return this.mockCotizaciones
  }
}
