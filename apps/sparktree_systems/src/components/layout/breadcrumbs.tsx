import { Fragment } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export type BreadcrumbItem = {
  label: string
  href?: string
  onClick?: () => void
  active?: boolean
  current?: boolean
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Migas de pan" className="border-b border-border bg-muted">
      <div className="mx-auto flex h-[calc(2.75rem-1px)] max-w-[1280px] items-center gap-1 overflow-hidden px-4 text-[13px] sm:gap-1.5 sm:px-6 sm:text-xs lg:px-8">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isMiddle = index > 0 && !isLast

          const className = [
            'flex h-full items-center',
            index === 0 ? 'shrink-0' : 'min-w-0',
            isMiddle ? 'hidden sm:flex' : '',
            item.current
              ? 'font-bold text-foreground'
              : item.active
                ? 'font-semibold text-blue-ink'
                : 'font-semibold text-muted-foreground transition hover:text-blue-ink',
          ]
            .filter(Boolean)
            .join(' ')

          const label = (
            <span className="min-w-0 truncate">{item.label}</span>
          )

          return (
            <Fragment key={`${index}-${item.label}`}>
              {index > 0 && (
                <ChevronRight
                  className={`size-3.5 shrink-0 text-muted-foreground/60 ${isMiddle ? 'hidden sm:block' : ''}`}
                  aria-hidden="true"
                />
              )}
              {item.href ? (
                <Link href={item.href} className={className} title={index > 0 ? item.label : undefined}>
                  {label}
                </Link>
              ) : item.onClick ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  className={className}
                  title={index > 0 ? item.label : undefined}
                >
                  {label}
                </button>
              ) : (
                <span
                  aria-current={item.current ? 'page' : undefined}
                  className={className}
                  title={index > 0 ? item.label : undefined}
                >
                  {label}
                </span>
              )}
            </Fragment>
          )
        })}
      </div>
    </nav>
  )
}
