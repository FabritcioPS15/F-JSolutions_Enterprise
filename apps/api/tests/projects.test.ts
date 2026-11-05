import type { admin } from '@fj-solutions/contracts'
import type {
  DeploymentWriteInput,
  ProjectListFilters,
  ProjectRepository,
  ProjectWriteInput,
} from '../src/repositories/project.repository'
import { ProjectService } from '../src/services/project.service'

const NOW = '2026-11-04T10:00:00.000Z'
const PROJECT_ID = '11111111-1111-4111-8111-111111111111'
const CLIENT_ID = '22222222-2222-4222-8222-222222222222'

function project(
  overrides: Partial<admin.WebProject> & Pick<admin.WebProject, 'id' | 'name'>
): admin.WebProject {
  return {
    id: overrides.id,
    name: overrides.name,
    clientName: 'Banco Andino',
    type: 'webapp',
    status: 'live',
    productionUrl: 'https://proveedores.bancoandino.pe',
    stagingUrl: 'https://staging-proveedores.bancoandino.pe',
    repoUrl: 'https://github.com/fjsystems/portal-andino',
    hosting: 'Vercel',
    domain: 'proveedores.bancoandino.pe',
    responsible: 'Fabritcio Peña',
    credentialLocation: 'Bitwarden · Clientes/Banco Andino',
    launchedAt: '2026-09-15',
    renewalAt: '2027-03-15',
    notes: 'Soporte mensual.',
    deployments: [],
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  }
}

function input(
  overrides: Partial<admin.WebProjectInput> &
    Pick<admin.WebProjectInput, 'name'>
): admin.WebProjectInput {
  return {
    name: overrides.name,
    clientName: 'Banco Andino',
    type: 'webapp',
    status: 'development',
    productionUrl: '',
    stagingUrl: '',
    repoUrl: '',
    hosting: '',
    domain: '',
    responsible: 'Fabritcio Peña',
    credentialLocation: '',
    notes: '',
    ...overrides,
  }
}

class FakeProjectRepository implements ProjectRepository {
  projects: admin.WebProject[] = []
  clients = new Set<string>()

  async list(filters: ProjectListFilters) {
    return this.projects.filter((item) => {
      const matchesQuery =
        !filters.q ||
        `${item.name} ${item.clientName} ${item.domain}`
          .toLowerCase()
          .includes(filters.q.toLowerCase())
      const matchesStatus = !filters.status || item.status === filters.status
      const matchesType = !filters.type || item.type === filters.type
      return matchesQuery && matchesStatus && matchesType
    })
  }

  async findById(id: string) {
    return this.projects.find((item) => item.id === id) ?? null
  }

  async create(payload: ProjectWriteInput) {
    const created = project({ id: PROJECT_ID, ...payload })
    this.projects.push(created)
    return created
  }

  async update(id: string, payload: ProjectWriteInput) {
    const index = this.projects.findIndex((item) => item.id === id)
    if (index === -1) return null
    const updated = { ...this.projects[index], ...payload, updatedAt: NOW }
    this.projects[index] = updated
    return updated
  }

  async delete(id: string) {
    const index = this.projects.findIndex((item) => item.id === id)
    if (index === -1) return false
    this.projects.splice(index, 1)
    return true
  }

  async addDeployment(projectId: string, payload: DeploymentWriteInput) {
    const index = this.projects.findIndex((item) => item.id === projectId)
    if (index === -1) return null
    const deployment: admin.WebProjectDeployment = {
      id: '33333333-3333-4333-8333-333333333333',
      environment: payload.environment,
      url: payload.url,
      version: payload.version,
      note: payload.note,
      deployedAt: payload.deployedAt ?? NOW,
    }
    this.projects[index] = {
      ...this.projects[index],
      deployments: [deployment, ...this.projects[index].deployments],
      productionUrl:
        payload.environment === 'production'
          ? payload.url
          : this.projects[index].productionUrl,
    }
    return deployment
  }

  async clientExists(id: string) {
    return this.clients.has(id)
  }
}

function seededRepository() {
  const repository = new FakeProjectRepository()
  repository.projects = [
    project({ id: PROJECT_ID, name: 'Portal de proveedores' }),
    project({
      id: '44444444-4444-4444-8444-444444444444',
      name: 'Sitio del colegio',
      type: 'website',
      status: 'planning',
      domain: 'sanagustin.edu.pe',
    }),
  ]
  repository.clients.add(CLIENT_ID)
  return repository
}

describe('ProjectService', () => {
  it('filtra por texto, estado y tipo', async () => {
    const repository = seededRepository()
    const service = new ProjectService(repository)

    expect(await service.list({ q: 'colegio' })).toHaveLength(1)
    expect(await service.list({ status: 'live' })).toHaveLength(1)
    expect(await service.list({ type: 'website', status: 'planning' })).toHaveLength(1)
  })

  it('crea un proyecto aplicando valores por defecto y limpiando espacios', async () => {
    const repository = seededRepository()
    const service = new ProjectService(repository)

    const created = await service.create({
      name: '  Nuevo portal  ',
      clientName: '  Banco Andino ',
      responsible: ' Fabritcio ',
      notes: '  Notas  ',
    })

    expect(created.name).toBe('Nuevo portal')
    expect(created.clientName).toBe('Banco Andino')
    expect(created.responsible).toBe('Fabritcio')
    expect(created.type).toBe('website')
    expect(created.status).toBe('planning')
    expect(created.notes).toBe('Notas')
  })

  it('rechaza proyectos sin nombre', async () => {
    const service = new ProjectService(seededRepository())
    await expect(service.create({ name: ' ' })).rejects.toMatchObject({ statusCode: 400 })
  })

  it('rechaza URLs inválidas', async () => {
    const service = new ProjectService(seededRepository())
    await expect(
      service.create(input({ name: 'Portal', productionUrl: 'midominio.pe' }))
    ).rejects.toMatchObject({ statusCode: 400 })
  })

  it('rechaza un identificador de cliente que no es UUID', async () => {
    const service = new ProjectService(seededRepository())
    await expect(
      service.create(input({ name: 'Portal', clientId: 'banco-andino' }))
    ).rejects.toMatchObject({ statusCode: 400 })
  })

  it('rechaza un cliente que no existe en la base de datos', async () => {
    const service = new ProjectService(seededRepository())
    await expect(
      service.create(input({ name: 'Portal', clientId: PROJECT_ID }))
    ).rejects.toMatchObject({ statusCode: 400 })
  })

  it('acepta un cliente existente', async () => {
    const service = new ProjectService(seededRepository())
    const created = await service.create(
      input({ name: 'Portal', clientId: CLIENT_ID })
    )
    expect(created.clientName).toBe('Banco Andino')
  })

  it('actualiza campos parciales y conserva el resto', async () => {
    const repository = seededRepository()
    const service = new ProjectService(repository)

    const updated = await service.update(PROJECT_ID, {
      name: 'Portal de proveedores 2.0',
      status: 'staging',
    })

    expect(updated.name).toBe('Portal de proveedores 2.0')
    expect(updated.status).toBe('staging')
    expect(updated.domain).toBe('proveedores.bancoandino.pe')
    expect(updated.launchedAt).toBe('2026-09-15')
  })

  it('permite limpiar la fecha de lanzamiento', async () => {
    const repository = seededRepository()
    const service = new ProjectService(repository)

    const updated = await service.update(PROJECT_ID, { launchedAt: null })

    expect(updated.launchedAt).toBeUndefined()
  })

  it('devuelve 404 al actualizar un proyecto inexistente', async () => {
    const service = new ProjectService(seededRepository())
    await expect(
      service.update('55555555-5555-4555-8555-555555555555', { name: 'Otro' })
    ).rejects.toMatchObject({ statusCode: 404 })
  })

  it('elimina un proyecto y devuelve 404 si ya no existe', async () => {
    const repository = seededRepository()
    const service = new ProjectService(repository)

    await service.delete(PROJECT_ID)
    expect(repository.projects).toHaveLength(1)
    await expect(service.delete(PROJECT_ID)).rejects.toMatchObject({ statusCode: 404 })
  })

  it('exige una URL al registrar un despliegue', async () => {
    const service = new ProjectService(seededRepository())
    await expect(
      service.registerDeployment(PROJECT_ID, { environment: 'production', url: ' ' })
    ).rejects.toMatchObject({ statusCode: 400 })
  })

  it('rechaza despliegues con URL inválida', async () => {
    const service = new ProjectService(seededRepository())
    await expect(
      service.registerDeployment(PROJECT_ID, { environment: 'production', url: 'ftp://host' })
    ).rejects.toMatchObject({ statusCode: 400 })
  })

  it('rechaza despliegues de proyectos inexistentes', async () => {
    const service = new ProjectService(seededRepository())
    await expect(
      service.registerDeployment('55555555-5555-4555-8555-555555555555', {
        environment: 'production',
        url: 'https://midominio.pe',
      })
    ).rejects.toMatchObject({ statusCode: 404 })
  })

  it('registra el despliegue y actualiza la URL de producción', async () => {
    const repository = seededRepository()
    const service = new ProjectService(repository)

    const deployment = await service.registerDeployment(PROJECT_ID, {
      environment: 'production',
      url: 'https://nuevo.midominio.pe',
      version: ' v2.0.0 ',
      note: ' Salida a producción ',
    })

    expect(deployment.url).toBe('https://nuevo.midominio.pe')
    expect(deployment.version).toBe('v2.0.0')
    expect(deployment.note).toBe('Salida a producción')
    expect(repository.projects[0].productionUrl).toBe('https://nuevo.midominio.pe')
  })
})
