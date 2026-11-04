import {
  availabilityLabels,
  clientSegmentLabels,
  clientStatusLabels,
  deploymentEnvironmentLabels,
  getStockState,
  inventoryMovementLabels,
  movementDelta,
  quoteItemCount,
  quoteStatusLabels,
  quoteTotals,
  requestChannelLabels,
  requestStatusLabels,
  statusLabels,
  stockLabels,
  webProjectStatusLabels,
  webProjectTypeLabels,
} from './format'
import type { DatasetExport } from './dataset-export'
import {
  buildSheet,
  excelDate,
  type ExcelColumn,
  type ExcelSheet,
} from './excel'
import type {
  ActivityEntry,
  ActivityType,
  AdminData,
  AdminProduct,
  Brand,
  Category,
  Client,
  Currency,
  InventoryMovement,
  Quote,
  QuoteLine,
  ServiceRequest,
  StoreSettings,
  WebProject,
  WebProjectDeployment,
} from './types'

const money = '#,##0.00'
const integer = '#,##0'
const dateTime = 'dd/mm/yyyy hh:mm'
const dateOnly = 'dd/mm/yyyy'

export const activityTypeLabels: Record<ActivityType, string> = {
  created: 'Creación',
  updated: 'Actualización',
  published: 'Publicación',
  unpublished: 'Retiro de publicación',
  archived: 'Archivado',
  restored: 'Restauración',
  duplicated: 'Duplicado',
  deleted: 'Eliminación',
}

function productSheets(products: AdminProduct[], currency: Currency): ExcelSheet[] {
  const columns: ExcelColumn<AdminProduct>[] = [
    { header: 'Nombre', width: 34, getValue: (product) => product.name, wrap: true },
    { header: 'SKU', width: 16, getValue: (product) => product.sku },
    { header: 'Código interno', width: 16, getValue: (product) => product.internalCode },
    { header: 'Categoría', width: 22, getValue: (product) => product.category },
    { header: 'Subcategoría', width: 22, getValue: (product) => product.subcategory },
    { header: 'Tipo', width: 22, getValue: (product) => product.subSubcategory },
    { header: 'Marca', width: 18, getValue: (product) => product.brand },
    { header: 'Modelo', width: 18, getValue: (product) => product.model },
    { header: `Precio (${currency})`, width: 14, getValue: (product) => product.price, format: money },
    { header: `Costo (${currency})`, width: 14, getValue: (product) => product.cost, format: money },
    {
      header: 'Mostrar precio',
      width: 14,
      align: 'center',
      getValue: (product) => (product.showPrice ? 'Sí' : 'No'),
    },
    { header: 'Stock', width: 10, getValue: (product) => product.stock, format: integer },
    { header: 'Stock mínimo', width: 12, getValue: (product) => product.minStock, format: integer },
    { header: 'Estado de stock', width: 16, getValue: (product) => stockLabels[getStockState(product)] },
    { header: 'Estado', width: 14, getValue: (product) => statusLabels[product.status] },
    {
      header: 'Disponibilidad',
      width: 18,
      getValue: (product) => availabilityLabels[product.availability],
    },
    {
      header: 'Destacado',
      width: 12,
      align: 'center',
      getValue: (product) => (product.featured ? 'Sí' : 'No'),
    },
    {
      header: 'Actualizado',
      width: 18,
      getValue: (product) => excelDate(product.updatedAt),
      format: dateTime,
    },
    {
      header: 'Creado',
      width: 18,
      getValue: (product) => excelDate(product.createdAt),
      format: dateTime,
    },
  ]

  return [buildSheet('Productos', columns, products)]
}

type InventoryRow = { product: AdminProduct; lastMovement?: InventoryMovement }

function inventorySheets(
  products: AdminProduct[],
  movements: InventoryMovement[],
  currency: Currency
): ExcelSheet[] {
  const lastByProduct = new Map<string, InventoryMovement>()
  movements.forEach((movement) => {
    const current = lastByProduct.get(movement.productId)
    if (
      !current ||
      new Date(movement.createdAt).getTime() > new Date(current.createdAt).getTime()
    ) {
      lastByProduct.set(movement.productId, movement)
    }
  })

  const rows: InventoryRow[] = products.map((product) => ({
    product,
    lastMovement: lastByProduct.get(product.id),
  }))

  const stockColumns: ExcelColumn<InventoryRow>[] = [
    { header: 'Producto', width: 34, getValue: (row) => row.product.name, wrap: true },
    { header: 'SKU', width: 16, getValue: (row) => row.product.sku },
    { header: 'Categoría', width: 24, getValue: (row) => row.product.category },
    { header: 'Marca', width: 18, getValue: (row) => row.product.brand },
    {
      header: 'Stock',
      width: 10,
      getValue: (row) => row.product.stock,
      format: integer,
    },
    {
      header: 'Stock mínimo',
      width: 12,
      getValue: (row) => row.product.minStock,
      format: integer,
    },
    {
      header: 'Estado de stock',
      width: 16,
      getValue: (row) => stockLabels[getStockState(row.product)],
    },
    {
      header: `Costo unitario (${currency})`,
      width: 18,
      getValue: (row) => row.product.cost ?? 0,
      format: money,
    },
    {
      header: `Valor en stock (${currency})`,
      width: 18,
      getValue: (row) => row.product.stock * (row.product.cost ?? 0),
      format: money,
    },
    {
      header: 'Último movimiento',
      width: 18,
      getValue: (row) => (row.lastMovement ? excelDate(row.lastMovement.createdAt) : null),
      format: dateTime,
    },
  ]

  const movementColumns: ExcelColumn<InventoryMovement>[] = [
    {
      header: 'Fecha',
      width: 18,
      getValue: (movement) => excelDate(movement.createdAt),
      format: dateTime,
    },
    { header: 'Producto', width: 34, getValue: (movement) => movement.productName, wrap: true },
    { header: 'SKU', width: 16, getValue: (movement) => movement.sku },
    { header: 'Tipo', width: 12, getValue: (movement) => inventoryMovementLabels[movement.type] },
    {
      header: 'Cantidad',
      width: 11,
      getValue: (movement) => movement.quantity,
      format: integer,
    },
    {
      header: 'Stock anterior',
      width: 14,
      getValue: (movement) => movement.previousStock,
      format: integer,
    },
    {
      header: 'Stock resultante',
      width: 15,
      getValue: (movement) => movement.resultingStock,
      format: integer,
    },
    {
      header: 'Variación',
      width: 11,
      getValue: (movement) => movementDelta(movement),
      format: '#,##0',
    },
    { header: 'Motivo', width: 24, getValue: (movement) => movement.reason },
    { header: 'Nota', width: 40, getValue: (movement) => movement.note, wrap: true },
  ]

  return [
    buildSheet('Inventario', stockColumns, rows),
    buildSheet('Movimientos', movementColumns, movements),
  ]
}

type ProjectRow = { project: WebProject; lastDeployment?: WebProjectDeployment }
type ProjectDeploymentRow = { project: WebProject; deployment: WebProjectDeployment }

function latestDeployment(project: WebProject): WebProjectDeployment | undefined {
  return [...project.deployments].sort(
    (a, b) => new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime()
  )[0]
}

function projectSheets(projects: WebProject[]): ExcelSheet[] {
  const rows: ProjectRow[] = projects.map((project) => ({
    project,
    lastDeployment: latestDeployment(project),
  }))

  const deploymentRows: ProjectDeploymentRow[] = projects
    .flatMap((project) =>
      project.deployments.map((deployment) => ({ project, deployment }))
    )
    .sort(
      (a, b) =>
        new Date(b.deployment.deployedAt).getTime() -
        new Date(a.deployment.deployedAt).getTime()
    )

  const projectColumns: ExcelColumn<ProjectRow>[] = [
    { header: 'Proyecto', width: 30, getValue: (row) => row.project.name, wrap: true },
    { header: 'Cliente', width: 28, getValue: (row) => row.project.clientName },
    { header: 'Tipo', width: 16, getValue: (row) => webProjectTypeLabels[row.project.type] },
    {
      header: 'Estado',
      width: 15,
      getValue: (row) => webProjectStatusLabels[row.project.status],
    },
    { header: 'URL producción', width: 34, getValue: (row) => row.project.productionUrl },
    { header: 'URL staging', width: 34, getValue: (row) => row.project.stagingUrl },
    { header: 'Repositorio', width: 34, getValue: (row) => row.project.repoUrl },
    { header: 'Hosting', width: 26, getValue: (row) => row.project.hosting },
    { header: 'Dominio', width: 26, getValue: (row) => row.project.domain },
    { header: 'Responsable', width: 20, getValue: (row) => row.project.responsible },
    {
      header: 'Credenciales',
      width: 30,
      getValue: (row) => row.project.credentialLocation,
      wrap: true,
    },
    {
      header: 'Lanzamiento',
      width: 14,
      getValue: (row) => excelDate(row.project.launchedAt),
      format: dateOnly,
    },
    {
      header: 'Renovación',
      width: 14,
      getValue: (row) => excelDate(row.project.renewalAt),
      format: dateOnly,
    },
    {
      header: 'Último despliegue',
      width: 18,
      getValue: (row) =>
        row.lastDeployment ? excelDate(row.lastDeployment.deployedAt) : null,
      format: dateTime,
    },
    {
      header: 'Despliegues',
      width: 12,
      getValue: (row) => row.project.deployments.length,
      format: integer,
    },
    { header: 'Notas', width: 42, getValue: (row) => row.project.notes, wrap: true },
  ]

  const deploymentColumns: ExcelColumn<ProjectDeploymentRow>[] = [
    {
      header: 'Fecha',
      width: 18,
      getValue: (row) => excelDate(row.deployment.deployedAt),
      format: dateTime,
    },
    { header: 'Proyecto', width: 30, getValue: (row) => row.project.name, wrap: true },
    { header: 'Cliente', width: 28, getValue: (row) => row.project.clientName },
    {
      header: 'Entorno',
      width: 14,
      getValue: (row) => deploymentEnvironmentLabels[row.deployment.environment],
    },
    { header: 'URL', width: 36, getValue: (row) => row.deployment.url },
    { header: 'Versión', width: 14, getValue: (row) => row.deployment.version },
    { header: 'Nota', width: 44, getValue: (row) => row.deployment.note, wrap: true },
  ]

  return [
    buildSheet('Proyectos web', projectColumns, rows),
    buildSheet('Despliegues', deploymentColumns, deploymentRows),
  ]
}

type QuoteRow = { quote: Quote; totals: ReturnType<typeof quoteTotals> }
type QuoteLineRow = {
  code: string
  client: string
  line: QuoteLine
  lineTotal: number
}

function quoteSheets(quotes: Quote[], currency: Currency, igv: number): ExcelSheet[] {
  const rows: QuoteRow[] = quotes.map((quote) => ({
    quote,
    totals: quoteTotals(quote.items, igv),
  }))

  const detail: QuoteLineRow[] = quotes.flatMap((quote) =>
    quote.items.map((line) => ({
      code: quote.code,
      client: quote.clientCompany || quote.clientName,
      line,
      lineTotal: Math.max(0, line.quantity) * Math.max(0, line.unitPrice),
    }))
  )

  const summaryColumns: ExcelColumn<QuoteRow>[] = [
    { header: 'Código', width: 20, getValue: (row) => row.quote.code },
    { header: 'Estado', width: 14, getValue: (row) => quoteStatusLabels[row.quote.status] },
    { header: 'Cliente', width: 26, getValue: (row) => row.quote.clientName },
    { header: 'Empresa', width: 26, getValue: (row) => row.quote.clientCompany },
    { header: 'Correo', width: 28, getValue: (row) => row.quote.clientEmail },
    { header: 'Teléfono', width: 16, getValue: (row) => row.quote.clientPhone },
    {
      header: 'Ítems',
      width: 9,
      getValue: (row) => quoteItemCount(row.quote.items),
      format: integer,
    },
    {
      header: `Subtotal (${currency})`,
      width: 15,
      getValue: (row) => row.totals.net,
      format: money,
    },
    {
      header: `IGV ${igv}% (${currency})`,
      width: 15,
      getValue: (row) => row.totals.tax,
      format: money,
    },
    {
      header: `Total (${currency})`,
      width: 15,
      getValue: (row) => row.totals.total,
      format: money,
    },
    {
      header: 'Válida hasta',
      width: 14,
      getValue: (row) => excelDate(row.quote.validUntil),
      format: dateOnly,
    },
    {
      header: 'Creada',
      width: 18,
      getValue: (row) => excelDate(row.quote.createdAt),
      format: dateTime,
    },
    {
      header: 'Actualizada',
      width: 18,
      getValue: (row) => excelDate(row.quote.updatedAt),
      format: dateTime,
    },
    { header: 'Notas', width: 40, getValue: (row) => row.quote.notes, wrap: true },
  ]

  const detailColumns: ExcelColumn<QuoteLineRow>[] = [
    { header: 'Cotización', width: 20, getValue: (row) => row.code },
    { header: 'Cliente / Empresa', width: 30, getValue: (row) => row.client },
    { header: 'Producto o servicio', width: 34, getValue: (row) => row.line.name, wrap: true },
    { header: 'SKU', width: 16, getValue: (row) => row.line.sku },
    {
      header: 'Cantidad',
      width: 12,
      getValue: (row) => row.line.quantity,
      format: integer,
    },
    {
      header: `Precio unitario (${currency})`,
      width: 18,
      getValue: (row) => row.line.unitPrice,
      format: money,
    },
    {
      header: `Total línea (${currency})`,
      width: 18,
      getValue: (row) => row.lineTotal,
      format: money,
    },
  ]

  return [
    buildSheet('Cotizaciones', summaryColumns, rows),
    buildSheet('Detalle', detailColumns, detail),
  ]
}

function clientSheets(clients: Client[]): ExcelSheet[] {
  const columns: ExcelColumn<Client>[] = [
    { header: 'Nombre', width: 26, getValue: (client) => client.name },
    { header: 'Empresa', width: 28, getValue: (client) => client.company },
    { header: 'Segmento', width: 13, getValue: (client) => clientSegmentLabels[client.segment] },
    {
      header: 'Documento',
      width: 12,
      getValue: (client) => (client.documentType ? client.documentType.toUpperCase() : undefined),
    },
    { header: 'Número de documento', width: 20, getValue: (client) => client.documentNumber },
    { header: 'Correo', width: 28, getValue: (client) => client.email },
    { header: 'Teléfono', width: 16, getValue: (client) => client.phone },
    { header: 'Ciudad', width: 16, getValue: (client) => client.city },
    { header: 'Dirección', width: 30, getValue: (client) => client.address, wrap: true },
    { header: 'Estado', width: 12, getValue: (client) => clientStatusLabels[client.status] },
    { header: 'Notas', width: 36, getValue: (client) => client.notes, wrap: true },
    {
      header: 'Creado',
      width: 18,
      getValue: (client) => excelDate(client.createdAt),
      format: dateTime,
    },
    {
      header: 'Actualizado',
      width: 18,
      getValue: (client) => excelDate(client.updatedAt),
      format: dateTime,
    },
  ]

  return [buildSheet('Clientes', columns, clients)]
}

function requestSheets(requests: ServiceRequest[]): ExcelSheet[] {
  const columns: ExcelColumn<ServiceRequest>[] = [
    { header: 'Código', width: 20, getValue: (request) => request.code },
    { header: 'Estado', width: 14, getValue: (request) => requestStatusLabels[request.status] },
    { header: 'Canal', width: 16, getValue: (request) => requestChannelLabels[request.channel] },
    { header: 'Nombre', width: 24, getValue: (request) => request.name },
    { header: 'Empresa', width: 26, getValue: (request) => request.company },
    { header: 'Correo', width: 28, getValue: (request) => request.email },
    { header: 'Teléfono', width: 16, getValue: (request) => request.phone },
    { header: 'Tema', width: 26, getValue: (request) => request.topic },
    { header: 'Mensaje', width: 50, getValue: (request) => request.message, wrap: true },
    { header: 'Notas', width: 36, getValue: (request) => request.notes, wrap: true },
    {
      header: 'Recibida',
      width: 18,
      getValue: (request) => excelDate(request.createdAt),
      format: dateTime,
    },
    {
      header: 'Actualizada',
      width: 18,
      getValue: (request) => excelDate(request.updatedAt),
      format: dateTime,
    },
  ]

  return [buildSheet('Mesa de ayuda', columns, requests)]
}

type SubcategoryRow = {
  category: string
  subcategory: string
  type: string
}

function categorySheets(categories: Category[]): ExcelSheet[] {
  const detail: SubcategoryRow[] = categories.flatMap((category) => {
    const rows: SubcategoryRow[] = category.subcategories.flatMap((subcategory) => {
      if (subcategory.subSubcategories.length === 0) {
        return [{ category: category.label, subcategory: subcategory.label, type: '' }]
      }
      return subcategory.subSubcategories.map((type) => ({
        category: category.label,
        subcategory: subcategory.label,
        type: type.label,
      }))
    })

    return rows.length > 0 ? rows : [{ category: category.label, subcategory: '', type: '' }]
  })

  const categoryColumns: ExcelColumn<Category>[] = [
    { header: 'Categoría', width: 26, getValue: (category) => category.label },
    { header: 'Slug', width: 24, getValue: (category) => category.slug },
    {
      header: 'Estado',
      width: 12,
      getValue: (category) => (category.status === 'active' ? 'Activa' : 'Inactiva'),
    },
    { header: 'Orden', width: 9, getValue: (category) => category.order, format: integer },
    {
      header: 'Subcategorías',
      width: 14,
      getValue: (category) => category.subcategories.length,
      format: integer,
    },
    {
      header: 'Tipos',
      width: 9,
      getValue: (category) =>
        category.subcategories.reduce(
          (total, subcategory) => total + subcategory.subSubcategories.length,
          0
        ),
      format: integer,
    },
    { header: 'Descripción', width: 40, getValue: (category) => category.description, wrap: true },
  ]

  const detailColumns: ExcelColumn<SubcategoryRow>[] = [
    { header: 'Categoría', width: 26, getValue: (row) => row.category },
    { header: 'Subcategoría', width: 26, getValue: (row) => row.subcategory },
    { header: 'Tipo', width: 26, getValue: (row) => row.type },
  ]

  return [
    buildSheet('Categorías', categoryColumns, categories),
    buildSheet('Subcategorías y tipos', detailColumns, detail),
  ]
}

export type BrandExportRow = { brand: Brand; total: number; published: number }

function brandSheets(rows: BrandExportRow[]): ExcelSheet[] {
  const columns: ExcelColumn<BrandExportRow>[] = [
    { header: 'Marca', width: 24, getValue: (row) => row.brand.name },
    { header: 'Slug', width: 24, getValue: (row) => row.brand.slug },
    {
      header: 'Estado',
      width: 12,
      getValue: (row) => (row.brand.status === 'active' ? 'Activa' : 'Inactiva'),
    },
    { header: 'Orden', width: 9, getValue: (row) => row.brand.order, format: integer },
    { header: 'Productos', width: 11, getValue: (row) => row.total, format: integer },
    { header: 'Publicados', width: 11, getValue: (row) => row.published, format: integer },
    {
      header: 'Descripción',
      width: 40,
      getValue: (row) => row.brand.description,
      wrap: true,
    },
  ]

  return [buildSheet('Marcas', columns, rows)]
}

function activitySheets(entries: ActivityEntry[]): ExcelSheet[] {
  const columns: ExcelColumn<ActivityEntry>[] = [
    {
      header: 'Fecha',
      width: 18,
      getValue: (entry) => excelDate(entry.at),
      format: dateTime,
    },
    { header: 'Acción', width: 20, getValue: (entry) => activityTypeLabels[entry.type] },
    { header: 'Producto', width: 34, getValue: (entry) => entry.productName, wrap: true },
    { header: 'Detalle', width: 40, getValue: (entry) => entry.detail, wrap: true },
  ]

  return [buildSheet('Actividad', columns, entries)]
}

type SettingRow = { label: string; value: string | number }

function settingsSheet(settings: StoreSettings): ExcelSheet[] {
  const rows: SettingRow[] = [
    { label: 'Nombre de la tienda', value: settings.storeName },
    { label: 'Razón social', value: settings.legalName },
    { label: 'RUC', value: settings.ruc },
    { label: 'Correo', value: settings.email },
    { label: 'Teléfono', value: settings.phone },
    { label: 'Dirección', value: settings.address },
    { label: 'Moneda', value: settings.currency },
    { label: 'IGV (%)', value: settings.igv },
    { label: 'Umbral de stock bajo', value: settings.lowStockThreshold },
  ]

  const columns: ExcelColumn<SettingRow>[] = [
    { header: 'Campo', width: 28, getValue: (row) => row.label },
    { header: 'Valor', width: 40, getValue: (row) => row.value },
  ]

  return [buildSheet('Configuración', columns, rows)]
}

export function productsDataset(products: AdminProduct[], currency: Currency): DatasetExport {
  return {
    prefix: 'productos',
    title: 'Productos',
    sheets: productSheets(products, currency),
  }
}

export function inventoryDataset(
  products: AdminProduct[],
  movements: InventoryMovement[],
  currency: Currency
): DatasetExport {
  return {
    prefix: 'inventario',
    title: 'Inventario',
    sheets: inventorySheets(products, movements, currency),
  }
}

export function projectsDataset(projects: WebProject[]): DatasetExport {
  return {
    prefix: 'proyectos-web',
    title: 'Proyectos web',
    sheets: projectSheets(projects),
  }
}

export function quotesDataset(quotes: Quote[], currency: Currency, igv: number): DatasetExport {
  return {
    prefix: 'cotizaciones',
    title: 'Cotizaciones',
    sheets: quoteSheets(quotes, currency, igv),
  }
}

export function clientsDataset(clients: Client[]): DatasetExport {
  return {
    prefix: 'clientes',
    title: 'Clientes',
    sheets: clientSheets(clients),
  }
}

export function requestsDataset(requests: ServiceRequest[]): DatasetExport {
  return {
    prefix: 'mesa-de-ayuda',
    title: 'Mensajes de la mesa de ayuda',
    sheets: requestSheets(requests),
  }
}

export function categoriesDataset(categories: Category[]): DatasetExport {
  return {
    prefix: 'categorias',
    title: 'Categorías',
    sheets: categorySheets(categories),
  }
}

export function brandsDataset(rows: BrandExportRow[]): DatasetExport {
  return {
    prefix: 'marcas',
    title: 'Marcas',
    sheets: brandSheets(rows),
  }
}

export function activityDataset(entries: ActivityEntry[]): DatasetExport {
  return {
    prefix: 'actividad',
    title: 'Actividad reciente',
    sheets: activitySheets(entries),
  }
}

export function backupDataset(data: AdminData): DatasetExport {
  const brandRows: BrandExportRow[] = data.brands.map((brand) => {
    const items = data.products.filter((product) => product.brand === brand.name)
    return {
      brand,
      total: items.length,
      published: items.filter((product) => product.status === 'active').length,
    }
  })

  return {
    prefix: 'respaldo',
    title: 'Respaldo completo',
    json: data,
    sheets: [
      ...productSheets(data.products, data.settings.currency),
      ...inventorySheets(data.products, data.inventoryMovements, data.settings.currency),
      ...projectSheets(data.webProjects),
      ...categorySheets(data.categories),
      ...brandSheets(brandRows),
      ...quoteSheets(data.quotes, data.settings.currency, data.settings.igv),
      ...clientSheets(data.clients),
      ...requestSheets(data.requests),
      ...activitySheets(data.activity),
      ...settingsSheet(data.settings),
    ],
  }
}
