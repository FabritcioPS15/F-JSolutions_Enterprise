'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { PageLoadingSkeleton } from '@/components/admin/page-loading-skeleton'

export const ADMIN_NAVIGATION_START_EVENT = 'fj:admin:navigation-start'

export function startAdminNavigation() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(ADMIN_NAVIGATION_START_EVENT))
  }
}

export function NavigationProgress({ collapsed }: { collapsed: boolean }) {
  const [pending, setPending] = useState(false)
  const timeoutRef = useRef<number | null>(null)
  const observerRef = useRef<MutationObserver | null>(null)
  const initialMainTextRef = useRef('')

  useEffect(() => {
    function clearPending() {
      setPending(false)
      observerRef.current?.disconnect()
      observerRef.current = null
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    function startPending() {
      setPending(true)
      observerRef.current?.disconnect()
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
      timeoutRef.current = window.setTimeout(clearPending, 30000)

      const main = document.querySelector('main')
      if (!main) return
      initialMainTextRef.current = main.innerText
      const observer = new MutationObserver(() => {
        if (main.querySelector('[role="status"][aria-busy="true"]')) return
        if (main.innerText !== initialMainTextRef.current) clearPending()
      })
      observer.observe(main, { childList: true, subtree: true, characterData: true })
      observerRef.current = observer
    }

    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
      }
      const target = event.target instanceof Element ? event.target : null
      const anchor = target?.closest('a')
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return
      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#')) return
      const destination = new URL(href, window.location.href)
      if (destination.origin !== window.location.origin) return
      if (destination.pathname === window.location.pathname && destination.search === window.location.search) {
        return
      }
      startPending()
    }

    window.addEventListener(ADMIN_NAVIGATION_START_EVENT, startPending)
    window.addEventListener('popstate', startPending)
    document.addEventListener('click', handleClick, true)

    return () => {
      window.removeEventListener(ADMIN_NAVIGATION_START_EVENT, startPending)
      window.removeEventListener('popstate', startPending)
      document.removeEventListener('click', handleClick, true)
      observerRef.current?.disconnect()
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  if (!pending) return null

  return (
    <>
      <div
        data-admin-navigation-progress
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="fixed inset-x-0 top-0 z-[120] h-0.5 overflow-hidden bg-[#5946A6]/15 animate-in fade-in-0 duration-150 delay-100 fill-mode-both motion-reduce:duration-0"
      >
        <span className="sr-only">Cargando página…</span>
        <span className="block h-full w-1/3 bg-[#5946A6] animate-[admin-navigation-progress_1.15s_ease-in-out_infinite] motion-reduce:animate-none" />
      </div>

      <div
        data-admin-page-skeleton
        aria-hidden="true"
        className={cn(
          'pointer-events-none fixed inset-x-0 bottom-0 top-16 z-20 overflow-hidden bg-background px-4 py-6 sm:px-6 lg:px-8 lg:py-8',
          collapsed ? 'lg:left-[76px]' : 'lg:left-[292px]',
          'animate-in fade-in-0 duration-200 delay-200 fill-mode-both motion-reduce:duration-0'
        )}
      >
        <PageLoadingSkeleton />
      </div>
    </>
  )
}
