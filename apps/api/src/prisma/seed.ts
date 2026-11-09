import 'dotenv/config'
import { PrismaClient, type Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

type PermissionSeed = {
  module: string
  action: string
  description: string
}

const MODULES: Record<string, string[]> = {
  dashboard: ['view'],
  reports: ['view'],
  products: ['view', 'create', 'update', 'delete', 'publish'],
  categories: ['view', 'create', 'update', 'delete'],
  brands: ['view', 'create', 'update', 'delete'],
  inventory: ['view', 'manage'],
  clients: ['view', 'create', 'update', 'delete'],
  quotes: ['view', 'create', 'update', 'delete', 'manage-status'],
  requests: ['view', 'create', 'update', 'delete', 'reply', 'assign'],
  services: ['view', 'create', 'update', 'delete', 'publish'],
  projects: ['view', 'create', 'update', 'delete', 'manage-deployments'],
  tasks: ['view', 'create', 'update', 'delete'],
  users: ['view', 'create', 'update', 'delete'],
  roles: ['view', 'create', 'update', 'delete'],
  settings: ['view', 'update'],
  audit: ['view'],
  media: ['view', 'upload', 'delete'],
  notifications: ['view', 'manage'],
}

const ACTION_LABELS: Record<string, string> = {
  view: 'Ver',
  create: 'Crear',
  update: 'Editar',
  delete: 'Eliminar',
  publish: 'Publicar',
  manage: 'Gestionar',
  'manage-status': 'Cambiar estado',
  reply: 'Responder',
  assign: 'Asignar',
  'manage-deployments': 'Gestionar despliegues',
  upload: 'Subir archivos',
}

const MODULE_LABELS: Record<string, string> = {
  dashboard: 'Panel general',
  reports: 'Reportes',
  products: 'Productos',
  categories: 'Categorías',
  brands: 'Marcas',
  inventory: 'Inventario',
  clients: 'Clientes',
  quotes: 'Cotizaciones',
  requests: 'Mesa de ayuda',
  services: 'Servicios TI',
  projects: 'Proyectos',
  tasks: 'Tareas',
  users: 'Usuarios',
  roles: 'Roles y permisos',
  settings: 'Configuración',
  audit: 'Auditoría',
  media: 'Archivos',
  notifications: 'Notificaciones',
}

const ALL_PERMISSIONS: PermissionSeed[] = Object.entries(MODULES).flatMap(
  ([module, actions]) =>
    actions.map((action) => ({
      module,
      action,
      description: `${ACTION_LABELS[action] ?? action} · ${MODULE_LABELS[module] ?? module}`,
    }))
)

const keyOf = (permission: PermissionSeed) => `${permission.module}.${permission.action}`

const ALL_KEYS = ALL_PERMISSIONS.map(keyOf)

const VIEW_KEYS = ALL_KEYS.filter(
  (key) => key.endsWith('.view') && !key.startsWith('users.') && !key.startsWith('roles.')
)

type RoleSeed = {
  key: string
  name: string
  description: string
  permissions: string[]
}

const ROLES: RoleSeed[] = [
  {
    key: 'superadmin',
    name: 'Superadministrador',
    description: 'Acceso total al sistema, incluida la gestión de roles y permisos.',
    permissions: ALL_KEYS,
  },
  {
    key: 'admin',
    name: 'Administrador',
    description: 'Gestiona la operación completa sin administrar roles ni cuentas del sistema.',
    permissions: ALL_KEYS.filter(
      (key) => !key.startsWith('roles.') && !/^users\.(create|update|delete)$/.test(key)
    ),
  },
  {
    key: 'ventas',
    name: 'Ventas',
    description: 'Catálogo, clientes, cotizaciones y seguimiento comercial.',
    permissions: [
      'dashboard.view',
      'reports.view',
      'products.view',
      'categories.view',
      'brands.view',
      'inventory.view',
      'clients.view',
      'clients.create',
      'clients.update',
      'quotes.view',
      'quotes.create',
      'quotes.update',
      'quotes.manage-status',
      'requests.view',
      'requests.update',
      'requests.reply',
      'services.view',
      'projects.view',
      'settings.view',
      'media.view',
      'notifications.view',
    ],
  },
  {
    key: 'soporte',
    name: 'Soporte',
    description: 'Atención de solicitudes, clientes y proyectos asignados.',
    permissions: [
      'dashboard.view',
      'reports.view',
      'products.view',
      'inventory.view',
      'clients.view',
      'requests.view',
      'requests.create',
      'requests.update',
      'requests.reply',
      'requests.assign',
      'services.view',
      'projects.view',
      'tasks.view',
      'tasks.update',
      'media.view',
      'notifications.view',
      'notifications.manage',
    ],
  },
  {
    key: 'consulta',
    name: 'Consulta',
    description: 'Acceso de solo lectura a la información operativa.',
    permissions: VIEW_KEYS,
  },
]

const STORE_SETTING = {
  storeName: 'FJ Systems',
  legalName: 'FJ Systems S.A.C.',
  ruc: '20601234567',
  email: 'ventas@fjsystems.pe',
  phone: '+51 999 888 777',
  address: 'Av. Javier Prado Este 1234, San Isidro, Lima',
  currency: 'PEN',
  igv: 18,
  lowStockThreshold: 5,
}

const SEQUENCES = [
  { key: 'quote', prefix: 'COT', nextNumber: 1, padding: 5 },
  { key: 'service-request', prefix: 'SOL', nextNumber: 1, padding: 5 },
]

async function seedPermissions() {
  for (const permission of ALL_PERMISSIONS) {
    const key = keyOf(permission)
    await prisma.permission.upsert({
      where: { key },
      update: {
        module: permission.module,
        action: permission.action,
        description: permission.description,
      },
      create: { key, ...permission },
    })
  }

  return prisma.permission.findMany()
}

async function seedRoles() {
  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { key: role.key },
      update: { name: role.name, description: role.description, isSystem: true },
      create: {
        key: role.key,
        name: role.name,
        description: role.description,
        isSystem: true,
      },
    })
  }

  return prisma.role.findMany()
}

async function seedRolePermissions(
  roles: Awaited<ReturnType<typeof seedRoles>>,
  permissions: Awaited<ReturnType<typeof seedPermissions>>
) {
  const permissionByKey = new Map(permissions.map((permission) => [permission.key, permission]))
  const missing: string[] = []

  for (const roleSeed of ROLES) {
    const role = roles.find((item) => item.key === roleSeed.key)
    if (!role) continue

    for (const key of roleSeed.permissions) {
      const permission = permissionByKey.get(key)
      if (!permission) {
        missing.push(key)
        continue
      }

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: { roleId: role.id, permissionId: permission.id },
      })
    }
  }

  if (missing.length > 0) {
    throw new Error(`Permisos declarados en roles que no existen: ${missing.join(', ')}`)
  }
}

async function seedSuperadmin(roles: Awaited<ReturnType<typeof seedRoles>>) {
  const email = (process.env.SEED_ADMIN_EMAIL ?? 'admin@fjsolutions.com.pe').toLowerCase()
  const name = process.env.SEED_ADMIN_NAME ?? 'Administrador F&J'
  const providedPassword = process.env.SEED_ADMIN_PASSWORD
  const password = providedPassword ?? 'Admin12345!'

  if (!providedPassword) {
    console.warn(
      '[seed] SEED_ADMIN_PASSWORD no está definido: se usa la contraseña de desarrollo "Admin12345!".'
    )
    console.warn('[seed] Cámbiala antes de desplegar en producción.')
  }

  const superadmin = roles.find((role) => role.key === 'superadmin')
  if (!superadmin) throw new Error('No se encontró el rol superadmin.')

  const passwordHash = await bcrypt.hash(password, 12)
  const existing = await prisma.user.findUnique({ where: { email } })

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      roleId: superadmin.id,
      status: 'ACTIVE',
      ...(existing ? {} : { passwordHash }),
    },
    create: {
      name,
      email,
      passwordHash,
      roleId: superadmin.id,
      status: 'ACTIVE',
      company: 'F&J Systems S.A.C.',
    },
  })

  if (existing) {
    console.log(`[seed] El usuario ${email} ya existía; se conservó su contraseña actual.`)
  } else {
    console.log(`[seed] Superadmin creado: ${email}`)
  }

  return user
}

async function seedSettings() {
  await prisma.setting.upsert({
    where: { key: 'store' },
    update: { value: STORE_SETTING as Prisma.InputJsonValue },
    create: { key: 'store', value: STORE_SETTING as Prisma.InputJsonValue },
  })
}

async function seedSequences() {
  for (const sequence of SEQUENCES) {
    await prisma.documentSequence.upsert({
      where: { key: sequence.key },
      update: { prefix: sequence.prefix, padding: sequence.padding },
      create: sequence,
    })
  }
}

async function main() {
  console.log('[seed] Iniciando datos base de F&J Systems...')

  const permissions = await seedPermissions()
  const roles = await seedRoles()
  await seedRolePermissions(roles, permissions)
  await seedSuperadmin(roles)
  await seedSettings()
  await seedSequences()

  console.log(
    `[seed] Listo: ${roles.length} roles, ${permissions.length} permisos, ${SEQUENCES.length} secuencias y configuración de tienda.`
  )
}

main()
  .catch((error) => {
    console.error('[seed] Error al ejecutar el seed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
