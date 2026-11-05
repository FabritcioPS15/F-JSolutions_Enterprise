import type {
  InventoryMovement,
  InventoryMovementInput,
} from '@fj-solutions/contracts/admin'

type Envelope<T> = {
  success: boolean
  data?: T
  message?: string
}

export class InventoryApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = 'InventoryApiError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(
    path ? `/api/inventory/${path}` : '/api/inventory',
    {
      credentials: 'same-origin',
      cache: 'no-store',
      ...init,
      headers: {
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
    }
  )

  const payload = (await response.json().catch(() => ({
    success: false,
    message: 'La API devolvió una respuesta no válida.',
  }))) as Envelope<T>

  if (!response.ok || payload.success === false) {
    throw new InventoryApiError(
      payload.message ?? 'No se pudo completar la operación de inventario.',
      response.status
    )
  }

  return payload.data as T
}

export function fetchInventoryMovements(): Promise<InventoryMovement[]> {
  return request<InventoryMovement[]>('movements')
}

export function createInventoryMovement(
  input: InventoryMovementInput
): Promise<InventoryMovement> {
  return request<InventoryMovement>('movements', {
    method: 'POST',
    body: JSON.stringify({
      productId: input.productId,
      type: input.type,
      quantity: input.quantity,
      reason: input.reason,
      note: input.note ?? undefined,
    }),
  })
}
