'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Plus } from 'lucide-react'
import {
  MAX_QUOTE_SERVICES,
  QUOTE_CART_EVENT,
  addToQuoteCart,
  readQuoteCart,
} from '@/lib/quote-cart'

export function AddToQuoteButton({
  slug,
  className,
}: {
  slug: string
  className: string
}) {
  const [mounted, setMounted] = useState(false)
  const [count, setCount] = useState(0)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const sync = () => {
      const cart = readQuoteCart()
      setCount(cart.length)
      setAdded(cart.includes(slug))
    }
    sync()
    setMounted(true)
    window.addEventListener(QUOTE_CART_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(QUOTE_CART_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [slug])

  if (!mounted) {
    return (
      <button type="button" disabled className={className}>
        <Plus aria-hidden="true" className="size-4" />
        Agregar a cotización
      </button>
    )
  }

  if (added) {
    return (
      <Link href="/cotizador-servicios" className={className}>
        <Check aria-hidden="true" className="size-4" />
        Ver cotización ({count})
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    )
  }

  if (count >= MAX_QUOTE_SERVICES) {
    return (
      <Link
        href="/cotizador-servicios"
        className={className}
        title="Tu cotización ya tiene el máximo de 8 servicios."
      >
        Cotización completa (8/8)
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={() => {
        const next = addToQuoteCart(slug)
        setCount(next.length)
        setAdded(next.includes(slug))
      }}
      className={className}
    >
      <Plus aria-hidden="true" className="size-4" />
      Agregar a cotización
    </button>
  )
}
