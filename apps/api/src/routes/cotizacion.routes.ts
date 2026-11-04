import { Router } from 'express'
import { sendCotizacion } from '../controllers/contact.controller'
import { getCotizaciones } from '../controllers/order.controller'
import { authenticate, requirePermission } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { cotizacionSchema } from '../models/order.model'

const router = Router()

router.post('/', validate(cotizacionSchema), sendCotizacion)
router.get('/', authenticate, requirePermission('quotes.view'), getCotizaciones)

export default router
