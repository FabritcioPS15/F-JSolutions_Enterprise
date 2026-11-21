'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, ClipboardList, X } from 'lucide-react'
import { ServiceCategoryIcon } from '@/components/quote/service-category-icon'
import {
  QUOTE_CART_EVENT,
  readQuoteCart,
  writeQuoteCart,
} from '@/lib/quote-cart'

export type QuoteCartService = {
  slug: string
  title: string
  category: string
}

export function QuoteCartWidget({ services }: { services: QuoteCartService[] }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [slugs, setSlugs] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const servicesBySlug = useMemo(
    () => new Map(services.map((service) => [service.slug, service])),
    [services],
  )

  useEffect(() => {
    const sync = () => setSlugs(readQuoteCart())
    sync()
    setMounted(true)
    window.addEventListener(QUOTE_CART_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(QUOTE_CART_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (slugs.length === 0) setOpen(false)
  }, [slugs.length])

  if (!mounted || slugs.length === 0 || pathname.startsWith('/cotizador-servicios')) {
    return null
  }

  const items = slugs.map((slug) => {
    const service = servicesBySlug.get(slug)
    return {
      slug,
      title: service?.title ?? slug,
      category: service?.category ?? 'Servicio',
    }
  })

  const remove = (slug: string) => {
    writeQuoteCart(slugs.filter((item) => item !== slug))
  }

  return (
    <div ref={rootRef} className="fixed bottom-5 right-4 z-40 sm:bottom-6 sm:right-6">
      {open && (
        <div
          id="quote-cart-panel"
          role="dialog"
          aria-label="Servicios agregados a la cotización"
          className="absolute bottom-[calc(100%+0.75rem)] right-0 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Tu cotización
              </p>
              <p className="mt-0.5 text-sm font-bold text-foreground">
                {items.length} {items.length === 1 ? 'servicio agregado' : 'servicios agregados'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>

          <ul className="max-h-[52vh] overflow-y-auto p-2">
            {items.map((item) => (
              <li
                key={item.slug}
                className="flex items-start gap-2 rounded-xl px-2 py-2 transition hover:bg-muted/70"
              >
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-tint-blue text-blue-ink">
                  <ServiceCategoryIcon category={item.category} className="size-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11.5px] font-bold leading-4 text-foreground">{item.title}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{item.category}</p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(item.slug)}
                  aria-label={`Quitar ${item.title}`}
                  className="grid size-6 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-card hover:text-foreground"
                >
                  <X aria-hidden="true" className="size-3" />
                </button>
              </li>
            ))}
          </ul>

          <div className="border-t border-border p-3">
            <Link
              href="/cotizador-servicios"
              onClick={() => setOpen(false)}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1769AA] px-4 text-sm font-bold text-white transition hover:bg-[#12568C]"
            >
              Definir alcance y cotizar
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <p className="mt-2 text-center text-[10px] leading-4 text-muted-foreground">
              Se envían todos los servicios juntos en una sola solicitud.
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="quote-cart-panel"
        aria-label={`Ver cotización: ${items.length} ${
          items.length === 1 ? 'servicio agregado' : 'servicios agregados'
        }`}
        className="relative grid size-14 place-items-center rounded-full bg-[#1769AA] text-white shadow-[0_16px_36px_-12px_rgba(23,105,170,0.75)] transition hover:bg-[#12568C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B8D9] focus-visible:ring-offset-2"
      >
        <ClipboardList aria-hidden="true" className="size-6" />
        <span className="absolute -right-1 -top-1 grid min-w-6 place-items-center rounded-full bg-[#00B8D9] px-1.5 py-0.5 text-[11px] font-bold leading-5 text-[#062030] ring-2 ring-card">
          {items.length}
        </span>
      </button>
    </div>
  )
}
