'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { PageSkeleton } from '@/components/layout/page-skeleton'

const SHOW_DELAY = 200
const SAFETY_TIMEOUT = 12000

export function NavigationSkeleton() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)
  const showTimer = useRef<number | null>(null)
  const safetyTimer = useRef<number | null>(null)

  const clearTimers = () => {
    if (showTimer.current) window.clearTimeout(showTimer.current)
    if (safetyTimer.current) window.clearTimeout(safetyTimer.current)
    showTimer.current = null
    safetyTimer.current = null
  }

  useEffect(() => {
    clearTimers()
    setLoading(false)
  }, [pathname])

  useEffect(() => {
    if (!loading) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [loading])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!anchor || anchor.getAttribute('target') === '_blank' || anchor.hasAttribute('download')) return
      const href = anchor.getAttribute('href') ?? ''
      if (!href || href.startsWith('//') || /^(https?:|mailto:|tel:|javascript:)/.test(href)) return

      const [path] = href.split('#')
      const here = `${window.location.pathname}${window.location.search}`
      if (!path || path === window.location.pathname || path === here) return

      clearTimers()
      showTimer.current = window.setTimeout(() => setLoading(true), SHOW_DELAY)
      safetyTimer.current = window.setTimeout(() => setLoading(false), SAFETY_TIMEOUT)
    }

    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      clearTimers()
    }
  }, [])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-card">
      <PageSkeleton />
    </div>
  )
}
