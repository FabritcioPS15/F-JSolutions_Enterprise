export const STORE_APP_URL = (
  process.env.NEXT_PUBLIC_STORE_APP_URL ?? 'http://localhost:3006'
).replace(/\/$/, '')

export function storeUrl(path = '') {
  if (!path) return STORE_APP_URL
  return `${STORE_APP_URL}${path.startsWith('/') ? path : `/${path}`}`
}
