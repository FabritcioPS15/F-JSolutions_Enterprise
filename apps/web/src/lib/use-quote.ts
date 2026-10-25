'use client'

import { useEffect, useState } from 'react'
import { findProduct, type Product } from '@/lib/catalog'
import type { Quote, QuoteItem } from '@/lib/quote'

const QUOTE_STORAGE_KEY = 'fj_quote'

const defaultQuote: Quote = {
  items: [],
  generalNotes: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

function loadQuoteFromStorage(): Quote {
  if (typeof window === 'undefined') return defaultQuote

  try {
    const stored = localStorage.getItem(QUOTE_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        ...defaultQuote,
        ...parsed,
      }
    }
  } catch (error) {
    console.error('Error loading quote from storage:', error)
  }

  return defaultQuote
}

function saveQuoteToStorage(quote: Quote) {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(quote))
  } catch (error) {
    console.error('Error saving quote to storage:', error)
  }
}

export function useQuote() {
  const [quote, setQuoteState] = useState<Quote>(defaultQuote)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setQuoteState(loadQuoteFromStorage())
    setIsLoaded(true)
  }, [])

  const setQuote = (update: Quote | ((prev: Quote) => Quote)) => {
    setQuoteState((prev) => {
      const next = typeof update === 'function' ? update(prev) : update
      const updated = {
        ...next,
        updatedAt: new Date().toISOString(),
      }
      saveQuoteToStorage(updated)
      return updated
    })
  }

  const addItem = (productId: string, quantity = 1, notes?: string) => {
    const product = findProduct(productId)
    if (!product) return

    setQuote((prev) => {
      const existingIndex = prev.items.findIndex((item) => item.productId === productId)

      if (existingIndex >= 0) {
        const updated = [...prev.items]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          notes: notes || updated[existingIndex].notes,
        }
        return { ...prev, items: updated }
      }

      const newItem: QuoteItem = {
        productId: product.id,
        productName: product.name,
        productModel: product.model,
        productSku: product.sku,
        productImage: product.image,
        quantity,
        notes,
      }

      return { ...prev, items: [...prev.items, newItem] }
    })
  }

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    setQuote((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    }))
  }

  const updateItemNotes = (productId: string, notes: string) => {
    setQuote((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.productId === productId ? { ...item, notes } : item
      ),
    }))
  }

  const removeItem = (productId: string) => {
    setQuote((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.productId !== productId),
    }))
  }

  const clearQuote = () => {
    setQuote(defaultQuote)
  }

  const replaceQuote = (items: QuoteItem[], generalNotes = '') => {
    const now = new Date().toISOString()
    const next: Quote = {
      items,
      generalNotes,
      createdAt: now,
      updatedAt: now,
    }
    saveQuoteToStorage(next)
    setQuoteState(next)
  }

  const setGeneralNotes = (notes: string) => {
    setQuote((prev) => ({ ...prev, generalNotes: notes }))
  }

  const count = quote.items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    quote,
    setQuote,
    addItem,
    updateItemQuantity,
    updateItemNotes,
    removeItem,
    clearQuote,
    replaceQuote,
    setGeneralNotes,
    count,
    isLoaded,
  }
}
