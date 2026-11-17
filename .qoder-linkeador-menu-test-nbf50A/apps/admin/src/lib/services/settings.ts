import type { StoreSettings } from '@fj-solutions/contracts/admin'

type Envelope<T> = {
  success: boolean
  data?: T
  message?: string
}

export class SettingsApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = 'SettingsApiError'
  }
}

async function request<T>(init?: RequestInit): Promise<T> {
  const response = await fetch('/api/settings', {
    credentials: 'same-origin',
    cache: 'no-store',
    ...init,
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  })

  const payload = (await response.json().catch(() => ({
    success: false,
    message: 'La API devolvió una respuesta no válida.',
  }))) as Envelope<T>

  if (!response.ok || payload.success === false) {
    throw new SettingsApiError(
      payload.message ?? 'No se pudo completar la operación de configuración.',
      response.status
    )
  }

  return payload.data as T
}

export function fetchSettings(): Promise<StoreSettings> {
  return request<StoreSettings>()
}

export function saveSettings(settings: StoreSettings): Promise<StoreSettings> {
  return request<StoreSettings>({
    method: 'PUT',
    body: JSON.stringify({
      storeName: settings.storeName,
      legalName: settings.legalName,
      ruc: settings.ruc,
      email: settings.email,
      phone: settings.phone,
      address: settings.address,
      currency: settings.currency,
      igv: settings.igv,
      lowStockThreshold: settings.lowStockThreshold,
    }),
  })
}
