'use client'

import { useEffect, useState } from 'react'

const FAVORITES_STORAGE_KEY = 'fj_favorites'

function loadFavoritesFromStorage(): Set<string> {
  if (typeof window === 'undefined') return new Set()

  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return new Set(Array.isArray(parsed) ? parsed : [])
    }
  } catch (error) {
    console.error('Error loading favorites from storage:', error)
  }

  return new Set()
}

function saveFavoritesToStorage(favorites: Set<string>) {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favorites)))
  } catch (error) {
    console.error('Error saving favorites to storage:', error)
  }
}

export function useFavorites() {
  const [favorites, setFavoritesState] = useState<Set<string>>(new Set())
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setFavoritesState(loadFavoritesFromStorage())
    setIsLoaded(true)
  }, [])

  const toggleFavorite = (productId: string) => {
    setFavoritesState((prev) => {
      const next = new Set(prev)
      if (next.has(productId)) {
        next.delete(productId)
      } else {
        next.add(productId)
      }
      saveFavoritesToStorage(next)
      return next
    })
  }

  const isFavorite = (productId: string) => favorites.has(productId)

  const count = favorites.size

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    count,
    isLoaded,
  }
}
