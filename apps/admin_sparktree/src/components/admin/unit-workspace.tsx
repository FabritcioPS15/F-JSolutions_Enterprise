'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowUpRight,
  Boxes,
  Cpu,
  ExternalLink,
  FileText,
  Globe2,
  Headphones,
  Link2,
  Package,
  PackageCheck,
  Pencil,
  Plus,
  Server,
  ShoppingBag,
  Tags,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { useAdmin } from '@/components/admin/admin-provider'
import {
  EmptyState,
  LoadingState,
  PageHeader,
  SectionCard,
  StatCard,
  btnPrimary,
  btnSecondary,
} from '@/components/admin/ui'
import {
  formatDate,
  getStockState,
  quoteStatusLabels,
  webProjectStatusLabels,
} from '@/lib/admin/format'
import { isLowStockProduct, isOpenOrder, isPendingQuote } from '@/lib/admin/notifications'
import { orderStatusLabels } from '@/lib/admin/operations'
import { fetchServiceOfferings } from '@/lib/services/service-offerings'
import type { ServiceOffering } from '@fj-solutions/contracts/admin'
import { cn } from '@/lib/utils'

export type ManagedUnit = 'systems' | 'store' | 'studio'

type WorkspaceAction = {
  label: string
  href: string
  permission: string
  icon: LucideIcon
  primary?: boolean
}

type WorkspaceModule = {
  label: string
  description: string
  href: string
  module: string
  icon: LucideIcon
}

type UnitConfig = {
  name: string
  tagline: string
  description: string
  publicUrl: string
  accent: string
  icon: LucideIcon
  actions: WorkspaceAction[]
  modules: WorkspaceModule[]
}

type StatDefinition = {
  label: string
  value: string
  helper: string
  icon: LucideIcon
  href?: string
}

type WorkspaceRow = {
  id: string
  title: string
  subtitle: string
  meta: string
}

type WorkspaceQueue = {
  title: string
  description: string
  href: string
  rows: WorkspaceRow[]
  emptyText: string
}

const unitConfigs: Record<ManagedUnit, UnitConfig> = {
  systems: {
    name: 'SparkTree Systems',
    tagline: 'Tecnología e infraestructura',
    description:
      'Gestiona servicios, soporte, proyectos y la operación tecnológica de la empresa desde un solo espacio.',
    publicUrl: (
      process.env.NEXT_PUBLIC_URL_SYSTEMS ??
      process.env.NEXT_PUBLIC_SYSTEMS_URL ??
      (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://fjsolutions.pe')
    ).replace(/\/+$/, ''),
    accent: '#00B8D9',
    icon: Cpu,
    actions: [
      { label: 'Nuevo servicio', href: '/servicios/nuevo', permission: 'services.create', icon: Plus, primary: true },
      { label: 'Nuevo producto', href: '/productos/nuevo', permission: 'products.create', icon: Package },
      { label: 'Ver cotizaciones', href: '/cotizaciones', permission: 'quotes.view', icon: FileText },
    ],
    modules: [
      { label: 'Catálogo de servicios', description: 'Contenido, alcances y publicación de servicios TI.', href: '/servicios', module: 'services', icon: Wrench },
      { label: 'Mesa de ayuda', description: 'Consultas, asignaciones y respuestas del equipo de soporte.', href: '/solicitudes', module: 'requests', icon: Headphones },
      { label: 'Proyectos web', description: 'Estado, dominios, responsables y despliegues.', href: '/proyectos', module: 'projects', icon: Globe2 },
      { label: 'Productos', description: 'Catálogo corporativo compartido con la tienda.', href: '/productos', module: 'products', icon: Package },
      { label: 'Inventario', description: 'Existencias, movimientos y reposición de equipos.', href: '/inventario', module: 'inventory', icon: Boxes },
      { label: 'Cotizaciones', description: 'Solicitudes comerciales y aprobaciones.', href: '/cotizaciones', module: 'quotes', icon: FileText },
    ],
  },
  store: {
    name: 'SparkTree Store',
    tagline: 'Equipamiento corporativo',
    description:
      'Administra el catálogo comercial, los pedidos y los clientes que compran en la tienda.',
    publicUrl: (
      process.env.NEXT_PUBLIC_URL_STORE ??
      process.env.NEXT_PUBLIC_STORE_URL ??
      'http://localhost:3006'
    ).replace(/\/+$/, ''),
    accent: '#2563EB',
    icon: ShoppingBag,
    actions: [
      { label: 'Nuevo producto', href: '/productos/nuevo', permission: 'products.create', icon: Plus, primary: true },
      { label: 'Gestionar pedidos', href: '/pedidos', permission: 'orders.view', icon: PackageCheck },
      { label: 'Ver clientes', href: '/clientes', permission: 'clients.view', icon: Users },
    ],
    modules: [
      { label: 'Productos', description: 'Fichas, precios, publicación y existencias.', href: '/productos', module: 'products', icon: Package },
      { label: 'Pedidos y entregas', description: 'Preparación, despacho y seguimiento de compras.', href: '/pedidos', module: 'orders', icon: PackageCheck },
      { label: 'Clientes', description: 'Directorio comercial y cuentas de empresa.', href: '/clientes', module: 'clients', icon: Users },
      { label: 'Cotizaciones', description: 'Propuestas, respuestas y aprobaciones.', href: '/cotizaciones', module: 'quotes', icon: FileText },
      { label: 'Inventario', description: 'Control de stock y movimientos del almacén.', href: '/inventario', module: 'inventory', icon: Boxes },
      { label: 'Categorías y marcas', description: 'Organización del catálogo visible en la tienda.', href: '/categorias', module: 'categories', icon: Tags },
    ],
  },
  studio: {
    name: 'SparkTree Studio',
    tagline: 'Marca y crecimiento digital',
    description:
      'Supervisa los proyectos digitales, sus entregas y las páginas de enlaces de clientes y campañas.',
    publicUrl: (
      process.env.NEXT_PUBLIC_URL_STUDIO ??
      process.env.NEXT_PUBLIC_STUDIO_URL ??
      'https://sparktree.pe'
    ).replace(/\/+$/, ''),
    accent: '#10B981',
    icon: Globe2,
    actions: [
      { label: 'Ver proyectos', href: '/proyectos', permission: 'projects.view', icon: Globe2, primary: true },
      { label: 'Abrir linkeador', href: '/links', permission: 'links.view', icon: Link2 },
      { label: 'Ver clientes', href: '/clientes', permission: 'clients.view', icon: Users },
    ],
    modules: [
      { label: 'Proyectos web', description: 'Planificación, desarrollo, staging y producción.', href: '/proyectos', module: 'projects', icon: Globe2 },
      { label: 'Linkeador', description: 'Páginas públicas, personalización y enlaces.', href: '/links', module: 'links', icon: Link2 },
      { label: 'Clientes', description: 'Empresas y contactos asociados a los proyectos.', href: '/clientes', module: 'clients', icon: Users },
      { label: 'Mesa de ayuda', description: 'Consultas de alcance, contenido y soporte.', href: '/solicitudes', module: 'requests', icon: Headphones },
      { label: 'Cotizaciones', description: 'Propuestas comerciales vinculadas a entregables.', href: '/cotizaciones', module: 'quotes', icon: FileText },
    ],
  },
}

function byNewest(a: { updatedAt: string }, b: { updatedAt: string }) {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
}

export function UnitWorkspace({ unit }: { unit: ManagedUnit }) {
  const { hydrated, can, products, quotes, orders, clients, requests, webProjects } = useAdmin()
  const [services, setServices] = useState<ServiceOffering[] | null>(null)
  const config = unitConfigs[unit]
  const UnitIcon = config.icon
  const canViewServices = can('services')

  useEffect(() => {
    if (unit !== 'systems' || !canViewServices) {
      setServices(null)
      return
    }
    let active = true
    void fetchServiceOfferings()
      .then((result) => {
        if (active) setServices(result)
      })
      .catch(() => {
        if (active) setServices([])
      })
    return () => {
      active = false
    }
  }, [unit, canViewServices])

  if (!hydrated) return <LoadingState label={`Cargando ${config.name}…`} />

  const activeProducts = products.filter((product) => product.status === 'active')
  const lowStock = products.filter(isLowStockProduct).sort((a, b) => a.stock - b.stock)
  const pendingQuotes = quotes.filter(isPendingQuote).sort(byNewest)
  const openOrders = orders.filter(isOpenOrder).sort(byNewest)
  const newRequests = requests.filter((request) => request.status === 'new').sort(byNewest)
  const activeClients = clients.filter((client) => client.status === 'active')
  const liveProjects = webProjects.filter((project) => project.status === 'live')
  const movingProjects = webProjects.filter((project) =>
    ['planning', 'development', 'staging'].includes(project.status)
  )
  const recentProjects = [...webProjects].sort(byNewest)
  const upcomingRenewals = webProjects
    .filter((project) => project.renewalAt)
    .sort((a, b) => new Date(a.renewalAt!).getTime() - new Date(b.renewalAt!).getTime())
  const publishedServices = services?.filter((service) => service.status === 'published') ?? []

  const stats: StatDefinition[] = [
    ...(can('products')
      ? [{
          label: 'Productos publicados',
          value: String(activeProducts.length),
          helper: 'Disponibles en el catálogo compartido',
          icon: Package,
          href: '/productos',
        }]
      : []),
    ...(can('quotes')
      ? [{
          label: 'Cotizaciones por atender',
          value: String(pendingQuotes.length),
          helper: 'Borradores y solicitudes en revisión',
          icon: FileText,
          href: '/cotizaciones',
        }]
      : []),
    ...(can('requests')
      ? [{
          label: 'Consultas nuevas',
          value: String(newRequests.length),
          helper: 'Mensajes sin revisar en la mesa de ayuda',
          icon: Headphones,
          href: '/solicitudes',
        }]
      : []),
    ...(unit === 'systems' && canViewServices
      ? [{
          label: 'Servicios publicados',
          value: services === null ? '—' : String(publishedServices.length),
          helper: services === null ? 'Cargando catálogo de servicios' : `${services.length} servicios registrados`,
          icon: Server,
          href: '/servicios',
        }]
      : []),
    ...(unit === 'store' && can('orders')
      ? [{
          label: 'Pedidos abiertos',
          value: String(openOrders.length),
          helper: 'Pendientes, confirmados o en preparación',
          icon: PackageCheck,
          href: '/pedidos',
        }]
      : []),
    ...(unit === 'store' && can('clients')
      ? [{
          label: 'Clientes activos',
          value: String(activeClients.length),
          helper: `${clients.length} registros en el directorio`,
          icon: Users,
          href: '/clientes',
        }]
      : []),
    ...(unit === 'store' && can('products')
      ? [{
          label: 'Productos por reponer',
          value: String(lowStock.length),
          helper: 'Stock bajo o agotado',
          icon: Boxes,
          href: '/productos?stock=low',
        }]
      : []),
    ...(unit === 'studio' && can('projects')
      ? [
          {
            label: 'Proyectos registrados',
            value: String(webProjects.length),
            helper: 'Proyectos web y entregables digitales',
            icon: Globe2,
            href: '/proyectos',
          },
          {
            label: 'En producción',
            value: String(liveProjects.length),
            helper: 'Proyectos publicados y activos',
            icon: Server,
            href: '/proyectos',
          },
          {
            label: 'En ejecución',
            value: String(movingProjects.length),
            helper: 'Planificación, desarrollo o staging',
            icon: Pencil,
            href: '/proyectos',
          },
          {
            label: 'Renovaciones registradas',
            value: String(upcomingRenewals.length),
            helper: 'Proyectos con fecha de renovación',
            icon: FileText,
            href: '/proyectos',
          },
        ]
      : []),
  ]

  const queues: WorkspaceQueue[] = [
    ...(can('quotes') && (unit === 'systems' || unit === 'store')
      ? [{
          title: 'Cotizaciones por atender',
          description: 'Solicitudes que necesitan revisión o respuesta.',
          href: '/cotizaciones',
          emptyText: 'No hay cotizaciones pendientes.',
          rows: pendingQuotes.slice(0, 5).map((quote) => ({
            id: quote.id,
            title: `${quote.code} · ${quote.clientName}`,
            subtitle: quote.clientCompany || quote.clientEmail || 'Cliente sin empresa registrada',
            meta: quoteStatusLabels[quote.status],
          })),
        }]
      : []),
    ...(can('requests') && unit === 'systems'
      ? [{
          title: 'Consultas nuevas',
          description: 'Bandeja de entrada del equipo de soporte.',
          href: '/solicitudes',
          emptyText: 'No hay consultas nuevas.',
          rows: newRequests.slice(0, 5).map((request) => ({
            id: request.id,
            title: `${request.code} · ${request.name}`,
            subtitle: request.topic,
            meta: 'Nueva',
          })),
        }]
      : []),
    ...(can('services') && unit === 'systems' && services !== null
      ? [{
          title: 'Servicios recientes',
          description: 'Últimas fichas actualizadas del catálogo TI.',
          href: '/servicios',
          emptyText: 'Todavía no hay servicios registrados.',
          rows: [...services].sort(byNewest).slice(0, 5).map((service) => ({
            id: service.id,
            title: service.title,
            subtitle: service.category,
            meta: service.status === 'published' ? 'Publicado' : service.status === 'draft' ? 'Borrador' : 'Archivado',
          })),
        }]
      : []),
    ...(can('orders') && unit === 'store'
      ? [{
          title: 'Pedidos abiertos',
          description: 'Compras que siguen en preparación o entrega.',
          href: '/pedidos',
          emptyText: 'No hay pedidos abiertos.',
          rows: openOrders.slice(0, 5).map((order) => ({
            id: order.id,
            title: `${order.code} · ${order.clientName}`,
            subtitle: order.expectedDeliveryAt
              ? `Entrega estimada: ${formatDate(order.expectedDeliveryAt)}`
              : order.deliveryAddress || 'Entrega sin dirección registrada',
            meta: orderStatusLabels[order.status],
          })),
        }]
      : []),
    ...(can('products') && unit === 'store'
      ? [{
          title: 'Productos por reponer',
          description: 'Existencias que requieren atención del almacén.',
          href: '/productos?stock=low',
          emptyText: 'No hay productos con stock bajo.',
          rows: lowStock.slice(0, 5).map((product) => ({
            id: product.id,
            title: product.name,
            subtitle: `${product.sku} · ${product.stock} unidades disponibles`,
            meta: getStockState(product) === 'out' ? 'Sin stock' : 'Stock bajo',
          })),
        }]
      : []),
    ...(can('clients') && unit === 'store'
      ? [{
          title: 'Clientes recientes',
          description: 'Últimos registros actualizados del directorio.',
          href: '/clientes',
          emptyText: 'No hay clientes registrados.',
          rows: [...clients].sort(byNewest).slice(0, 5).map((client) => ({
            id: client.id,
            title: client.name,
            subtitle: client.company || client.email || 'Sin empresa o correo registrado',
            meta: client.status === 'active' ? 'Activo' : 'Inactivo',
          })),
        }]
      : []),
    ...(can('projects') && unit === 'studio'
      ? [{
          title: 'Proyectos recientes',
          description: 'Entregables digitales actualizados recientemente.',
          href: '/proyectos',
          emptyText: 'No hay proyectos registrados.',
          rows: recentProjects.slice(0, 5).map((project) => ({
            id: project.id,
            title: project.name,
            subtitle: project.clientName || project.domain || 'Sin cliente o dominio registrado',
            meta: webProjectStatusLabels[project.status],
          })),
        }]
      : []),
    ...(can('projects') && unit === 'studio'
      ? [{
          title: 'Próximas renovaciones',
          description: 'Fechas de mantenimiento, hosting o continuidad.',
          href: '/proyectos',
          emptyText: 'No hay renovaciones registradas.',
          rows: upcomingRenewals.slice(0, 5).map((project) => ({
            id: project.id,
            title: project.name,
            subtitle: project.clientName || project.domain || 'Sin cliente o dominio registrado',
            meta: formatDate(project.renewalAt!),
          })),
        }]
      : []),
  ]

  const modules = config.modules.filter((item) => can(item.module))
  const actions = config.actions.filter((item) => can(item.permission))
  const PrimaryActionIcon = actions[0]?.icon

  return (
    <div className="space-y-6">
      <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: config.accent }} />
      <PageHeader
        eyebrow={config.tagline}
        title={config.name}
        description={config.description}
        actions={
          <>
            <a href={config.publicUrl} target="_blank" rel="noreferrer" className={btnSecondary}>
              <ExternalLink className="size-4" aria-hidden="true" />
              Ver sitio público
            </a>
            {actions[0] && PrimaryActionIcon && (
              <Link href={actions[0].href} className={btnPrimary}>
                <PrimaryActionIcon className="size-4" aria-hidden="true" />
                {actions[0].label}
              </Link>
            )}
          </>
        }
      />

      {actions.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {actions.slice(1).map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.href} href={action.href} className={btnSecondary}>
                <Icon className="size-4" aria-hidden="true" />
                {action.label}
              </Link>
            )
          })}
        </div>
      )}

      {stats.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      )}

      <SectionCard
        title="Módulos de gestión"
        description="Accesos directos a las herramientas habilitadas para tu rol."
        icon={UnitIcon}
      >
        {modules.length === 0 ? (
          <EmptyState
            icon={UnitIcon}
            title="Sin módulos asignados"
            description="Tu rol puede ver esta unidad, pero todavía no tiene acceso a sus herramientas."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {modules.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-xl border border-border bg-background/40 p-4 transition hover:-translate-y-0.5 hover:border-[#5946A6]/30 hover:bg-card hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground ring-1 ring-border">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <ArrowUpRight className="size-4 text-muted-foreground/50 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#5946A6]" aria-hidden="true" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground">{item.description}</p>
                </Link>
              )
            })}
          </div>
        )}
      </SectionCard>

      {queues.length > 0 && (
        <div className="grid gap-4 xl:grid-cols-2">
          {queues.map((queue) => (
            <SectionCard
              key={queue.title}
              title={queue.title}
              description={queue.description}
              action={
                <Link href={queue.href} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5946A6] hover:underline">
                  Ver módulo
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </Link>
              }
              bodyClassName="p-2"
            >
              {queue.rows.length === 0 ? (
                <p className="px-3 py-4 text-xs text-muted-foreground">{queue.emptyText}</p>
              ) : (
                <ul className="space-y-0.5">
                  {queue.rows.map((row) => (
                    <li key={row.id}>
                      <Link href={queue.href} className="flex items-start justify-between gap-3 rounded-xl px-3 py-2.5 transition hover:bg-muted">
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-semibold text-foreground">{row.title}</span>
                          <span className="mt-0.5 block truncate text-[10.5px] text-muted-foreground">{row.subtitle}</span>
                        </span>
                        <span className={cn('shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground ring-1 ring-inset ring-border')}>
                          {row.meta}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  )
}
