import { NextFunction, Request, Response } from 'express'
import type { admin } from '@fj-solutions/contracts'
import { sendSuccess } from '../utils/response'
import { projectService } from '../services/project.service'

const types = [
  'landing',
  'website',
  'webapp',
  'ecommerce',
  'maintenance',
  'software',
] as const
const statuses = [
  'planning',
  'development',
  'staging',
  'live',
  'paused',
  'archived',
] as const

function typeFrom(value: unknown): admin.WebProjectType | undefined {
  return types.includes(value as admin.WebProjectType)
    ? (value as admin.WebProjectType)
    : undefined
}

function statusFrom(value: unknown): admin.WebProjectStatus | undefined {
  return statuses.includes(value as admin.WebProjectStatus)
    ? (value as admin.WebProjectStatus)
    : undefined
}

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await projectService.list({
      q: typeof req.query.q === 'string' ? req.query.q : undefined,
      status: statusFrom(req.query.status),
      type: typeFrom(req.query.type),
    })
    return sendSuccess(res, projects)
  } catch (err) {
    next(err)
  }
}

export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.get(req.params.id)
    return sendSuccess(res, project)
  } catch (err) {
    next(err)
  }
}

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.create(
      req.body as Partial<admin.WebProjectInput>
    )
    return sendSuccess(res, project, 'Proyecto creado.', 201)
  } catch (err) {
    next(err)
  }
}

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.update(
      req.params.id,
      req.body as Partial<admin.WebProjectInput>
    )
    return sendSuccess(res, project, 'Proyecto actualizado.')
  } catch (err) {
    next(err)
  }
}

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await projectService.delete(req.params.id)
    return sendSuccess(res, null, 'Proyecto eliminado.')
  } catch (err) {
    next(err)
  }
}

export const createProjectDeployment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deployment = await projectService.registerDeployment(
      req.params.id,
      req.body as Partial<admin.DeploymentInput>
    )
    return sendSuccess(res, deployment, 'Despliegue registrado.', 201)
  } catch (err) {
    next(err)
  }
}
