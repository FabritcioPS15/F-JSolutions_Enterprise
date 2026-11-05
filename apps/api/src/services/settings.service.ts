import type { admin } from '@fj-solutions/contracts'
import { AppError } from '../middleware/error-handler'
import { prismaSettingsRepository } from '../repositories/prisma-settings.repository'
import type { SettingsRepository, StoredSettings } from '../repositories/settings.repository'

export const DEFAULT_SETTINGS: admin.StoreSettings = {
  storeName: 'FJ Systems',
  legalName: 'FJ Systems S.A.C.',
  ruc: '20601234567',
  email: 'ventas@fjsystems.pe',
  phone: '+51 999 888 777',
  address: 'Av. Javier Prado Este 1234, San Isidro, Lima',
  currency: 'PEN',
  igv: 18,
  lowStockThreshold: 5,
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function text(value: string | undefined, fallback: string) {
  return value === undefined ? fallback : value.trim()
}

function normalize(
  input: StoredSettings,
  base: admin.StoreSettings
): admin.StoreSettings {
  return {
    storeName: text(input.storeName, base.storeName),
    legalName: text(input.legalName, base.legalName),
    ruc: text(input.ruc, base.ruc),
    email: text(input.email, base.email),
    phone: text(input.phone, base.phone),
    address: text(input.address, base.address),
    currency:
      input.currency === 'USD' || input.currency === 'PEN'
        ? input.currency
        : base.currency,
    igv: Number(input.igv ?? base.igv),
    lowStockThreshold: Math.trunc(Number(input.lowStockThreshold ?? base.lowStockThreshold)),
  }
}

function assertSettings(settings: admin.StoreSettings) {
  if (!settings.storeName) {
    throw new AppError('El nombre comercial es obligatorio.', 400)
  }
  if (!EMAIL.test(settings.email)) {
    throw new AppError('El correo de contacto no es válido.', 400)
  }
  if (settings.ruc && !/^\d{11}$/.test(settings.ruc)) {
    throw new AppError('El RUC debe tener 11 dígitos.', 400)
  }
  if (!Number.isFinite(settings.igv) || settings.igv < 0 || settings.igv > 100) {
    throw new AppError('El IGV debe estar entre 0 y 100.', 400)
  }
  if (
    !Number.isInteger(settings.lowStockThreshold) ||
    settings.lowStockThreshold < 0
  ) {
    throw new AppError('El umbral de stock bajo debe ser un entero mayor o igual a 0.', 400)
  }
}

export class SettingsService {
  constructor(
    private readonly repository: SettingsRepository = prismaSettingsRepository
  ) {}

  async get() {
    const stored = await this.repository.read()
    return normalize(stored ?? {}, DEFAULT_SETTINGS)
  }

  async update(payload: StoredSettings) {
    const current = await this.get()
    const next = normalize(payload, current)
    assertSettings(next)
    return this.repository.write(next)
  }
}

export const settingsService = new SettingsService()
