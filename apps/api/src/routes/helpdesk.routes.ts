import { Router } from 'express'
import {
  createTicket,
  listTickets,
  removeTicket,
  replyTicket,
  updateTicket,
} from '../controllers/helpdesk.controller'
import { requireAdminKey } from '../middleware/admin-key'
import { validate } from '../middleware/validate'
import {
  createHelpdeskSchema,
  replyHelpdeskSchema,
  updateHelpdeskSchema,
} from '../models/helpdesk.model'

const router = Router()

router.use(requireAdminKey)

router.get('/', listTickets)
router.post('/', validate(createHelpdeskSchema), createTicket)
router.patch('/:id', validate(updateHelpdeskSchema), updateTicket)
router.delete('/:id', removeTicket)
router.post('/:id/reply', validate(replyHelpdeskSchema), replyTicket)

export default router
