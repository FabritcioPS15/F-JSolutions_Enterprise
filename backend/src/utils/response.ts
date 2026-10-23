import { Response } from 'express'
import { ApiResponse } from '../types'

export function sendSuccess<T>(res: Response, data: T, message?: string, status = 200) {
  const body: ApiResponse<T> = { success: true, data, message }
  return res.status(status).json(body)
}

export function sendError(res: Response, message: string, status = 400, errors?: Record<string, string[]>) {
  const body: ApiResponse = { success: false, message, errors }
  return res.status(status).json(body)
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: { page: number; limit: number; total: number }
) {
  const body: ApiResponse<T[]> = {
    success: true,
    data,
    pagination: {
      ...pagination,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  }
  return res.status(200).json(body)
}