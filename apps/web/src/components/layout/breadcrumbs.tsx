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
      <div className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-1.5 px-4 py-3 text-xs text-muted-foreground sm:px-6 lg:px-8">
        {items.map((item, index) => {
          const className = item.current
            ? 'font-bold text-foreground'
            : item.active
              ? 'font-semibold text-blue-ink'
              : 'font-semibold text-muted-foreground transition hover:text-blue-ink'

          return (
            <Fragment key={`${index}-${item.label}`}>
              {index > 0 && (
                <ChevronRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
              )}
              {item.href ? (
                <Link href={item.href} className={className}>
                  {item.label}
                </Link>
              ) : item.onClick ? (
                <button type="button" onClick={item.onClick} className={className}>
                  {item.label}
                </button>
              ) : (
                <span aria-current={item.current ? 'page' : undefined} className={className}>
                  {item.label}
                </span>
              )}
            </Fragment>
          )
        })}
      </div>
    </nav>
  )
}
