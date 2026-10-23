import { Router } from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller'
import { authenticate, requireRole } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { createProductSchema, updateProductSchema, productQuerySchema } from '../models/product.model'

const router = Router()

// Públicas
router.get('/', validate(productQuerySchema), getProducts)
router.get('/:id', getProductById)

// Protegidas (Solo Admin y Staff)
router.post('/', authenticate, requireRole('admin', 'staff'), validate(createProductSchema), createProduct)
router.put('/:id', authenticate, requireRole('admin', 'staff'), validate(updateProductSchema), updateProduct)
router.delete('/:id', authenticate, requireRole('admin'), deleteProduct)

export default router
