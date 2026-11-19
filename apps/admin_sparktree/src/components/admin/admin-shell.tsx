'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BarChart3,
  Bell,
  BookOpenCheck,
  Boxes,
  Building2,
  Cpu,
  ChevronRight,
  ExternalLink,
  FileText,
  FolderTree,
  Globe2,
  Headphones,
  History,
  Inbox,
  KeyRound,
  LayoutDashboard,
  Link2,
  Loader2,
  LogOut,
  Menu,
  Network,
  Package,
  PackageCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Scale,
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
import {
  LEGAL_CASES_UPDATED_EVENT,
  countOpenLegalCases,
} from '@/lib/admin/legal-cases'

type NavArea =
  | 'general'
  | 'unidades'
  | 'catalogo'
  | 'servicios'
  | 'comercial'
  | 'atencion'
  | 'sistema'

type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
  badge?: number
  badgeHint?: string
}

type NavSection = {
  area: NavArea
  label: string
  icon: LucideIcon
  items: NavItem[]
}

const storeUrl = process.env.NEXT_PUBLIC_STORE_URL ?? 'http://localhost:3000'

// Categoría que contiene una ruta. Se usa para abrir el grupo correcto desde el
// primer render (servidor y cliente) y al navegar con el Command Palette.
const areaPaths: { area: NavArea; path: string }[] = [
  { area: 'general', path: '/' },
  { area: 'general', path: '/reportes' },
  { area: 'general', path: '/actividad' },
  { area: 'general', path: '/notificaciones' },
  { area: 'unidades', path: '/unidades' },
  { area: 'unidades', path: '/legal' },
  { area: 'catalogo', path: '/productos' },
  { area: 'catalogo', path: '/inventario' },
  { area: 'catalogo', path: '/categorias' },
  { area: 'catalogo', path: '/marcas' },
  { area: 'catalogo', path: '/atributos' },
  { area: 'catalogo', path: '/proveedores' },
  { area: 'servicios', path: '/servicios' },
  { area: 'servicios', path: '/proyectos' },
  { area: 'servicios', path: '/links' },
  { area: 'comercial', path: '/cotizaciones' },
  { area: 'comercial', path: '/pedidos' },
  { area: 'comercial', path: '/clientes' },
  { area: 'atencion', path: '/solicitudes' },
  { area: 'atencion', path: '/reclamaciones' },
  { area: 'sistema', path: '/usuarios' },
  { area: 'sistema', path: '/roles' },
  { area: 'sistema', path: '/areas' },
  { area: 'sistema', path: '/configuracion' },
  { area: 'sistema', path: '/auditoria' },
  { area: 'sistema', path: '/seguridad' },
  { area: 'sistema', path: '/integraciones' },
  { area: 'sistema', path: '/notificaciones' },
]

function areaForPath(path: string): NavArea | null {
  const match = areaPaths.find(
    (entry) => path === entry.path || path.startsWith(`${entry.path}/`)
  )
  return match?.area ?? null
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'SP'
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '')
  return initials.join('') || 'SP'
}

function getBreadcrumb(pathname: string) {
  if (pathname === '/') return { section: 'General', title: 'Resumen general' }
  if (pathname === '/reportes') return { section: 'General', title: 'Reportes y métricas' }
  if (pathname === '/actividad') return { section: 'General', title: 'Actividad reciente' }
  if (pathname === '/notificaciones') return { section: 'General', title: 'Notificaciones' }
  if (pathname === '/unidades') {
    return { section: 'Unidades de negocio', title: 'Ecosistema SparkTree' }
  }
  if (pathname === '/legal') {
    return { section: 'Unidades de negocio', title: 'Casos legales' }
  }
  if (pathname === '/productos') return { section: 'Catálogo y almacén', title: 'Productos' }
  if (pathname === '/productos/nuevo') {
    return { section: 'Catálogo y almacén', title: 'Nuevo producto' }
  }
  if (pathname.startsWith('/productos/') && pathname.endsWith('/editar')) {
    return { section: 'Catálogo y almacén', title: 'Editar producto' }
  }
  if (pathname.startsWith('/productos/')) {
    return { section: 'Catálogo y almacén', title: 'Detalle del producto' }
  }
  if (pathname === '/categorias') return { section: 'Catálogo y almacén', title: 'Categorías' }
  if (pathname === '/marcas') return { section: 'Catálogo y almacén', title: 'Marcas' }
  if (pathname === '/atributos') {
    return { section: 'Catálogo y almacén', title: 'Atributos y especificaciones' }
  }
  if (pathname === '/inventario') {
    return { section: 'Catálogo y almacén', title: 'Inventario y stock' }
  }
  if (pathname === '/proveedores') {
    return { section: 'Catálogo y almacén', title: 'Proveedores' }
  }
  if (pathname === '/cotizaciones') return { section: 'Comercial', title: 'Cotizaciones' }
  if (pathname === '/pedidos') return { section: 'Comercial', title: 'Pedidos y entregas' }
  if (pathname === '/clientes') return { section: 'Comercial', title: 'Directorio de clientes' }
  if (pathname === '/solicitudes') return { section: 'Atención al cliente', title: 'Mesa de ayuda' }
  if (pathname === '/reclamaciones') return { section: 'Atención al cliente', title: 'Libro de reclamaciones' }
  if (pathname === '/servicios') return { section: 'Servicios TI', title: 'Catálogo de servicios' }
  if (pathname === '/servicios/nuevo') return { section: 'Servicios TI', title: 'Nuevo servicio' }
  if (pathname.startsWith('/servicios/') && pathname.endsWith('/editar')) {
    return { section: 'Servicios TI', title: 'Editar servicio' }
  }
  if (pathname === '/proyectos') return { section: 'Servicios TI', title: 'Proyectos web' }
  if (pathname === '/links') return { section: 'Servicios TI', title: 'Linkeador' }
  if (pathname === '/usuarios') return { section: 'Sistema', title: 'Usuarios' }
  if (pathname === '/roles') return { section: 'Sistema', title: 'Roles y permisos' }
  if (pathname === '/areas') return { section: 'Sistema', title: 'Áreas organizacionales' }
  if (pathname === '/configuracion') return { section: 'Sistema', title: 'Configuración' }
  if (pathname === '/auditoria') return { section: 'Sistema', title: 'Auditoría del sistema' }
  if (pathname === '/seguridad') return { section: 'Sistema', title: 'Seguridad' }
  if (pathname === '/integraciones') return { section: 'Sistema', title: 'Integraciones' }
  if (pathname === '/notificaciones') return { section: 'Sistema', title: 'Centro de notificaciones' }
  // Fallback: buscar en areaPaths para derivar sección
  const areaEntry = areaPaths.find(
    (entry) => pathname === entry.path || pathname.startsWith(`${entry.path}/`)
  )
  if (areaEntry) {
    const areaLabels: Record<NavArea, string> = {
      general: 'General',
      unidades: 'Unidades de negocio',
      catalogo: 'Catálogo y almacén',
      servicios: 'Servicios TI',
      comercial: 'Comercial',
      atencion: 'Atención al cliente',
      sistema: 'Sistema',
    }
    const seg = pathname.split('/').filter(Boolean)
    const title = seg.length > 0
      ? seg[seg.length - 1]!.replace(/-/g, ' ').replace(/w/g, (c) => c.toUpperCase())
      : areaLabels[areaEntry.area]
    return { section: areaLabels[areaEntry.area], title }
  }
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
  // Acordeón de una sola categoría abierta a la vez. Arranca con el grupo de la
  // ruta actual para que la opción activa ya esté visible en el primer render.
  const [openArea, setOpenArea] = useState<NavArea | null>(() => areaForPath(pathname))
  // El libro de reclamaciones vive en su propio endpoint; se cuenta aquí para
  // que aparezca tanto en el sidebar como en la campanita de notificaciones.
  const canViewComplaints = can('complaints')
  const [complaintCount, setComplaintCount] = useState(0)
  const [openLegalCases, setOpenLegalCases] = useState(0)
  const [profileOpen, setProfileOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [flyoutArea, setFlyoutArea] = useState<NavArea | null>(null)
  const [flyoutPos, setFlyoutPos] = useState<{ top: number; left: number } | null>(null)
  const flyoutRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<Partial<Record<NavArea, HTMLDivElement | null>>>({})
  const profileRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement | null>(null)
  const asideRef = useRef<HTMLElement | null>(null)
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

  // La rueda sobre el sidebar nunca debe arrastrar la página. Si el panel
  // interno puede seguir scrolleando se respeta; al llegar al límite se corta
  // la propagación para que el contenido principal no se mueva.
  useEffect(() => {
    const aside = asideRef.current
    if (!aside) return

    function handleSidebarWheel(event: WheelEvent) {
      if (event.deltaY === 0) return
      const target = event.target as HTMLElement | null
      const scroller = target?.closest<HTMLElement>('[data-sidebar-scroll]')
      if (!scroller) {
        event.preventDefault()
        return
      }
      const atTop = scroller.scrollTop <= 0
      const atBottom =
        Math.ceil(scroller.scrollTop + scroller.clientHeight) >= scroller.scrollHeight
      if ((event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom)) {
        event.preventDefault()
      }
    }

    aside.addEventListener('wheel', handleSidebarWheel, { passive: false })
    return () => aside.removeEventListener('wheel', handleSidebarWheel)
  }, [])

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

  // Cerrar flyout al hacer click fuera o Escape
  useEffect(() => {
    if (!flyoutArea) return
    function handlePointer(event: MouseEvent) {
      if (!flyoutRef.current?.contains(event.target as Node)) setFlyoutArea(null)
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setFlyoutArea(null)
    }
    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [flyoutArea])

  // Cerrar flyout al navegar
  useEffect(() => { setFlyoutArea(null) }, [pathname])

  function openFlyout(area: NavArea) {
    if (flyoutArea === area) {
      setFlyoutArea(null)
      setFlyoutPos(null)
      return
    }
    const el = buttonRefs.current[area]
    if (el) {
      const rect = el.getBoundingClientRect()
      setFlyoutPos({ top: rect.top, left: rect.right + 8 })
    }
    setFlyoutArea(area)
  }

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

  // El área activa es excluyente: al pulsar una categoría se muestran solo sus
  // opciones y al volver a pulsarla se regresa a la vista completa.
  function areaRailClass(active: boolean) {
    return cn(
      'group relative grid size-11 place-items-center rounded-xl transition',
      active
        ? 'bg-[#7A67C9]/15 text-[#C5BDF2] ring-1 ring-[#7A67C9]/30'
        : 'text-slate-500 hover:bg-white/[0.05] hover:text-white'
    )
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

  const loadComplaints = useCallback(async () => {
    if (!canViewComplaints) {
      setComplaintCount(0)
      return
    }
    try {
      const response = await fetch('/api/admin/complaints', { cache: 'no-store' })
      if (!response.ok) return
      const payload = (await response.json()) as {
        data?: { complaints?: { status?: string }[] }
      }
      const list = payload.data?.complaints
      if (Array.isArray(list)) {
        setComplaintCount(list.filter((item) => item.status === 'pending').length)
      }
    } catch {
      // Si la API no responde se conserva el último conteo conocido.
    }
  }, [canViewComplaints])

  // Se refresca al navegar y al abrir la campanita (onRefresh).
  useEffect(() => {
    void loadComplaints()
  }, [loadComplaints, pathname])

  useEffect(() => {
    const sync = () => setOpenLegalCases(countOpenLegalCases())
    sync()
    window.addEventListener(LEGAL_CASES_UPDATED_EVENT, sync)
    return () => window.removeEventListener(LEGAL_CASES_UPDATED_EVENT, sync)
  }, [pathname])

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
      area: 'general',
      label: 'General',
      icon: LayoutDashboard,
      items: [
        { href: '/', label: 'Resumen', icon: LayoutDashboard, exact: true },
        { href: '/reportes', label: 'Reportes y métricas', icon: BarChart3 },
        { href: '/actividad', label: 'Actividad reciente', icon: History },
      ],
    },
    {
      area: 'unidades',
      label: 'Unidades de negocio',
      icon: Network,
      items: [
        { href: '/unidades', label: 'Ecosistema', icon: Network },
        {
          href: '/legal',
          label: 'Casos legales',
          icon: Scale,
          badge: openLegalCases,
          badgeHint:
            openLegalCases === 1
              ? '1 caso legal activo'
              : `${openLegalCases} casos legales activos`,
        },
      ],
    },
    {
      area: 'catalogo',
      label: 'Catálogo y almacén',
      icon: Package,
      items: [
        {
          href: '/productos',
          label: 'Productos',
          icon: Package,
          badge: lowStockCount,
          badgeHint:
            lowStockCount === 1
              ? '1 producto requiere reposición'
              : `${lowStockCount} productos requieren reposición`,
        },
        { href: '/inventario', label: 'Inventario y stock', icon: Boxes },
        { href: '/categorias', label: 'Categorías', icon: FolderTree },
        { href: '/marcas', label: 'Marcas', icon: Tags },
        { href: '/atributos', label: 'Atributos técnicos', icon: SlidersHorizontal },
        { href: '/proveedores', label: 'Proveedores', icon: Truck },
      ],
    },
    {
      area: 'servicios',
      label: 'Servicios TI',
      icon: Wrench,
      items: [
        { href: '/servicios', label: 'Catálogo de servicios', icon: Wrench },
        { href: '/proyectos', label: 'Proyectos web', icon: Globe2 },
        { href: '/links', label: 'Linkeador', icon: Link2 },
      ],
    },
    {
      area: 'comercial',
      label: 'Comercial',
      icon: ShoppingCart,
      items: [
        {
          href: '/cotizaciones',
          label: 'Cotizaciones',
          icon: FileText,
          badge: pendingQuoteCount,
          badgeHint:
            pendingQuoteCount === 1
              ? '1 cotización por atender'
              : `${pendingQuoteCount} cotizaciones por atender`,
        },
        {
          href: '/pedidos',
          label: 'Pedidos y entregas',
          icon: PackageCheck,
          badge: openOrderCount,
          badgeHint:
            openOrderCount === 1
              ? '1 pedido en ruta de entrega'
              : `${openOrderCount} pedidos en ruta de entrega`,
        },
        { href: '/clientes', label: 'Directorio de clientes', icon: Users },
      ],
    },
    {
      area: 'atencion',
      label: 'Atención al cliente',
      icon: Headphones,
      items: [
        {
          href: '/solicitudes',
          label: 'Mesa de ayuda',
          icon: Inbox,
          badge: newRequestCount,
          badgeHint:
            newRequestCount === 1
              ? '1 mensaje nuevo'
              : `${newRequestCount} mensajes nuevos`,
        },
        { href: '/reclamaciones', label: 'Reclamaciones', icon: BookOpenCheck, badge: complaintCount, badgeHint:
          complaintCount === 1
            ? '1 reclamación pendiente'
            : `${complaintCount} reclamaciones pendientes` },
      ],
    },
    {
      area: 'sistema',
      label: 'Sistema',
      icon: ShieldCheck,
      items: [
        { href: '/usuarios', label: 'Usuarios', icon: Users },
        { href: '/roles', label: 'Roles y permisos', icon: KeyRound },
        { href: '/areas', label: 'Áreas organizacionales', icon: Building2 },
        { href: '/configuracion', label: 'Configuración', icon: Settings },
        { href: '/auditoria', label: 'Auditoría del sistema', icon: History },
        { href: '/seguridad', label: 'Seguridad', icon: ShieldCheck },
        { href: '/integraciones', label: 'Integraciones', icon: Cpu },
        { href: '/notificaciones', label: 'Centro de notificaciones', icon: Bell },
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

  // Pendientes por categoría: se muestran como insignia roja aunque el grupo
  // esté cerrado o el sidebar esté contraído, para saber dónde hay avisos.
  function pendingForSection(section: NavSection) {
    return section.items.reduce((sum, item) => sum + (item.badge ?? 0), 0)
  }

  const notificationTotal = permittedSections.reduce(
    (sum, section) => sum + pendingForSection(section),
    0
  )

  // Entrar directo por URL abre la categoría que contiene la página actual.
  useEffect(() => {
    setOpenArea(areaForPath(pathname))
  }, [pathname])

  useEffect(() => {
    navRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [openArea])

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
        ref={asideRef}
        data-surface="dark"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[316px] max-w-full flex-col overflow-x-hidden border-r border-slate-800/80 bg-[#0E0A1C] text-slate-400 transition-[transform,width] duration-300 ease-out lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
          collapsed && 'lg:w-[92px]'
        )}
        aria-label="Navegación principal"
      >
        <div
          className={cn(
            'relative flex h-20 shrink-0 items-center gap-3 border-b border-slate-800/80 px-4',
            collapsed && 'lg:justify-center lg:px-0'
          )}
        >
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="group flex min-w-0 flex-1 items-center transition-transform duration-200"
            aria-label="SparkTree Admin, inicio"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/sparktree-horizontal.png"
              alt="SparkTree Admin"
              className={cn(
                'h-10 w-auto shrink-0 object-contain transition duration-200 group-hover:scale-105 sm:h-11',
                collapsed && 'lg:hidden'
              )}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/sparktree-symbol.png"
              alt=""
              aria-hidden="true"
              className={cn(
                'hidden h-10 w-auto shrink-0 object-contain transition duration-200 group-hover:scale-105 sm:h-11',
                collapsed && 'lg:block'
              )}
            />
          </Link>

          <button
            type="button"
            onClick={toggleCollapsed}
            className={cn(
              'hidden size-8 shrink-0 place-items-center rounded-xl text-slate-400 transition hover:bg-white/[0.08] hover:text-white lg:grid',
              collapsed && 'lg:hidden'
            )}
            aria-label="Contraer menú lateral"
            title="Contraer menú"
          >
            <PanelLeftClose className="size-4.5" />
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

        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className={cn(
            'mx-3 mt-3 flex shrink-0 items-center gap-2.5 rounded-xl border border-slate-800/80 bg-[#0D1320] px-3 py-2.5 text-xs text-slate-400 transition hover:border-slate-700 hover:text-slate-200',
            collapsed && 'lg:hidden'
          )}
          aria-label="Abrir buscador y comandos (Ctrl + K)"
        >
          <Search className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">Buscar en el panel…</span>
          <kbd className="ml-auto rounded border border-slate-800 bg-[#0E0A1C] px-1 py-0.5 font-mono text-[8.5px] font-bold text-slate-500">
            Ctrl K
          </kbd>
        </button>

        <nav
          ref={navRef}
          data-sidebar-scroll
          className={cn(
            'flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-3 pb-5 pt-3 scrollbar-thin',
            collapsed && 'lg:hidden'
          )}
        >
          <div className="flex flex-col">
            {permittedSections.length === 0 && (
              <p className="px-3 py-6 text-center text-[11px] leading-relaxed text-slate-500">
                Tu rol no tiene secciones habilitadas.
              </p>
            )}
            {permittedSections.map((section) => {
              const SectionIcon = section.icon
              const isOpen = openArea === section.area
              const sectionPending = pendingForSection(section)

              return (
                <div
                  key={section.area}
                  className={cn(
                    'mb-1 rounded-xl border transition-colors duration-150',
                    isOpen
                      ? 'border-slate-800/80 bg-white/[0.018]'
                      : 'border-transparent'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenArea(isOpen ? null : section.area)}
                    aria-expanded={isOpen}
                    aria-controls={`nav-group-${section.area}`}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] font-semibold transition-colors',
                      isOpen
                        ? 'bg-white/[0.02] text-white'
                        : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                    )}
                  >
                    <SectionIcon
                      className={cn(
                        'size-[18px] shrink-0 transition-colors',
                        isOpen ? 'text-[#C5BDF2]' : 'text-slate-500'
                      )}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1 truncate">{section.label}</span>
                    {sectionPending > 0 && (
                      <span
                        className="grid size-[19px] shrink-0 place-items-center rounded-full bg-rose-500 text-[10px] font-bold leading-none text-white aspect-square shadow-xs"
                        title={
                          sectionPending === 1
                            ? '1 aviso pendiente en esta categoría'
                            : `${sectionPending} avisos pendientes en esta categoría`
                        }
                        aria-label={
                          sectionPending === 1
                            ? '1 aviso pendiente en esta categoría'
                            : `${sectionPending} avisos pendientes en esta categoría`
                        }
                      >
                        {sectionPending > 99 ? '99+' : sectionPending}
                      </span>
                    )}
                    <ChevronRight
                      className={cn(
                        'size-3.5 shrink-0 transition-transform duration-200',
                        isOpen ? 'rotate-90 text-[#C5BDF2]' : 'text-slate-600'
                      )}
                      aria-hidden="true"
                    />
                  </button>

                  {isOpen && (
                    <div
                      id={`nav-group-${section.area}`}
                      className="relative px-2 pb-2 pl-8 before:absolute before:bottom-3 before:left-[19px] before:top-0 before:w-px before:bg-slate-800/80"
                    >
                      <ul className="space-y-0.5">
                        {section.items.map((item) => {
                          const Icon = item.icon
                          const active = item.exact
                            ? pathname === item.href
                            : pathname === item.href || pathname.startsWith(`${item.href}/`)
                          const hasBadge = !!item.badge && item.badge > 0

                          return (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={() => setOpen(false)}
                                aria-current={active ? 'page' : undefined}
                                className={cn(
                                  'group relative flex min-h-9 items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium leading-tight transition-colors duration-150',
                                  active
                                    ? 'bg-gradient-to-r from-[#7A67C9]/20 to-[#8876D9]/5 font-semibold text-white shadow-[inset_0_0_0_1px_rgba(122,103,201,0.20)]'
                                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                                )}
                              >
                                <Icon
                                  className={cn(
                                    'size-[17px] shrink-0 transition-colors',
                                    active
                                      ? 'text-[#C5BDF2]'
                                      : 'text-slate-500 group-hover:text-slate-300'
                                  )}
                                  aria-hidden="true"
                                />
                                <span className="truncate">{item.label}</span>
                                {hasBadge && (
                                  <span
                                    className="ml-auto grid size-[19px] shrink-0 place-items-center rounded-full bg-rose-500 text-[10px] font-bold leading-none text-white aspect-square shadow-xs"
                                    title={item.badgeHint ?? `${item.badge} pendientes`}
                                    aria-label={item.badgeHint ?? `${item.badge} pendientes`}
                                  >
                                    {(item.badge ?? 0) > 99 ? '99+' : item.badge}
                                  </span>
                                )}
                                {active && !hasBadge && (
                                  <span
                                    className="ml-auto size-1 shrink-0 rounded-full bg-[#7A67C9]"
                                    aria-hidden="true"
                                  />
                                )}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </nav>

        {collapsed && (
          <nav
            data-sidebar-scroll
            aria-label="Categorías"
            className="hidden min-h-0 flex-1 flex-col items-center gap-2 overflow-y-auto overflow-x-hidden overscroll-contain px-0 py-3 scrollbar-thin lg:flex"
          >
            {permittedSections.map((section) => {
              const SectionIcon = section.icon
              const isActive = areaForPath(pathname) === section.area
              const isFlyoutOpen = flyoutArea === section.area
              const sectionPending = pendingForSection(section)

              return (
                <div
                  key={section.area}
                  className="relative w-full flex justify-center"
                  ref={(el) => { buttonRefs.current[section.area] = el }}
                >
                  <button
                    type="button"
                    onClick={() => openFlyout(section.area)}
                    title={
                      sectionPending > 0
                        ? `${section.label} · ${sectionPending} pendientes`
                        : section.label
                    }
                    aria-label={`Ver opciones de ${section.label}`}
                    aria-expanded={isFlyoutOpen}
                    className={cn(
                      'group relative flex w-full max-w-[80px] flex-col items-center justify-center gap-1.5 rounded-2xl py-2.5 px-1 transition-all duration-200',
                      isActive || isFlyoutOpen
                        ? 'bg-gradient-to-b from-[#7A67C9]/20 to-[#5946A6]/10 text-white shadow-xs ring-1 ring-[#7A67C9]/40'
                        : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
                    )}
                  >
                    <span className="relative grid size-9 place-items-center rounded-xl transition duration-200 group-hover:scale-105">
                      <SectionIcon
                        className={cn(
                          'size-5.5 shrink-0 transition-colors',
                          isActive || isFlyoutOpen ? 'text-[#C5BDF2]' : 'text-slate-400 group-hover:text-white'
                        )}
                        aria-hidden="true"
                      />
                      {sectionPending > 0 && (
                        <span
                          className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-rose-500 text-[10px] font-extrabold leading-none text-white aspect-square shadow-sm ring-2 ring-[#0E0A1C]"
                          aria-hidden="true"
                        >
                          {sectionPending > 99 ? '99+' : sectionPending}
                        </span>
                      )}
                    </span>
                    <span
                      className={cn(
                        'text-[10px] font-semibold leading-tight text-center truncate max-w-[70px]',
                        isActive || isFlyoutOpen ? 'text-white font-bold' : 'text-slate-400 group-hover:text-slate-200'
                      )}
                    >
                      {section.label.split(' ')[0]}
                    </span>
                  </button>
                </div>
              )
            })}
            <button
              type="button"
              onClick={toggleCollapsed}
              className="group mt-3 flex w-full max-w-[80px] items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-b from-[#5946A6]/30 to-[#4A3A8F]/20 py-2.5 text-[#C5BDF2] ring-1 ring-[#7A67C9]/40 transition-all duration-200 hover:from-[#5946A6]/50 hover:to-[#4A3A8F]/35 hover:text-white hover:ring-[#7A67C9]/70 hover:shadow-lg hover:shadow-indigo-900/30"
              aria-label="Expandir menú lateral"
              title="Expandir menú"
            >
              <PanelLeftOpen className="size-4.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </nav>
        )}

        {/* ── Portal flyout — se monta en document.body para escapar overflow ── */}
        {collapsed && flyoutArea && flyoutPos &&
          createPortal(
            (() => {
              const section = permittedSections.find((s) => s.area === flyoutArea)
              if (!section) return null
              const SectionIcon = section.icon
              return (
                <div
                  ref={flyoutRef}
                  style={{ position: 'fixed', top: flyoutPos.top, left: flyoutPos.left, zIndex: 9999 }}
                  className="w-56 rounded-2xl border border-slate-700/70 bg-[#14102A] shadow-2xl shadow-black/70 ring-1 ring-white/[0.06] animate-in fade-in slide-in-from-left-2 duration-150"
                >
                  <div className="flex items-center gap-2 border-b border-slate-800/80 px-3.5 py-3">
                    <SectionIcon className="size-4 shrink-0 text-[#C5BDF2]" aria-hidden="true" />
                    <span className="text-[13px] font-bold text-slate-100">{section.label}</span>
                  </div>
                  <ul className="p-2 space-y-0.5">
                    {section.items.map((item) => {
                      const Icon = item.icon
                      const active = item.exact
                        ? pathname === item.href
                        : pathname === item.href || pathname.startsWith(`${item.href}/`)
                      const hasBadge = !!item.badge && item.badge > 0
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => { setFlyoutArea(null); setFlyoutPos(null) }}
                            aria-current={active ? 'page' : undefined}
                            className={cn(
                              'flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors duration-150',
                              active
                                ? 'bg-gradient-to-r from-[#7A67C9]/25 to-[#8876D9]/10 font-semibold text-white shadow-[inset_0_0_0_1px_rgba(122,103,201,0.25)]'
                                : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
                            )}
                          >
                            <Icon
                              className={cn('size-4 shrink-0', active ? 'text-[#C5BDF2]' : 'text-slate-500')}
                              aria-hidden="true"
                            />
                            <span className="flex-1 truncate">{item.label}</span>
                            {hasBadge && (
                              <span className="grid size-[18px] shrink-0 place-items-center rounded-full bg-rose-500 text-[9.5px] font-bold text-white aspect-square">
                                {(item.badge ?? 0) > 99 ? '99+' : item.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })(),
            document.body
          )
        }

        <div className="shrink-0 border-t border-slate-800/80 bg-[#0B0817] px-3 py-3">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#7A67C9]/15 text-[#C5BDF2] ring-1 ring-[#7A67C9]/25">
                <Building2 className="size-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-bold leading-snug text-slate-100">
                  {settings.legalName}
                </p>
                <p className="text-[11.5px] font-semibold tabular-nums text-slate-400">
                  RUC&nbsp;{settings.ruc}
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>

      <div
        className={cn(
          'flex min-h-screen flex-col transition-[padding] duration-300',
          collapsed ? 'lg:pl-[92px]' : 'lg:pl-[316px]'
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
              className="ml-auto hidden min-w-0 items-center justify-between gap-3 rounded-xl border border-border bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground shadow-xs transition hover:border-[#5946A6]/40 hover:bg-card hover:text-foreground md:flex md:w-64 lg:w-80"
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
                  complaints: complaintCount,
                }}
                can={can}
                onRefresh={loadComplaints}
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
                        onClick={() => setProfileOpen(false)}
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
