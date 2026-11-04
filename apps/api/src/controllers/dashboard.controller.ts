import { NextFunction, Request, Response } from 'express'
import { sendSuccess } from '../utils/response'
import { dashboardService } from '../services/dashboard.service'

function queryString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

export const getSummary = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const summary = await dashboardService.getSummary()
    return sendSuccess(res, summary)
  } catch (err) {
    next(err)
  }
}

export const getSalesReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await dashboardService.getSalesReport(
      queryString(req.query.from),
      queryString(req.query.to)
    )
    return sendSuccess(res, report)
  } catch (err) {
    next(err)
  }
}

export const getHelpdeskReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await dashboardService.getHelpdeskReport(
      queryString(req.query.from),
      queryString(req.query.to)
    )
    return sendSuccess(res, report)
  } catch (err) {
    next(err)
  }
}
