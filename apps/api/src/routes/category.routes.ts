import { Router } from 'express'
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../controllers/category.controller'
import { authenticate, optionalAuthenticate, requirePermission } from '../middleware/auth'
import { validate } from '../middleware/validate'
import {
  categoryIdSchema,
  categoryQuerySchema,
  createCategorySchema,
  updateCategorySchema,
} from '../models/category.model'

const router = Router()

router.get('/', optionalAuthenticate, validate(categoryQuerySchema), getCategories)
router.post(
  '/',
  authenticate,
  requirePermission('categories.create'),
  validate(createCategorySchema),
  createCategory
)
router.put(
  '/:id',
  authenticate,
  requirePermission('categories.update'),
  validate(categoryIdSchema),
  validate(updateCategorySchema),
  updateCategory
)
router.delete(
  '/:id',
  authenticate,
  requirePermission('categories.delete'),
  validate(categoryIdSchema),
  deleteCategory
)

export default router
