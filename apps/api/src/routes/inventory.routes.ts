import { Router } from 'express'
import {
  createInventoryMovement,
  getInventoryMovements,
} from '../controllers/inventory.controller'
import { authenticate, requirePermission } from '../middleware/auth'
import { validate } from '../middleware/validate'
import {
  inventoryMovementSchema,
  inventoryQuerySchema,
} from '../models/inventory.model'

const router = Router()

router.get(
  '/movements',
  authenticate,
  requirePermission('inventory.view'),
  validate(inventoryQuerySchema),
  getInventoryMovements
)
router.post(
  '/movements',
  authenticate,
  requirePermission('inventory.manage'),
  validate(inventoryMovementSchema),
  createInventoryMovement
)

export default router
