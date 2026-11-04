import { Router } from 'express'
import {
  getHelpdeskReport,
  getSalesReport,
  getSummary,
} from '../controllers/dashboard.controller'
import { authenticate, requirePermission } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { reportRangeSchema } from '../models/dashboard.model'

const router = Router()

router.use(authenticate)

router.get('/summary', requirePermission('dashboard.view'), getSummary)
router.get(
  '/reports/sales',
  requirePermission('reports.view'),
  validate(reportRangeSchema),
  getSalesReport
)
router.get(
  '/reports/helpdesk',
  requirePermission('reports.view'),
  validate(reportRangeSchema),
  getHelpdeskReport
)

export default router
