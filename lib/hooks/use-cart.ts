'use client'

import { useMemo, useState } from 'react'
import { findProduct, type Product } from '@/lib/catalog'

export type CartLine = { product: Product; qty: number }

export function useCart() {
  const [items, setItems] = useState<Record<string, number>>({})

  const add = (id: string) => {
    if (!findProduct(id)) return
    setItems((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
  }

  const remove = (id: string) => {
    setItems((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const setQty = (id: string, qty: number) => {
    if (qty <= 0) {
      remove(id)
      return
    }
    setItems((prev) => ({ ...prev, [id]: qty }))
  }

  const lines = useMemo<CartLine[]>(
    () =>
      Object.entries(items).flatMap(([id, qty]) => {
        const product = findProduct(id)
        return product ? [{ product, qty }] : []
      }),
    [items],
  )

  const count = lines.reduce((sum, line) => sum + line.qty, 0)
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0)

  return { items, add, remove, setQty, lines, count, subtotal }
}
