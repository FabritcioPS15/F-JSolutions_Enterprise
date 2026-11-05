import {
  DeploymentEnvironment as PrismaDeploymentEnvironment,
  Prisma,
  ProjectStatus as PrismaProjectStatus,
  ProjectType as PrismaProjectType,
  type Project as PrismaProject,
  type ProjectDeployment as PrismaProjectDeployment,
} from '@prisma/client'
import type { admin } from '@fj-solutions/contracts'
import { prisma } from '../config/database'
import type {
  DeploymentWriteInput,
  ProjectListFilters,
  ProjectRepository,
  ProjectWriteInput,
} from './project.repository'

type ProjectWithDeployments = PrismaProject & { deployments: PrismaProjectDeployment[] }

const typeToAdmin: Record<PrismaProjectType, admin.WebProjectType> = {
  LANDING: 'landing',
  WEBSITE: 'website',
  WEBAPP: 'webapp',
  ECOMMERCE: 'ecommerce',
  MAINTENANCE: 'maintenance',
  SOFTWARE: 'software',
}

const typeToPrisma: Record<admin.WebProjectType, PrismaProjectType> = {
  landing: PrismaProjectType.LANDING,
  website: PrismaProjectType.WEBSITE,
  webapp: PrismaProjectType.WEBAPP,
  ecommerce: PrismaProjectType.ECOMMERCE,
  maintenance: PrismaProjectType.MAINTENANCE,
  software: PrismaProjectType.SOFTWARE,
}

const statusToAdmin: Record<PrismaProjectStatus, admin.WebProjectStatus> = {
  PLANNING: 'planning',
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  LIVE: 'live',
  PAUSED: 'paused',
  ARCHIVED: 'archived',
}

const statusToPrisma: Record<admin.WebProjectStatus, PrismaProjectStatus> = {
  planning: PrismaProjectStatus.PLANNING,
  development: PrismaProjectStatus.DEVELOPMENT,
  staging: PrismaProjectStatus.STAGING,
  live: PrismaProjectStatus.LIVE,
  paused: PrismaProjectStatus.PAUSED,
  archived: PrismaProjectStatus.ARCHIVED,
}

const environmentToAdmin: Record<
  PrismaDeploymentEnvironment,
  admin.DeploymentEnvironment
> = {
  PRODUCTION: 'production',
  STAGING: 'staging',
  PREVIEW: 'preview',
}

const environmentToPrisma: Record<
  admin.DeploymentEnvironment,
  PrismaDeploymentEnvironment
> = {
  production: PrismaDeploymentEnvironment.PRODUCTION,
  staging: PrismaDeploymentEnvironment.STAGING,
  preview: PrismaDeploymentEnvironment.PREVIEW,
}

function dateOnly(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : undefined
}

function parseDate(value?: string) {
  if (!value) return null
  return new Date(`${value.slice(0, 10)}T00:00:00.000Z`)
}

function toDeployment(record: PrismaProjectDeployment): admin.WebProjectDeployment {
  return {
    id: record.id,
    environment: environmentToAdmin[record.environment],
    url: record.url,
    version: record.version ?? undefined,
    note: record.note ?? undefined,
    deployedAt: record.deployedAt.toISOString(),
  }
}

function toAdmin(record: ProjectWithDeployments): admin.WebProject {
  return {
    id: record.id,
    name: record.name,
    clientId: record.clientId ?? undefined,
    clientName: record.clientName ?? '',
    type: typeToAdmin[record.type],
    status: statusToAdmin[record.status],
    productionUrl: record.productionUrl ?? '',
    stagingUrl: record.stagingUrl ?? '',
    repoUrl: record.repoUrl ?? '',
    hosting: record.hosting ?? '',
    domain: record.domain ?? '',
    responsible: record.responsibleName ?? '',
    credentialLocation: record.credentialLocation ?? '',
    launchedAt: dateOnly(record.launchedAt),
    renewalAt: dateOnly(record.renewalAt),
    notes: record.notes ?? '',
    deployments: [...record.deployments]
      .sort((a, b) => b.deployedAt.getTime() - a.deployedAt.getTime())
      .map(toDeployment),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  }
}

function toWriteData(input: ProjectWriteInput) {
  return {
    name: input.name,
    clientId: input.clientId?.trim() || null,
    clientName: input.clientName.trim() || null,
    type: typeToPrisma[input.type],
    status: statusToPrisma[input.status],
    responsibleName: input.responsible.trim() || null,
    productionUrl: input.productionUrl.trim() || null,
    stagingUrl: input.stagingUrl.trim() || null,
    repoUrl: input.repoUrl.trim() || null,
    hosting: input.hosting.trim() || null,
    domain: input.domain.trim() || null,
    credentialLocation: input.credentialLocation.trim() || null,
    launchedAt: parseDate(input.launchedAt),
    renewalAt: parseDate(input.renewalAt),
    notes: input.notes.trim() || null,
  }
}

const includeDeployments = { deployments: true } as const

export const prismaProjectRepository: ProjectRepository = {
  async list(filters: ProjectListFilters) {
    const where: Prisma.ProjectWhereInput = {}
    if (filters.status) where.status = statusToPrisma[filters.status]
    if (filters.type) where.type = typeToPrisma[filters.type]
    if (filters.q) {
      where.OR = [
        { name: { contains: filters.q, mode: 'insensitive' } },
        { clientName: { contains: filters.q, mode: 'insensitive' } },
        { domain: { contains: filters.q, mode: 'insensitive' } },
        { hosting: { contains: filters.q, mode: 'insensitive' } },
        { responsibleName: { contains: filters.q, mode: 'insensitive' } },
        { productionUrl: { contains: filters.q, mode: 'insensitive' } },
        { stagingUrl: { contains: filters.q, mode: 'insensitive' } },
      ]
    }

    const rows = await prisma.project.findMany({
      where,
      include: includeDeployments,
      orderBy: { createdAt: 'desc' },
    })
    return rows.map(toAdmin)
  },

  async findById(id: string) {
    const row = await prisma.project.findUnique({
      where: { id },
      include: includeDeployments,
    })
    return row ? toAdmin(row) : null
  },

  async create(input: ProjectWriteInput) {
    const row = await prisma.project.create({
      data: toWriteData(input),
      include: includeDeployments,
    })
    return toAdmin(row)
  },

  async update(id: string, input: ProjectWriteInput) {
    try {
      const row = await prisma.project.update({
        where: { id },
        data: toWriteData(input),
        include: includeDeployments,
      })
      return toAdmin(row)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null
      }
      throw error
    }
  },

  async delete(id: string) {
    try {
      await prisma.project.delete({ where: { id } })
      return true
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false
      }
      throw error
    }
  },

  async addDeployment(projectId: string, input: DeploymentWriteInput) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    })
    if (!project) return null

    const url = input.url.trim()
    const record = await prisma.$transaction(async (tx) => {
      const created = await tx.projectDeployment.create({
        data: {
          projectId,
          environment: environmentToPrisma[input.environment],
          url,
          version: input.version?.trim() || null,
          note: input.note?.trim() || null,
          deployedAt: input.deployedAt ? new Date(input.deployedAt) : new Date(),
        },
      })

      const urlPatch =
        input.environment === 'production'
          ? { productionUrl: url }
          : input.environment === 'staging'
            ? { stagingUrl: url }
            : {}
      if (Object.keys(urlPatch).length > 0) {
        await tx.project.update({ where: { id: projectId }, data: urlPatch })
      }

      return created
    })

    return toDeployment(record)
  },

  async clientExists(id: string) {
    const count = await prisma.client.count({ where: { id } })
    return count > 0
  },
}
