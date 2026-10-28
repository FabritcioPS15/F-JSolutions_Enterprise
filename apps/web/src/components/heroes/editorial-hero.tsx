import type { ReactNode } from 'react'
import {
  HERO_CONTAINER,
  HeroActions,
  HeroEyebrow,
  HeroLead,
  HeroSection,
  HeroTitle,
} from '@/components/heroes/hero-primitives'
import { cn } from '@/lib/utils'

type EditorialHeroProps = {
  id?: string
  eyebrow?: string
  title: ReactNode
  description: string
  meta?: string[]
  actions?: ReactNode
  aside?: ReactNode
  children?: ReactNode
  size?: 'lg' | 'md'
}

/**
 * Variante G · Hero editorial o informativo.
 * Una sola columna de lectura; la composición no fuerza dos columnas
 * salvo que exista un aside con información complementaria.
 */
export function EditorialHero({
  id,
  eyebrow,
  title,
  description,
  meta,
  actions,
  aside,
  children,
  size = 'lg',
}: EditorialHeroProps) {
  return (
    <HeroSection id={id}>
      <div className={`${HERO_CONTAINER} pb-10 pt-10 sm:pb-12 sm:pt-12 lg:pb-14 lg:pt-14`}>
        <div
          className={cn(
            'grid gap-8',
            aside && 'lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end lg:gap-12',
          )}
        >
          <div className="max-w-[780px]">
            {eyebrow ? <HeroEyebrow>{eyebrow}</HeroEyebrow> : null}

            <HeroTitle size={size}>{title}</HeroTitle>

            <HeroLead className="max-w-[62ch]">{description}</HeroLead>

            {meta && meta.length > 0 && (
              <ul className="hero-reveal hero-delay-3 mt-5 flex flex-wrap items-center gap-1.5">
                {meta.map((item) => (
                  <li
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white/80 px-2.5 py-1 text-[10.5px] font-semibold text-[#475569] backdrop-blur"
                  >
                    <span aria-hidden="true" className="size-1 rounded-full bg-[#22D3EE]" />
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {actions && <HeroActions>{actions}</HeroActions>}
          </div>

          {aside && <div className="hero-reveal hero-delay-2 w-full max-w-[420px] lg:max-w-none">{aside}</div>}
        </div>

        {children}
      </div>
    </HeroSection>
  )
}
