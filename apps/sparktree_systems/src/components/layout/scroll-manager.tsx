'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const GAP = 12
const FALLBACK_OFFSET = 89

function headerOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--site-header-height')
  const height = Number.parseFloat(raw)
  return Number.isFinite(height) ? height + GAP : FALLBACK_OFFSET
}

function scrollToHash(hash: string) {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  if (!id) return
  const target = document.getElementById(id)
  if (!target) return
  const top = target.getBoundingClientRect().top + window.scrollY - headerOffset()
  window.scrollTo({ top: Math.max(top, 0), behavior: 'auto' })
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'auto' })
}

export function ScrollManager() {
  const pathname = usePathname()
  const skip = useRef(false)
  const initial = useRef(true)

  useEffect(() => {
    const onPopState = () => {
      skip.current = true
      window.setTimeout(() => {
        skip.current = false
      }, 250)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (initial.current) {
      initial.current = false
      if (!window.location.hash) return
    }
    if (skip.current) return

    const hash = window.location.hash
    if (!hash) {
      scrollToTop()
      const frame = requestAnimationFrame(scrollToTop)
      const timer = window.setTimeout(scrollToTop, 250)
      return () => {
        cancelAnimationFrame(frame)
        window.clearTimeout(timer)
      }
    }

    // El layout puede crecer (imágenes, fuentes) después del salto inicial:
    // se recalcula hasta que el destino quede estable, salvo que el usuario ya scrollee.
    let done = false
    let lastY = -1
    const cancel = () => {
      done = true
    }
    const settle = () => {
      if (done) return
      scrollToHash(hash)
      lastY = window.scrollY
    }
    const onScroll = () => {
      if (lastY >= 0 && Math.abs(window.scrollY - lastY) > 4) cancel()
    }
    window.addEventListener('wheel', cancel, { passive: true })
    window.addEventListener('touchmove', cancel, { passive: true })
    window.addEventListener('keydown', cancel)
    window.addEventListener('scroll', onScroll, { passive: true })
    const frame = requestAnimationFrame(settle)
    const first = window.setTimeout(settle, 350)
    const late = window.setTimeout(settle, 1200)
    const onLoad = () => settle()
    if (document.readyState !== 'complete') window.addEventListener('load', onLoad)

    return () => {
      done = true
      cancelAnimationFrame(frame)
      window.clearTimeout(first)
      window.clearTimeout(late)
      window.removeEventListener('load', onLoad)
      window.removeEventListener('wheel', cancel)
      window.removeEventListener('touchmove', cancel)
      window.removeEventListener('keydown', cancel)
      window.removeEventListener('scroll', onScroll)
    }
  }, [pathname])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (skip.current || event.defaultPrevented) return
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!anchor || anchor.getAttribute('target') === '_blank') return
      const href = anchor.getAttribute('href') ?? ''
      if (!href || /^(https?:|mailto:|tel:)/.test(href)) return

      const [path, hash] = href.split('#')
      const here = `${window.location.pathname}${window.location.search}`
      if (path !== '' && path !== window.location.pathname && path !== here) return

      if (!hash) {
        window.setTimeout(scrollToTop, 60)
        return
      }
      window.setTimeout(() => scrollToHash(`#${hash}`), 60)
      window.setTimeout(() => scrollToHash(`#${hash}`), 400)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}
