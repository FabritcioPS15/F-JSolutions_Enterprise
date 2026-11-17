'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BarChart3,
  BookOpenCheck,
  Boxes,
  ChevronRight,
  ExternalLink,
  FileText,
  FolderTree,
  Globe2,
  Headphones,
  History,
  Inbox,
  LayoutDashboard,
  LayoutGrid,
  Link2,
  Loader2,
  LogOut,
  Menu,
  Package,
  PackageCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  ShieldCheck,
  ShieldX,
  ShoppingCart,
  SlidersHorizontal,
  Tags,
  Truck,
  Users,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAdmin } from '@/components/admin/admin-provider'
import { EmptyState, btnSecondary } from '@/components/admin/ui'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { CommandPalette } from '@/components/admin/command-palette'
import { NotificationsMenu } from '@/components/admin/notifications-menu'
import { permissionModules } from '@/lib/admin/permissions'
import { getStockState } from '@/lib/admin/format'
import { openOrderStatuses } from '@/lib/admin/operations'
import type { SessionUser } from '@/lib/auth/types'
import { moduleByHref, moduleForPathname } from '@/lib/admin/access'

type NavArea =
  | 'general'
  | 'ventas'
  | 'clientes'
  | 'atencion'
  | 'catalogo'
  | 'servicios'
  | 'sistema'

type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
  badge?: number
  badgeHint?: string
  badgeTone?: 'amber' | 'blue'
  area?: NavArea
}

type NavSection = {
  label: string
  items: NavItem[]
}

const navAreaOptions: { key: NavArea; label: string; short: string; icon: LucideIcon }[] = [
  { key: 'general', label: 'General', short: 'General', icon: LayoutGrid },
  { key: 'ventas', label: 'Ventas', short: 'Ventas', icon: ShoppingCart },
  { key: 'clientes', label: 'Clientes', short: 'Clientes', icon: Users },
  { key: 'atencion', label: 'Atención al cliente', short: 'Atención', icon: Headphones },
  { key: 'catalogo', label: 'Catálogo', short: 'Catálogo', icon: Package },
  { key: 'servicios', label: 'Servicios TI', short: 'Servicios', icon: Wrench },
  { key: 'sistema', label: 'Sistema', short: 'Sistema', icon: ShieldCheck },
]

const allNavAreas = navAreaOptions.map((area) => area.key)

const storeUrl = process.env.NEXT_PUBLIC_STORE_URL ?? 'http://localhost:3000'

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'FJ'
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '')
  return initials.join('') || 'FJ'
}

function getBreadcrumb(pathname: string) {
  if (pathname === '/') return { section: 'Panel', title: 'Resumen general' }
  if (pathname === '/productos') return { section: 'Catálogo', title: 'Productos' }
  if (pathname === '/productos/nuevo') return { section: 'Catálogo', title: 'Nuevo producto' }
  if (pathname.startsWith('/productos/') && pathname.endsWith('/editar')) {
    return { section: 'Catálogo', title: 'Editar producto' }
  }
  if (pathname.startsWith('/productos/')) return { section: 'Catálogo', title: 'Detalle del producto' }
  if (pathname === '/categorias') return { section: 'Catálogo', title: 'Categorías' }
  if (pathname === '/marcas') return { section: 'Catálogo', title: 'Marcas' }
  if (pathname === '/atributos') return { section: 'Catálogo', title: 'Atributos y especificaciones' }
  if (pathname === '/cotizaciones') return { section: 'Comercial', title: 'Cotizaciones' }
  if (pathname === '/clientes') return { section: 'Comercial', title: 'Clientes' }
  if (pathname === '/solicitudes') return { section: 'Atención al cliente', title: 'Mesa de ayuda' }
  if (pathname === '/reclamaciones') return { section: 'Atención al cliente', title: 'Libro de reclamaciones' }
  if (pathname === '/servicios') return { section: 'Servicios TI', title: 'Catálogo de servicios' }
  if (pathname === '/servicios/nuevo') return { section: 'Servicios TI', title: 'Nuevo servicio' }
  if (pathname.startsWith('/servicios/') && pathname.endsWith('/editar')) {
    return { section: 'Servicios TI', title: 'Editar servicio' }
  }
  if (pathname === '/links') return { section: 'General', title: 'Linkeador' }
  if (pathname === '/reportes') return { section: 'General', title: 'Reportes' }
  if (pathname === '/actividad') return { section: 'General', title: 'Actividad reciente' }
  if (pathname === '/inventario') return { section: 'Operaciones', title: 'Inventario' }
  if (pathname === '/pedidos') return { section: 'Operaciones', title: 'Pedidos y entregas' }
  if (pathname === '/proveedores') return { section: 'Operaciones', title: 'Proveedores' }
  if (pathname === '/usuarios') return { section: 'Sistema', title: 'Usuarios y permisos' }
  if (pathname === '/proyectos') return { section: 'Operaciones', title: 'Proyectos web' }
  if (pathname === '/configuracion') return { section: 'Sistema', title: 'Configuración' }
  return { section: 'Panel', title: 'Administración' }
}

export function AdminShell({
  children,
  user,
}: {
  children: ReactNode
  user: SessionUser
}) {
  const pathname = usePathname()
  const router = useRouter()
  const {
    can,
    products,
    quotes,
    orders,
    requests,
    settings,
    catalogSource,
    catalogError,
    commercialSource,
    commercialError,
    projectsSource,
  } = useAdmin()
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [areaFilter, setAreaFilter] = useState<NavArea[]>([])
  const [profileOpen, setProfileOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [search, setSearch] = useState('')
  const profileRef = useRef<HTMLDivElement>(null)
  const initials = getInitials(user.name)

  // Atajo global Ctrl + K / Cmd + K para el Command Palette
  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem('fj-systems-sidebar-collapsed') === '1')
    } catch {
      // El panel sigue funcionando sin persistencia del sidebar.
    }
  }, [])

  useEffect(() => {
    setOpen(false)
    setProfileOpen(false)
  }, [pathname])

  // La cuenta de empresa no tiene resumen: su panel es su página pública.
  useEffect(() => {
    if (pathname === '/' && !can('dashboard') && can('links')) router.replace('/links')
  }, [pathname, can, router])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    if (!profileOpen) return
    function handlePointer(event: MouseEvent) {
      if (!profileRef.current?.contains(event.target as Node)) setProfileOpen(false)
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setProfileOpen(false)
    }
    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [profileOpen])

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev
      try {
        window.localStorage.setItem('fj-systems-sidebar-collapsed', next ? '1' : '0')
      } catch {
        // Sin persistencia, el estado se mantiene durante la sesión.
      }
      return next
    })
  }

  // Las áreas de la columna izquierda son un filtro acumulable: sin selección
  // se ven todas las secciones y cada área muestra solo sus propios enlaces.
  const areaFilterActive = areaFilter.length > 0

  function toggleArea(area: NavArea) {
    setAreaFilter((prev) =>
      prev.includes(area)
        ? prev.filter((item) => item !== area)
        : allNavAreas.filter((item) => item === area || prev.includes(item))
    )
  }

  function areaRailClass(active: boolean) {
    return cn(
      'relative flex w-full flex-col items-center gap-1 rounded-xl px-1 py-2 text-[9.5px] font-semibold leading-tight transition',
      active
        ? 'bg-[#2563EB]/20 text-white ring-1 ring-[#3B82F6]/35'
        : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
    )
  }

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const term = search.trim()
    router.push(term ? `/productos?q=${encodeURIComponent(term)}` : '/productos')
  }

  async function handleLogout() {
    if (loggingOut) return
    setLoggingOut(true)

    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      router.replace('/login')
      router.refresh()
    }
  }

  const lowStockCount = products.filter((product) => {
    if (product.status === 'archived') return false
    const state = getStockState(product)
    return state === 'low' || state === 'out'
  }).length
  const pendingQuoteCount = quotes.filter(
    (quote) => quote.status === 'draft' || quote.status === 'new' || quote.status === 'review'
  ).length
  const newRequestCount = requests.filter((request) => request.status === 'new').length
  const openOrderCount = orders.filter((order) =>
    openOrderStatuses.includes(order.status)
  ).length

  const sections: NavSection[] = [
    {
      label: 'General',
      items: [
        { href: '/', label: 'Resumen', icon: LayoutDashboard, exact: true, area: 'general' },
        { href: '/reportes', label: 'Reportes y métricas', icon: BarChart3, area: 'general' },
        { href: '/actividad', label: 'Actividad reciente', icon: History, area: 'general' },
        { href: '/links', label: 'Linkeador', icon: Link2, area: 'general' },
      ],
    },
    {
      label: 'Ventas & Clientes',
      items: [
        {
          href: '/cotizaciones',
          label: 'Cotizaciones',
          icon: FileText,
          area: 'ventas',
          badge: pendingQuoteCount,
          badgeHint:
            pendingQuoteCount === 1
              ? '1 cotización por atender'
              : `${pendingQuoteCount} cotizaciones por atender`,
          badgeTone: 'blue',
        },
        {
          href: '/pedidos',
          label: 'Pedidos y entregas',
          icon: PackageCheck,
          area: 'ventas',
          badge: openOrderCount,
          badgeHint:
            openOrderCount === 1
              ? '1 pedido en ruta de entrega'
              : `${openOrderCount} pedidos en ruta de entrega`,
          badgeTone: 'blue',
        },
        { href: '/clientes', label: 'Directorio de clientes', icon: Users, area: 'clientes' },
        {
          href: '/solicitudes',
          label: 'Mesa de ayuda',
          icon: Inbox,
          area: 'atencion',
          badge: newRequestCount,
          badgeHint:
            newRequestCount === 1
              ? '1 mensaje nuevo'
              : `${newRequestCount} mensajes nuevos`,
        },
        {
          href: '/reclamaciones',
          label: 'Reclamaciones',
          icon: BookOpenCheck,
          area: 'atencion',
        },
      ],
    },
    {
      label: 'Catálogo & Almacén',
      items: [
        {
          href: '/productos',
          label: 'Productos',
          icon: Package,
          area: 'catalogo',
          badge: lowStockCount,
          badgeHint:
            lowStockCount === 1
              ? '1 producto requiere reposición'
              : `${lowStockCount} productos requieren reposición`,
        },
        { href: '/inventario', label: 'Inventario y stock', icon: Boxes, area: 'catalogo' },
        { href: '/categorias', label: 'Categorías', icon: FolderTree, area: 'catalogo' },
        { href: '/marcas', label: 'Marcas', icon: Tags, area: 'catalogo' },
        {
          href: '/atributos',
          label: 'Atributos técnicos',
          icon: SlidersHorizontal,
          area: 'catalogo',
        },
        { href: '/proveedores', label: 'Proveedores', icon: Truck, area: 'catalogo' },
      ],
    },
    {
      label: 'Servicios & Proyectos',
      items: [
        { href: '/servicios', label: 'Servicios TI', icon: Wrench, area: 'servicios' },
        { href: '/proyectos', label: 'Proyectos web', icon: Globe2, area: 'servicios' },
      ],
    },
    {
      label: 'Sistema & Control',
      items: [
        { href: '/usuarios', label: 'Usuarios y roles', icon: ShieldCheck, area: 'sistema' },
        { href: '/configuracion', label: 'Configuración', icon: Settings, area: 'sistema' },
      ],
    },
  ]

  // El sidebar lista solo lo que el rol puede ver. Es la misma matriz que revisa
  // el BFF antes de reenviar a la API, así que ocultar no es la única barrera.
  const permittedSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const module = moduleByHref[item.href]
        return !module || can(module)
      }),
    }))
    .filter((section) => section.items.length > 0)

  const totalNavItems = permittedSections.reduce((sum, section) => sum + section.items.length, 0)

  const visibleSections = permittedSections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !areaFilterActive || (item.area && areaFilter.includes(item.area))
      ),
    }))
    .filter((section) => section.items.length > 0)

  const visibleNavItems = visibleSections.reduce((sum, section) => sum + section.items.length, 0)

  // Entrar directo por URL también está cubierto: si falta el permiso de lectura
  // se muestra el bloqueo en lugar de la pantalla pedida.
  const requestedModule = moduleForPathname(pathname)
  const blockedByPermission = requestedModule ? !can(requestedModule) : false
  const blockedModuleLabel =
    permissionModules.find((module) => module.key === requestedModule)?.label ?? requestedModule

  const breadcrumb = getBreadcrumb(pathname)

  return (
    <div className="min-h-screen bg-background">
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        data-surface="dark"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[356px] max-w-full border-r border-slate-800/80 bg-[#090D16] text-slate-400 transition-[transform,width] duration-300 ease-out lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
          collapsed && 'lg:w-[160px]'
        )}
        aria-label="Navegación principal"
      >
        <div
          className="flex w-[84px] shrink-0 flex-col border-r border-slate-800/80 bg-[#070A0F]"
          role="group"
          aria-label="Accesos y filtros del menú"
        >
          <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-3 pt-4 scrollbar-thin">
            {can('links') && (
              <>
                <Link
                  href="/links"
                  onClick={() => {
                    setAreaFilter([])
                    setOpen(false)
                  }}
                  aria-label="Abrir Linkeador"
                  aria-current={pathname === '/links' ? 'page' : undefined}
                  title="Linkeador"
                  className={areaRailClass(pathname === '/links')}
                >
                  <Link2 className="size-4 shrink-0" aria-hidden="true" />
                  <span className="w-full truncate text-center">Linkeador</span>
                </Link>
                <div className="mx-2 h-px bg-slate-800/80" aria-hidden="true" />
              </>
            )}
            {navAreaOptions.map((area) => {
              const AreaIcon = area.icon
              const active = areaFilter.includes(area.key)
              return (
                <button
                  key={area.key}
                  type="button"
                  onClick={() => toggleArea(area.key)}
                  aria-pressed={active}
                  aria-label={`Filtrar por ${area.label}`}
                  title={area.label}
                  className={areaRailClass(active)}
                >
                  <AreaIcon className="size-4 shrink-0" aria-hidden="true" />
                  <span className="w-full truncate text-center">{area.short}</span>
                </button>
              )
            })}
          </div>
          {areaFilterActive && (
            <button
              type="button"
              onClick={() => setAreaFilter([])}
              aria-label="Quitar filtro de áreas"
              className="shrink-0 border-t border-slate-800/80 px-2 py-2 text-center transition hover:bg-white/[0.04]"
            >
              <span className="block text-[10px] font-bold tabular-nums text-slate-300">
                {visibleNavItems}/{totalNavItems}
              </span>
              <span className="block text-[8.5px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Ver todo
              </span>
            </button>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
        <div
          className={cn(
            'relative flex h-20 shrink-0 items-center border-b border-slate-800/80 bg-[#080B12] px-4',
            collapsed ? 'justify-center px-2' : 'justify-between'
          )}
        >
          {!collapsed && <div className="hidden size-8 shrink-0 lg:block" aria-hidden="true" />}

          <Link
            href="/"
            className={cn(
              'group flex items-center justify-center transition-transform duration-200',
              !collapsed && 'flex-1'
            )}
            aria-label="FJ Systems, inicio"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="F&J Systems"
              className={cn(
                'h-11 w-auto shrink-0 object-contain brightness-0 invert transition-transform duration-200 group-hover:scale-105',
                collapsed && 'lg:h-7'
              )}
            />
          </Link>

          <button
            type="button"
            onClick={toggleCollapsed}
            className={cn(
              'hidden size-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white lg:grid',
              collapsed && 'lg:hidden'
            )}
            aria-label="Contraer menú lateral"
            title="Contraer menú"
          >
            <PanelLeftClose className="size-4" />
          </button>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
          {collapsed && (
            <button
              type="button"
              onClick={toggleCollapsed}
              className="mx-auto mb-4 hidden size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white lg:grid"
              aria-label="Expandir menú lateral"
              title="Expandir menú"
            >
              <PanelLeftOpen className="size-4" />
            </button>
          )}
          {visibleSections.map((section) => (
            <div key={section.label} className="mb-5 last:mb-0">
              <p
                className={cn(
                  'mb-2 px-3 text-[9.5px] font-bold uppercase tracking-[0.2em] text-slate-500',
                  collapsed && 'lg:hidden'
                )}
              >
                {section.label}
              </p>
              {collapsed && <div className="mb-2 hidden h-px bg-slate-800/80 lg:block" aria-hidden="true" />}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const active = item.exact
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(`${item.href}/`)

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'group relative flex items-center gap-3 rounded-xl px-3 py-2 text-[12.5px] font-medium transition-all duration-150',
                          collapsed && 'lg:justify-center lg:px-0',
                          active
                            ? 'bg-[#2563EB]/20 text-white font-semibold shadow-xs ring-1 ring-[#3B82F6]/35'
                            : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                        )}
                      >
                        {active && (
                          <span
                            className={cn(
                              'absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#3B82F6] shadow-[0_0_8px_rgba(59,130,246,0.6)]',
                              collapsed && 'lg:hidden'
                            )}
                          />
                        )}
                        <Icon
                          className={cn(
                            'size-4.5 shrink-0 transition-colors',
                            active ? 'text-[#60A5FA]' : 'text-slate-500 group-hover:text-slate-300'
                          )}
                          aria-hidden="true"
                        />
                        <span className={cn('truncate', collapsed && 'lg:hidden')}>{item.label}</span>
                        {!!item.badge && item.badge > 0 && (
                          <span
                            className={cn(
                              'ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ring-1 ring-inset',
                              item.badgeTone === 'blue'
                                ? 'bg-[#3B82F6]/15 text-[#93C5FD] ring-[#3B82F6]/30'
                                : 'bg-amber-400/15 text-amber-300 ring-amber-400/30',
                              collapsed && 'lg:hidden'
                            )}
                            title={item.badgeHint ?? `${item.badge} pendientes`}
                            aria-label={item.badgeHint ?? `${item.badge} pendientes`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="shrink-0 space-y-2.5 border-t border-slate-800/80 bg-[#070A0F] p-3.5">
          <div
            className={cn(
              'rounded-xl border border-slate-800/80 bg-slate-900/60 px-3 py-2',
              collapsed && 'lg:hidden'
            )}
          >
            <p className="truncate text-[11.5px] font-semibold text-slate-200">{settings.legalName}</p>
            <p className="mt-0.5 font-mono text-[10.5px] tabular-nums text-slate-400">
              RUC {settings.ruc}
            </p>
          </div>

          <div
            className={cn(
              'flex items-center gap-3 rounded-xl px-1.5 py-1',
              collapsed && 'lg:justify-center lg:px-0'
            )}
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-[11px] font-bold text-white shadow-xs">
              {initials}
            </span>
            <div className={cn('min-w-0', collapsed && 'lg:hidden')}>
              <p className="truncate text-xs font-semibold text-white">{user.name}</p>
              <p className="truncate text-[10.5px] text-slate-400">{user.roleName}</p>
            </div>
          </div>
        </div>
        </div>
      </aside>

      <div
        className={cn(
          'flex min-h-screen flex-col transition-[padding] duration-300',
          collapsed ? 'lg:pl-[160px]' : 'lg:pl-[356px]'
        )}
      >
        <header className="sticky top-0 z-30 border-b border-border/80 bg-card/85 backdrop-blur-lg">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="grid size-9 place-items-center rounded-xl border border-border bg-card text-muted-foreground shadow-xs transition hover:bg-muted lg:hidden"
                aria-label="Abrir menú"
              >
                <Menu className="size-4" />
              </button>

              <nav aria-label="Migas de pan" className="flex min-w-0 items-center gap-1.5 text-xs">
                <span className="hidden text-muted-foreground sm:inline">{breadcrumb.section}</span>
                <ChevronRight
                  className="hidden size-3.5 shrink-0 text-muted-foreground/60 sm:inline"
                  aria-hidden="true"
                />
                <span className="truncate font-semibold text-foreground">{breadcrumb.title}</span>
              </nav>
            </div>

            {/* Buscador interactivo y Command Palette Trigger (Ctrl + K) */}
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="ml-auto hidden min-w-0 items-center justify-between gap-3 rounded-xl border border-border bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground shadow-xs transition hover:border-[#2563EB]/40 hover:bg-card hover:text-foreground md:flex md:w-64 lg:w-80"
              aria-label="Abrir buscador y comandos (Ctrl + K)"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="truncate">Buscar productos, SKU, cotizaciones…</span>
              </div>
              <kbd className="inline-flex shrink-0 items-center gap-0.5 rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted-foreground shadow-2xs">
                <span className="text-[9px]">Ctrl</span> K
              </kbd>
            </button>

            <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
              {/* Botón rápido Command en móvil */}
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="grid size-9 place-items-center rounded-xl border border-border bg-card text-muted-foreground shadow-xs transition hover:bg-muted md:hidden"
                aria-label="Buscar con Command Palette"
              >
                <Search className="size-4" />
              </button>

              {/* Centro de notificaciones */}
              <NotificationsMenu
                counts={{
                  quotes: pendingQuoteCount,
                  products: lowStockCount,
                  orders: openOrderCount,
                  requests: newRequestCount,
                  complaints: 0,
                }}
                can={can}
              />

              <a
                href={storeUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Abrir la tienda en una nueva pestaña"
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-card px-3 text-[11px] font-semibold text-muted-foreground shadow-xs transition hover:border-input hover:bg-muted"
              >
                <ExternalLink className="size-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Ver tienda</span>
              </a>

              <ThemeToggle />

              <span className="hidden h-6 w-px bg-border sm:block" aria-hidden="true" />

              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                  aria-label="Menú de perfil"
                  className="grid size-9 place-items-center rounded-full bg-slate-800 text-[11px] font-bold text-white ring-2 ring-white shadow-sm transition hover:bg-slate-700"
                >
                  {initials}
                </button>

                {profileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-slate-900/10"
                  >
                    <div className="border-b border-border px-4 py-3">
                      <p className="text-xs font-bold text-foreground">{user.name}</p>
                      <p className="mt-0.5 truncate text-[10.5px] text-muted-foreground">{user.email}</p>
                      <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-[9.5px] font-semibold text-muted-foreground">
                        <ShieldCheck className="size-3" aria-hidden="true" />
                        {user.roleName}
                      </p>
                    </div>
                    <div className="p-1.5">
                      <Link
                        href="/configuracion"
                        className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        role="menuitem"
                      >
                        <Settings className="size-4 text-muted-foreground" aria-hidden="true" />
                        Configuración
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-muted-foreground transition hover:bg-red-500/10 hover:text-danger-ink disabled:cursor-not-allowed disabled:opacity-60"
                        role="menuitem"
                      >
                        {loggingOut ? (
                          <Loader2 className="size-4 animate-spin text-muted-foreground" aria-hidden="true" />
                        ) : (
                          <LogOut className="size-4 text-muted-foreground" aria-hidden="true" />
                        )}
                        {loggingOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {catalogError ? (
          <div className="mx-auto w-full max-w-[1440px] px-4 pt-4 sm:px-6 lg:px-8">
            <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-warning-ink">
              El catálogo no está sincronizado con la base de datos. Se mantiene el respaldo
              local. {catalogError}
            </p>
          </div>
        ) : null}

        {commercialError ? (
          <div className="mx-auto w-full max-w-[1440px] px-4 pt-4 sm:px-6 lg:px-8">
            <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-warning-ink">
              Clientes y cotizaciones no están sincronizados con la base de datos. Se mantiene el
              respaldo local. {commercialError}
            </p>
          </div>
        ) : null}

        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {blockedByPermission ? (
            <EmptyState
              icon={ShieldX}
              title="Sin acceso a esta sección"
              description={`Tu rol (${user.roleName}) no tiene el permiso de lectura de ${blockedModuleLabel}. Un superadministrador puede ampliarlo desde Usuarios y permisos.`}
              action={
                <Link href="/" className={btnSecondary}>
                  Volver al resumen
                </Link>
              }
            />
          ) : (
            children
          )}
        </main>

        <footer className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-2 px-4 pb-6 text-[10.5px] text-muted-foreground sm:px-6 lg:px-8">
          <p>© 2026 {settings.storeName}. Panel interno de administración.</p>
          <p className="font-medium">
            {catalogSource === 'api' && commercialSource === 'api' && projectsSource === 'api'
              ? 'Catálogo, comercial y proyectos en base de datos'
              : 'Respaldo local'}{' '}
            · v1.2
          </p>
        </footer>
      </div>

      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    </div>
  )
}
