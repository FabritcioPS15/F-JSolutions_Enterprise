import type { admin } from '@fj-solutions/contracts'
import { AppError } from '../middleware/error-handler'
import { prismaInventoryRepository } from '../repositories/prisma-inventory.repository'
import type {
  InventoryListFilters,
  InventoryMovementWriteInput,
  InventoryRepository,
} from '../repositories/inventory.repository'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const TYPES: admin.InventoryMovementType[] = ['in', 'out', 'adjustment']

export class InventoryService {
  constructor(
    private readonly repository: InventoryRepository = prismaInventoryRepository
  ) {}

  async list(filters: InventoryListFilters) {
    return this.repository.list(filters)
  }

  async register(payload: Partial<admin.InventoryMovementInput> & { actorId?: string }) {
    const productId = String(payload.productId ?? '').trim()
    if (!productId) {
      throw new AppError('Selecciona un producto válido.', 400)
    }
    if (!UUID.test(productId)) {
      throw new AppError('El producto debe estar registrado en la base de datos.', 400)
    }

    const type = payload.type
    if (!type || !TYPES.includes(type)) {
      throw new AppError('El tipo de movimiento no es válido.', 400)
    }

    const quantity = Math.trunc(Number(payload.quantity))
    if (!Number.isFinite(quantity)) {
      throw new AppError('Ingresa una cantidad válida.', 400)
    }
    if (type === 'adjustment' && quantity < 0) {
      throw new AppError('El stock ajustado no puede ser negativo.', 400)
    }
    if (type !== 'adjustment' && quantity <= 0) {
      throw new AppError('La cantidad debe ser mayor que cero.', 400)
    }

    const product = await this.repository.findProduct(productId)
    if (!product) {
      throw new AppError('Producto no encontrado.', 404)
    }

    const input: InventoryMovementWriteInput = {
      type,
      quantity,
      reason: String(payload.reason ?? '').trim() || 'Movimiento manual',
      note: String(payload.note ?? '').trim() || undefined,
      actorId: payload.actorId,
    }

    const result = await this.repository.createMovement(productId, input)

    if (result.status === 'product-not-found') {
      throw new AppError('Producto no encontrado.', 404)
    }
    if (result.status === 'insufficient-stock') {
      throw new AppError(
        `Solo hay ${result.available} unidades disponibles.`,
        400
      )
    }
    if (result.status === 'no-change') {
      throw new AppError('El stock resultante es igual al actual.', 400)
    }

    return result.movement
  }
}

export const inventoryService = new InventoryService()
