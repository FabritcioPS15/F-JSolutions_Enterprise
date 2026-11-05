import type { admin } from '@fj-solutions/contracts'
import type {
  InventoryListFilters,
  InventoryMovementResult,
  InventoryMovementWriteInput,
  InventoryProduct,
  InventoryRepository,
} from '../src/repositories/inventory.repository'
import { InventoryService } from '../src/services/inventory.service'

const PRODUCT_ID = '11111111-1111-4111-8111-111111111111'
const OTHER_ID = '22222222-2222-4222-8222-222222222222'
const NOW = '2026-11-04T10:00:00.000Z'

function product(overrides: Partial<InventoryProduct> = {}): InventoryProduct {
  return {
    id: PRODUCT_ID,
    name: 'Laptop Lenovo ThinkPad',
    sku: 'LEN-T14',
    stock: 10,
    ...overrides,
  }
}

function movement(
  overrides: Partial<admin.InventoryMovement> &
    Pick<admin.InventoryMovement, 'id' | 'type' | 'quantity' | 'createdAt'>
): admin.InventoryMovement {
  return {
    id: overrides.id,
    productId: PRODUCT_ID,
    productName: 'Laptop Lenovo ThinkPad',
    sku: 'LEN-T14',
    type: overrides.type,
    quantity: overrides.quantity,
    previousStock: 10,
    resultingStock: 12,
    reason: 'Compra a proveedor',
    note: '',
    createdAt: overrides.createdAt,
    ...overrides,
  }
}

class FakeInventoryRepository implements InventoryRepository {
  products = new Map<string, InventoryProduct>()
  movements: admin.InventoryMovement[] = []

  async list(filters: InventoryListFilters) {
    return this.movements
      .filter((item) => {
        const matchesType = !filters.type || item.type === filters.type
        const matchesProduct =
          !filters.productId || item.productId === filters.productId
        const matchesQuery =
          !filters.q ||
          `${item.productName} ${item.sku} ${item.reason} ${item.note ?? ''}`
            .toLowerCase()
            .includes(filters.q.toLowerCase())
        return matchesType && matchesProduct && matchesQuery
      })
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, filters.limit ?? 200)
  }

  async findProduct(id: string) {
    return this.products.get(id) ?? null
  }

  async createMovement(
    productId: string,
    input: InventoryMovementWriteInput
  ): Promise<InventoryMovementResult> {
    const item = this.products.get(productId)
    if (!item) return { status: 'product-not-found' }

    const resultingStock =
      input.type === 'in'
        ? item.stock + input.quantity
        : input.type === 'out'
          ? item.stock - input.quantity
          : input.quantity

    if (input.type === 'out' && input.quantity > item.stock) {
      return { status: 'insufficient-stock', available: item.stock }
    }
    if (resultingStock === item.stock) {
      return { status: 'no-change', stock: item.stock }
    }

    const created: admin.InventoryMovement = {
      id: `movement-${this.movements.length + 1}`,
      productId,
      productName: item.name,
      sku: item.sku,
      type: input.type,
      quantity: input.quantity,
      previousStock: item.stock,
      resultingStock,
      reason: input.reason,
      note: input.note,
      createdAt: NOW,
    }
    item.stock = resultingStock
    this.movements.unshift(created)
    return { status: 'created', movement: created }
  }
}

function createFixture() {
  const repository = new FakeInventoryRepository()
  repository.products.set(PRODUCT_ID, product())
  repository.products.set(OTHER_ID, product({ id: OTHER_ID, name: 'Monitor Dell', sku: 'DELL-24' }))
  return { repository, service: new InventoryService(repository) }
}

describe('InventoryService', () => {
  it('lista los movimientos con filtros de texto, tipo, producto y límite', async () => {
    const { repository, service } = createFixture()
    repository.movements = [
      movement({ id: 'm1', type: 'in', quantity: 2, createdAt: '2026-11-01T10:00:00.000Z', reason: 'Compra' }),
      movement({ id: 'm2', type: 'out', quantity: 1, createdAt: '2026-11-02T10:00:00.000Z', reason: 'Venta' }),
      movement({ id: 'm3', type: 'out', quantity: 3, createdAt: '2026-11-03T10:00:00.000Z', productId: OTHER_ID, productName: 'Monitor Dell', reason: 'Venta' }),
    ]

    await expect(service.list({})).resolves.toHaveLength(3)
    await expect(service.list({ type: 'out' })).resolves.toHaveLength(2)
    await expect(service.list({ productId: OTHER_ID })).resolves.toHaveLength(1)
    await expect(service.list({ q: 'monitor' })).resolves.toHaveLength(1)
    await expect(service.list({ limit: 2 })).resolves.toHaveLength(2)
    await expect(service.list({ q: 'compra' })).resolves.toHaveLength(1)
  })

  it('rechaza un producto que no es UUID', async () => {
    const { service } = createFixture()
    await expect(
      service.register({ productId: 'laptop-lenovo', type: 'in', quantity: 1 })
    ).rejects.toThrow('El producto debe estar registrado en la base de datos.')
  })

  it('rechaza un tipo de movimiento inválido', async () => {
    const { service } = createFixture()
    await expect(
      service.register({
        productId: PRODUCT_ID,
        type: 'transfer' as admin.InventoryMovementType,
        quantity: 1,
      })
    ).rejects.toThrow('El tipo de movimiento no es válido.')
  })

  it('exige cantidades positivas salvo en ajustes', async () => {
    const { service } = createFixture()
    await expect(
      service.register({ productId: PRODUCT_ID, type: 'in', quantity: 0 })
    ).rejects.toThrow('La cantidad debe ser mayor que cero.')
    await expect(
      service.register({ productId: PRODUCT_ID, type: 'out', quantity: -1 })
    ).rejects.toThrow('La cantidad debe ser mayor que cero.')
    await expect(
      service.register({ productId: PRODUCT_ID, type: 'adjustment', quantity: -1 })
    ).rejects.toThrow('El stock ajustado no puede ser negativo.')
  })

  it('responde 404 si el producto no existe', async () => {
    const { service } = createFixture()
    await expect(
      service.register({
        productId: '99999999-9999-4999-8999-999999999999',
        type: 'in',
        quantity: 1,
      })
    ).rejects.toThrow('Producto no encontrado.')
  })

  it('bloquea una salida mayor al stock disponible', async () => {
    const { service } = createFixture()
    await expect(
      service.register({ productId: PRODUCT_ID, type: 'out', quantity: 11 })
    ).rejects.toThrow('Solo hay 10 unidades disponibles.')
  })

  it('rechaza un ajuste que no cambia el stock', async () => {
    const { service } = createFixture()
    await expect(
      service.register({ productId: PRODUCT_ID, type: 'adjustment', quantity: 10 })
    ).rejects.toThrow('El stock resultante es igual al actual.')
  })

  it('registra una entrada, actualiza el stock y normaliza el motivo', async () => {
    const { repository, service } = createFixture()

    const created = await service.register({
      productId: PRODUCT_ID,
      type: 'in',
      quantity: 5,
      reason: '  Compra a proveedor  ',
      note: '  Guía 001-2026  ',
    })

    expect(created).toMatchObject({
      productId: PRODUCT_ID,
      type: 'in',
      quantity: 5,
      previousStock: 10,
      resultingStock: 15,
      reason: 'Compra a proveedor',
      note: 'Guía 001-2026',
    })
    expect(repository.products.get(PRODUCT_ID)?.stock).toBe(15)
  })

  it('usa un motivo por defecto cuando el campo viene vacío', async () => {
    const { service } = createFixture()
    const created = await service.register({
      productId: PRODUCT_ID,
      type: 'in',
      quantity: 2,
      reason: '   ',
    })
    expect(created.reason).toBe('Movimiento manual')
    expect(created.note).toBeUndefined()
  })

  it('registra una salida y descuenta el stock', async () => {
    const { repository, service } = createFixture()
    const created = await service.register({
      productId: PRODUCT_ID,
      type: 'out',
      quantity: 4,
      reason: 'Venta directa',
    })

    expect(created.resultingStock).toBe(6)
    expect(repository.products.get(PRODUCT_ID)?.stock).toBe(6)
  })

  it('registra un ajuste y fija el stock real', async () => {
    const { repository, service } = createFixture()
    const created = await service.register({
      productId: PRODUCT_ID,
      type: 'adjustment',
      quantity: 3,
      reason: 'Conteo físico',
    })

    expect(created.previousStock).toBe(10)
    expect(created.resultingStock).toBe(3)
    expect(repository.products.get(PRODUCT_ID)?.stock).toBe(3)
  })
})
