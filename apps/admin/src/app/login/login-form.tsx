'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, Eye, EyeOff, Loader2, LogIn } from 'lucide-react'

type ApiResponse = {
  success?: boolean
  message?: string
}

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      const body = (await response.json().catch(() => null)) as ApiResponse | null

      if (!response.ok || !body?.success) {
        setError(body?.message ?? 'No se pudo iniciar sesión. Inténtalo nuevamente.')
        return
      }

      router.replace('/')
      router.refresh()
    } catch {
      setError('No se pudo conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-[12px] leading-relaxed text-red-700"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="nombre@fjsolutions.pe"
          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#5B21B6] focus:ring-4 focus:ring-[#5B21B6]/10"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Tu contraseña"
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-3.5 pr-10 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#5B21B6] focus:ring-4 focus:ring-[#5B21B6]/10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#2E1065] text-[13px] font-semibold text-white transition hover:bg-[#3B0764] focus:outline-none focus:ring-4 focus:ring-[#5B21B6]/25 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Verificando…
          </>
        ) : (
          <>
            <LogIn className="size-4" aria-hidden="true" />
            Entrar al panel
          </>
        )}
      </button>
    </form>
  )
}
