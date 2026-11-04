import type { admin } from '@fj-solutions/contracts'
import { AppError } from '../middleware/error-handler'
import { prismaServiceOfferingRepository } from '../repositories/prisma-service-offering.repository'
import type {
  ServiceOfferingListFilters,
  ServiceOfferingRepository,
  ServiceOfferingWriteInput,
} from '../repositories/service-offering.repository'

export type ServiceOfferingPayload = Partial<admin.ServiceOfferingInput> & {
  heroImage?: admin.ServiceHeroImage | null
}

export type ServiceOfferingCreatePayload = Omit<admin.ServiceOfferingInput, 'status' | 'position'> & {
  heroImage?: admin.ServiceHeroImage | null
  status?: admin.ServiceOfferingStatus
  position?: number
}

type WriteOptions = {
  canPublish: boolean
}

function text(value: string | null | undefined) {
  return value?.trim() ?? ''
}

function normalizePayload(payload: ServiceOfferingPayload): ServiceOfferingWriteInput {
  const related = Array.from(
    new Set(
      (payload.related ?? [])
        .map((slug) => slug.trim().toLowerCase())
        .filter((slug) => slug.length > 0)
    )
  )

  const includes = (payload.includes ?? [])
    .map((entry) => ({ title: text(entry.title), copy: text(entry.copy) }))
    .filter((entry) => entry.title.length > 0 && entry.copy.length > 0)

  const faq = (payload.faq ?? [])
    .map((entry) => ({ question: text(entry.question), answer: text(entry.answer) }))
    .filter((entry) => entry.question.length > 0 && entry.answer.length > 0)

  const heroImage =
    payload.heroImage && text(payload.heroImage.src) && text(payload.heroImage.alt)
      ? { src: text(payload.heroImage.src), alt: text(payload.heroImage.alt) }
      : undefined

  return {
    slug: text(payload.slug).toLowerCase(),
    title: text(payload.title),
    category: payload.category ?? 'Soporte TI',
    summary: text(payload.summary),
    intro: text(payload.intro),
    heroImage,
    includes,
    faq,
    related,
    status: payload.status ?? 'draft',
    position: Math.max(0, Math.trunc(payload.position ?? 0)),
  }
}

function mergeWithCurrent(
  current: admin.ServiceOffering,
  payload: ServiceOfferingPayload
): ServiceOfferingPayload {
  return {
    slug: payload.slug ?? current.slug,
    title: payload.title ?? current.title,
    category: payload.category ?? current.category,
    summary: payload.summary ?? current.summary,
    intro: payload.intro ?? current.intro,
    heroImage: 'heroImage' in payload ? payload.heroImage : current.heroImage,
    includes: payload.includes ?? current.includes,
    faq: payload.faq ?? current.faq,
    related: payload.related ?? current.related,
    status: payload.status ?? current.status,
    position: payload.position ?? current.position,
  }
}

function assertContent(input: ServiceOfferingWriteInput) {
  if (!input.slug || input.slug.length < 2) {
    throw new AppError('El slug del servicio es obligatorio.', 400)
  }
  if (input.title.length < 2) {
    throw new AppError('El título del servicio es obligatorio.', 400)
  }
  if (input.summary.length < 10) {
    throw new AppError('El resumen debe tener al menos 10 caracteres.', 400)
  }
  if (input.intro.length < 10) {
    throw new AppError('La introducción debe tener al menos 10 caracteres.', 400)
  }
}

function assertPublishable(input: ServiceOfferingWriteInput) {
  assertContent(input)
  if (input.includes.length === 0) {
    throw new AppError(
      'Agrega al menos un alcance del servicio antes de publicarlo.',
      400
    )
  }
}

export class ServiceOfferingService {
  constructor(
    private readonly repository: ServiceOfferingRepository = prismaServiceOfferingRepository
  ) {}

  async list(filters: ServiceOfferingListFilters) {
    return this.repository.list(filters)
  }

  async listPublished(category?: admin.ServiceOfferingCategory) {
    const services = await this.repository.listPublished()
    return category
      ? services.filter((service) => service.category === category)
      : services
  }

  async get(id: string) {
    const service = await this.repository.findById(id)
    if (!service) throw new AppError('Servicio no encontrado.', 404)
    return service
  }

  async getPublishedBySlug(slug: string) {
    const service = await this.repository.findBySlug(slug)
    if (!service || service.status !== 'published') {
      throw new AppError('Servicio no disponible.', 404)
    }
    return service
  }

  async create(payload: ServiceOfferingCreatePayload, options: WriteOptions) {
    const input = normalizePayload(payload)
    assertContent(input)

    if (input.status !== 'draft' && !options.canPublish) {
      throw new AppError('No tienes permisos para publicar servicios.', 403)
    }
    if (input.status === 'published') {
      assertPublishable(input)
    }

    const existing = await this.repository.findBySlug(input.slug)
    if (existing) {
      throw new AppError('Ya existe un servicio con ese slug.', 409)
    }

    await this.assertRelated(input.related, null)
    return this.repository.create(input)
  }

  async update(id: string, payload: ServiceOfferingPayload, options: WriteOptions) {
    const current = await this.get(id)
    const input = normalizePayload(mergeWithCurrent(current, payload))
    assertContent(input)

    if (input.status !== current.status) {
      if (!options.canPublish) {
        throw new AppError('No tienes permisos para publicar servicios.', 403)
      }
      if (input.status === 'published') {
        assertPublishable(input)
      }
    }

    if (input.slug !== current.slug) {
      const existing = await this.repository.findBySlug(input.slug)
      if (existing && existing.id !== id) {
        throw new AppError('Ya existe un servicio con ese slug.', 409)
      }
    }

    await this.assertRelated(input.related, input.slug)

    const updated = await this.repository.update(id, input)
    if (!updated) throw new AppError('Servicio no encontrado.', 404)
    return updated
  }

  async updateStatus(id: string, status: admin.ServiceOfferingStatus) {
    return this.update(id, { status }, { canPublish: true })
  }

  async delete(id: string) {
    const deleted = await this.repository.delete(id)
    if (!deleted) throw new AppError('Servicio no encontrado.', 404)
  }

  private async assertRelated(related: string[], ownSlug: string | null) {
    if (ownSlug && related.includes(ownSlug)) {
      throw new AppError('Un servicio no puede relacionarse consigo mismo.', 400)
    }
    if (related.length === 0) return

    const existing = await this.repository.existingSlugs(related)
    const missing = related.filter((slug) => !existing.has(slug))
    if (missing.length > 0) {
      throw new AppError(
        `Estos servicios relacionados no existen: ${missing.join(', ')}.`,
        400
      )
    }
  }
}

export const serviceOfferingService = new ServiceOfferingService()
