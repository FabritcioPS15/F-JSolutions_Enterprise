import { Router } from 'express'
import {
  createClient,
  deleteClient,
  getClientById,
  getClients,
  updateClient,
} from '../controllers/client.controller'
import { authenticate, requirePermission } from '../middleware/auth'
import { validate } from '../middleware/validate'
import {
  clientIdSchema,
  clientQuerySchema,
  createClientSchema,
  updateClientSchema,
} from '../models/client.model'

const router = Router()

router.get(
  '/',
  authenticate,
  requirePermission('clients.view'),
  validate(clientQuerySchema),
  getClients
)
router.get(
  '/:id',
  authenticate,
  requirePermission('clients.view'),
  validate(clientIdSchema),
  getClientById
)
router.post(
  '/',
  authenticate,
  requirePermission('clients.create'),
  validate(createClientSchema),
  createClient
)
router.put(
  '/:id',
  authenticate,
  requirePermission('clients.update'),
  validate(clientIdSchema),
  validate(updateClientSchema),
  updateClient
)
router.delete(
  '/:id',
  authenticate,
  requirePermission('clients.delete'),
  validate(clientIdSchema),
  deleteClient
)

export default router
