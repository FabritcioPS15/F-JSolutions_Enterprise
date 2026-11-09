import {
  allPermissionKeys,
  permissionCatalog,
  viewOnlyKeys,
} from '@fj-solutions/contracts/permissions'
import type { AdminUserRole } from './types'

// Los keys y acciones de permiso son canónicos en contracts/permissions: los
// valida la API y los dibuja la matriz de roles. Aquí solo se añade la etiqueta
// visible del módulo y el reparto por rol.
export type PermissionModule = {
  key: string
  label: string
  actions: string[]
}

export const permissionActionLabels: Record<string, string> = {
  view: 'Ver',
  create: 'Crear',
  update: 'Editar',
  delete: 'Eliminar',
  publish: 'Publicar',
  manage: 'Gestionar',
  'manage-status': 'Estados',
  'manage-delivery': 'Entregas',
  reply: 'Responder',
  assign: 'Asignar',
  'manage-deployments': 'Despliegues',
  upload: 'Subir',
}

const moduleLabels: Record<string, string> = {
  dashboard: 'Resumen',
  reports: 'Reportes',
  products: 'Productos',
  attributes: 'Atributos',
  categories: 'Categorías',
  brands: 'Marcas',
  inventory: 'Inventario',
  suppliers: 'Proveedores',
  clients: 'Clientes',
  quotes: 'Cotizaciones',
  orders: 'Pedidos y entregas',
  requests: 'Mesa de ayuda',
  services: 'Servicios TI',
  projects: 'Proyectos web',
  users: 'Usuarios',
  roles: 'Roles y permisos',
  settings: 'Configuración',
  audit: 'Actividad',
}

export const permissionModules: PermissionModule[] = permissionCatalog.map((module) => ({
  key: module.key,
  label: moduleLabels[module.key] ?? module.key,
  actions: module.actions,
}))

function grant(actionsByModule: Record<string, string[]>) {
  return Object.entries(actionsByModule).flatMap(([module, actions]) =>
    actions.map((action) => `${module}.${action}`)
  )
}

export const rolePermissions: Record<AdminUserRole, string[]> = {
  superadmin: allPermissionKeys(permissionCatalog),
  admin: grant({
    dashboard: ['view'],
    reports: ['view'],
    products: ['view', 'create', 'update', 'delete', 'publish'],
    attributes: ['view', 'create', 'update', 'delete'],
    categories: ['view', 'create', 'update', 'delete'],
    brands: ['view', 'create', 'update', 'delete'],
    inventory: ['view', 'manage'],
    suppliers: ['view', 'create', 'update', 'delete'],
    clients: ['view', 'create', 'update', 'delete'],
    quotes: ['view', 'create', 'update', 'delete', 'manage-status'],
    orders: ['view', 'create', 'update', 'manage-delivery'],
    requests: ['view', 'create', 'update', 'reply', 'assign'],
    services: ['view', 'create', 'update', 'publish'],
    projects: ['view', 'update', 'manage-deployments'],
    users: ['view'],
    roles: ['view'],
    settings: ['view', 'update'],
    audit: ['view'],
  }),
  ventas: grant({
    dashboard: ['view'],
    reports: ['view'],
    products: ['view'],
    attributes: ['view'],
    categories: ['view'],
    brands: ['view'],
    inventory: ['view'],
    suppliers: ['view'],
    clients: ['view', 'create', 'update'],
    quotes: ['view', 'create', 'update', 'manage-status'],
    orders: ['view', 'create', 'update', 'manage-delivery'],
    requests: ['view', 'create', 'reply'],
    services: ['view'],
    projects: ['view'],
    audit: ['view'],
  }),
  soporte: grant({
    dashboard: ['view'],
    products: ['view'],
    attributes: ['view'],
    categories: ['view'],
    brands: ['view'],
    inventory: ['view'],
    clients: ['view'],
    quotes: ['view'],
    orders: ['view', 'manage-delivery'],
    requests: ['view', 'create', 'update', 'reply'],
    services: ['view'],
    projects: ['view', 'manage-deployments'],
    audit: ['view'],
  }),
  consulta: viewOnlyKeys(permissionCatalog),
}

export function roleGrants(role: AdminUserRole, key: string) {
  return rolePermissions[role].includes(key)
}

export function roleSummary(role: AdminUserRole) {
  return rolePermissions[role].length
}
