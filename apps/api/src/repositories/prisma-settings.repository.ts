import { Prisma } from '@prisma/client'
import type { admin } from '@fj-solutions/contracts'
import { prisma } from '../config/database'
import type { SettingsRepository, StoredSettings } from './settings.repository'

const SETTINGS_KEY = 'store'

function toStoredSettings(value: unknown): StoredSettings | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return value as StoredSettings
}

export class PrismaSettingsRepository implements SettingsRepository {
  async read() {
    const record = await prisma.setting.findUnique({ where: { key: SETTINGS_KEY } })
    return toStoredSettings(record?.value)
  }

  async write(settings: admin.StoreSettings) {
    const record = await prisma.setting.upsert({
      where: { key: SETTINGS_KEY },
      update: { value: settings as Prisma.InputJsonValue },
      create: { key: SETTINGS_KEY, value: settings as Prisma.InputJsonValue },
    })
    return (toStoredSettings(record.value) ?? settings) as admin.StoreSettings
  }
}

export const prismaSettingsRepository = new PrismaSettingsRepository()
