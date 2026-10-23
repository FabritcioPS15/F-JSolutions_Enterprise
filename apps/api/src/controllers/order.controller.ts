import { Request, Response, NextFunction } from 'express'
import { OrderService } from '../services/order.service'
import { sendSuccess, sendError } from '../utils/response'

const orderService = new OrderService()

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.createOrder({
      ...req.body,
      userId: req.user?.sub,
    })
    return sendSuccess(res, order, 'Pedido registrado exitosamente', 201)
  } catch (err) { next(err) }
}

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isCustomer = req.user?.role === 'customer'
    const orders = await orderService.getOrders(isCustomer ? req.user?.sub : undefined)
    return sendSuccess(res, orders)
  } catch (err) { next(err) }
}

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.getOrderById(req.params.id)
    if (!order) return sendError(res, 'Pedido no encontrado', 404)
    return sendSuccess(res, order)
  } catch (err) { next(err) }
}

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.updateStatus(req.params.id, req.body.status)
    if (!order) return sendError(res, 'Pedido no encontrado', 404)
    return sendSuccess(res, order, 'Estado del pedido actualizado')
  } catch (err) { next(err) }
}

export const createCotizacion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cotizacion = await orderService.createCotizacion(req.body)
    return sendSuccess(res, cotizacion, 'Solicitud de cotización recibida', 201)
  } catch (err) { next(err) }
}

export const getCotizaciones = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await orderService.getCotizaciones()
    return sendSuccess(res, list)
  } catch (err) { next(err) }
}
