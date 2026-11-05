import {
  InventoryMovementType as PrismaInventoryMovementType,
  Prisma,
  type InventoryMovement as PrismaInventoryMovement,
} from '@prisma/client'
import type { admin } from '@fj-solutions/contracts'
import { prisma } from '../config/database'
import type {
  InventoryListFilters,
  InventoryMovementResult,
  InventoryMovementWriteInput,
  InventoryRepository,
} from './inventory.repository'

function toPrismaType(
  type: admin.InventoryMovementType
): PrismaInventoryMovementType {
  if (type === 'in') return PrismaInventoryMovementType.IN
  if (type === 'out') return PrismaInventoryMovementType.OUT
  return PrismaInventoryMovementType.ADJUSTMENT
}

function toAdminMovement(movement: PrismaInventoryMovement): admin.InventoryMovement {
  return {
    id: movement.id,
    productId: movement.productId ?? '',
    productName: movement.productName,
    sku: movement.sku ?? '',
    type:
      movement.type === PrismaInventoryMovementType.IN
        ? 'in'
        : movement.type === PrismaInventoryMovementType.OUT
          ? 'out'
          : 'adjustment',
    quantity: movement.quantity,
    previousStock: movement.previousStock,
    resultingStock: movement.resultingStock,
    reason: movement.reason,
    note: movement.note ?? undefined,
    createdAt: movement.createdAt.toISOString(),
  }
}

export class PrismaInventoryRepository implements InventoryRepository {
  async list(filters: InventoryListFilters) {
    const where: Prisma.InventoryMovementWhereInput = {}
    if (filters.type) where.type = toPrismaType(filters.type)
    if (filters.productId) where.productId = filters.productId
    if (filters.q) {
      where.OR = [
        { productName: { contains: filters.q, mode: 'insensitive' } },
        { sku: { contains: filters.q, mode: 'insensitive' } },
        { reason: { contains: filters.q, mode: 'insensitive' } },
        { note: { contains: filters.q, mode: 'insensitive' } },
      ]
    }

    const movements = await prisma.inventoryMovement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(filters.limit ?? 200, 1), 500),
    })
    return movements.map(toAdminMovement)
  }

  async findProduct(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true, name: true, sku: true, stock: true },
    })
    if (!product) return null
    return {
      id: product.id,
      name: product.name,
      sku: product.sku ?? '',
      stock: product.stock,
    }
  }

  async createMovement(
    productId: string,
    input: InventoryMovementWriteInput
  ): Promise<InventoryMovementResult> {
    return prisma.$transaction(async (tx): Promise<InventoryMovementResult> => {
      const product = await tx.product.findUnique({
        where: { id: productId },
        select: { id: true, name: true, sku: true, stock: true },
      })
      if (!product) return { status: 'product-not-found' }

      const previousStock = product.stock
      const resultingStock =
        input.type === 'in'
          ? previousStock + input.quantity
          : input.type === 'out'
            ? previousStock - input.quantity
            : input.quantity

      if (input.type === 'out' && input.quantity > previousStock) {
        return { status: 'insufficient-stock', available: previousStock }
      }
      if (resultingStock === previousStock) {
        return { status: 'no-change', stock: previousStock }
      }

      await tx.product.update({
        where: { id: productId },
        data: { stock: resultingStock },
      })
      const movement = await tx.inventoryMovement.create({
        data: {
          productId,
          productName: product.name,
          sku: product.sku,
          type: toPrismaType(input.type),
          quantity: input.quantity,
          previousStock,
          resultingStock,
          reason: input.reason,
          note: input.note ?? null,
          actorId: input.actorId ?? null,
        },
      })

      return { status: 'created', movement: toAdminMovement(movement) }
    })
  }
}

export const prismaInventoryRepository = new PrismaInventoryRepository()
