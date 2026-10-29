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
          'grid place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 ring-1 ring-inset ring-slate-200/80',
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
        'overflow-hidden rounded-xl bg-slate-50 object-contain ring-1 ring-inset ring-slate-200/70',
        className
      )}
    />
  )
}
