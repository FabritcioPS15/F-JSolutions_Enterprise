import { NextFunction, Request, Response } from 'express'
import type { admin } from '@fj-solutions/contracts'
import { inventoryService } from '../services/inventory.service'
import { sendSuccess } from '../utils/response'

const types = ['in', 'out', 'adjustment'] as const

function typeFrom(value: unknown): admin.InventoryMovementType | undefined {
  return types.includes(value as admin.InventoryMovementType)
    ? (value as admin.InventoryMovementType)
    : undefined
}

export const getInventoryMovements = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const movements = await inventoryService.list({
      q: typeof req.query.q === 'string' ? req.query.q : undefined,
      type: typeFrom(req.query.type),
      productId:
        typeof req.query.productId === 'string' ? req.query.productId : undefined,
      limit:
        typeof req.query.limit === 'string'
          ? Number(req.query.limit)
          : undefined,
    })
    return sendSuccess(res, movements)
  } catch (err) {
    next(err)
  }
}

export const createInventoryMovement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const movement = await inventoryService.register({
      ...(req.body as Partial<admin.InventoryMovementInput>),
      actorId: req.auth?.user.id,
    })
    return sendSuccess(res, movement, 'Movimiento registrado.', 201)
  } catch (err) {
    next(err)
  }
}
