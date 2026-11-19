'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowUpRight,
  Cpu,
  ExternalLink,
  GraduationCap,
  Headphones,
  Megaphone,
  Network,
  Package,
  Scale,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  type LucideIcon,
} from 'lucide-react'
import { useAdmin } from '@/components/admin/admin-provider'
import { PageHeader, SectionCard, StatCard, btnPrimary, btnSecondary } from '@/components/admin/ui'
import { openOrderStatuses } from '@/lib/admin/operations'
import {
  LEGAL_CASES_UPDATED_EVENT,
  countOpenLegalCases,
} from '@/lib/admin/legal-cases'
import { cn } from '@/lib/utils'

type UnitModule = {
  label: string
  href: string
  module: string
}

type Unit = {
  slug: string
  name: string
  tagline: string
  description: string
  href: string
  accent: string
  icon: LucideIcon
  modules: UnitModule[]
}

const units: Unit[] = [
  {
    slug: 'studio',
    name: 'SparkTree Studio',
    tagline: 'Marca y crecimiento digital',
    description:
      'Estrategia de marca, sitios web, SEO y campañas. Los proyectos y las páginas de enlaces se gestionan desde el panel.',
    href: process.env.NEXT_PUBLIC_URL_STUDIO ?? 'https://sparktree.pe',
    accent: '#10B981',
    icon: Megaphone,
    modules: [
      { label: 'Proyectos web', href: '/proyectos', module: 'projects' },
      { label: 'Linkeador', href: '/links', module: 'links' },
    ],
  },
  {
    slug: 'systems',
    name: 'SparkTree Systems',
    tagline: 'Tecnología e infraestructura',
    description:
      'Software, infraestructura y equipamiento corporativo. Concentra el catálogo, el inventario y la operación comercial.',
    href: process.env.NEXT_PUBLIC_URL_SYSTEMS ?? 'https://fjsolutions.com.pe',
    accent: '#00B8D9',
    icon: Cpu,
    modules: [
      { label: 'Productos', href: '/productos', module: 'products' },
      { label: 'Inventario', href: '/inventario', module: 'inventory' },
      { label: 'Servicios TI', href: '/servicios', module: 'services' },
      { label: 'Cotizaciones', href: '/cotizaciones', module: 'quotes' },
      { label: 'Mesa de ayuda', href: '/solicitudes', module: 'requests' },
    ],
  },
  {
    slug: 'academia',
    name: 'SparkTree Academia',
    tagline: 'Formación tecnológica',
    description:
      'Programas y certificaciones para equipos. Las inscripciones y consultas llegan a la mesa de ayuda compartida.',
    href: process.env.NEXT_PUBLIC_URL_ACADEMIA ?? 'http://localhost:3004',
    accent: '#4267C7',
    icon: GraduationCap,
    modules: [{ label: 'Mesa de ayuda', href: '/solicitudes', module: 'requests' }],
  },
  {
    slug: 'store',
    name: 'SparkTree Store',
    tagline: 'Equipamiento corporativo',
    description:
      'Laptops, servidores, redes y licencias. Comparte catálogo, pedidos y clientes con la operación de Systems.',
    href: process.env.NEXT_PUBLIC_STORE_URL ?? 'http://localhost:3006',
    accent: '#5946A6',
    icon: ShoppingBag,
    modules: [
      { label: 'Productos', href: '/productos', module: 'products' },
      { label: 'Pedidos', href: '/pedidos', module: 'orders' },
      { label: 'Clientes', href: '/clientes', module: 'clients' },
    ],
  },
  {
    slug: 'legal',
    name: 'SparkTree Legal',
    tagline: 'Respaldo legal empresarial',
    description:
      'Contratos, cumplimiento y controversias con un solo interlocutor. Los casos se registran y siguen desde este panel.',
    href: process.env.NEXT_PUBLIC_URL_LEGAL ?? 'http://localhost:3009',
    accent: '#C6A56B',
    icon: Scale,
    modules: [
      { label: 'Casos legales', href: '/legal', module: 'legal' },
      { label: 'Reclamaciones', href: '/reclamaciones', module: 'complaints' },
    ],
  },
]

const sharedAreas = [
  {
    title: 'Catálogo y almacén',
    description: 'Una sola base de productos para Store y Systems.',
    icon: Package,
    links: [
      { label: 'Productos', href: '/productos', module: 'products' },
      { label: 'Inventario', href: '/inventario', module: 'inventory' },
      { label: 'Categorías', href: '/categorias', module: 'categories' },
      { label: 'Proveedores', href: '/proveedores', module: 'suppliers' },
    ],
  },
  {
    title: 'Comercial',
    description: 'Cotizaciones, pedidos y clientes de todo el grupo.',
    icon: ShoppingCart,
    links: [
      { label: 'Cotizaciones', href: '/cotizaciones', module: 'quotes' },
      { label: 'Pedidos', href: '/pedidos', module: 'orders' },
      { label: 'Clientes', href: '/clientes', module: 'clients' },
    ],
  },
  {
    title: 'Atención al cliente',
    description: 'Consultas de Academia, Systems y Legal en una bandeja.',
    icon: Headphones,
    links: [
      { label: 'Mesa de ayuda', href: '/solicitudes', module: 'requests' },
      { label: 'Reclamaciones', href: '/reclamaciones', module: 'complaints' },
    ],
  },
  {
    title: 'Sistema',
    description: 'Accesos, configuración y trazabilidad del panel.',
    icon: ShieldCheck,
    links: [
      { label: 'Usuarios', href: '/usuarios', module: 'users' },
      { label: 'Roles y permisos', href: '/roles', module: 'roles' },
      { label: 'Configuración', href: '/configuracion', module: 'settings' },
      { label: 'Auditoría', href: '/auditoria', module: 'audit' },
    ],
  },
]

export function UnitsView() {
  const { products, quotes, orders, requests, clients, can } = useAdmin()
  const [legalOpen, setLegalOpen] = useState(0)

  useEffect(() => {
    const sync = () => setLegalOpen(countOpenLegalCases())
    sync()
    window.addEventListener(LEGAL_CASES_UPDATED_EVENT, sync)
    return () => window.removeEventListener(LEGAL_CASES_UPDATED_EVENT, sync)
  }, [])

  const activeProducts = products.filter((entry) => entry.status === 'active').length
  const openQuotes = quotes.filter((entry) =>
    ['draft', 'new', 'review'].includes(entry.status)
  ).length
  const openOrders = orders.filter((entry) => openOrderStatuses.includes(entry.status)).length
  const newRequests = requests.filter((entry) => entry.status === 'new').length

  const unitMetrics: Record<string, string[]> = {
    studio: ['Proyectos y enlaces en el panel'],
    systems: [
      `${activeProducts} ${activeProducts === 1 ? 'producto activo' : 'productos activos'}`,
      `${openQuotes} ${openQuotes === 1 ? 'cotización abierta' : 'cotizaciones abiertas'}`,
    ],
    academia: [`${newRequests} ${newRequests === 1 ? 'consulta nueva' : 'consultas nuevas'}`],
    store: [
      `${activeProducts} ${activeProducts === 1 ? 'producto publicado' : 'productos publicados'}`,
      `${openOrders} ${openOrders === 1 ? 'pedido abierto' : 'pedidos abiertos'}`,
    ],
    legal: [
      `${legalOpen} ${legalOpen === 1 ? 'caso activo' : 'casos activos'}`,
      `${clients.length} ${clients.length === 1 ? 'cliente compartido' : 'clientes compartidos'}`,
    ],
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="SparkTree Group"
        title="Unidades de negocio"
        description="El mapa completo del ecosistema: cada unidad con sus módulos, sus métricas y su sitio público, sin salir del panel."
        actions={
          <>
            <a
              href={process.env.NEXT_PUBLIC_URL_GROUP ?? 'http://localhost:3008'}
              target="_blank"
              rel="noreferrer"
              className={btnSecondary}
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              Ver sitio del grupo
            </a>
            {can('legal', 'create') && (
              <Link href="/legal" className={btnPrimary}>
                <Scale className="size-4" aria-hidden="true" />
                Casos legales
              </Link>
            )}
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Unidades activas"
          value={String(units.length)}
          helper="Studio, Systems, Academia, Store y Legal"
          icon={Network}
        />
        <StatCard
          label="Productos publicados"
          value={String(activeProducts)}
          helper="Catálogo compartido con la tienda"
          icon={Package}
          href="/productos"
        />
        <StatCard
          label="Operación comercial"
          value={String(openOrders + openQuotes)}
          helper={`${openQuotes} cotizaciones · ${openOrders} pedidos abiertos`}
          icon={ShoppingCart}
          href="/cotizaciones"
        />
        <StatCard
          label="Casos legales"
          value={String(legalOpen)}
          helper="Consultas activas con responsable"
          icon={Scale}
          href="/legal"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {units.map((unit) => {
          const Icon = unit.icon
          const modules = unit.modules.filter((item) => can(item.module))
          const metrics = unitMetrics[unit.slug] ?? []
          return (
            <article
              key={unit.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition hover:-translate-y-0.5 hover:border-border hover:shadow-md"
            >
              <div className="h-1.5 w-full" style={{ backgroundColor: unit.accent }} />
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="grid size-11 place-items-center rounded-xl ring-1 ring-inset"
                    style={{ backgroundColor: `${unit.accent}1A`, color: unit.accent }}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <a
                    href={unit.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Abrir ${unit.name}`}
                    className="grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                </div>

                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  {unit.tagline}
                </p>
                <h2 className="mt-1 font-heading text-lg font-bold tracking-tight text-foreground">
                  {unit.name}
                </h2>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
                  {unit.description}
                </p>

                {metrics.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {metrics.map((metric) => (
                      <li
                        key={metric}
                        className="rounded-full bg-muted px-2.5 py-0.5 text-[10.5px] font-medium text-muted-foreground ring-1 ring-inset ring-border"
                      >
                        {metric}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {modules.length === 0 ? (
                    <span className="text-[11px] text-muted-foreground">
                      Sin módulos asignados a tu rol.
                    </span>
                  ) : (
                    modules.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-[11.5px] font-semibold text-foreground/80 transition',
                          'hover:border-[#5946A6]/40 hover:bg-[#5946A6]/5 hover:text-[#4A3A8F]'
                        )}
                      >
                        {item.label}
                      </Link>
                    ))
                  )}
                </div>

                <a
                  href={unit.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[11.5px] font-semibold text-muted-foreground transition hover:text-foreground"
                >
                  Abrir sitio
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </a>
              </div>
            </article>
          )
        })}
      </div>

      <SectionCard
        title="Servicios compartidos del panel"
        description="Las unidades no duplican operación: comparten catálogo, atención y gobierno de accesos."
        icon={Network}
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {sharedAreas.map((area) => {
            const Icon = area.icon
            const links = area.links.filter((item) => can(item.module))
            return (
              <div
                key={area.title}
                className="rounded-xl border border-border/80 bg-background/40 p-4"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground ring-1 ring-border/70">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <p className="mt-3 text-sm font-semibold text-foreground">{area.title}</p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground">
                  {area.description}
                </p>
                <ul className="mt-3 space-y-1">
                  {links.length === 0 ? (
                    <li className="text-[11px] text-muted-foreground">Sin acceso para tu rol.</li>
                  ) : (
                    links.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="inline-flex items-center gap-1 text-[11.5px] font-medium text-foreground/80 transition hover:text-[#4A3A8F]"
                        >
                          {item.label}
                          <ArrowUpRight className="size-3" aria-hidden="true" />
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )
          })}
        </div>
      </SectionCard>
    </div>
  )
}
