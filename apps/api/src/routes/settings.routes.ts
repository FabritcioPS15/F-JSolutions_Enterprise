import { Router } from 'express'
import { getSettings, updateSettings } from '../controllers/settings.controller'
import { authenticate, requirePermission } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { updateSettingsSchema } from '../models/settings.model'

const router = Router()

router.get('/', authenticate, requirePermission('settings.view'), getSettings)
router.put(
  '/',
  authenticate,
  requirePermission('settings.update'),
  validate(updateSettingsSchema),
  updateSettings
)

export default router
