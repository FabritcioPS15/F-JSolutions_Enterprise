import { Router } from 'express'
import {
  createBrand,
  deleteBrand,
  getBrands,
  updateBrand,
} from '../controllers/brand.controller'
import { authenticate, optionalAuthenticate, requirePermission } from '../middleware/auth'
import { validate } from '../middleware/validate'
import {
  brandIdSchema,
  brandQuerySchema,
  createBrandSchema,
  updateBrandSchema,
} from '../models/brand.model'

const router = Router()

router.get('/', optionalAuthenticate, validate(brandQuerySchema), getBrands)
router.post(
  '/',
  authenticate,
  requirePermission('brands.create'),
  validate(createBrandSchema),
  createBrand
)
router.put(
  '/:id',
  authenticate,
  requirePermission('brands.update'),
  validate(brandIdSchema),
  validate(updateBrandSchema),
  updateBrand
)
router.delete(
  '/:id',
  authenticate,
  requirePermission('brands.delete'),
  validate(brandIdSchema),
  deleteBrand
)

export default router
