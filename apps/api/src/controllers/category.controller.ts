import { NextFunction, Request, Response } from 'express'
import { sendError, sendSuccess } from '../utils/response'
import { catalogService, type CategoryPayload } from '../services/catalog.service'

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

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = adminScope(req, res, 'categories.view')
    if (admin === null) return
    const categories = await catalogService.listCategories(Boolean(admin))
    return sendSuccess(res, categories)
  } catch (err) {
    next(err)
  }
}

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await catalogService.createCategory(req.body as CategoryPayload)
    return sendSuccess(res, category, 'Categoría creada exitosamente.', 201)
  } catch (err) {
    next(err)
  }
}

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await catalogService.updateCategory(
      req.params.id,
      req.body as Partial<CategoryPayload>
    )
    return sendSuccess(res, category, 'Categoría actualizada.')
  } catch (err) {
    next(err)
  }
}

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await catalogService.deleteCategory(req.params.id)
    return sendSuccess(res, null, 'Categoría eliminada.')
  } catch (err) {
    next(err)
  }
}
