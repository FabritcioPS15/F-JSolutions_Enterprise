import { Router } from 'express'
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProductBySlug,
  getProducts,
  updateProduct,
} from '../controllers/product.controller'
import { authenticate, optionalAuthenticate, requirePermission } from '../middleware/auth'
import { validate } from '../middleware/validate'
import {
  createProductSchema,
  productIdSchema,
  productQuerySchema,
  productSlugSchema,
  updateProductSchema,
} from '../models/product.model'

const router = Router()

// Lectura pública; con ?scope=admin y sesión válida devuelve borradores.
router.get('/', optionalAuthenticate, validate(productQuerySchema), getProducts)
router.get('/slug/:slug', optionalAuthenticate, validate(productSlugSchema), getProductBySlug)
router.get('/:id', optionalAuthenticate, validate(productIdSchema), getProductById)

// Escritura protegida por permisos del catálogo.
router.post(
  '/',
  authenticate,
  requirePermission('products.create'),
  validate(createProductSchema),
  createProduct
)
router.put(
  '/:id',
  authenticate,
  requirePermission('products.update'),
  validate(productIdSchema),
  validate(updateProductSchema),
  updateProduct
)
router.delete(
  '/:id',
  authenticate,
  requirePermission('products.delete'),
  validate(productIdSchema),
  deleteProduct
)

export default router
