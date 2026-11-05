import { Router } from 'express'
import {
  createProject,
  createProjectDeployment,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from '../controllers/project.controller'
import { authenticate, requirePermission } from '../middleware/auth'
import { validate } from '../middleware/validate'
import {
  createProjectSchema,
  projectDeploymentSchema,
  projectIdSchema,
  projectQuerySchema,
  updateProjectSchema,
} from '../models/project.model'

const router = Router()

router.get(
  '/',
  authenticate,
  requirePermission('projects.view'),
  validate(projectQuerySchema),
  getProjects
)
router.get(
  '/:id',
  authenticate,
  requirePermission('projects.view'),
  validate(projectIdSchema),
  getProjectById
)
router.post(
  '/',
  authenticate,
  requirePermission('projects.create'),
  validate(createProjectSchema),
  createProject
)
router.put(
  '/:id',
  authenticate,
  requirePermission('projects.update'),
  validate(projectIdSchema),
  validate(updateProjectSchema),
  updateProject
)
router.delete(
  '/:id',
  authenticate,
  requirePermission('projects.delete'),
  validate(projectIdSchema),
  deleteProject
)
router.post(
  '/:id/deployments',
  authenticate,
  requirePermission('projects.manage-deployments'),
  validate(projectIdSchema),
  validate(projectDeploymentSchema),
  createProjectDeployment
)

export default router
