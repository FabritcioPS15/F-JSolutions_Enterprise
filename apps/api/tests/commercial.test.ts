import type { admin } from '@fj-solutions/contracts'
import type {
  ClientListFilters,
  ClientListResult,
  ClientWriteInput,
  CommercialRepository,
  QuoteListFilters,
  QuoteListResult,
  QuoteSequence,
  QuoteWriteInput,
} from '../src/repositories/commercial.repository'
import {
  CommercialService,
  computeQuoteAmounts,
  parseQuoteDate,
} from '../src/services/commercial.service'

const VALID_PRODUCT_ID = '11111111-1111-4111-8111-111111111111'
const MISSING_PRODUCT_ID = '22222222-2222-4222-8222-222222222222'

class FakeCommercialRepository implements CommercialRepository {
  clients: admin.Client[] = []
  quotes: admin.Quote[] = []
  productIds = new Set<string>([VALID_PRODUCT_ID])
  lastQuoteInput: QuoteWriteInput | null = null
  history: Array<{ quoteId: string; from?: admin.QuoteStatus; to: admin.QuoteStatus }> = []
  sequence = 0

  async listClients(filters: ClientListFilters): Promise<ClientListResult> {
    const term = filters.q?.toLowerCase()
    const list = this.clients.filter((client) => {
      const matchesTerm =
        !term ||
        client.name.toLowerCase().includes(term) ||
        client.company.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term)
      const matchesStatus = !filters.status || client.status === filters.status
      const matchesSegment = !filters.segment || client.segment === filters.segment
      return matchesTerm && matchesStatus && matchesSegment
    })
    return { data: list, total: list.length }
  }

  async findClientById(id: string) {
    return this.clients.find((client) => client.id === id) ?? null
  }

  async findClientByEmail(email: string) {
    const target = email.trim().toLowerCase()
    return this.clients.find((client) => client.email.toLowerCase() === target) ?? null
  }

  async findClientByDocument(documentType: 'dni' | 'ruc', documentNumber: string) {
    return (
      this.clients.find(
        (client) =>
          client.documentType === documentType &&
          client.documentNumber === documentNumber
      ) ?? null
    )
  }

  async createClient(input: ClientWriteInput): Promise<admin.Client> {
    const now = new Date('2026-03-01T10:00:00Z').toISOString()
    const client: admin.Client = {
      id: input.id ?? `cliente-${this.clients.length + 1}`,
      name: input.name,
      company: input.company ?? '',
      documentType: input.documentType ?? undefined,
      documentNumber: input.documentNumber ?? undefined,
      email: input.email ?? '',
      phone: input.phone ?? '',
      city: input.city ?? '',
      address: input.address ?? '',
      segment: input.segment,
      status: input.status,
      notes: input.notes ?? '',
      createdAt: now,
      updatedAt: now,
    }
    this.clients.push(client)
    return client
  }

  async updateClient(id: string, input: ClientWriteInput): Promise<admin.Client | null> {
    const index = this.clients.findIndex((client) => client.id === id)
    if (index === -1) return null
    const current = this.clients[index]
    const updated: admin.Client = {
      ...current,
      name: input.name,
      company: input.company ?? '',
      documentType: input.documentType ?? undefined,
      documentNumber: input.documentNumber ?? undefined,
      email: input.email ?? '',
      phone: input.phone ?? '',
      city: input.city ?? '',
      address: input.address ?? '',
      segment: input.segment,
      status: input.status,
      notes: input.notes ?? '',
      updatedAt: new Date('2026-03-02T10:00:00Z').toISOString(),
    }
    this.clients[index] = updated
    return updated
  }

  async deleteClient(id: string) {
    const exists = this.clients.some((client) => client.id === id)
    if (!exists) return false
    this.clients = this.clients.filter((client) => client.id !== id)
    return true
  }

  async listQuotes(filters: QuoteListFilters): Promise<QuoteListResult> {
    const list = this.quotes.filter(
      (quote) => !filters.status || quote.status === filters.status
    )
    return { data: list, total: list.length }
  }

  async findQuoteById(id: string) {
    return this.quotes.find((quote) => quote.id === id) ?? null
  }

  async createQuote(input: QuoteWriteInput): Promise<admin.Quote> {
    this.lastQuoteInput = input
    const quote = this.toQuote(input, input.id ?? `cotizacion-${this.quotes.length + 1}`)
    this.quotes.unshift(quote)
    this.history.push({ quoteId: quote.id, to: quote.status })
    return quote
  }

  async updateQuote(id: string, input: QuoteWriteInput): Promise<admin.Quote | null> {
    this.lastQuoteInput = input
    const index = this.quotes.findIndex((quote) => quote.id === id)
    if (index === -1) return null
    const previous = this.quotes[index]
    if (previous.status !== input.status) {
      this.history.push({ quoteId: id, from: previous.status, to: input.status })
    }
    const updated = this.toQuote(input, id)
    this.quotes[index] = updated
    return updated
  }

  async updateQuoteStatus(
    id: string,
    status: admin.QuoteStatus
  ): Promise<admin.Quote | null> {
    const index = this.quotes.findIndex((quote) => quote.id === id)
    if (index === -1) return null
    const previous = this.quotes[index]
    if (previous.status !== status) {
      this.history.push({ quoteId: id, from: previous.status, to: status })
    }
    this.quotes[index] = {
      ...previous,
      status,
      updatedAt: new Date('2026-03-03T10:00:00Z').toISOString(),
    }
    return this.quotes[index]
  }

  async deleteQuote(id: string) {
    const exists = this.quotes.some((quote) => quote.id === id)
    if (!exists) return false
    this.quotes = this.quotes.filter((quote) => quote.id !== id)
    return true
  }

  async nextQuoteSequence(): Promise<QuoteSequence> {
    this.sequence += 1
    return {
      code: `COT-${String(this.sequence).padStart(5, '0')}`,
      sequenceNumber: this.sequence,
    }
  }

  async findExistingProductIds(ids: string[]) {
    return new Set(ids.filter((id) => this.productIds.has(id)))
  }

  private toQuote(input: QuoteWriteInput, id: string): admin.Quote {
    const now = new Date('2026-03-01T10:00:00Z').toISOString()
    return {
      id,
      code: input.code,
      clientId: input.clientId ?? undefined,
      clientName: input.clientName,
      clientCompany: input.clientCompany ?? '',
      clientEmail: input.clientEmail ?? '',
      clientPhone: input.clientPhone ?? '',
      status: input.status,
      items: input.items.map((item, index) => ({
        id: `linea-${index + 1}`,
        productId: item.productId ?? undefined,
        name: item.name,
        sku: item.sku ?? undefined,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      notes: input.notes ?? '',
      validUntil: input.validUntil ? input.validUntil.toISOString().slice(0, 10) : '',
      createdAt: now,
      updatedAt: now,
    }
  }
}

function seedClient(
  repository: FakeCommercialRepository,
  overrides: Partial<admin.Client> = {}
): admin.Client {
  const now = new Date('2026-02-01T10:00:00Z').toISOString()
  const client: admin.Client = {
    id: 'cliente-banco',
    name: 'María Ríos',
    company: 'Banco Andino',
    documentType: 'ruc',
    documentNumber: '20123456789',
    email: 'compras@bancoandino.pe',
    phone: '+51 987 654 321',
    city: 'Lima',
    address: 'Av. Ejemplo 123',
    segment: 'empresa',
    status: 'active',
    notes: '',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
  repository.clients.push(client)
  return client
}

describe('CommercialService — clientes', () => {
  it('registra un cliente y bloquea documentos duplicados', async () => {
    const repository = new FakeCommercialRepository()
    seedClient(repository)
    const service = new CommercialService(repository)

    const created = await service.createClient({
      name: 'Carlos Pérez',
      company: 'Redes del Sur',
      documentType: 'dni',
      documentNumber: '45678901',
      email: 'carlos@redes.pe',
      segment: 'empresa',
    })

    expect(created.name).toBe('Carlos Pérez')
    expect(created.documentNumber).toBe('45678901')

    await expect(
      service.createClient({
        name: 'Otra persona',
        documentType: 'ruc',
        documentNumber: '20123456789',
      })
    ).rejects.toMatchObject({ statusCode: 409 })
  })

  it('valida la longitud del documento y actualiza parcialmente', async () => {
    const repository = new FakeCommercialRepository()
    seedClient(repository)
    const service = new CommercialService(repository)

    await expect(
      service.createClient({ name: 'Sin RUC válido', documentType: 'ruc', documentNumber: '123' })
    ).rejects.toMatchObject({ statusCode: 400 })

    const updated = await service.updateClient('cliente-banco', { city: 'Arequipa' })

    expect(updated.city).toBe('Arequipa')
    expect(updated.company).toBe('Banco Andino')
    expect(updated.documentNumber).toBe('20123456789')
  })

  it('devuelve 404 al eliminar un cliente inexistente', async () => {
    const service = new CommercialService(new FakeCommercialRepository())
    await expect(service.deleteClient('fantasma')).rejects.toMatchObject({ statusCode: 404 })
  })
})

describe('CommercialService — cotizaciones', () => {
  it('calcula totales con IGV incluido y usa la secuencia COT', async () => {
    const repository = new FakeCommercialRepository()
    const client = seedClient(repository)
    const service = new CommercialService(repository)

    const quote = await service.createQuote(
      {
        clientId: client.id,
        clientName: client.name,
        clientEmail: client.email,
        status: 'draft',
        items: [
          { productId: null, name: 'Laptop', quantity: 2, unitPrice: 590 },
          { productId: null, name: 'Mouse', quantity: 1, unitPrice: 118 },
        ],
        validUntil: '2026-03-30',
      },
      'user-1'
    )

    expect(quote.code).toBe('COT-00001')
    expect(repository.lastQuoteInput?.amounts).toEqual({
      subtotal: 1100,
      discountTotal: 0,
      taxRate: 18,
      taxAmount: 198,
      total: 1298,
    })
    expect(repository.lastQuoteInput?.clientId).toBe(client.id)
    expect(repository.lastQuoteInput?.clientCompany).toBe('Banco Andino')
    expect(quote.items).toHaveLength(2)
    expect(repository.history).toHaveLength(1)
  })

  it('rechaza clientes inexistentes y cotizaciones enviadas sin productos', async () => {
    const repository = new FakeCommercialRepository()
    const service = new CommercialService(repository)

    await expect(
      service.createQuote({
        clientId: 'cliente-fantasma',
        clientName: 'Cliente',
        email: undefined,
      } as never)
    ).rejects.toMatchObject({ statusCode: 400 })

    await expect(
      service.createQuote({
        clientName: 'Cliente manual',
        clientEmail: 'cliente@empresa.pe',
        status: 'sent',
        items: [],
      })
    ).rejects.toMatchObject({ statusCode: 400 })
  })

  it('actualiza la cotización conservando el código y registra el cambio de estado', async () => {
    const repository = new FakeCommercialRepository()
    const client = seedClient(repository)
    const service = new CommercialService(repository)
    const created = await service.createQuote({
      clientId: client.id,
      clientName: client.name,
      clientEmail: client.email,
      status: 'draft',
      items: [{ name: 'Monitor', quantity: 1, unitPrice: 1000 }],
    })

    const updated = await service.updateQuote(
      created.id,
      {
        status: 'sent',
        items: [{ name: 'Monitor', quantity: 3, unitPrice: 1000 }],
        notes: 'Entrega en 48 horas.',
      },
      'user-2'
    )

    expect(updated.code).toBe(created.code)
    expect(updated.status).toBe('sent')
    expect(updated.items[0].quantity).toBe(3)
    expect(repository.lastQuoteInput?.amounts.total).toBe(3000)
    expect(repository.history.at(-1)).toMatchObject({
      quoteId: created.id,
      from: 'draft',
      to: 'sent',
    })
  })

  it('cambia el estado y devuelve 404 cuando la cotización no existe', async () => {
    const repository = new FakeCommercialRepository()
    const service = new CommercialService(repository)
    const quote = await service.createQuote({
      clientName: 'Cliente manual',
      clientEmail: 'cliente@empresa.pe',
      items: [{ name: 'Equipo', quantity: 1, unitPrice: 100 }],
    })

    const approved = await service.updateQuoteStatus(quote.id, 'approved', 'user-1')
    expect(approved.status).toBe('approved')

    await expect(
      service.updateQuoteStatus('cotizacion-fantasma', 'approved')
    ).rejects.toMatchObject({ statusCode: 404 })
  })

  it('convierte una solicitud web en una cotización NEW vinculada al cliente', async () => {
    const repository = new FakeCommercialRepository()
    seedClient(repository)
    const service = new CommercialService(repository)

    const quote = await service.createPublicQuote({
      contactName: 'María Ríos',
      contactEmail: 'COMPRAS@BANCOANDINO.PE',
      contactPhone: '+51 987 654 321',
      companyName: 'Banco Andino',
      generalNotes: 'Necesitamos 10 equipos.',
      contactPreference: 'whatsapp',
      items: [
        { productId: VALID_PRODUCT_ID, name: 'Laptop', sku: 'LAP-01', quantity: 10 },
        { productId: MISSING_PRODUCT_ID, name: 'Monitor', quantity: 2 },
        { productId: 'producto-estatico', name: 'Teclado', quantity: 1 },
      ],
    })

    expect(quote.status).toBe('new')
    expect(quote.clientId).toBe('cliente-banco')
    expect(repository.clients).toHaveLength(1)
    expect(quote.items[0].productId).toBe(VALID_PRODUCT_ID)
    expect(quote.items[1].productId).toBeUndefined()
    expect(quote.items[2].productId).toBeUndefined()
    expect(repository.lastQuoteInput?.amounts.total).toBe(0)
    expect(repository.lastQuoteInput?.internalNotes).toContain('WhatsApp')
  })

  it('crea el cliente cuando la solicitud web no coincide con el directorio', async () => {
    const repository = new FakeCommercialRepository()
    const service = new CommercialService(repository)

    const quote = await service.createPublicQuote({
      contactName: 'Lucía Torres',
      contactEmail: 'lucia@estudio.pe',
      contactPhone: '+51 999 888 777',
      documentType: 'dni',
      documentNumber: '12345678',
      items: [{ name: 'Impresora', quantity: 1 }],
    })

    expect(repository.clients).toHaveLength(1)
    expect(repository.clients[0]).toMatchObject({
      name: 'Lucía Torres',
      segment: 'persona',
      documentNumber: '12345678',
    })
    expect(quote.clientId).toBe(repository.clients[0].id)
  })
})

describe('Utilidades de cotización', () => {
  it('calcula el IGV incluido y rechaza fechas inválidas', () => {
    expect(computeQuoteAmounts([{ subtotal: 1180 }], 18)).toEqual({
      subtotal: 1000,
      discountTotal: 0,
      taxRate: 18,
      taxAmount: 180,
      total: 1180,
    })
    expect(computeQuoteAmounts([{ subtotal: 500 }], 0).total).toBe(500)
    expect(parseQuoteDate('2026-04-15')?.toISOString()).toBe('2026-04-15T00:00:00.000Z')
    expect(parseQuoteDate('')).toBeNull()
    expect(() => parseQuoteDate('no-es-fecha')).toThrow('La fecha de vigencia no es válida.')
  })
})
