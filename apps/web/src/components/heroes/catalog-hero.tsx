'use client'

import { useState } from 'react'
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  HardDrive,
  Laptop,
  Monitor,
  Network,
  Package,
  Router,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from 'lucide-react'
import {
  HERO_CONTAINER,
  HeroAccent,
  HeroAction,
  HeroActions,
  HeroEyebrow,
  HeroLead,
  HeroSection,
  HeroTitle,
} from '@/components/heroes/hero-primitives'
import { findProduct, type Product } from '@/lib/catalog'
import { cn } from '@/lib/utils'

type QuickCategory = {
  label: string
  count: number
}

type CatalogHeroProps = {
  totalProducts: number
  categoryCount: number
  activeCategory?: string
  quickCategories?: QuickCategory[]
  onSelectCategory?: (category: string) => void
}

const categoryIcons: Record<string, LucideIcon> = {
  Laptops: Laptop,
  Monitores: Monitor,
  Componentes: HardDrive,
  Redes: Router,
  'PC y Servidores': Boxes,
}

const defaultQuickCategories: QuickCategory[] = [
  { label: 'Laptops', count: 12 },
  { label: 'Componentes', count: 9 },
  { label: 'Monitores', count: 7 },
  { label: 'Redes', count: 6 },
  { label: 'Almacenamiento', count: 5 },
]

const featuredIds = ['lenovo-thinkpad-e14-g5', 'dell-ultrasharp-u2422h', 'tp-link-tl-sg1016']

const availabilityLabel = {
  available: 'Disponible',
  limited: 'Stock limitado',
  consult: 'Consultar',
} as const

function ProductTile({
  product,
  large = false,
}: {
  product?: Product
  large?: boolean
}) {
  const [imageFailed, setImageFailed] = useState(false)

  if (!product) return null

  return (
    <div
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white transition duration-300 hover:border-[#2563EB]/30 hover:shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)]',
        large ? 'col-span-2' : '',
      )}
    >
      <div
        className={cn(
          'relative m-2.5 mb-0 overflow-hidden rounded-xl border border-[#EEF2F7] bg-[#F8FAFC]',
          large ? 'aspect-[16/8.5]' : 'aspect-[4/3]',
        )}
      >
        {imageFailed ? (
          <div className="flex size-full items-center justify-center text-[#2563EB]">
            <Package aria-hidden="true" className="size-7" strokeWidth={1.4} />
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
            className={cn(
              'size-full object-contain transition-transform duration-500 group-hover:scale-[1.03]',
              large ? 'p-4 sm:p-5' : 'p-2.5 sm:p-3',
            )}
          />
        )}
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md border border-[#E2E8F0] bg-white/90 px-1.5 py-0.5 text-[7.5px] font-bold uppercase tracking-wider text-[#475569] backdrop-blur">
          {product.category}
        </span>
      </div>
      <div className={cn('px-3 pb-3 pt-2', large ? 'sm:px-3.5' : '')}>
        <p className="line-clamp-1 text-[10px] font-bold text-[#0F172A] sm:text-[11px]">
          {product.name}
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="truncate text-[8.5px] text-[#64748B]">{product.brand}</p>
          <span className="inline-flex shrink-0 items-center gap-1 text-[8px] font-semibold text-[#475569]">
            <span
              aria-hidden="true"
              className={cn(
                'size-1 rounded-full',
                product.availability === 'available'
                  ? 'bg-[#14B8A6]'
                  : product.availability === 'limited'
                    ? 'bg-[#F59E0B]'
                    : 'bg-[#94A3B8]',
              )}
            />
            {product.availability ? availabilityLabel[product.availability] : 'A cotizar'}
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * Variante B · Hero para categorías y catálogo de productos.
 * Se usa en /productos. Las subcategorías son accesos rápidos reales al filtro.
 */
export function CatalogHero({
  totalProducts,
  categoryCount,
  activeCategory,
  quickCategories = defaultQuickCategories,
  onSelectCategory,
}: CatalogHeroProps) {
  const featured = featuredIds
    .map((id) => findProduct(id))
    .filter((product): product is Product => Boolean(product))
  const [primary, ...rest] = featured

  const handleSelect = (category: string) => {
    onSelectCategory?.(category)
    if (typeof document !== 'undefined') {
      document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <HeroSection>
      <div className={`${HERO_CONTAINER} pb-10 pt-9 sm:pb-12 sm:pt-11 lg:pb-14 lg:pt-12`}>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.96fr)] lg:gap-12 xl:gap-16">
          <div className="max-w-[620px]">
            <HeroEyebrow icon={<Package aria-hidden="true" className="size-3.5" />}>
              Catálogo corporativo
            </HeroEyebrow>

            <HeroTitle size="lg">
              Equipos y tecnología para <HeroAccent>cada área</HeroAccent> de tu empresa.
            </HeroTitle>

            <HeroLead>
              Explora laptops, componentes, monitores, redes y equipamiento profesional. Agrega lo
              que necesitas y recibe una cotización con asesoría real, sin comprar a ciegas.
            </HeroLead>

            <div className="hero-reveal hero-delay-3 mt-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-[10.5px] font-semibold text-[#475569] shadow-sm">
                <Package aria-hidden="true" className="size-3 text-[#2563EB]" />
                {totalProducts} productos
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-[10.5px] font-semibold text-[#475569] shadow-sm">
                <Boxes aria-hidden="true" className="size-3 text-[#2563EB]" />
                {categoryCount} categorías
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-[10.5px] font-semibold text-[#475569] shadow-sm">
                <ShieldCheck aria-hidden="true" className="size-3 text-[#2563EB]" />
                Cotización asistida
              </span>
            </div>

            <HeroActions>
              <HeroAction href="#catalogo">Ver catálogo completo</HeroAction>
              <HeroAction href="/cotizacion" variant="secondary">
                Solicitar cotización
              </HeroAction>
            </HeroActions>

            <div className="hero-reveal hero-delay-4 mt-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                Accesos rápidos
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {quickCategories.map((category) => {
                  const Icon = categoryIcons[category.label] ?? Package
                  const isActive = activeCategory === category.label
                  return (
                    <button
                      key={category.label}
                      type="button"
                      onClick={() => handleSelect(category.label)}
                      aria-pressed={isActive}
                      className={cn(
                        'group inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-[10.5px] font-semibold transition',
                        isActive
                          ? 'border-[#2563EB] bg-[#2563EB] text-white shadow-sm'
                          : 'border-[#E2E8F0] bg-white text-[#475569] hover:border-[#2563EB]/40 hover:text-[#1D4ED8]',
                      )}
                    >
                      <Icon
                        aria-hidden="true"
                        className={cn(
                          'size-3.5',
                          isActive ? 'text-white' : 'text-[#2563EB]',
                        )}
                      />
                      {category.label}
                      <span
                        className={cn(
                          'rounded px-1 font-mono text-[8.5px]',
                          isActive ? 'bg-white/20 text-white' : 'bg-[#F1F5F9] text-[#64748B]',
                        )}
                      >
                        {category.count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="hero-reveal hero-delay-2 relative mx-auto w-full max-w-[560px] lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute inset-x-8 inset-y-10 -z-10 rounded-[40px] bg-[#2563EB]/10 blur-3xl"
            />
            <div className="hero-float-soft relative rounded-[24px] border border-[#E2E8F0] bg-white p-3 shadow-[0_42px_100px_-52px_rgba(15,23,42,0.5)] sm:p-3.5">
              <div className="flex items-center justify-between gap-3 px-1.5 pb-2.5 pt-0.5">
                <div className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                    <Boxes aria-hidden="true" className="size-3.5" />
                  </span>
                  <div>
                    <p className="text-[10.5px] font-bold text-[#0F172A]">Selección corporativa</p>
                    <p className="text-[8.5px] text-[#64748B]">Equipos para empresas y oficinas</p>
                  </div>
                </div>
                <a
                  href="#catalogo"
                  className="inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-[9px] font-bold text-[#1D4ED8] transition hover:bg-[#EFF6FF]"
                >
                  Ver todo <ArrowRight aria-hidden="true" className="size-3" />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <ProductTile product={primary} large />
                {rest.map((product) => (
                  <ProductTile key={product.id} product={product} />
                ))}
              </div>

              <div className="mt-2.5 flex items-center justify-between gap-2 rounded-xl border border-[#EEF2F7] bg-[#F8FAFC] px-2.5 py-2">
                <span className="inline-flex items-center gap-1.5 text-[8.5px] font-semibold text-[#475569]">
                  <Truck aria-hidden="true" className="size-3 text-[#2563EB]" />
                  Entrega coordinada a nivel nacional
                </span>
                <span className="inline-flex items-center gap-1 text-[8px] font-bold text-[#15803D]">
                  <CheckCircle2 aria-hidden="true" className="size-3" />
                  Asesoría incluida
                </span>
              </div>
            </div>

            <div className="hero-float absolute -bottom-5 -left-2 hidden items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white/95 px-3 py-2.5 shadow-[0_18px_40px_-22px_rgba(15,23,42,0.4)] backdrop-blur sm:flex">
              <span className="grid size-7 place-items-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                <Network aria-hidden="true" className="size-3.5" />
              </span>
              <span>
                <span className="block text-[10px] font-bold leading-4 text-[#0F172A]">
                  {totalProducts}+ referencias
                </span>
                <span className="block text-[8.5px] leading-4 text-[#64748B]">Catálogo en crecimiento</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </HeroSection>
  )
}
