import { Router } from 'express'
import { sendCotizacion } from '../controllers/contact.controller'
import { getCotizaciones } from '../controllers/order.controller'
import { authenticate, requireRole } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { cotizacionSchema } from '../models/order.model'

const router = Router()

router.post('/', validate(cotizacionSchema), sendCotizacion)
router.get('/', authenticate, requireRole('admin', 'staff'), getCotizaciones)

export default router
