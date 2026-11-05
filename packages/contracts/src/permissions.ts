// Catálogo canónico de permisos del panel. Los mismos keys que valida la API con
// `requirePermission(...)` son los que dibuja la matriz de roles del panel, así
// que ninguna capa mantiene ya una lista paralela de módulos.

export type PermissionAction =
  | 'view'
  | 'create'
  | 'update'
  | 'delete'
  | 'publish'
  | 'manage'
  | 'manage-status'
  | 'manage-delivery'
  | 'reply'
  | 'assign'
  | 'manage-deployments'
  | 'upload'

export type PermissionModule = {
  key: string
  actions: PermissionAction[]
}

export const permissionCatalog: PermissionModule[] = [
  { key: 'dashboard', actions: ['view'] },
  { key: 'reports', actions: ['view'] },
  { key: 'products', actions: ['view', 'create', 'update', 'delete', 'publish'] },
  { key: 'attributes', actions: ['view', 'create', 'update', 'delete'] },
  { key: 'categories', actions: ['view', 'create', 'update', 'delete'] },
  { key: 'brands', actions: ['view', 'create', 'update', 'delete'] },
  { key: 'inventory', actions: ['view', 'manage'] },
  { key: 'suppliers', actions: ['view', 'create', 'update', 'delete'] },
  { key: 'clients', actions: ['view', 'create', 'update', 'delete'] },
  { key: 'quotes', actions: ['view', 'create', 'update', 'delete', 'manage-status'] },
  { key: 'orders', actions: ['view', 'create', 'update', 'delete', 'manage-delivery'] },
  { key: 'requests', actions: ['view', 'create', 'update', 'delete', 'reply', 'assign'] },
  { key: 'services', actions: ['view', 'create', 'update', 'delete', 'publish'] },
  { key: 'projects', actions: ['view', 'create', 'update', 'delete', 'manage-deployments'] },
  { key: 'users', actions: ['view', 'create', 'update', 'delete'] },
  { key: 'roles', actions: ['view', 'update'] },
  { key: 'settings', actions: ['view', 'update'] },
  { key: 'audit', actions: ['view'] },
]

export function permissionKey(module: string, action: PermissionAction | string): string {
  return `${module}.${action}`
}

export function permissionKeysFor(modules: PermissionModule[]): string[] {
  return modules.flatMap((module) => module.actions.map((action) => permissionKey(module.key, action)))
}

// Rol de solo lectura: todo lo que el catálogo permita ver y nada más.
export function viewOnlyKeys(modules: PermissionModule[] = permissionCatalog): string[] {
  return permissionKeysFor(
    modules
      .filter((module) => module.actions.includes('view'))
      .map((module) => ({ key: module.key, actions: ['view'] as PermissionAction[] }))
  )
}

export function allPermissionKeys(modules: PermissionModule[] = permissionCatalog): string[] {
  return permissionKeysFor(modules)
}

export function hasPermission(permissions: readonly string[] | null | undefined, key: string): boolean {
  return permissions?.includes(key) ?? false
}

export function hasModulePermission(
  permissions: readonly string[] | null | undefined,
  module: string,
  action: PermissionAction | string
): boolean {
  return hasPermission(permissions, permissionKey(module, action))
}
