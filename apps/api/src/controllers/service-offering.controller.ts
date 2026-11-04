import { NextFunction, Request, Response } from 'express'
import type { admin } from '@fj-solutions/contracts'
import { sendSuccess } from '../utils/response'
import {
  serviceOfferingService,
  type ServiceOfferingCreatePayload,
  type ServiceOfferingPayload,
} from '../services/service-offering.service'

const statuses = ['draft', 'published', 'archived'] as const
const categories = [
  'Soporte TI',
  'Infraestructura TI',
  'Desarrollo de software',
] as const

function statusFrom(value: unknown): admin.ServiceOfferingStatus | undefined {
  return statuses.includes(value as admin.ServiceOfferingStatus)
    ? (value as admin.ServiceOfferingStatus)
    : undefined
}

function categoryFrom(value: unknown): admin.ServiceOfferingCategory | undefined {
  return categories.includes(value as admin.ServiceOfferingCategory)
    ? (value as admin.ServiceOfferingCategory)
    : undefined
}

function canPublish(req: Request) {
  return req.auth?.permissions.includes('services.publish') ?? false
}

export const getServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const services = await serviceOfferingService.list({
      q: typeof req.query.q === 'string' ? req.query.q : undefined,
      status: statusFrom(req.query.status),
      category: categoryFrom(req.query.category),
    })
    return sendSuccess(res, services)
  } catch (err) {
    next(err)
  }
}

export const getServiceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await serviceOfferingService.get(req.params.id)
    return sendSuccess(res, service)
  } catch (err) {
    next(err)
  }
}

export const createService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await serviceOfferingService.create(
      req.body as ServiceOfferingCreatePayload,
      { canPublish: canPublish(req) }
    )
    return sendSuccess(res, service, 'Servicio creado.', 201)
  } catch (err) {
    next(err)
  }
}

export const updateService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await serviceOfferingService.update(
      req.params.id,
      req.body as ServiceOfferingPayload,
      { canPublish: canPublish(req) }
    )
    return sendSuccess(res, service, 'Servicio actualizado.')
  } catch (err) {
    next(err)
  }
}

export const updateServiceStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status = (req.body as { status: admin.ServiceOfferingStatus }).status
    const service = await serviceOfferingService.updateStatus(req.params.id, status)
    return sendSuccess(res, service, 'Estado del servicio actualizado.')
  } catch (err) {
    next(err)
  }
}

export const deleteService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await serviceOfferingService.delete(req.params.id)
    return sendSuccess(res, null, 'Servicio eliminado.')
  } catch (err) {
    next(err)
  }
}

export const getPublicServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const services = await serviceOfferingService.listPublished(
      categoryFrom(req.query.category)
    )
    return sendSuccess(res, services)
  } catch (err) {
    next(err)
  }
}

export const getPublicServiceBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const service = await serviceOfferingService.getPublishedBySlug(req.params.slug)
    return sendSuccess(res, service)
  } catch (err) {
    next(err)
  }
}
