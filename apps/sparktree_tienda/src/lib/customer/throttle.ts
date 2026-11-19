// Límite en memoria para los formularios públicos. No reemplaza un rate limit
// de infraestructura, pero frena el uso repetido de registro y reenvío mientras
// la tienda corre en un solo proceso.
const buckets = new Map<string, { count: number; resetAt: number }>()

export function allowAttempt(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (bucket.count >= limit) return false
  bucket.count += 1
  return true
}

export function resetAttempts() {
  buckets.clear()
}
