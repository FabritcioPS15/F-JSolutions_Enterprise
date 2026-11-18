import type { AdminUserInput } from '@/lib/admin/types'

// Las cuentas del panel viven en el servidor local: aquí solo se habla con el
// BFF, que exige sesión y restringe las mutaciones al superadministrador.
export class UsersApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, { cache: 'no-store', ...init })
  } catch {
    throw new UsersApiError('No se pudo conectar con el servidor de usuarios.', 0)
  }

  let payload: { success?: boolean; message?: string; data?: T } | null = null
  try {
    payload = (await response.json()) as { success?: boolean; message?: string; data?: T }
  } catch {
    payload = null
  }

  if (!response.ok || !payload?.success) {
    throw new UsersApiError(
      payload?.message ?? 'No se pudo completar la operación con usuarios.',
      response.status,
    )
  }

  return payload.data as T
}

export async function fetchUsers() {
  const data = await request<{ users: Record<string, unknown>[] }>('/api/admin/users')
  return data.users
}

export async function createUserRecord(input: AdminUserInput & { password: string }) {
  const data = await request<{ user: Record<string, unknown> }>('/api/admin/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  return data.user
}

export async function updateUserRecord(
  id: string,
  input: Partial<AdminUserInput> & { password?: string },
) {
  const data = await request<{ user: Record<string, unknown> }>(
    `/api/admin/users/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
  )
  return data.user
}

export async function deleteUserRecord(id: string) {
  await request<{ id: string }>(`/api/admin/users/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
