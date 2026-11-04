import { NextFunction, Request, Response } from 'express'
import { sendError, sendSuccess } from '../utils/response'
import { catalogService, type BrandPayload } from '../services/catalog.service'

function adminScope(req: Request, res: Response, permission: string) {
  if (req.query.scope !== 'admin') return false
  if (!req.auth) {
    sendError(res, 'No autorizado: se requiere una sesión válida.', 401)
    return null
  }
  if (!req.auth.permissions.includes(permission)) {
    sendError(res, 'No tienes permisos para realizar esta acción.', 403)
    return null
  }
  return true
}

export const getBrands = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = adminScope(req, res, 'brands.view')
    if (admin === null) return
    const brands = await catalogService.listBrands(Boolean(admin))
    return sendSuccess(res, brands)
  } catch (err) {
    next(err)
  }
}

export const createBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const brand = await catalogService.createBrand(req.body as BrandPayload)
    return sendSuccess(res, brand, 'Marca creada exitosamente.', 201)
  } catch (err) {
    next(err)
  }
}

export const updateBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const brand = await catalogService.updateBrand(req.params.id, req.body as Partial<BrandPayload>)
    return sendSuccess(res, brand, 'Marca actualizada.')
  } catch (err) {
    next(err)
  }
}

export const deleteBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await catalogService.deleteBrand(req.params.id)
    return sendSuccess(res, null, 'Marca eliminada.')
  } catch (err) {
    next(err)
  }
}
