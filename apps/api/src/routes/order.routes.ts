import { Router } from 'express'
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/order.controller'
import { authenticate, requireRole } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { createOrderSchema } from '../models/order.model'

const router = Router()

router.post('/', validate(createOrderSchema), createOrder)
router.get('/', authenticate, getOrders)
router.get('/:id', authenticate, getOrderById)
router.patch('/:id/status', authenticate, requireRole('admin', 'staff'), updateOrderStatus)

export default router
