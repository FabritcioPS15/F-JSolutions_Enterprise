import { Router } from 'express'
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/order.controller'
import { authenticate, requirePermission } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { createOrderSchema } from '../models/order.model'

const router = Router()

router.post('/', validate(createOrderSchema), createOrder)

// Los pedidos heredados se consultan con el permiso comercial de cotizaciones.
router.get('/', authenticate, requirePermission('quotes.view'), getOrders)
router.get('/:id', authenticate, requirePermission('quotes.view'), getOrderById)
router.patch(
  '/:id/status',
  authenticate,
  requirePermission('quotes.manage-status'),
  updateOrderStatus
)

export default router
