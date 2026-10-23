'use client'

import { useState } from 'react'
import {
  AppWindow,
  BatteryCharging,
  Cable,
  Check,
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
  ShoppingCart,
  Smartphone,
  Star,
  type LucideIcon,
} from 'lucide-react'
import { formatPrice, type Product } from '@/lib/catalog'

type ProductCardProps = {
  product: Product
  onAdd: (id: string) => void
}

const categoryIcons: Record<string, LucideIcon> = {
  'PC y Servidores': Server,
  Laptops: Laptop,
  Componentes: Cpu,
  Monitores: Monitor,
  'Periféricos': Keyboard,
  Almacenamiento: HardDrive,
  Redes: Router,
  Impresoras: Printer,
  'Audio y Video': Headphones,
  Gaming: Gamepad2,
  Accesorios: Cable,
  'Telefonía': Smartphone,
  Software: AppWindow,
  'Cables y Energía': BatteryCharging,
  'Hogar inteligente': House,
}

const allowedBadges = new Set(['Nuevo', 'Destacado', 'Oferta', 'Más vendido'])

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const [liked, setLiked] = useState(false)
  const [added, setAdded] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const CategoryIcon = categoryIcons[product.category] ?? Package
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0
  const badge =
    discount > 0
      ? `Oferta -${discount}%`
      : product.badge && allowedBadges.has(product.badge)
        ? product.badge
        : null

  const handleAdd = () => {
    onAdd(product.id)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1600)
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_6px_18px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#2563EB]/30 hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)]">
      <div className="relative m-4 mb-0 aspect-[4/3] overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F1F5F9]">
        {imageFailed ? (
          <div
            role="img"
            aria-label={product.name}
            className="flex size-full flex-col items-center justify-center gap-3 px-5 text-center"
          >
            <span className="grid size-14 place-items-center rounded-xl border border-[#E2E8F0] bg-white text-[#0E7490]">
              <CategoryIcon className="size-6" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-[#64748B]">
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
            className="size-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}

        {badge && (
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-md border border-[#E2E8F0] bg-white/90 px-2 py-1 font-mono text-[9px] font-medium uppercase tracking-[0.12em] text-[#0F172A] backdrop-blur">
            <span className="size-1 rounded-full bg-[#2563EB]" />
            {badge}
          </span>
        )}

        <button
          type="button"
          onClick={() => setLiked((value) => !value)}
          aria-label={`${liked ? 'Quitar de' : 'Agregar a'} favoritos: ${product.name}`}
          aria-pressed={liked}
          className={`absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-lg border border-[#E2E8F0] bg-white/90 backdrop-blur transition hover:border-[#2563EB]/40 ${
            liked ? 'text-[#0E7490]' : 'text-[#475569] hover:text-[#0F172A]'
          }`}
        >
          <Heart className={`size-3.5 ${liked ? 'fill-current' : ''}`} aria-hidden="true" />
        </button>

        {product.stock === 'low' && (
          <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-md border border-[#E2E8F0] bg-white/90 px-2 py-1 text-[9px] font-medium text-[#475569] backdrop-blur">
            <span className="size-1 rounded-full bg-[#0E7490]" />
            ÃÅ¡ltimas unidades
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-[#2563EB]">
          {product.brand}
          <span className="mx-1.5 text-[#94A3B8]">/</span>
          <span className="text-[#475569]">{product.category}</span>
        </p>

        <h3 className="mt-2 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-[#0F172A]">
          {product.name}
        </h3>

        <ul className="mt-2.5 min-h-[38px] space-y-1 text-[11px] leading-[15px] text-[#475569]">
          {product.specs.slice(0, 2).map((spec) => (
            <li key={spec} className="flex items-start gap-1.5">
              <span className="mt-[6px] size-1 shrink-0 rounded-full bg-[#0E7490]/60" />
              {spec}
            </li>
          ))}
        </ul>

        <div className="mt-2.5 flex items-center gap-2 border-t border-[#E2E8F0] pt-2.5">
          <span
            className="flex items-center gap-0.5 text-[#0E7490]"
            aria-label={`${product.rating} de 5 estrellas`}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`size-3 ${
                  index < Math.round(product.rating) ? 'fill-current' : 'text-[#CBD5E1]'
                }`}
                aria-hidden="true"
              />
            ))}
          </span>
          <span className="font-mono text-[10px] font-medium text-[#475569]">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-[10px] text-[#64748B]">({product.reviews})</span>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between gap-2">
            <div>
              {discount > 0 && product.oldPrice && (
                <p className="text-[10px] leading-4 text-[#64748B] line-through">
                  {formatPrice(product.oldPrice)}
                </p>
              )}
              <p className="text-lg font-bold leading-6 tracking-tight text-[#0F172A]">
                {formatPrice(product.price)}
              </p>
            </div>
            <span className="pb-1 font-mono text-[9px] uppercase tracking-wide text-[#64748B]">
              IGV incluido
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={`mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
              added
                ? 'bg-[#22D3EE] text-[#0B1120]'
                : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
            }`}
          >
            {added ? (
              <Check className="size-3.5" aria-hidden="true" />
            ) : (
              <ShoppingCart className="size-3.5" aria-hidden="true" />
            )}
            {added ? 'Agregado al carrito' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </article>
  )
}

