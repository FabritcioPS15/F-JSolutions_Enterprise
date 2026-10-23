import { Router } from 'express'
import { sendContact } from '../controllers/contact.controller'
import { validate } from '../middleware/validate'
import { contactSchema } from '../models/order.model'

const router = Router()

router.post('/', validate(contactSchema), sendContact)

export default router
