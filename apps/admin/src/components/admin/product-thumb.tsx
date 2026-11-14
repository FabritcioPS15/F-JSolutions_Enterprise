'use client'

import { useEffect, useState } from 'react'
import { Package } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ProductThumb({
  src,
  alt,
  className,
}: {
  src?: string
  alt: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (!src || failed) {
    return (
      <div
        className={cn(
          'grid place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-muted to-border text-muted-foreground ring-1 ring-inset ring-border/80',
          className
        )}
        aria-label={alt}
      >
        <Package className="size-5" aria-hidden="true" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn(
        'overflow-hidden rounded-xl bg-muted object-contain ring-1 ring-inset ring-border/70',
        className
      )}
    />
  )
}
