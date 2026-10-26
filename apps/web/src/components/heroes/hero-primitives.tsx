import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Sistema de hero de F&J Solutions.
 *
 * Reglas compartidas:
 * - Fondo claro, superficies blancas y bordes sutiles.
 * - Espaciado vertical automático: nunca alturas fijas ni 100vh.
 * - Contenedor central de 1280 px, igual que el resto del sitio.
 * - Microanimaciones CSS con soporte para prefers-reduced-motion.
 */

export const HERO_CONTAINER = 'mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8'

export const HERO_TITLE_SIZE = {
  xl: 'text-[clamp(2.25rem,1.15rem+3.4vw,4.1rem)]',
  lg: 'text-[clamp(2.1rem,1.1rem+2.9vw,3.55rem)]',
  md: 'text-[clamp(1.95rem,1.2rem+2.25vw,3rem)]',
} as const

type HeroSectionProps = {
  id?: string
  children: ReactNode
  className?: string
  overlay?: boolean
}

export function HeroSection({ id, children, className, overlay = true }: HeroSectionProps) {
  return (
    <section id={id} className={cn('relative isolate overflow-hidden bg-white', className)}>
      {overlay && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#FFFFFF_0%,#FCFDFE_52%,#F8FAFC_100%)]" />
          <div className="hero-grid absolute inset-x-0 top-0 h-[420px] opacity-60" />
          <div className="absolute -right-44 -top-52 size-[560px] rounded-full bg-[#2563EB]/[0.07] blur-[110px]" />
          <div className="absolute -left-36 top-24 size-[380px] rounded-full bg-[#22D3EE]/[0.10] blur-[100px]" />
        </div>
      )}
      {children}
    </section>
  )
}

type HeroEyebrowProps = {
  children: ReactNode
  icon?: ReactNode
  className?: string
}

export function HeroEyebrow({ children, icon, className }: HeroEyebrowProps) {
  return (
    <span
      className={cn(
        'hero-reveal inline-flex items-center gap-2 rounded-full border border-[#DBEAFE] bg-white/85 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#1D4ED8] shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur',
        className,
      )}
    >
      {icon ?? (
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-[#22D3EE] shadow-[0_0_0_3px_rgba(34,211,238,0.18)]"
        />
      )}
      {children}
    </span>
  )
}

type HeroTitleProps = {
  children: ReactNode
  className?: string
  size?: keyof typeof HERO_TITLE_SIZE
  as?: 'h1' | 'h2'
}

export function HeroTitle({ children, className, size = 'xl', as: Tag = 'h1' }: HeroTitleProps) {
  return (
    <Tag
      className={cn(
        'hero-reveal hero-delay-1 mt-5 max-w-[20ch] text-balance font-heading font-bold leading-[1.02] tracking-[-0.05em] text-[#0F172A]',
        HERO_TITLE_SIZE[size],
        className,
      )}
    >
      {children}
    </Tag>
  )
}

export function HeroAccent({ children }: { children: ReactNode }) {
  return <span className="text-[#2563EB]">{children}</span>
}

type HeroLeadProps = {
  children: ReactNode
  className?: string
}

export function HeroLead({ children, className }: HeroLeadProps) {
  return (
    <p
      className={cn(
        'hero-reveal hero-delay-2 mt-5 max-w-[54ch] text-[0.975rem] leading-7 text-[#475569] sm:text-base',
        className,
      )}
    >
      {children}
    </p>
  )
}

export function HeroActions({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'hero-reveal hero-delay-3 mt-7 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center',
        className,
      )}
    >
      {children}
    </div>
  )
}

type HeroActionProps = {
  href: string
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'quiet'
  arrow?: boolean
  className?: string
}

const actionVariants = {
  primary:
    'bg-[#2563EB] text-white shadow-[0_12px_28px_-14px_rgba(37,99,235,0.75)] hover:-translate-y-0.5 hover:bg-[#1D4ED8] hover:shadow-[0_18px_34px_-16px_rgba(37,99,235,0.65)]',
  secondary:
    'border border-[#DBE2EA] bg-white text-[#0F172A] shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 hover:border-[#2563EB]/45 hover:text-[#1D4ED8] hover:shadow-[0_10px_24px_-16px_rgba(15,23,42,0.35)]',
  quiet:
    'border border-transparent bg-transparent text-[#1D4ED8] hover:bg-[#EFF6FF] hover:text-[#1D4ED8]',
} as const

export function HeroAction({
  href,
  children,
  variant = 'primary',
  arrow = true,
  className,
}: HeroActionProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-2 sm:w-auto',
        actionVariants[variant],
        className,
      )}
    >
      {children}
      {arrow && (
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
        />
      )}
    </Link>
  )
}

export function HeroProof({
  items,
  className,
}: {
  items: string[]
  className?: string
}) {
  return (
    <ul
      className={cn(
        'hero-reveal hero-delay-4 mt-7 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[12px] font-semibold text-[#475569]',
        className,
      )}
    >
      {items.map((item) => (
        <li key={item} className="flex items-center gap-1.5">
          <span className="grid size-4 shrink-0 place-items-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
            <Check aria-hidden="true" className="size-2.5" strokeWidth={3} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}

export function HeroVisual({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'hero-reveal hero-delay-2 relative mx-auto w-full max-w-[560px] lg:max-w-none',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-8 inset-y-10 -z-10 rounded-[40px] bg-[#2563EB]/10 blur-3xl"
      />
      {children}
    </div>
  )
}

export function HeroPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-[0_42px_100px_-52px_rgba(15,23,42,0.5)]',
        className,
      )}
    >
      {children}
    </div>
  )
}

type RelatedLink = {
  label: string
  href: string
  icon?: ReactNode
  hint?: string
}

export function HeroRelatedLinks({
  items,
  title,
  className,
}: {
  items: RelatedLink[]
  title?: string
  className?: string
}) {
  return (
    <div className={cn('hero-reveal hero-delay-5 mt-9', className)}>
      {title && (
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">{title}</p>
      )}
      <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white/75 px-3 py-2.5 text-left transition hover:border-[#2563EB]/35 hover:bg-white hover:shadow-[0_10px_24px_-20px_rgba(15,23,42,0.4)]"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#EFF6FF] text-[#2563EB] transition group-hover:bg-[#2563EB] group-hover:text-white">
              {item.icon ?? <ArrowUpRight aria-hidden="true" className="size-3.5" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12px] font-bold text-[#0F172A]">{item.label}</span>
              {item.hint && (
                <span className="mt-0.5 block truncate text-[10px] text-[#64748B]">{item.hint}</span>
              )}
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-3.5 shrink-0 text-[#94A3B8] transition group-hover:translate-x-0.5 group-hover:text-[#2563EB]"
            />
          </Link>
        ))}
      </div>
    </div>
  )
}

export function HeroFloatingNote({
  icon,
  title,
  subtitle,
  className,
  delay = 0,
}: {
  icon: ReactNode
  title: string
  subtitle: string
  className?: string
  delay?: number
}) {
  return (
    <div
      className={cn(
        'hero-float absolute z-20 flex items-center gap-2.5 rounded-xl border border-[#E2E8F0] bg-white/95 px-3 py-2.5 shadow-[0_18px_40px_-22px_rgba(15,23,42,0.4)] backdrop-blur',
        className,
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
        {icon}
      </span>
      <span>
        <span className="block text-[11px] font-bold leading-4 text-[#0F172A]">{title}</span>
        <span className="block text-[9px] leading-4 text-[#64748B]">{subtitle}</span>
      </span>
    </div>
  )
}

export function HeroDivider({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('h-px w-full bg-[#EEF2F7]', className)} />
}
