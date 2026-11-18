import type {
  ServiceOffering,
  ServiceOfferingInput,
  ServiceOfferingStatus,
} from '@fj-solutions/contracts/admin'

type Envelope<T> = {
  success: boolean
  data?: T
  message?: string
}

export class ServiceOfferingApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = 'ServiceOfferingApiError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path ? `/api/services/${path}` : '/api/services', {
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
    throw new ServiceOfferingApiError(
      payload.message ?? 'No se pudo completar la operación de servicios.',
      response.status
    )
  }

  return payload.data as T
}

export function fetchServiceOfferings(): Promise<ServiceOffering[]> {
  return request<ServiceOffering[]>('')
}

export function fetchServiceOffering(id: string): Promise<ServiceOffering> {
  return request<ServiceOffering>(encodeURIComponent(id))
}

function payload(input: ServiceOfferingInput) {
  return {
    slug: input.slug,
    title: input.title,
    category: input.category,
    summary: input.summary,
    intro: input.intro,
    heroImage: input.heroImage ?? null,
    includes: input.includes,
    faq: input.faq,
    related: input.related,
    status: input.status,
    position: input.position,
  }
}

export function createServiceOffering(input: ServiceOfferingInput): Promise<ServiceOffering> {
  return request<ServiceOffering>('', {
    method: 'POST',
    body: JSON.stringify(payload(input)),
  })
}

export function updateServiceOffering(
  id: string,
  input: ServiceOfferingInput
): Promise<ServiceOffering> {
  return request<ServiceOffering>(encodeURIComponent(id), {
    method: 'PUT',
    body: JSON.stringify(payload(input)),
  })
}

export function updateServiceOfferingStatus(
  id: string,
  status: ServiceOfferingStatus
): Promise<ServiceOffering> {
  return request<ServiceOffering>(`${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export async function deleteServiceOffering(id: string) {
  try {
    await request(encodeURIComponent(id), { method: 'DELETE' })
  } catch (error) {
    if (error instanceof ServiceOfferingApiError && error.status === 404) return
    throw error
  }
}
