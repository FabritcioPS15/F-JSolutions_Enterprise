import {
  Prisma,
  ServiceCategory as PrismaServiceCategory,
  ServiceStatus as PrismaServiceStatus,
  type ServiceOffering as PrismaServiceOffering,
} from '@prisma/client'
import type { admin } from '@fj-solutions/contracts'
import { prisma } from '../config/database'
import type {
  ServiceOfferingListFilters,
  ServiceOfferingRepository,
  ServiceOfferingWriteInput,
} from './service-offering.repository'

const categoryToAdmin: Record<PrismaServiceCategory, admin.ServiceOfferingCategory> = {
  SUPPORT: 'Soporte TI',
  INFRASTRUCTURE: 'Infraestructura TI',
  SOFTWARE: 'Desarrollo de software',
}

const categoryToPrisma: Record<admin.ServiceOfferingCategory, PrismaServiceCategory> = {
  'Soporte TI': PrismaServiceCategory.SUPPORT,
  'Infraestructura TI': PrismaServiceCategory.INFRASTRUCTURE,
  'Desarrollo de software': PrismaServiceCategory.SOFTWARE,
}

const statusToAdmin: Record<PrismaServiceStatus, admin.ServiceOfferingStatus> = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
}

const statusToPrisma: Record<admin.ServiceOfferingStatus, PrismaServiceStatus> = {
  draft: PrismaServiceStatus.DRAFT,
  published: PrismaServiceStatus.PUBLISHED,
  archived: PrismaServiceStatus.ARCHIVED,
}

function recordOf(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function text(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function parseIncludes(value: Prisma.JsonValue): admin.ServiceInclude[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((entry) => {
    const record = recordOf(entry)
    if (!record) return []
    const title = text(record.title)
    const copy = text(record.copy)
    return title && copy ? [{ title, copy }] : []
  })
}

function parseFaq(value: Prisma.JsonValue): admin.ServiceFaq[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((entry) => {
    const record = recordOf(entry)
    if (!record) return []
    const question = text(record.question)
    const answer = text(record.answer)
    return question && answer ? [{ question, answer }] : []
  })
}

function toAdmin(record: PrismaServiceOffering): admin.ServiceOffering {
  const heroImageSrc = record.heroImageSrc?.trim()
  const heroImageAlt = record.heroImageAlt?.trim()

  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    category: categoryToAdmin[record.category],
    summary: record.summary,
    intro: record.intro,
    heroImage:
      heroImageSrc && heroImageAlt ? { src: heroImageSrc, alt: heroImageAlt } : undefined,
    includes: parseIncludes(record.includes),
    faq: parseFaq(record.faq),
    related: record.related,
    status: statusToAdmin[record.status],
    position: record.position,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  }
}

function toWriteData(input: ServiceOfferingWriteInput) {
  return {
    slug: input.slug,
    title: input.title,
    category: categoryToPrisma[input.category],
    summary: input.summary,
    intro: input.intro,
    heroImageSrc: input.heroImage?.src.trim() || null,
    heroImageAlt: input.heroImage?.alt.trim() || null,
    includes: input.includes as unknown as Prisma.InputJsonValue,
    faq: input.faq as unknown as Prisma.InputJsonValue,
    related: input.related,
    status: statusToPrisma[input.status],
    position: input.position,
  }
}

const orderBy: Prisma.ServiceOfferingOrderByWithRelationInput[] = [
  { position: 'asc' },
  { title: 'asc' },
]

export const prismaServiceOfferingRepository: ServiceOfferingRepository = {
  async list(filters: ServiceOfferingListFilters) {
    const where: Prisma.ServiceOfferingWhereInput = {}
    if (filters.status) where.status = statusToPrisma[filters.status]
    if (filters.category) where.category = categoryToPrisma[filters.category]
    if (filters.q) {
      where.OR = [
        { title: { contains: filters.q, mode: 'insensitive' } },
        { summary: { contains: filters.q, mode: 'insensitive' } },
        { slug: { contains: filters.q, mode: 'insensitive' } },
      ]
    }

    const rows = await prisma.serviceOffering.findMany({ where, orderBy })
    return rows.map(toAdmin)
  },

  async listPublished() {
    const rows = await prisma.serviceOffering.findMany({
      where: { status: PrismaServiceStatus.PUBLISHED },
      orderBy,
    })
    return rows.map(toAdmin)
  },

  async findById(id: string) {
    const row = await prisma.serviceOffering.findUnique({ where: { id } })
    return row ? toAdmin(row) : null
  },

  async findBySlug(slug: string) {
    const row = await prisma.serviceOffering.findUnique({ where: { slug } })
    return row ? toAdmin(row) : null
  },

  async create(input: ServiceOfferingWriteInput) {
    const row = await prisma.serviceOffering.create({ data: toWriteData(input) })
    return toAdmin(row)
  },

  async update(id: string, input: ServiceOfferingWriteInput) {
    try {
      const row = await prisma.serviceOffering.update({
        where: { id },
        data: toWriteData(input),
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
      await prisma.serviceOffering.delete({ where: { id } })
      return true
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false
      }
      throw error
    }
  },

  async existingSlugs(slugs: string[]) {
    if (slugs.length === 0) return new Set<string>()
    const rows = await prisma.serviceOffering.findMany({
      where: { slug: { in: slugs } },
      select: { slug: true },
    })
    return new Set(rows.map((row) => row.slug))
  },
}
