'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ToastVariant } from '@/lib/admin/types'

type ToastItem = {
  id: string
  title: string
  description?: string
  variant: ToastVariant
}

type ToastApi = {
  push: (toast: Omit<ToastItem, 'id'>) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastApi | null>(null)

const icons = {
  success: CheckCircle2,
  error: CircleAlert,
  info: Info,
}

const styles = {
  success: 'border-emerald-200 bg-white text-emerald-600',
  error: 'border-red-200 bg-white text-red-600',
  info: 'border-blue-200 bg-white text-blue-600',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timers = useRef<Map<string, number>>(new Map())

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer) window.clearTimeout(timer)
    timers.current.delete(id)
  }, [])

  const push = useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      setToasts((prev) => [...prev, { ...toast, id }])
      const timer = window.setTimeout(() => dismiss(id), 4000)
      timers.current.set(id, timer)
    },
    [dismiss]
  )

  useEffect(() => {
    const timersMap = timers.current
    return () => {
      timersMap.forEach((timer) => window.clearTimeout(timer))
      timersMap.clear()
    }
  }, [])

  const api: ToastApi = {
    push,
    success: (title, description) => push({ title, description, variant: 'success' }),
    error: (title, description) => push({ title, description, variant: 'error' }),
    info: (title, description) => push({ title, description, variant: 'info' }),
  }

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6">
        {toasts.map((toast) => {
          const Icon = icons[toast.variant]
          return (
            <div
              key={toast.id}
              role="status"
              className={cn(
                'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-lg shadow-slate-900/5 animate-in slide-in-from-bottom-2 fade-in-0 duration-200',
                styles[toast.variant]
              )}
            >
              <span className="mt-0.5 shrink-0">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
                {toast.description && (
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="shrink-0 rounded-md p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Cerrar notificación"
              >
                <X className="size-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast debe usarse dentro de ToastProvider')
  return context
}
