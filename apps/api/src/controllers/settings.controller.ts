import { NextFunction, Request, Response } from 'express'
import type { admin } from '@fj-solutions/contracts'
import { settingsService } from '../services/settings.service'
import { sendSuccess } from '../utils/response'

export const getSettings = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    return sendSuccess(res, await settingsService.get())
  } catch (err) {
    next(err)
  }
}

export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await settingsService.update(
      req.body as Partial<admin.StoreSettings>
    )
    return sendSuccess(res, settings, 'Configuración actualizada.')
  } catch (err) {
    next(err)
  }
}
