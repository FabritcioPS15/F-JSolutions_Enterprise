'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

type ProcessSequenceProps = {
  children: ReactNode
  className?: string
  layout?: 'grid' | 'stack'
}

export function ProcessSequence({ children, className, layout = 'grid' }: ProcessSequenceProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setRevealed(true)
        observer.disconnect()
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-process-sequence=""
      data-layout={layout}
      data-revealed={revealed ? 'true' : undefined}
      className={className ? `process-sequence ${className}` : 'process-sequence'}
    >
      {children}
    </div>
  )
}
