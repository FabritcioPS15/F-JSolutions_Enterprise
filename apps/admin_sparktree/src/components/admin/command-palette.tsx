'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  BarChart3,
  BookOpenCheck,
  Boxes,
  FilePlus,
  FileText,
  FolderTree,
  Globe2,
  History,
  Inbox,
  LayoutDashboard,
  Link2,
  Network,
  Package,
  PackageCheck,
  PackagePlus,
  Scale,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Tags,
  Truck,
  Users,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useAdmin } from '@/components/admin/admin-provider'
import { moduleByHref } from '@/lib/admin/access'
import { formatCurrency } from '@/lib/admin/format'

type CommandItem = {
  id: string
  title: string
  subtitle?: string
  href: string
  icon: LucideIcon
  badge?: string
  group: 'Navegación' | 'Acciones rápidas' | 'Productos' | 'Comercial'
}

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const { products, quotes, clients, can } = useAdmin()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Enfocar el input al abrir y limpiar búsqueda
  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Rutas base del panel con sus iconos
  const navItems = useMemo<CommandItem[]>(() => {
    const raw: Array<{ title: string; href: string; icon: LucideIcon; group: 'Navegación' }> = [
      { title: 'Resumen general (Dashboard)', href: '/', icon: LayoutDashboard, group: 'Navegación' },
      { title: 'Reportes y analítica', href: '/reportes', icon: BarChart3, group: 'Navegación' },
      { title: 'Actividad reciente', href: '/actividad', icon: History, group: 'Navegación' },
      { title: 'Unidades de negocio del grupo', href: '/unidades', icon: Network, group: 'Navegación' },
      { title: 'Casos legales', href: '/legal', icon: Scale, group: 'Navegación' },
      { title: 'Linkeador: páginas de enlaces', href: '/links', icon: Link2, group: 'Navegación' },
      { title: 'Catálogo de productos', href: '/productos', icon: Package, group: 'Navegación' },
      { title: 'Inventario y control de stock', href: '/inventario', icon: Boxes, group: 'Navegación' },
      { title: 'Categorías del catálogo', href: '/categorias', icon: FolderTree, group: 'Navegación' },
      { title: 'Marcas autorizadas', href: '/marcas', icon: Tags, group: 'Navegación' },
      { title: 'Atributos técnicos', href: '/atributos', icon: SlidersHorizontal, group: 'Navegación' },
      { title: 'Cotizaciones comerciales', href: '/cotizaciones', icon: FileText, group: 'Navegación' },
      { title: 'Pedidos y entregas', href: '/pedidos', icon: PackageCheck, group: 'Navegación' },
      { title: 'Directorio de clientes', href: '/clientes', icon: Users, group: 'Navegación' },
      { title: 'Mesa de ayuda y solicitudes', href: '/solicitudes', icon: Inbox, group: 'Navegación' },
      { title: 'Libro de reclamaciones', href: '/reclamaciones', icon: BookOpenCheck, group: 'Navegación' },
      { title: 'Servicios de TI', href: '/servicios', icon: Wrench, group: 'Navegación' },
      { title: 'Proyectos web corporativos', href: '/proyectos', icon: Globe2, group: 'Navegación' },
      { title: 'Proveedores registrados', href: '/proveedores', icon: Truck, group: 'Navegación' },
      { title: 'Usuarios y roles', href: '/usuarios', icon: ShieldCheck, group: 'Navegación' },
      { title: 'Configuración general', href: '/configuracion', icon: Settings, group: 'Navegación' },
    ]

    return raw
      .filter((item) => {
        const module = moduleByHref[item.href]
        return !module || can(module)
      })
      .map((item) => ({ ...item, id: `nav-${item.href}` }))
  }, [can])

  // Acciones rápidas operativas
  const actionItems = useMemo<CommandItem[]>(() => {
    return [
      {
        id: 'act-new-product',
        title: 'Crear nuevo producto',
        subtitle: 'Registrar un nuevo producto en el catálogo',
        href: '/productos/nuevo',
        icon: PackagePlus,
        badge: 'Nuevo',
        group: 'Acciones rápidas',
      },
      {
        id: 'act-low-stock',
        title: 'Ver productos por reponer',
        subtitle: 'Listado filtrado con stock bajo o agotado',
        href: '/productos?stock=low',
        icon: Boxes,
        badge: 'Alerta',
        group: 'Acciones rápidas',
      },
      {
        id: 'act-new-service',
        title: 'Registrar nuevo servicio TI',
        subtitle: 'Publicar una nueva oferta o paquete de soporte',
        href: '/servicios/nuevo',
        icon: Wrench,
        badge: 'Servicios',
        group: 'Acciones rápidas',
      },
      {
        id: 'act-draft-quotes',
        title: 'Ver cotizaciones en borrador / pendientes',
        subtitle: 'Cotizaciones comerciales por revisar y emitir',
        href: '/cotizaciones?status=pending',
        icon: FilePlus,
        badge: 'Comercial',
        group: 'Acciones rápidas',
      },
    ]
  }, [])

  // Productos encontrados según búsqueda
  const productItems = useMemo<CommandItem[]>(() => {
    const q = query.trim().toLowerCase()
    if (!q || q.length < 2) return []

    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map((p) => ({
        id: `prod-${p.id}`,
        title: p.name,
        subtitle: `SKU: ${p.sku} · ${p.brand} · Stock: ${p.stock} un. · ${formatCurrency(p.price, 'PEN')}`,
        href: `/productos/${p.id}`,
        icon: Package,
        badge: p.status === 'active' ? 'Publicado' : 'Borrador',
        group: 'Productos',
      }))
  }, [query, products])

  // Clientes y cotizaciones según búsqueda
  const commercialItems = useMemo<CommandItem[]>(() => {
    const q = query.trim().toLowerCase()
    if (!q || q.length < 2) return []

    const matchedClients: CommandItem[] = clients
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.documentNumber && c.documentNumber.includes(q)) ||
          c.company.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .map((c) => ({
        id: `client-${c.id}`,
        title: c.name,
        subtitle: `${c.documentType?.toUpperCase() ?? 'DOC'}: ${c.documentNumber ?? 'S/N'} · ${c.email}`,
        href: `/clientes?q=${encodeURIComponent(c.name)}`,
        icon: Users,
        badge: 'Cliente',
        group: 'Comercial',
      }))

    const matchedQuotes: CommandItem[] = quotes
      .filter((qt) => qt.code.toLowerCase().includes(q) || qt.clientName.toLowerCase().includes(q))
      .slice(0, 3)
      .map((qt) => ({
        id: `quote-${qt.id}`,
        title: `Cotización ${qt.code} - ${qt.clientName}`,
        subtitle: `Estado: ${qt.status} · ${qt.items.length} ítems registrados`,
        href: `/cotizaciones?code=${encodeURIComponent(qt.code)}`,
        icon: FileText,
        badge: 'Cotización',
        group: 'Comercial',
      }))

    return [...matchedClients, ...matchedQuotes]
  }, [query, clients, quotes])

  // Lista consolidada y filtrada
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      return [...actionItems, ...navItems]
    }

    const filteredNav = navItems.filter((item) => item.title.toLowerCase().includes(q))
    const filteredActions = actionItems.filter(
      (item) => item.title.toLowerCase().includes(q) || item.subtitle?.toLowerCase().includes(q)
    )

    return [...productItems, ...commercialItems, ...filteredActions, ...filteredNav]
  }, [query, navItems, actionItems, productItems, commercialItems])

  // Navegación con teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) =>
        prev <= 0 ? filteredItems.length - 1 : prev - 1
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = filteredItems[selectedIndex]
      if (item) {
        onClose()
        router.push(item.href)
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  // Scroll automático hacia el elemento seleccionado
  useEffect(() => {
    const container = listRef.current
    if (!container) return
    const activeEl = container.querySelector('[aria-selected="true"]') as HTMLElement
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 pt-12 sm:p-6 sm:pt-20"
      role="dialog"
      aria-modal="true"
      aria-label="Buscador global y comandos"
    >
      {/* Backdrop con blur */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Contenedor del Command Dialog */}
      <div className="relative flex max-h-[82vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-700/60 bg-[#1C1638] text-slate-100 shadow-2xl shadow-black/60 ring-1 ring-white/10 animate-in fade-in-0 zoom-in-95 duration-150">
        {/* Cabecera del buscador */}
        <div className="flex items-center gap-3 border-b border-slate-800 bg-[#0F0B1E] px-4 py-3 sm:px-5">
          <Search className="size-5 shrink-0 text-slate-400" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Buscar por producto, SKU, cliente, cotización o destino…"
            className="w-full bg-transparent text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              className="grid size-6 place-items-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white"
              aria-label="Limpiar búsqueda"
            >
              <X className="size-3.5" />
            </button>
          ) : (
            <kbd className="hidden rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-400 sm:inline-block">
              ESC
            </kbd>
          )}
        </div>

        {/* Resultados agrupados */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 scrollbar-thin">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              <p className="font-semibold text-slate-300">No se encontraron resultados</p>
              <p className="mt-1 text-[11px] text-slate-500">
                Prueba buscando por nombre de producto, SKU, cliente o sección.
              </p>
            </div>
          ) : (
            <ul className="space-y-1">
              {filteredItems.map((item, index) => {
                const Icon = item.icon
                const isSelected = index === selectedIndex

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onClose()
                        router.push(item.href)
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      aria-selected={isSelected}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs transition-all ${
                        isSelected
                          ? 'bg-[#5946A6] text-white shadow-md shadow-[#5946A6]/30'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <span
                        className={`grid size-8 shrink-0 place-items-center rounded-lg ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-800/80 text-slate-400'
                        }`}
                      >
                        <Icon className="size-4" aria-hidden="true" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{item.title}</p>
                        {item.subtitle && (
                          <p
                            className={`truncate text-[10.5px] ${
                              isSelected ? 'text-blue-100' : 'text-slate-400'
                            }`}
                          >
                            {item.subtitle}
                          </p>
                        )}
                      </div>

                      {item.badge && (
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Barra inferior con atajos */}
        <div className="flex items-center justify-between border-t border-slate-800/80 bg-[#0F0B1E] px-4 py-2.5 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono">↑</kbd>
              <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono">↓</kbd>
              Navegar
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono">↵</kbd>
              Seleccionar
            </span>
          </div>
          <span className="hidden sm:inline text-slate-500">
            SparkTree Group Command
          </span>
        </div>
      </div>
    </div>
  )
}
