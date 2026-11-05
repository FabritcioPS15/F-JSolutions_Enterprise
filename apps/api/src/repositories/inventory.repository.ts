import type { admin } from '@fj-solutions/contracts'

export type InventoryListFilters = {
  q?: string
  type?: admin.InventoryMovementType
  productId?: string
  limit?: number
}

export type InventoryProduct = {
  id: string
  name: string
  sku: string
  stock: number
}

export type InventoryMovementWriteInput = {
  type: admin.InventoryMovementType
  quantity: number
  reason: string
  note?: string
  actorId?: string
}

export type InventoryMovementResult =
  | { status: 'created'; movement: admin.InventoryMovement }
  | { status: 'product-not-found' }
  | { status: 'insufficient-stock'; available: number }
  | { status: 'no-change'; stock: number }

export interface InventoryRepository {
  list(filters: InventoryListFilters): Promise<admin.InventoryMovement[]>
  findProduct(id: string): Promise<InventoryProduct | null>
  createMovement(
    productId: string,
    input: InventoryMovementWriteInput
  ): Promise<InventoryMovementResult>
}
