import { Router } from 'express'
import {
  createService,
  deleteService,
  getPublicServiceBySlug,
  getPublicServices,
  getServiceById,
  getServices,
  updateService,
  updateServiceStatus,
} from '../controllers/service-offering.controller'
import { authenticate, requirePermission } from '../middleware/auth'
import { validate } from '../middleware/validate'
import {
  createServiceOfferingSchema,
  publicServiceOfferingQuerySchema,
  publicServiceOfferingSlugSchema,
  serviceOfferingIdSchema,
  serviceOfferingQuerySchema,
  serviceOfferingStatusSchema,
  updateServiceOfferingSchema,
} from '../models/service-offering.model'

const router = Router()

// Catálogo público de servicios publicados. Sin sesión.
router.get(
  '/public',
  validate(publicServiceOfferingQuerySchema),
  getPublicServices
)
router.get(
  '/public/:slug',
  validate(publicServiceOfferingSlugSchema),
  getPublicServiceBySlug
)

router.get(
  '/',
  authenticate,
  requirePermission('services.view'),
  validate(serviceOfferingQuerySchema),
  getServices
)
router.get(
  '/:id',
  authenticate,
  requirePermission('services.view'),
  validate(serviceOfferingIdSchema),
  getServiceById
)
router.post(
  '/',
  authenticate,
  requirePermission('services.create'),
  validate(createServiceOfferingSchema),
  createService
)
router.put(
  '/:id',
  authenticate,
  requirePermission('services.update'),
  validate(serviceOfferingIdSchema),
  validate(updateServiceOfferingSchema),
  updateService
)
router.patch(
  '/:id/status',
  authenticate,
  requirePermission('services.publish'),
  validate(serviceOfferingIdSchema),
  validate(serviceOfferingStatusSchema),
  updateServiceStatus
)
router.delete(
  '/:id',
  authenticate,
  requirePermission('services.delete'),
  validate(serviceOfferingIdSchema),
  deleteService
)

export default router
