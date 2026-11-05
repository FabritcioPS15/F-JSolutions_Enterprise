import type { admin } from '@fj-solutions/contracts'

export type StoredSettings = Partial<admin.StoreSettings>

export interface SettingsRepository {
  read(): Promise<StoredSettings | null>
  write(settings: admin.StoreSettings): Promise<admin.StoreSettings>
}
