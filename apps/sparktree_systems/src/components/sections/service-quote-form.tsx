'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Check,
  ClipboardList,
  Headset,
  Mail,
  Phone,
  SlidersHorizontal,
} from 'lucide-react'
import {
  MAX_QUOTE_SERVICES,
  readQuoteCart,
  writeQuoteCart,
} from '@/lib/quote-cart'
import { cn } from '@/lib/utils'

type QuoteServiceOption = {
  slug: string
  title: string
}

const steps = [
  {
    icon: ClipboardList,
    title: 'Selecciona los servicios',
    copy: 'Marca uno o varios de los servicios disponibles.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Define el alcance',
    copy: 'Equipos, sedes y prioridad en el cotizador.',
  },
  {
    icon: Check,
    title: 'Recibe la propuesta',
    copy: 'Revisamos tu caso y te damos un siguiente paso concreto.',
  },
]

export function ServiceQuoteForm({ services }: { services: QuoteServiceOption[] }) {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])
  const [existingCount, setExistingCount] = useState(0)
  const serviceKey = services.map((service) => service.slug).join('|')

  useEffect(() => {
    const cart = readQuoteCart()
    const available = serviceKey.split('|')
    setExistingCount(cart.length)
    setSelected(cart.filter((slug) => available.includes(slug)))
  }, [serviceKey])

  const toggle = (slug: string) => {
    setSelected((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug],
    )
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (selected.length === 0) return

    const managed = new Set(services.map((service) => service.slug))
    const others = readQuoteCart().filter((slug) => !managed.has(slug))
    writeQuoteCart([...others, ...selected].slice(0, MAX_QUOTE_SERVICES))
    router.push('/cotizador-servicios')
  }

  return (
    <section
      id="cotizacion"
      className="scroll-mt-20 bg-card px-4 py-12 sm:scroll-mt-24 sm:px-6 lg:scroll-mt-28 lg:px-8 lg:py-16"
    >
      <div className="mx-auto grid max-w-[1280px] gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-12">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-ink">
            Arma tu cotización
          </p>
          <h2 className="mt-2 max-w-lg text-3xl font-bold leading-tight tracking-[-0.04em] sm:text-4xl">
            Selecciona servicios y recibe una propuesta.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Marca los servicios que necesitas. En el cotizador defines cantidades, sedes y
            prioridad; al final recibes un rango referencial y un siguiente paso.
          </p>

          <ol className="mt-7 space-y-4">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-tint-blue text-blue-ink">
                  <step.icon aria-hidden="true" className="size-4" />
                </span>
                <span>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    Paso {index + 1}
                  </span>
                  <span className="mt-0.5 block font-heading text-sm font-bold text-foreground">
                    {step.title}
                  </span>
                  <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                    {step.copy}
                  </span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-7 flex flex-wrap gap-2">
            <a
              href="tel:+51999888777"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-xs font-bold text-muted-foreground transition hover:border-[#1769AA]/40 hover:text-blue-ink"
            >
              <Phone aria-hidden="true" className="size-3.5" /> +51 999 888 777
            </a>
            <a
              href="mailto:ventas@fjsolutions.pe"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-xs font-bold text-muted-foreground transition hover:border-[#1769AA]/40 hover:text-blue-ink"
            >
              <Mail aria-hidden="true" className="size-3.5" /> ventas@fjsolutions.pe
            </a>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="rounded-3xl border border-border bg-card p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.35)] sm:p-7"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-tint-blue text-blue-ink">
              <Headset aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="font-heading text-sm font-bold text-foreground">
                Servicios para cotizar
              </p>
              <p className="text-[11px] text-muted-foreground">
                Respuesta en menos de 24 horas hábiles.
              </p>
            </div>
            {existingCount > 0 && (
              <span className="ml-auto shrink-0 rounded-full border border-blue-ink/25 bg-tint-blue px-2.5 py-1 text-[10px] font-bold text-blue-ink">
                {Math.min(existingCount, MAX_QUOTE_SERVICES)}/{MAX_QUOTE_SERVICES} en curso
              </span>
            )}
          </div>

          <fieldset className="mt-5">
            <legend className="sr-only">Servicios disponibles para cotizar</legend>
            <div className="flex flex-col gap-2.5">
              {services.map((service) => {
                const checked = selected.includes(service.slug)
                return (
                  <label
                    key={service.slug}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-xs font-semibold transition',
                      checked
                        ? 'border-[#1769AA] bg-[#1769AA]/5 text-foreground'
                        : 'border-border bg-card text-foreground/85 hover:border-blue-ink/30 hover:bg-muted',
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(service.slug)}
                      className="size-4 accent-[#1769AA]"
                    />
                    <span className="flex-1">{service.title}</span>
                    {checked && <Check aria-hidden="true" className="size-4 text-blue-ink" />}
                  </label>
                )
              })}
            </div>
          </fieldset>

          <p className="mt-3 text-[11px] leading-4 text-muted-foreground">
            ¿Buscas alquiler de equipos? Sigue en evaluación:{' '}
            <Link href="/servicios#alquiler" className="font-bold text-blue-ink hover:text-[#0F86B8]">
              cuéntanos tu caso
            </Link>
            .
          </p>

          <button
            type="submit"
            disabled={selected.length === 0}
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1769AA] px-4 text-sm font-bold text-white transition hover:bg-[#12568C] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {selected.length > 0
              ? `Agregar ${selected.length} ${selected.length === 1 ? 'servicio' : 'servicios'} a la cotización`
              : 'Selecciona al menos un servicio'}
            <ArrowRight aria-hidden="true" className="size-4" />
          </button>

          <div className="mt-3 flex flex-col gap-1 text-center text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>Hasta 8 servicios por cotización.</span>
            <Link href="/contacto" className="font-semibold hover:text-blue-ink">
              Prefiero asesoría directa
            </Link>
          </div>
        </form>
      </div>
    </section>
  )
}
