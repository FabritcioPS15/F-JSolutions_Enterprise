'use client'

import { useCallback, useEffect, useState } from 'react'
import type { AccountProfile, SavedQuote } from '@/lib/account'

const PROFILE_STORAGE_KEY = 'fj_account_profile'
const QUOTES_STORAGE_KEY = 'fj_quote_history'
const MAX_SAVED_QUOTES = 50

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback

  try {
    const stored = localStorage.getItem(key)
    if (!stored) return fallback
    return JSON.parse(stored) as T
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error)
    return fallback
  }
}

function writeStored(key: string, value: unknown) {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error)
  }
}

type LegacyProfile = Partial<AccountProfile> & { ruc?: string }
type LegacyQuote = SavedQuote & { companyRuc?: string }

// Compatibilidad con datos guardados antes de separar DNI / RUC.
function normalizeProfile(raw: LegacyProfile | null): AccountProfile | null {
  if (!raw) return null

  return {
    name: raw.name ?? '',
    email: raw.email ?? '',
    phone: raw.phone ?? '',
    company: raw.company ?? '',
    documentType: raw.documentType === 'dni' ? 'dni' : 'ruc',
    documentNumber: raw.documentNumber ?? raw.ruc ?? '',
    contactPreference: raw.contactPreference ?? 'email',
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  }
}

function normalizeQuote(raw: LegacyQuote): SavedQuote {
  const { companyRuc, ...rest } = raw
  const documentNumber = rest.documentNumber ?? companyRuc ?? ''

  return {
    ...rest,
    documentType: rest.documentType ?? (documentNumber ? 'ruc' : undefined),
    documentNumber: documentNumber || undefined,
  }
}

export function useAccount() {
  const [profile, setProfile] = useState<AccountProfile | null>(null)
  const [quotes, setQuotes] = useState<SavedQuote[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setProfile(normalizeProfile(readStored<LegacyProfile | null>(PROFILE_STORAGE_KEY, null)))
    setQuotes(readStored<LegacyQuote[]>(QUOTES_STORAGE_KEY, []).map(normalizeQuote))
    setIsLoaded(true)
  }, [])

  const saveProfile = useCallback((next: AccountProfile) => {
    const value: AccountProfile = {
      ...next,
      createdAt: next.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    writeStored(PROFILE_STORAGE_KEY, value)
    setProfile(value)
    return value
  }, [])

  const addQuote = useCallback((quote: SavedQuote) => {
    setQuotes((prev) => {
      const next = [quote, ...prev.filter((item) => item.id !== quote.id)].slice(0, MAX_SAVED_QUOTES)
      writeStored(QUOTES_STORAGE_KEY, next)
      return next
    })
  }, [])

  const removeQuote = useCallback((id: string) => {
    setQuotes((prev) => {
      const next = prev.filter((item) => item.id !== id)
      writeStored(QUOTES_STORAGE_KEY, next)
      return next
    })
  }, [])

  const clearQuotes = useCallback(() => {
    writeStored(QUOTES_STORAGE_KEY, [])
    setQuotes([])
  }, [])

  return {
    profile,
    quotes,
    isLoaded,
    saveProfile,
    addQuote,
    removeQuote,
    clearQuotes,
  }
}
