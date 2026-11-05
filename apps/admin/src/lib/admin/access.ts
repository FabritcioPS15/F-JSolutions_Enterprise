import { hasPermission, permissionKey } from '@fj-solutions/contracts/permissions'
import type { PermissionAction } from '@fj-solutions/contracts/permissions'
import { rolePermissions } from './permissions'
import type { AdminUserRole } from './types'
import type { SessionUser } from '@/lib/auth/types'

// Autorización del panel: una sola función decide si la UI muestra una sección
// o una acción. La API sigue siendo la autoridad final; el BFF usa el mismo
// checkPermission para no negociar permisos "a ojo" en cada proxy.
export type Access = {
  role: AdminUserRole
  permissions: string[]
}

const panelRoles: AdminUserRole[] = ['superadmin', 'admin', 'ventas', 'soporte', 'consulta']

export function accessFromSession(user: SessionUser | null | undefined): Access {
  const role = panelRoles.includes(user?.role as AdminUserRole)
    ? (user?.role as AdminUserRole)
    : 'consulta'
  // Los permisos reales los trae /auth/me; el mapa de roles solo es respaldo
  // para sesiones antiguas que aún no los incluyen.
  const permissions = user?.permissions?.length ? user.permissions : rolePermissions[role]
  return { role, permissions }
}

export function checkPermission(
  access: Access,
  module: string,
  action: PermissionAction | string = 'view'
): boolean {
  return hasPermission(access.permissions, permissionKey(module, action))
}

export type CanFunction = (module: string, action?: PermissionAction | string) => boolean

export function createCan(access: Access): CanFunction {
  return (module, action = 'view') => checkPermission(access, module, action)
}

// Cada ruta del panel pertenece a un módulo del catálogo de permisos.
export const moduleByHref: Record<string, string> = {
  '/': 'dashboard',
  '/reportes': 'reports',
  '/actividad': 'audit',
  '/productos': 'products',
  '/categorias': 'categories',
  '/marcas': 'brands',
  '/atributos': 'attributes',
  '/inventario': 'inventory',
  '/proveedores': 'suppliers',
  '/clientes': 'clients',
  '/cotizaciones': 'quotes',
  '/pedidos': 'orders',
  '/solicitudes': 'requests',
  '/servicios': 'services',
  '/proyectos': 'projects',
  '/usuarios': 'users',
  '/roles': 'roles',
  '/configuracion': 'settings',
}

export function moduleForPathname(pathname: string): string | null {
  if (pathname === '/' || pathname === '') return moduleByHref['/']
  const match = Object.entries(moduleByHref)
    .filter(([href]) => href !== '/' && (pathname === href || pathname.startsWith(`${href}/`)))
    .sort((a, b) => b[0].length - a[0].length)[0]
  return match?.[1] ?? null
}

// El BFF traduce el verbo HTTP a la acción del catálogo; las excepciones
// (responder, gestionar entregas, publicar) las declara cada proxy.
export function actionForMethod(method: string): PermissionAction {
  switch (method.toUpperCase()) {
    case 'GET':
    case 'HEAD':
      return 'view'
    case 'POST':
      return 'create'
    case 'PUT':
    case 'PATCH':
      return 'update'
    case 'DELETE':
      return 'delete'
    default:
      return 'update'
  }
}
