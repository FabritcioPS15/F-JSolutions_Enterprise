import type { admin } from '@fj-solutions/contracts'
import type {
  SettingsRepository,
  StoredSettings,
} from '../src/repositories/settings.repository'
import { DEFAULT_SETTINGS, SettingsService } from '../src/services/settings.service'

function input(overrides: Partial<admin.StoreSettings> = {}): admin.StoreSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...overrides,
  }
}

class FakeSettingsRepository implements SettingsRepository {
  stored: StoredSettings | null = null
  writes = 0
  settings: admin.StoreSettings | null = null

  async read() {
    return this.stored
  }

  async write(settings: admin.StoreSettings) {
    this.writes += 1
    this.settings = settings
    this.stored = settings
    return settings
  }
}

describe('SettingsService', () => {
  it('devuelve la configuración por defecto cuando no hay fila guardada', async () => {
    const service = new SettingsService(new FakeSettingsRepository())
    await expect(service.get()).resolves.toEqual(DEFAULT_SETTINGS)
  })

  it('combina los valores guardados con los predeterminados', async () => {
    const repository = new FakeSettingsRepository()
    repository.stored = { storeName: 'FJ Store', igv: 19 }
    const service = new SettingsService(repository)

    const settings = await service.get()

    expect(settings.storeName).toBe('FJ Store')
    expect(settings.igv).toBe(19)
    expect(settings.currency).toBe('PEN')
    expect(settings.lowStockThreshold).toBe(DEFAULT_SETTINGS.lowStockThreshold)
  })

  it('recorta los textos y persiste la configuración completa', async () => {
    const repository = new FakeSettingsRepository()
    const service = new SettingsService(repository)

    const saved = await service.update(
      input({
        storeName: '  FJ Systems Perú  ',
        legalName: '  FJ Systems S.A.C.  ',
        email: '  ventas@fjsystems.pe  ',
        phone: '  +51 999 888 777  ',
      })
    )

    expect(saved.storeName).toBe('FJ Systems Perú')
    expect(saved.legalName).toBe('FJ Systems S.A.C.')
    expect(saved.email).toBe('ventas@fjsystems.pe')
    expect(saved.phone).toBe('+51 999 888 777')
    expect(repository.writes).toBe(1)
  })

  it('conserva los campos no enviados en una actualización parcial', async () => {
    const repository = new FakeSettingsRepository()
    repository.stored = input({ currency: 'USD', lowStockThreshold: 8 })
    const service = new SettingsService(repository)

    const saved = await service.update({ igv: 19 })

    expect(saved.igv).toBe(19)
    expect(saved.currency).toBe('USD')
    expect(saved.lowStockThreshold).toBe(8)
    expect(saved.storeName).toBe(DEFAULT_SETTINGS.storeName)
  })

  it('rechaza un nombre comercial vacío', async () => {
    const service = new SettingsService(new FakeSettingsRepository())
    await expect(service.update(input({ storeName: '   ' }))).rejects.toThrow(
      'El nombre comercial es obligatorio.'
    )
  })

  it('rechaza un correo inválido', async () => {
    const service = new SettingsService(new FakeSettingsRepository())
    await expect(service.update(input({ email: 'ventas' }))).rejects.toThrow(
      'El correo de contacto no es válido.'
    )
  })

  it('rechaza un RUC con formato inválido', async () => {
    const service = new SettingsService(new FakeSettingsRepository())
    await expect(service.update(input({ ruc: '2060123' }))).rejects.toThrow(
      'El RUC debe tener 11 dígitos.'
    )
  })

  it('permite dejar el RUC vacío', async () => {
    const service = new SettingsService(new FakeSettingsRepository())
    await expect(service.update(input({ ruc: '' }))).resolves.toMatchObject({ ruc: '' })
  })

  it('rechaza un IGV fuera del rango permitido', async () => {
    const service = new SettingsService(new FakeSettingsRepository())
    await expect(service.update(input({ igv: 120 }))).rejects.toThrow(
      'El IGV debe estar entre 0 y 100.'
    )
    await expect(service.update(input({ igv: -1 }))).rejects.toThrow(
      'El IGV debe estar entre 0 y 100.'
    )
  })

  it('rechaza un umbral de stock negativo', async () => {
    const service = new SettingsService(new FakeSettingsRepository())
    await expect(
      service.update(input({ lowStockThreshold: -2 }))
    ).rejects.toThrow('El umbral de stock bajo debe ser un entero mayor o igual a 0.')
  })

  it('acepta moneda USD y un umbral entero', async () => {
    const service = new SettingsService(new FakeSettingsRepository())
    await expect(
      service.update(input({ currency: 'USD', lowStockThreshold: 3 }))
    ).resolves.toMatchObject({ currency: 'USD', lowStockThreshold: 3 })
  })
})
