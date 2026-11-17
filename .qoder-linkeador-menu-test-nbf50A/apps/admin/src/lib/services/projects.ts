import type {
  DeploymentInput,
  WebProject,
  WebProjectDeployment,
  WebProjectInput,
} from '@fj-solutions/contracts/admin'

type Envelope<T> = {
  success: boolean
  data?: T
  message?: string
}

export class ProjectApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = 'ProjectApiError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path ? `/api/projects/${path}` : '/api/projects', {
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
    throw new ProjectApiError(
      payload.message ?? 'No se pudo completar la operación de proyectos.',
      response.status
    )
  }

  return payload.data as T
}

const REMOTE_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function payload(input: WebProjectInput) {
  return {
    name: input.name,
    clientId: input.clientId && REMOTE_ID.test(input.clientId) ? input.clientId : '',
    clientName: input.clientName,
    type: input.type,
    status: input.status,
    productionUrl: input.productionUrl,
    stagingUrl: input.stagingUrl,
    repoUrl: input.repoUrl,
    hosting: input.hosting,
    domain: input.domain,
    responsible: input.responsible,
    credentialLocation: input.credentialLocation,
    launchedAt: input.launchedAt ?? null,
    renewalAt: input.renewalAt ?? null,
    notes: input.notes,
  }
}

export function fetchProjects(): Promise<WebProject[]> {
  return request<WebProject[]>('')
}

export function fetchProject(id: string): Promise<WebProject> {
  return request<WebProject>(encodeURIComponent(id))
}

export function createProject(input: WebProjectInput): Promise<WebProject> {
  return request<WebProject>('', {
    method: 'POST',
    body: JSON.stringify(payload(input)),
  })
}

export function updateProject(id: string, input: WebProjectInput): Promise<WebProject> {
  return request<WebProject>(encodeURIComponent(id), {
    method: 'PUT',
    body: JSON.stringify(payload(input)),
  })
}

export async function saveProject(project: WebProject): Promise<WebProject> {
  if (!REMOTE_ID.test(project.id)) return createProject(project)
  try {
    return await updateProject(project.id, project)
  } catch (error) {
    if (error instanceof ProjectApiError && error.status === 404) {
      return createProject(project)
    }
    throw error
  }
}

export async function ensureProject(project: WebProject): Promise<WebProject> {
  return REMOTE_ID.test(project.id) ? project : createProject(project)
}

export async function deleteProject(id: string) {
  try {
    await request(encodeURIComponent(id), { method: 'DELETE' })
  } catch (error) {
    if (error instanceof ProjectApiError && error.status === 404) return
    throw error
  }
}

export function createDeployment(
  projectId: string,
  input: DeploymentInput
): Promise<WebProjectDeployment> {
  return request<WebProjectDeployment>(`${encodeURIComponent(projectId)}/deployments`, {
    method: 'POST',
    body: JSON.stringify({
      environment: input.environment,
      url: input.url,
      version: input.version ?? undefined,
      note: input.note ?? undefined,
      deployedAt: input.deployedAt ?? undefined,
    }),
  })
}
