export const QUOTE_CART_KEY = 'sparktree-systems:quote-services'
export const QUOTE_CART_EVENT = 'sparktree:quote-services'
export const MAX_QUOTE_SERVICES = 8

export function readQuoteCart(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(QUOTE_CART_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((slug): slug is string => typeof slug === 'string' && slug.length > 0)
      .slice(0, MAX_QUOTE_SERVICES)
  } catch {
    return []
  }
}

export function writeQuoteCart(slugs: string[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      QUOTE_CART_KEY,
      JSON.stringify(slugs.slice(0, MAX_QUOTE_SERVICES)),
    )
  } catch {
    // Storage may be unavailable (private mode); the quoter still works in-session.
  }
  window.dispatchEvent(new Event(QUOTE_CART_EVENT))
}

export function addToQuoteCart(slug: string): string[] {
  const current = readQuoteCart()
  if (current.includes(slug)) return current
  const next = [...current, slug].slice(0, MAX_QUOTE_SERVICES)
  writeQuoteCart(next)
  return next
}
