import type { admin } from '@fj-solutions/contracts'
import type {
  ServiceOfferingListFilters,
  ServiceOfferingRepository,
  ServiceOfferingWriteInput,
} from '../src/repositories/service-offering.repository'
import { ServiceOfferingService } from '../src/services/service-offering.service'

const NOW = '2026-11-04T10:00:00.000Z'

function offering(
  overrides: Partial<admin.ServiceOffering> & Pick<admin.ServiceOffering, 'id' | 'slug' | 'title'>
): admin.ServiceOffering {
  return {
    id: overrides.id,
    slug: overrides.slug,
    title: overrides.title,
    category: 'Soporte TI',
    summary: 'Resumen válido del servicio.',
    intro: 'Introducción válida del servicio.',
    includes: [{ title: 'Alcance', copy: 'Detalle del alcance.' }],
    faq: [],
    related: [],
    status: 'draft',
    position: 0,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  }
}

function input(
  overrides: Partial<admin.ServiceOfferingInput> &
    Pick<admin.ServiceOfferingInput, 'slug' | 'title'>
): admin.ServiceOfferingInput {
  return {
    slug: overrides.slug,
    title: overrides.title,
    category: 'Soporte TI',
    summary: 'Resumen válido del servicio.',
    intro: 'Introducción válida del servicio.',
    includes: [{ title: 'Alcance', copy: 'Detalle del alcance.' }],
    faq: [],
    related: [],
    status: 'draft',
    position: 0,
    ...overrides,
  }
}

class FakeServiceOfferingRepository implements ServiceOfferingRepository {
  services: admin.ServiceOffering[] = []

  async list(filters: ServiceOfferingListFilters) {
    return this.services.filter((service) => {
      const matchesQuery =
        !filters.q ||
        `${service.title} ${service.slug} ${service.summary}`
          .toLowerCase()
          .includes(filters.q.toLowerCase())
      const matchesStatus = !filters.status || service.status === filters.status
      const matchesCategory = !filters.category || service.category === filters.category
      return matchesQuery && matchesStatus && matchesCategory
    })
  }

  async listPublished() {
    return this.services.filter((service) => service.status === 'published')
  }

  async findById(id: string) {
    return this.services.find((service) => service.id === id) ?? null
  }

  async findBySlug(slug: string) {
    return this.services.find((service) => service.slug === slug) ?? null
  }

  async create(payload: ServiceOfferingWriteInput) {
    const service: admin.ServiceOffering = {
      ...payload,
      heroImage: payload.heroImage,
      id: `servicio-${this.services.length + 1}`,
      createdAt: NOW,
      updatedAt: NOW,
    }
    this.services.push(service)
    return service
  }

  async update(id: string, payload: ServiceOfferingWriteInput) {
    const index = this.services.findIndex((service) => service.id === id)
    if (index === -1) return null
    const updated: admin.ServiceOffering = {
      ...payload,
      heroImage: payload.heroImage,
      id,
      createdAt: this.services[index].createdAt,
      updatedAt: NOW,
    }
    this.services[index] = updated
    return updated
  }

  async delete(id: string) {
    const index = this.services.findIndex((service) => service.id === id)
    if (index === -1) return false
    this.services.splice(index, 1)
    return true
  }

  async existingSlugs(slugs: string[]) {
    return new Set(
      this.services
        .map((service) => service.slug)
        .filter((slug) => slugs.includes(slug))
    )
  }
}

function seededRepository() {
  const repository = new FakeServiceOfferingRepository()
  repository.services = [
    offering({
      id: 'servicio-1',
      slug: 'soporte-remoto',
      title: 'Soporte remoto',
      status: 'published',
      position: 1,
    }),
    offering({
      id: 'servicio-2',
      slug: 'redes-empresariales',
      title: 'Redes empresariales',
      category: 'Infraestructura TI',
      status: 'published',
      position: 2,
    }),
    offering({
      id: 'servicio-3',
      slug: 'sistema-de-ventas',
      title: 'Sistema de ventas',
      category: 'Desarrollo de software',
      status: 'draft',
      position: 3,
    }),
  ]
  return repository
}

describe('ServiceOfferingService — creación', () => {
  it('normaliza el contenido y crea un borrador sin permiso de publicación', async () => {
    const repository = seededRepository()
    const service = new ServiceOfferingService(repository)

    const created = await service.create(
      {
        slug: ' Soporte-Hibrido ',
        title: ' Soporte híbrido ',
        category: 'Soporte TI',
        summary: '  Atención remota para tu equipo.  ',
        intro: '  Resolvemos incidencias a distancia.  ',
        includes: [
          { title: ' Mesa de ayuda ', copy: ' Atención de tickets. ' },
          { title: 'Solo título', copy: '   ' },
        ],
        faq: [{ question: '¿Incluye visitas?', answer: 'No, es remoto.' }],
        related: ['REDES-EMPRESARIALES', 'redes-empresariales'],
        status: 'draft',
        position: 4,
      },
      { canPublish: false }
    )

    expect(created.slug).toBe('soporte-hibrido')
    expect(created.title).toBe('Soporte híbrido')
    expect(created.summary).toBe('Atención remota para tu equipo.')
    expect(created.includes).toEqual([{ title: 'Mesa de ayuda', copy: 'Atención de tickets.' }])
    expect(created.related).toEqual(['redes-empresariales'])
    expect(created.status).toBe('draft')
  })

  it('rechaza crear un servicio publicado sin permiso', async () => {
    const repository = seededRepository()
    const service = new ServiceOfferingService(repository)

    await expect(
      service.create(
        input({ slug: 'monitoreo-red', title: 'Monitoreo de red', status: 'published' }),
        { canPublish: false }
      )
    ).rejects.toMatchObject({ statusCode: 403 })
  })

  it('exige alcances antes de publicar', async () => {
    const repository = seededRepository()
    const service = new ServiceOfferingService(repository)

    await expect(
      service.create(
        input({ slug: 'monitoreo-red', title: 'Monitoreo de red', status: 'published', includes: [] }),
        { canPublish: true }
      )
    ).rejects.toMatchObject({ statusCode: 400 })
  })

  it('rechaza slugs duplicados ignorando mayúsculas', async () => {
    const repository = seededRepository()
    const service = new ServiceOfferingService(repository)

    await expect(
      service.create(input({ slug: 'Soporte-Remoto', title: 'Duplicado' }), { canPublish: true })
    ).rejects.toMatchObject({ statusCode: 409 })
  })

  it('rechaza servicios relacionados inexistentes', async () => {
    const repository = seededRepository()
    const service = new ServiceOfferingService(repository)

    await expect(
      service.create(
        input({
          slug: 'respaldo-corporativo',
          title: 'Respaldo corporativo',
          related: ['redes-empresariales', 'servicio-fantasma'],
        }),
        { canPublish: true }
      )
    ).rejects.toMatchObject({
      statusCode: 400,
      message: 'Estos servicios relacionados no existen: servicio-fantasma.',
    })
  })
})

describe('ServiceOfferingService — actualización', () => {
  it('permite editar contenido sin permiso mientras siga en borrador', async () => {
    const repository = seededRepository()
    const service = new ServiceOfferingService(repository)

    const updated = await service.update(
      'servicio-3',
      { title: 'Sistema de ventas e inventario', position: 9 },
      { canPublish: false }
    )

    expect(updated.title).toBe('Sistema de ventas e inventario')
    expect(updated.status).toBe('draft')
    expect(updated.position).toBe(9)
    expect(updated.includes).toEqual([{ title: 'Alcance', copy: 'Detalle del alcance.' }])
  })

  it('bloquea cambios de estado sin permiso de publicación', async () => {
    const repository = seededRepository()
    const service = new ServiceOfferingService(repository)

    await expect(
      service.update('servicio-3', { status: 'published' }, { canPublish: false })
    ).rejects.toMatchObject({ statusCode: 403 })

    await expect(
      service.update('servicio-1', { status: 'archived' }, { canPublish: false })
    ).rejects.toMatchObject({ statusCode: 403 })
  })

  it('publica cuando hay alcances y permiso', async () => {
    const repository = seededRepository()
    const service = new ServiceOfferingService(repository)

    const updated = await service.update('servicio-3', { status: 'published' }, { canPublish: true })

    expect(updated.status).toBe('published')
    expect(repository.services.find((item) => item.id === 'servicio-3')?.status).toBe('published')
  })

  it('rechaza cambiar el slug a uno ya ocupado', async () => {
    const repository = seededRepository()
    const service = new ServiceOfferingService(repository)

    await expect(
      service.update('servicio-3', { slug: 'soporte-remoto' }, { canPublish: true })
    ).rejects.toMatchObject({ statusCode: 409 })
  })

  it('permite conservar su propio slug', async () => {
    const repository = seededRepository()
    const service = new ServiceOfferingService(repository)

    const updated = await service.update(
      'servicio-1',
      { slug: 'soporte-remoto', title: 'Soporte remoto empresarial' },
      { canPublish: true }
    )

    expect(updated.slug).toBe('soporte-remoto')
    expect(updated.title).toBe('Soporte remoto empresarial')
  })

  it('rechaza relacionarse consigo mismo', async () => {
    const repository = seededRepository()
    const service = new ServiceOfferingService(repository)

    await expect(
      service.update('servicio-1', { related: ['soporte-remoto'] }, { canPublish: true })
    ).rejects.toMatchObject({
      statusCode: 400,
      message: 'Un servicio no puede relacionarse consigo mismo.',
    })
  })

  it('permite quitar la imagen destacada con null', async () => {
    const repository = seededRepository()
    repository.services[0] = offering({
      ...repository.services[0],
      heroImage: { src: '/img/soporte.jpg', alt: 'Soporte remoto' },
    })
    const service = new ServiceOfferingService(repository)

    const updated = await service.update('servicio-1', { heroImage: null }, { canPublish: true })

    expect(updated.heroImage).toBeUndefined()
  })

  it('devuelve 404 al actualizar un servicio inexistente', async () => {
    const repository = seededRepository()
    const service = new ServiceOfferingService(repository)

    await expect(
      service.update('servicio-fantasma', { title: 'Fantasma' }, { canPublish: true })
    ).rejects.toMatchObject({ statusCode: 404 })
  })
})

describe('ServiceOfferingService — lectura y borrado', () => {
  it('solo expone servicios publicados por slug', async () => {
    const repository = seededRepository()
    const service = new ServiceOfferingService(repository)

    const published = await service.getPublishedBySlug('soporte-remoto')
    expect(published.id).toBe('servicio-1')

    await expect(service.getPublishedBySlug('sistema-de-ventas')).rejects.toMatchObject({
      statusCode: 404,
    })
    await expect(service.getPublishedBySlug('servicio-fantasma')).rejects.toMatchObject({
      statusCode: 404,
    })
  })

  it('filtra el catálogo público por categoría', async () => {
    const repository = seededRepository()
    const service = new ServiceOfferingService(repository)

    const published = await service.listPublished()
    expect(published.map((item) => item.slug)).toEqual([
      'soporte-remoto',
      'redes-empresariales',
    ])

    const infrastructure = await service.listPublished('Infraestructura TI')
    expect(infrastructure.map((item) => item.slug)).toEqual(['redes-empresariales'])
  })

  it('elimina servicios existentes y devuelve 404 para inexistentes', async () => {
    const repository = seededRepository()
    const service = new ServiceOfferingService(repository)

    await service.delete('servicio-3')
    expect(repository.services.map((item) => item.slug)).toEqual([
      'soporte-remoto',
      'redes-empresariales',
    ])

    await expect(service.delete('servicio-3')).rejects.toMatchObject({ statusCode: 404 })
  })
})
