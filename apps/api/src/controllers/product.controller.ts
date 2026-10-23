import { Request, Response, NextFunction } from 'express'
import { ProductService } from '../services/product.service'
import { sendSuccess, sendPaginated } from '../utils/response'

const productService = new ProductService()

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 24, q, category, brand, minPrice, maxPrice, oferta, sort } = req.query
    const result = await productService.findAll({
      page: Number(page), limit: Number(limit),
      q: q as string, category: category as string,
      brand: brand as string, minPrice: Number(minPrice) || undefined,
      maxPrice: Number(maxPrice) || undefined,
      oferta: oferta === 'true', sort: sort as string,
    })
    return sendPaginated(res, result.data, result.pagination)
  } catch (err) { next(err) }
}

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.findById(req.params.id)
    return sendSuccess(res, product)
  } catch (err) { next(err) }
}

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.create(req.body)
    return sendSuccess(res, product, 'Producto creado exitosamente', 201)
  } catch (err) { next(err) }
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.update(req.params.id, req.body)
    return sendSuccess(res, product, 'Producto actualizado')
  } catch (err) { next(err) }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await productService.delete(req.params.id)
    return sendSuccess(res, null, 'Producto eliminado')
  } catch (err) { next(err) }
}