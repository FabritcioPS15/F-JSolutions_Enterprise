import { NextFunction, Request, Response } from 'express'
import { sendError, sendPaginated, sendSuccess } from '../utils/response'
import { catalogService, type ProductPayload } from '../services/catalog.service'

function isAdminScope(req: Request, res: Response, permission: string) {
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

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = isAdminScope(req, res, 'products.view')
    if (admin === null) return

    const page = Number(req.query.page) || 1
    const limit = Math.min(Number(req.query.limit) || 50, 100)
    const featured = req.query.featured
    const result = await catalogService.listProducts({
      page,
      limit,
      q: typeof req.query.q === 'string' ? req.query.q : undefined,
      categorySlug: typeof req.query.category === 'string' ? req.query.category : undefined,
      brandName: typeof req.query.brand === 'string' ? req.query.brand : undefined,
      minPrice: req.query.minPrice !== undefined ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice !== undefined ? Number(req.query.maxPrice) : undefined,
      featured:
        featured === 'true' || featured === '1'
          ? true
          : featured === 'false' || featured === '0'
            ? false
            : undefined,
      status:
        typeof req.query.status === 'string'
          ? (req.query.status as 'active' | 'draft' | 'archived')
          : undefined,
      sort: (typeof req.query.sort === 'string' ? req.query.sort : 'newest') as
        | 'newest'
        | 'price_asc'
        | 'price_desc'
        | 'name',
      publishedOnly: !admin,
    })

    return sendPaginated(res, result.data, { page, limit, total: result.total })
  } catch (err) {
    next(err)
  }
}

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = isAdminScope(req, res, 'products.view')
    if (admin === null) return
    const product = await catalogService.getProductById(req.params.id, !admin)
    return sendSuccess(res, product)
  } catch (err) {
    next(err)
  }
}

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = isAdminScope(req, res, 'products.view')
    if (admin === null) return
    const product = await catalogService.getProductBySlug(req.params.slug, !admin)
    return sendSuccess(res, product)
  } catch (err) {
    next(err)
  }
}

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await catalogService.createProduct(
      req.body as ProductPayload,
      req.auth?.user.id
    )
    return sendSuccess(res, product, 'Producto creado exitosamente.', 201)
  } catch (err) {
    next(err)
  }
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await catalogService.updateProduct(
      req.params.id,
      req.body as Partial<ProductPayload>,
      req.auth?.user.id
    )
    return sendSuccess(res, product, 'Producto actualizado.')
  } catch (err) {
    next(err)
  }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await catalogService.deleteProduct(req.params.id)
    return sendSuccess(res, null, 'Producto archivado.')
  } catch (err) {
    next(err)
  }
}
