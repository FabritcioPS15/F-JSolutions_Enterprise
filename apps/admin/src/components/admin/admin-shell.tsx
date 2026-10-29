'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Bell,
  Boxes,
  ChevronRight,
  ExternalLink,
  FileText,
  FolderTree,
  History,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Tags,
  Truck,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAdmin } from '@/components/admin/admin-provider'
import { getStockState } from '@/lib/admin/format'

type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
  badge?: number
  planned?: boolean
}

type NavSection = {
  label: string
  items: NavItem[]
}

const storeUrl = process.env.NEXT_PUBLIC_STORE_URL ?? 'http://localhost:3000'

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
  if (pathname === '/actividad') return { section: 'General', title: 'Actividad reciente' }
  if (pathname === '/configuracion') return { section: 'Sistema', title: 'Configuración' }
  return { section: 'Panel', title: 'Administración' }
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { products, settings } = useAdmin()
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const profileRef = useRef<HTMLDivElement>(null)

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

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const term = search.trim()
    router.push(term ? `/productos?q=${encodeURIComponent(term)}` : '/productos')
  }

  const lowStockCount = products.filter((product) => {
    if (product.status === 'archived') return false
    const state = getStockState(product)
    return state === 'low' || state === 'out'
  }).length

  const sections: NavSection[] = [
    {
      label: 'General',
      items: [
        { href: '/', label: 'Resumen', icon: LayoutDashboard, exact: true },
        { href: '/actividad', label: 'Actividad reciente', icon: History },
      ],
    },
    {
      label: 'Catálogo',
      items: [
        { href: '/productos', label: 'Productos', icon: Package, badge: lowStockCount },
        { href: '/categorias', label: 'Categorías', icon: FolderTree },
        { href: '/marcas', label: 'Marcas', icon: Tags },
        { href: '/atributos', label: 'Atributos y especificaciones', icon: SlidersHorizontal, planned: true },
      ],
    },
    {
      label: 'Comercial',
      items: [
        { href: '/cotizaciones', label: 'Cotizaciones', icon: FileText, planned: true },
        { href: '/clientes', label: 'Clientes', icon: Users, planned: true },
        { href: '/solicitudes', label: 'Solicitudes recibidas', icon: Inbox, planned: true },
      ],
    },
    {
      label: 'Operaciones',
      items: [
        { href: '/inventario', label: 'Inventario', icon: Boxes, planned: true },
        { href: '/proveedores', label: 'Proveedores', icon: Truck, planned: true },
      ],
    },
    {
      label: 'Administración',
      items: [
        { href: '/usuarios', label: 'Usuarios y permisos', icon: ShieldCheck, planned: true },
        { href: '/configuracion', label: 'Configuración', icon: Settings },
      ],
    },
  ]

  const breadcrumb = getBreadcrumb(pathname)

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-white/5 bg-[#0B1220] text-slate-300 transition-[transform,width] duration-300 ease-out lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
          collapsed && 'lg:w-[76px]'
        )}
        aria-label="Navegación principal"
      >
        <div
          className={cn(
            'flex h-20 shrink-0 items-center gap-3 border-b border-white/[0.06] px-5',
            collapsed && 'lg:justify-center lg:px-3'
          )}
        >
          <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="FJ Systems, inicio">
            <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-white/[0.08] font-heading text-sm font-bold tracking-tight text-white ring-1 ring-inset ring-white/15">
              FJ
              <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
            </span>
            <span className={cn('min-w-0', collapsed && 'lg:hidden')}>
              <span className="block truncate font-heading text-[15px] font-bold tracking-tight text-white">
                {settings.storeName}
              </span>
              <span className="block text-[9.5px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                Panel de administración
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={toggleCollapsed}
            className={cn(
              'ml-auto hidden size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white lg:grid',
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
            className="ml-auto grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5 scrollbar-thin">
          {collapsed && (
            <button
              type="button"
              onClick={toggleCollapsed}
              className="mx-auto mb-4 hidden size-8 place-items-center rounded-lg text-slate-500 transition hover:bg-white/10 hover:text-white lg:grid"
              aria-label="Expandir menú lateral"
              title="Expandir menú"
            >
              <PanelLeftOpen className="size-4" />
            </button>
          )}
          {sections.map((section) => (
            <div key={section.label} className="mb-6 last:mb-0">
              <p
                className={cn(
                  'mb-2 px-3 text-[9.5px] font-bold uppercase tracking-[0.22em] text-slate-600',
                  collapsed && 'lg:hidden'
                )}
              >
                {section.label}
              </p>
              {collapsed && <div className="mb-2 hidden h-px bg-white/[0.06] lg:block" aria-hidden="true" />}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const active =
                    !item.planned &&
                    (item.exact
                      ? pathname === item.href
                      : pathname === item.href || pathname.startsWith(`${item.href}/`))

                  if (item.planned) {
                    return (
                      <li key={item.href}>
                        <span
                          className={cn(
                            'flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-600',
                            collapsed && 'lg:justify-center lg:px-0'
                          )}
                          title={`${item.label} · disponible en una próxima etapa`}
                          aria-disabled="true"
                        >
                          <Icon className="size-[18px] shrink-0 text-slate-600" aria-hidden="true" />
                          <span className={cn('truncate', collapsed && 'lg:hidden')}>{item.label}</span>
                          <span
                            className={cn(
                              'ml-auto rounded-full bg-white/[0.04] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500 ring-1 ring-inset ring-white/[0.06]',
                              collapsed && 'lg:hidden'
                            )}
                          >
                            Pronto
                          </span>
                        </span>
                      </li>
                    )
                  }

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all',
                          collapsed && 'lg:justify-center lg:px-0',
                          active
                            ? 'bg-white/[0.07] text-white shadow-inner ring-1 ring-white/[0.06]'
                            : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                        )}
                      >
                        {active && (
                          <span
                            className={cn(
                              'absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-white/70',
                              collapsed && 'lg:hidden'
                            )}
                          />
                        )}
                        <Icon
                          className={cn(
                            'size-[18px] shrink-0 transition-colors',
                            active ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                          )}
                          aria-hidden="true"
                        />
                        <span className={cn('truncate', collapsed && 'lg:hidden')}>{item.label}</span>
                        {!!item.badge && item.badge > 0 && (
                          <span
                            className={cn(
                              'ml-auto rounded-full bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-amber-300 ring-1 ring-inset ring-amber-400/20',
                              collapsed && 'lg:hidden'
                            )}
                            title={`${item.badge} productos requieren reposición`}
                            aria-label={`${item.badge} productos requieren reposición`}
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

        <div className="shrink-0 space-y-3 border-t border-white/[0.06] p-4">
          <div
            className={cn(
              'rounded-2xl bg-white/[0.035] p-3 ring-1 ring-inset ring-white/[0.06]',
              collapsed && 'lg:hidden'
            )}
          >
            <div className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              <p className="text-[11px] font-semibold text-slate-300">Datos locales activos</p>
            </div>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-slate-500">
              El catálogo se guarda en este navegador. Exporta un respaldo desde Configuración.
            </p>
          </div>

          <div
            className={cn(
              'flex items-center gap-3 rounded-2xl px-1 py-0.5',
              collapsed && 'lg:justify-center lg:px-0'
            )}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-slate-700 to-slate-800 text-[11px] font-bold text-white ring-1 ring-white/10">
              AD
            </span>
            <div className={cn('min-w-0', collapsed && 'lg:hidden')}>
              <p className="truncate text-xs font-semibold text-white">Administrador</p>
              <p className="truncate text-[10.5px] text-slate-500">Sesión local</p>
            </div>
          </div>
        </div>
      </aside>

      <div
        className={cn(
          'flex min-h-screen flex-col transition-[padding] duration-300',
          collapsed ? 'lg:pl-[76px]' : 'lg:pl-[272px]'
        )}
      >
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-lg">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="grid size-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-xs transition hover:bg-slate-50 lg:hidden"
                aria-label="Abrir menú"
              >
                <Menu className="size-4" />
              </button>

              <nav aria-label="Migas de pan" className="flex min-w-0 items-center gap-1.5 text-xs">
                <span className="hidden text-slate-400 sm:inline">{breadcrumb.section}</span>
                <ChevronRight
                  className="hidden size-3.5 shrink-0 text-slate-300 sm:inline"
                  aria-hidden="true"
                />
                <span className="truncate font-semibold text-slate-900">{breadcrumb.title}</span>
              </nav>
            </div>

            <form onSubmit={handleSearch} className="ml-auto hidden min-w-0 md:block md:w-64 lg:w-80" role="search">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar productos o SKU…"
                  aria-label="Buscador global de productos"
                  className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </form>

            <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
              <Link
                href="/productos?stock=low"
                className="hidden items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2 text-[11px] font-semibold text-amber-700 transition hover:bg-amber-100 sm:inline-flex"
                title="Ver productos con stock bajo"
              >
                <Bell className="size-3.5" aria-hidden="true" />
                {lowStockCount} por reponer
              </Link>

              <a
                href={storeUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Abrir la tienda en una nueva pestaña"
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-600 shadow-xs transition hover:border-slate-300 hover:bg-slate-50"
              >
                <ExternalLink className="size-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Ver tienda</span>
              </a>

              <span className="hidden h-6 w-px bg-slate-200 sm:block" aria-hidden="true" />

              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                  aria-label="Menú de perfil"
                  className="grid size-9 place-items-center rounded-full bg-slate-800 text-[11px] font-bold text-white ring-2 ring-white shadow-sm transition hover:bg-slate-700"
                >
                  AD
                </button>

                {profileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10"
                  >
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="text-xs font-bold text-slate-900">Administrador</p>
                      <p className="mt-0.5 text-[10.5px] text-slate-500">{settings.email}</p>
                      <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-[9.5px] font-semibold text-slate-500">
                        Sesión local · sin autenticación remota
                      </p>
                    </div>
                    <div className="p-1.5">
                      <Link
                        href="/configuracion"
                        className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                        role="menuitem"
                      >
                        <Settings className="size-4 text-slate-400" aria-hidden="true" />
                        Configuración
                      </Link>
                      <span
                        className="flex cursor-not-allowed items-start gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-400"
                        title="Disponible cuando se conecte la autenticación"
                        aria-disabled="true"
                      >
                        <LogOut className="mt-0.5 size-4 text-slate-300" aria-hidden="true" />
                        <span>
                          Cerrar sesión
                          <span className="mt-0.5 block text-[9.5px] font-normal text-slate-400">
                            Requiere autenticación conectada
                          </span>
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>

        <footer className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-2 px-4 pb-6 text-[10.5px] text-slate-400 sm:px-6 lg:px-8">
          <p>© 2026 {settings.storeName}. Panel interno de administración.</p>
          <p className="font-medium">Almacenamiento local · v1.1</p>
        </footer>
      </div>
    </div>
  )
}
