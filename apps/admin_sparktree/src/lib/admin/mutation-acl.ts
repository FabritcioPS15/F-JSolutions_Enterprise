import { permissionActionLabels, permissionModules } from './permissions'
import type { CanFunction } from './access'

// Punto único de autorización para las mutaciones locales del panel: ninguna
// escritura escapa de aquí, así que el rol se aplica igual aunque la pantalla no
// haya ocultado el botón. La API y el BFF siguen siendo la autoridad final.
type MutationPermission = {
  module: string
  action: string
}

export const mutationPermissions: Record<string, MutationPermission> = {
  createProduct: { module: 'products', action: 'create' },
  updateProduct: { module: 'products', action: 'update' },
  deleteProduct: { module: 'products', action: 'delete' },
  duplicateProduct: { module: 'products', action: 'create' },
  toggleProductStatus: { module: 'products', action: 'update' },
  setProductStatus: { module: 'products', action: 'update' },
  bulkSetStatus: { module: 'products', action: 'update' },
  bulkDeleteProducts: { module: 'products', action: 'delete' },
  unlinkProductTaxonomy: { module: 'products', action: 'update' },
  registerMovement: { module: 'inventory', action: 'manage' },
  addCategory: { module: 'categories', action: 'create' },
  updateCategory: { module: 'categories', action: 'update' },
  renameCategory: { module: 'categories', action: 'update' },
  removeCategory: { module: 'categories', action: 'delete' },
  addSubcategory: { module: 'categories', action: 'create' },
  renameSubcategory: { module: 'categories', action: 'update' },
  removeSubcategory: { module: 'categories', action: 'delete' },
  addSubSubcategory: { module: 'categories', action: 'create' },
  renameSubSubcategory: { module: 'categories', action: 'update' },
  removeSubSubcategory: { module: 'categories', action: 'delete' },
  addBrand: { module: 'brands', action: 'create' },
  updateBrand: { module: 'brands', action: 'update' },
  removeBrand: { module: 'brands', action: 'delete' },
  createClient: { module: 'clients', action: 'create' },
  updateClient: { module: 'clients', action: 'update' },
  removeClient: { module: 'clients', action: 'delete' },
  createQuote: { module: 'quotes', action: 'create' },
  updateQuote: { module: 'quotes', action: 'update' },
  removeQuote: { module: 'quotes', action: 'delete' },
  setQuoteStatus: { module: 'quotes', action: 'manage-status' },
  createOrder: { module: 'orders', action: 'create' },
  updateOrder: { module: 'orders', action: 'update' },
  removeOrder: { module: 'orders', action: 'delete' },
  setOrderStatus: { module: 'orders', action: 'manage-delivery' },
  setOrderPayment: { module: 'orders', action: 'manage-delivery' },
  createSupplier: { module: 'suppliers', action: 'create' },
  updateSupplier: { module: 'suppliers', action: 'update' },
  removeSupplier: { module: 'suppliers', action: 'delete' },
  setSupplierStatus: { module: 'suppliers', action: 'update' },
  createAttribute: { module: 'attributes', action: 'create' },
  updateAttribute: { module: 'attributes', action: 'update' },
  removeAttribute: { module: 'attributes', action: 'delete' },
  setAttributeStatus: { module: 'attributes', action: 'update' },
  createRequest: { module: 'requests', action: 'create' },
  updateRequest: { module: 'requests', action: 'update' },
  removeRequest: { module: 'requests', action: 'delete' },
  setRequestStatus: { module: 'requests', action: 'update' },
  replyToRequest: { module: 'requests', action: 'reply' },
  convertRequestToQuote: { module: 'quotes', action: 'create' },
  createProject: { module: 'projects', action: 'create' },
  updateProject: { module: 'projects', action: 'update' },
  deleteProject: { module: 'projects', action: 'delete' },
  registerDeployment: { module: 'projects', action: 'manage-deployments' },
  createUser: { module: 'users', action: 'create' },
  updateUser: { module: 'users', action: 'update' },
  removeUser: { module: 'users', action: 'delete' },
  setUserStatus: { module: 'users', action: 'update' },
  updateSettings: { module: 'settings', action: 'update' },
  resetData: { module: 'settings', action: 'update' },
  importData: { module: 'settings', action: 'update' },
}

const actionVerbs: Record<string, string> = {
  view: 'ver',
  create: 'crear',
  update: 'editar',
  delete: 'eliminar',
  publish: 'publicar',
  manage: 'gestionar',
  'manage-status': 'cambiar el estado de',
  'manage-delivery': 'gestionar las entregas de',
  'manage-deployments': 'registrar despliegues de',
  reply: 'responder',
  assign: 'asignar',
  upload: 'subir',
}

const moduleLabels = new Map(permissionModules.map((module) => [module.key, module.label]))

export function deniedMessage(permission: MutationPermission): string {
  const verb = actionVerbs[permission.action] ?? permission.action
  const label = moduleLabels.get(permission.module) ?? permission.module
  return `Tu rol no tiene permiso para ${verb} ${label.toLowerCase()}.`
}

export function permissionLabel(permission: MutationPermission): string {
  const action = permissionActionLabels[permission.action] ?? permission.action
  const label = moduleLabels.get(permission.module) ?? permission.module
  return `${label} · ${action}`
}

export class PermissionDeniedError extends Error {
  readonly permission: string

  constructor(permission: MutationPermission) {
    super(deniedMessage(permission))
    this.name = 'PermissionDeniedError'
    this.permission = `${permission.module}.${permission.action}`
  }
}

type AnyFunction = (...args: unknown[]) => unknown

export function withMutationGuard<T extends object>(
  api: T,
  can: CanFunction,
  onDenied: (message: string, permission: MutationPermission) => void
): T {
  const guarded: Record<string, unknown> = { ...api } as Record<string, unknown>

  for (const [name, permission] of Object.entries(mutationPermissions)) {
    const original = guarded[name]
    if (typeof original !== 'function') continue

    guarded[name] = (...args: unknown[]) => {
      if (!can(permission.module, permission.action)) {
        onDenied(deniedMessage(permission), permission)
        // Además del aviso se lanza el error: una mutación negada no debe
        // devolver un registro falso que la pantalla use como si fuera válido.
        throw new PermissionDeniedError(permission)
      }
      return (original as AnyFunction)(...args)
    }
  }

  return guarded as T
}
