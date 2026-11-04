import { Router } from 'express'
import {
  createPublicQuote,
  createQuote,
  deleteQuote,
  getQuoteById,
  getQuotes,
  updateQuote,
  updateQuoteStatus,
} from '../controllers/quote.controller'
import { authenticate, requirePermission } from '../middleware/auth'
import { validate } from '../middleware/validate'
import {
  createQuoteSchema,
  publicQuoteSchema,
  quoteIdSchema,
  quoteQuerySchema,
  quoteStatusSchema,
  updateQuoteSchema,
} from '../models/quote.model'

const router = Router()

// Solicitud pública desde la tienda. Sin sesión: crea una cotización en estado NEW.
router.post('/public', validate(publicQuoteSchema), createPublicQuote)

router.get(
  '/',
  authenticate,
  requirePermission('quotes.view'),
  validate(quoteQuerySchema),
  getQuotes
)
router.get(
  '/:id',
  authenticate,
  requirePermission('quotes.view'),
  validate(quoteIdSchema),
  getQuoteById
)
router.post(
  '/',
  authenticate,
  requirePermission('quotes.create'),
  validate(createQuoteSchema),
  createQuote
)
router.put(
  '/:id',
  authenticate,
  requirePermission('quotes.update'),
  validate(quoteIdSchema),
  validate(updateQuoteSchema),
  updateQuote
)
router.patch(
  '/:id/status',
  authenticate,
  requirePermission('quotes.manage-status'),
  validate(quoteIdSchema),
  validate(quoteStatusSchema),
  updateQuoteStatus
)
router.delete(
  '/:id',
  authenticate,
  requirePermission('quotes.delete'),
  validate(quoteIdSchema),
  deleteQuote
)

export default router
