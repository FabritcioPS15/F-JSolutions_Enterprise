'use client'

import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export type FaqAccordionItem = {
  question: string
  answer: string
  badge?: string
}

type FaqAccordionVariant = 'default' | 'numbered' | 'search'

type FaqAccordionProps = {
  items: FaqAccordionItem[]
  variant?: FaqAccordionVariant
  className?: string
}

const variantStyles: Record<
  FaqAccordionVariant,
  {
    list: string
    card: string
    trigger: string
    question: string
    panel: string
    answer: string
    openCard: string
    openQuestion?: string
  }
> = {
  default: {
    list: 'space-y-2',
    card: 'rounded-xl',
    trigger: 'px-5 py-4',
    question: 'text-sm leading-6',
    panel: 'px-5 pb-4',
    answer: 'mt-3 text-sm leading-6 text-muted-foreground',
    openCard: 'border-[#1769AA]/35 shadow-sm',
  },
  numbered: {
    list: 'space-y-2',
    card: 'rounded-2xl',
    trigger: 'px-5 py-4',
    question: 'text-sm leading-6',
    panel: 'px-5 pb-4',
    answer: 'mt-3 pl-8 text-sm leading-6 text-muted-foreground',
    openCard: 'border-[#1769AA]/35 shadow-sm',
  },
  search: {
    list: 'space-y-3',
    card: 'rounded-2xl',
    trigger: 'p-5',
    question: 'mt-2 font-heading text-sm font-bold sm:text-base',
    panel: 'border-t border-border bg-muted/50 px-5 pb-5 pt-3',
    answer: 'text-xs leading-relaxed text-muted-foreground sm:text-sm',
    openCard: 'border-[#1769AA]/45 shadow-sm',
    openQuestion: 'text-brand-ink',
  },
}

export function FaqAccordion({ items, variant = 'default', className }: FaqAccordionProps) {
  const baseId = useId()
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)
  const styles = variantStyles[variant]
  const isSearch = variant === 'search'
  const isNumbered = variant === 'numbered'

  return (
    <div className={cn(styles.list, className)}>
      {items.map((item, index) => {
        const isOpen = openQuestion === item.question
        const triggerId = `${baseId}-trigger-${index}`
        const panelId = `${baseId}-panel-${index}`

        return (
          <div
            key={item.question}
            className={cn(
              'overflow-hidden border bg-card transition-[border-color,box-shadow] duration-200',
              styles.card,
              isOpen ? styles.openCard : 'border-border hover:border-input',
            )}
          >
            <button
              type="button"
              id={triggerId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() =>
                setOpenQuestion((current) => (current === item.question ? null : item.question))
              }
              className={cn(
                'flex w-full items-start justify-between gap-4 text-left transition-colors focus-visible:ring-2 focus-visible:ring-[#1769AA]/40 focus-visible:ring-inset focus-visible:outline-none',
                styles.trigger,
              )}
            >
              <div className={cn('flex flex-1 items-start', isNumbered && 'gap-3')}>
                {isNumbered && (
                  <span className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                )}
                <div className="flex-1">
                  {isSearch && item.badge && (
                    <span className="inline-block rounded-md bg-brand-soft px-2 py-0.5 text-[10px] font-bold tracking-wide text-brand-ink uppercase">
                      {item.badge}
                    </span>
                  )}
                  <h3
                    className={cn(
                      'font-bold transition-colors duration-200',
                      styles.question,
                      isOpen ? (styles.openQuestion ?? 'text-foreground') : 'text-foreground',
                    )}
                  >
                    {item.question}
                  </h3>
                </div>
              </div>

              {isSearch ? (
                <span
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-lg border transition-[rotate,background-color,border-color,color] duration-300 motion-reduce:transition-none',
                    isOpen
                      ? 'rotate-180 border-[#1769AA]/25 bg-brand-soft text-brand-ink'
                      : 'border-border bg-muted text-muted-foreground',
                  )}
                >
                  <ChevronDown className="size-4" aria-hidden="true" />
                </span>
              ) : (
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    'size-4 shrink-0 text-muted-foreground transition-transform duration-300 motion-reduce:transition-none',
                    isNumbered && 'mt-0.5',
                    isOpen && 'rotate-180 text-brand-ink',
                  )}
                />
              )}
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={cn(
                'grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <div className={styles.panel}>
                  <p className={styles.answer}>{item.answer}</p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
