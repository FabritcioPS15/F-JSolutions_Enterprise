import type { admin } from '@fj-solutions/contracts'
import { AppError } from '../middleware/error-handler'
import { prismaProjectRepository } from '../repositories/prisma-project.repository'
import type {
  DeploymentWriteInput,
  ProjectListFilters,
  ProjectRepository,
  ProjectWriteInput,
} from '../repositories/project.repository'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function text(value: string | null | undefined) {
  return value?.trim() ?? ''
}

function assertUrl(value: string, label: string) {
  if (!value) return
  try {
    const parsed = new URL(value)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') throw new Error()
  } catch {
    throw new AppError(`${label} no es una URL válida.`, 400)
  }
}

function normalizePayload(
  payload: Partial<admin.WebProjectInput>
): ProjectWriteInput {
  return {
    name: text(payload.name),
    clientId: text(payload.clientId) || undefined,
    clientName: text(payload.clientName),
    type: payload.type ?? 'website',
    status: payload.status ?? 'planning',
    productionUrl: text(payload.productionUrl),
    stagingUrl: text(payload.stagingUrl),
    repoUrl: text(payload.repoUrl),
    hosting: text(payload.hosting),
    domain: text(payload.domain),
    responsible: text(payload.responsible),
    credentialLocation: text(payload.credentialLocation),
    launchedAt: text(payload.launchedAt) || undefined,
    renewalAt: text(payload.renewalAt) || undefined,
    notes: text(payload.notes),
  }
}

function mergeWithCurrent(
  current: admin.WebProject,
  payload: Partial<admin.WebProjectInput>
): Partial<admin.WebProjectInput> {
  return {
    name: payload.name ?? current.name,
    clientId: 'clientId' in payload ? payload.clientId : current.clientId,
    clientName: payload.clientName ?? current.clientName,
    type: payload.type ?? current.type,
    status: payload.status ?? current.status,
    productionUrl: payload.productionUrl ?? current.productionUrl,
    stagingUrl: payload.stagingUrl ?? current.stagingUrl,
    repoUrl: payload.repoUrl ?? current.repoUrl,
    hosting: payload.hosting ?? current.hosting,
    domain: payload.domain ?? current.domain,
    responsible: payload.responsible ?? current.responsible,
    credentialLocation: payload.credentialLocation ?? current.credentialLocation,
    launchedAt: 'launchedAt' in payload ? payload.launchedAt : current.launchedAt,
    renewalAt: 'renewalAt' in payload ? payload.renewalAt : current.renewalAt,
    notes: payload.notes ?? current.notes,
  }
}

export class ProjectService {
  constructor(
    private readonly repository: ProjectRepository = prismaProjectRepository
  ) {}

  async list(filters: ProjectListFilters) {
    return this.repository.list(filters)
  }

  async get(id: string) {
    const project = await this.repository.findById(id)
    if (!project) throw new AppError('Proyecto no encontrado.', 404)
    return project
  }

  async create(payload: Partial<admin.WebProjectInput>) {
    const input = normalizePayload(payload)
    await this.assertInput(input)
    return this.repository.create(input)
  }

  async update(id: string, payload: Partial<admin.WebProjectInput>) {
    const current = await this.get(id)
    const input = normalizePayload(mergeWithCurrent(current, payload))
    await this.assertInput(input)
    const updated = await this.repository.update(id, input)
    if (!updated) throw new AppError('Proyecto no encontrado.', 404)
    return updated
  }

  async delete(id: string) {
    const deleted = await this.repository.delete(id)
    if (!deleted) throw new AppError('Proyecto no encontrado.', 404)
  }

  async registerDeployment(projectId: string, payload: Partial<DeploymentWriteInput>) {
    await this.get(projectId)
    const url = text(payload.url)
    if (!url) {
      throw new AppError('La URL del despliegue es obligatoria.', 400)
    }
    assertUrl(url, 'La URL del despliegue')

    const deployment = await this.repository.addDeployment(projectId, {
      environment: payload.environment ?? 'production',
      url,
      version: text(payload.version) || undefined,
      note: text(payload.note) || undefined,
      deployedAt: text(payload.deployedAt) || undefined,
    })
    if (!deployment) throw new AppError('Proyecto no encontrado.', 404)
    return deployment
  }

  private async assertInput(input: ProjectWriteInput) {
    if (input.name.length < 2) {
      throw new AppError('El nombre del proyecto es obligatorio.', 400)
    }
    assertUrl(input.productionUrl, 'La URL de producción')
    assertUrl(input.stagingUrl, 'La URL de staging')
    assertUrl(input.repoUrl, 'La URL del repositorio')

    if (!input.clientId) return
    if (!UUID.test(input.clientId)) {
      throw new AppError('El cliente seleccionado no es válido.', 400)
    }
    const exists = await this.repository.clientExists(input.clientId)
    if (!exists) {
      throw new AppError('El cliente seleccionado no existe.', 400)
    }
  }
}

export const projectService = new ProjectService()
