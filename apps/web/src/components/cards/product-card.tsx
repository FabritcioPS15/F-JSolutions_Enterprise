'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  AppWindow,
  ArrowRight,
  BatteryCharging,
  Cable,
  Check,
  ClipboardList,
  Cpu,
  Gamepad2,
  HardDrive,
  Headphones,
  Heart,
  House,
  Keyboard,
  Laptop,
  Monitor,
  Package,
  Printer,
  Router,
  Server,
  Smartphone,
  type LucideIcon,
} from 'lucide-react'
import { useFavorites } from '@/lib/use-favorites'
import type { Product } from '@/lib/catalog'

type ProductCardProps = {
  product: Product
  onAddToQuote: (id: string) => void
}

const categoryIcons: Record<string, LucideIcon> = {
  'PC y Servidores': Server,
  Laptops: Laptop,
  Componentes: Cpu,
  Monitores: Monitor,
  'Periféricos': Keyboard,
  Almacenamiento: HardDrive,
  Redes: Router,
  'Impresoras y Escáneres': Printer,
  Impresoras: Printer,
  'Audio y Video': Headphones,
  Gaming: Gamepad2,
  Accesorios: Cable,
  'Telefonía': Smartphone,
  Software: AppWindow,
  'Cables y Energía': BatteryCharging,
  'Hogar inteligente': House,
}

const availabilityLabels = {
  available: 'En stock para entrega inmediata',
  limited: 'Stock limitado',
  consult: 'A pedido corporativo',
}

const availabilityColors = {
  available: 'bg-[#10B981]',
  limited: 'bg-[#F59E0B]',
  consult: 'bg-[#64748B]',
}

export function ProductCard({ product, onAddToQuote }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const [added, setAdded] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const CategoryIcon = categoryIcons[product.category] ?? Package

  const handleAddToQuote = (event: React.MouseEvent) => {
    event.stopPropagation()
    event.preventDefault()
    onAddToQuote(product.id)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1600)
  }

  const handleToggleFavorite = (event: React.MouseEvent) => {
    event.stopPropagation()
    event.preventDefault()
    toggleFavorite(product.id)
  }

  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#2563EB]/40 hover:shadow-lg"
    >
      {/* Contenedor de Imagen ampliado */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F8FAFC] p-4 sm:p-5">
        {imageFailed ? (
          <div
            role="img"
            aria-label={product.name}
            className="flex size-full flex-col items-center justify-center gap-3 px-5 text-center"
          >
            <span className="grid size-16 place-items-center rounded-2xl border border-[#E2E8F0] bg-white text-[#2563EB]">
              <CategoryIcon className="size-7" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#64748B]">
              {product.category}
            </span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
            className="size-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Botón de Favoritos */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-label={`${isFavorite(product.id) ? 'Quitar de' : 'Agregar a'} favoritos: ${product.name}`}
          aria-pressed={isFavorite(product.id)}
          className={`absolute right-3 top-3 grid size-9 place-items-center rounded-xl border border-[#E2E8F0] bg-white/95 shadow-xs backdrop-blur transition hover:scale-105 hover:border-[#2563EB]/40 ${
            isFavorite(product.id) ? 'text-[#EF4444]' : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <Heart className={`size-4 ${isFavorite(product.id) ? 'fill-current' : ''}`} aria-hidden="true" />
        </button>

        {/* Badge de Disponibilidad */}
        {product.availability && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-[#0F172A] shadow-xs backdrop-blur">
            <span className={`size-1.5 rounded-full ${availabilityColors[product.availability]}`} />
            {availabilityLabels[product.availability]}
          </span>
        )}
      </div>

      {/* Contenido de la Card */}
      <div className="flex flex-1 flex-col p-5">
        {/* Jerarquía: Marca + Subcategoría + Sub-subcategoría */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="rounded-md bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">
            {product.brand}
          </span>
          <span className="text-xs text-[#64748B] font-medium">
            {product.subcategory || product.category}
          </span>
          {product.subSubcategory && (
            <>
              <span className="text-[#CBD5E1]">·</span>
              <span className="text-xs text-[#94A3B8] font-normal truncate max-w-[140px]">
                {product.subSubcategory}
              </span>
            </>
          )}
        </div>

        {/* Título del producto con tamaño mejorado */}
        <h3 className="mt-2.5 font-heading text-base font-bold leading-snug text-[#0F172A] transition-colors group-hover:text-[#2563EB] line-clamp-2 min-h-[46px]">
          {product.name}
        </h3>

        {/* SKU y Modelo */}
        {(product.model || product.sku) && (
          <div className="mt-1 flex items-center gap-2 text-[11px] text-[#64748B]">
            {product.sku && (
              <span>
                SKU: <span className="font-mono font-medium text-[#0F172A]">{product.sku}</span>
              </span>
            )}
            {product.model && product.sku && <span className="text-[#E2E8F0]">|</span>}
            {product.model && (
              <span>
                Mod: <span className="font-mono font-medium text-[#0F172A]">{product.model}</span>
              </span>
            )}
          </div>
        )}

        {/* Especificaciones clave */}
        <ul className="mt-3 space-y-1.5 text-xs text-[#475569]">
          {product.specs.slice(0, 3).map((spec) => (
            <li key={spec} className="flex items-start gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#2563EB]" />
              <span className="line-clamp-1">{spec}</span>
            </li>
          ))}
        </ul>

        {/* Botón de acción inferior */}
        <div className="mt-auto pt-5">
          <button
            type="button"
            onClick={handleAddToQuote}
            className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 ${
              added
                ? 'bg-[#10B981] text-white shadow-sm'
                : 'bg-[#2563EB] text-white shadow-xs hover:bg-[#1D4ED8] hover:shadow-md active:scale-[0.98]'
            }`}
          >
            {added ? (
              <Check className="size-4" aria-hidden="true" />
            ) : (
              <ClipboardList className="size-4" aria-hidden="true" />
            )}
            {added ? 'Agregado a cotización' : 'Agregar a cotización'}
          </button>
        </div>
      </div>
    </Link>
  )
}
