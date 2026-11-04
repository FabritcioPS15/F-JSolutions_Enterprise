import { Router } from 'express'
import {
  createTicket,
  listTickets,
  removeTicket,
  replyTicket,
  updateTicket,
} from '../controllers/helpdesk.controller'
import { authenticate, requirePermission } from '../middleware/auth'
import { validate } from '../middleware/validate'
import {
  createHelpdeskSchema,
  replyHelpdeskSchema,
  updateHelpdeskSchema,
} from '../models/helpdesk.model'

const router = Router()

router.use(authenticate)

router.get('/', requirePermission('requests.view'), listTickets)
router.post('/', requirePermission('requests.create'), validate(createHelpdeskSchema), createTicket)
router.patch('/:id', requirePermission('requests.update'), validate(updateHelpdeskSchema), updateTicket)
router.delete('/:id', requirePermission('requests.delete'), removeTicket)
router.post('/:id/reply', requirePermission('requests.reply'), validate(replyHelpdeskSchema), replyTicket)

export default router
