import { Product } from '../types'

interface FindAllParams {
  page: number
  limit: number
  q?: string
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  oferta?: boolean
  sort?: string
}

export class ProductService {
  // Simulación de base de datos en memoria para desarrollo
  private mockProducts: Product[] = [
    {
      id: '1',
      name: 'Servidor Dell PowerEdge R750',
      slug: 'servidor-dell-poweredge-r750',
      description: 'Servidor de rack empresarial de alto rendimiento con procesadores Intel Xeon Scalable.',
      price: 15499.0,
      oldPrice: 17200.0,
      stock: 5,
      category: 'servidores',
      brand: 'Dell Technologies',
      images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800'],
      specs: {
        Procesador: '2x Intel Xeon Silver 4314',
        RAM: '64GB DDR4 ECC RDIMM',
        Almacenamiento: '2x 960GB SSD SAS Enterprise',
        Fuente: 'Dual Redundante 800W',
      },
      badge: 'Bestseller',
      rating: 4.9,
      reviews: 14,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Switch Cisco Catalyst 9200L 48 Puertos PoE+',
      slug: 'switch-cisco-catalyst-9200l-48p-poe',
      description: 'Switch gestionable de capa 2/3 para redes empresariales con 370W de potencia PoE.',
      price: 8950.0,
      stock: 12,
      category: 'redes',
      brand: 'Cisco',
      images: ['https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800'],
      specs: {
        Puertos: '48x 1GbE PoE+ + 4x 10G SFP+',
        Capacidad: '104 Gbps switching',
        PoE: '370W disponible',
      },
      rating: 4.8,
      reviews: 22,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  async findAll(params: FindAllParams) {
    let list = [...this.mockProducts].filter((p) => p.isActive)

    if (params.q) {
      const qLower = params.q.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(qLower) ||
          p.brand.toLowerCase().includes(qLower) ||
          p.description.toLowerCase().includes(qLower)
      )
    }

    if (params.category) {
      list = list.filter((p) => p.category.toLowerCase() === params.category!.toLowerCase())
    }

    if (params.brand) {
      list = list.filter((p) => p.brand.toLowerCase() === params.brand!.toLowerCase())
    }

    if (params.minPrice !== undefined) {
      list = list.filter((p) => p.price >= params.minPrice!)
    }

    if (params.maxPrice !== undefined) {
      list = list.filter((p) => p.price <= params.maxPrice!)
    }

    if (params.oferta) {
      list = list.filter((p) => !!p.oldPrice && p.oldPrice > p.price)
    }

    // Ordenamiento
    if (params.sort === 'price_asc') list.sort((a, b) => a.price - b.price)
    else if (params.sort === 'price_desc') list.sort((a, b) => b.price - a.price)
    else if (params.sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    else list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const total = list.length
    const offset = (params.page - 1) * params.limit
    const data = list.slice(offset, offset + params.limit)

    return {
      data,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit) || 1,
      },
    }
  }

  async findById(id: string): Promise<Product | null> {
    const product = this.mockProducts.find((p) => p.id === id)
    return product || null
  }

  async create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviews' | 'isActive'>): Promise<Product> {
    const newProduct: Product = {
      ...data,
      id: String(Date.now()),
      rating: 5,
      reviews: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.mockProducts.unshift(newProduct)
    return newProduct
  }

  async update(id: string, data: Partial<Product>): Promise<Product | null> {
    const idx = this.mockProducts.findIndex((p) => p.id === id)
    if (idx === -1) return null

    this.mockProducts[idx] = {
      ...this.mockProducts[idx],
      ...data,
      updatedAt: new Date(),
    }
    return this.mockProducts[idx]
  }

  async delete(id: string): Promise<boolean> {
    const idx = this.mockProducts.findIndex((p) => p.id === id)
    if (idx === -1) return false
    this.mockProducts[idx].isActive = false
    return true
  }
}
