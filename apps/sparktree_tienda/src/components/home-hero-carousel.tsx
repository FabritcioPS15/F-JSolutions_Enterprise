'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

export type HeroSlide = {
  eyebrow: string
  title: string
  description: string
  image: string
  imageAlt: string
  categoryHref: string
  categoryLabel: string
  productHref: string
  productLabel: string
  note: string
}

const AUTOPLAY_MS = 6500

export function HomeHeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const count = slides.length
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [manual, setManual] = useState(false)

  useEffect(() => {
    if (paused || manual || count < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % count)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [paused, manual, count])

  const goTo = useCallback(
    (next: number) => {
      setActive(((next % count) + count) % count)
      setManual(true)
    },
    [count]
  )

  if (count === 0) return null

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Productos y categorías destacadas"
      className="relative overflow-hidden rounded-3xl border border-border bg-[#172554] shadow-[0_28px_60px_-42px_rgba(23,37,84,0.85)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false)
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          goTo(active - 1)
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          goTo(active + 1)
        }
      }}
    >
      <div className="grid">
        {slides.map((slide, index) => {
          const isActive = index === active
          return (
            <article
              key={slide.title}
              aria-roledescription="diapositiva"
              aria-label={`${index + 1} de ${count}`}
              aria-hidden={!isActive}
              inert={!isActive}
              className={`col-start-1 row-start-1 grid transition-opacity duration-500 motion-reduce:transition-none lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] ${
                isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <div className="relative z-10 flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:py-14">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-blue-50 backdrop-blur">
                  <Sparkles className="size-3.5 text-[#F59E0B]" aria-hidden="true" />
                  {slide.eyebrow}
                </span>
                <h2 className="mt-4 max-w-xl font-heading text-3xl font-black leading-tight text-white sm:text-4xl">
                  {slide.title}
                </h2>
                <p className="mt-3 max-w-lg text-sm text-blue-100/90">{slide.description}</p>
                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Link
                    href={slide.categoryHref}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
                  >
                    {slide.categoryLabel}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href={slide.productHref}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/10"
                  >
                    {slide.productLabel}
                  </Link>
                </div>
                <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.14em] text-blue-200/70">
                  {slide.note}
                </p>
              </div>

              <div className="relative hidden min-h-[300px] lg:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image}
                  alt={slide.imageAlt}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  className="absolute inset-0 size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#172554] via-[#172554]/35 to-[#172554]/5" />
              </div>
            </article>
          )
        })}
      </div>

      <div className="relative z-10 flex items-center justify-between gap-4 border-t border-white/10 px-6 py-3 sm:px-10">
        <div className="flex items-center gap-1.5" role="group" aria-label="Seleccionar banner">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Ver banner ${index + 1}: ${slide.title}`}
              aria-current={index === active}
              className={`h-1.5 rounded-full transition-all ${
                index === active ? 'w-7 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            aria-label="Banner anterior"
            className="grid size-8 place-items-center rounded-lg border border-white/15 text-white/80 transition hover:border-white/40 hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            aria-label="Banner siguiente"
            className="grid size-8 place-items-center rounded-lg border border-white/15 text-white/80 transition hover:border-white/40 hover:bg-white/10 hover:text-white"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}
