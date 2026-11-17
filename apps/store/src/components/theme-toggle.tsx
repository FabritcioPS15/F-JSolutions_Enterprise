'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

const STORAGE_KEY = 'fj-theme'

type Theme = 'light' | 'dark'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
  }, [])

  const label = theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    const root = document.documentElement
    root.classList.toggle('dark', next === 'dark')
    root.classList.toggle('light', next === 'light')
    root.style.colorScheme = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* almacenamiento bloqueado: el cambio vale solo para esta visita */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      aria-pressed={theme === 'dark'}
      className={`grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-primary/40 hover:text-foreground sm:size-10 ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="size-4 sm:size-5" aria-hidden="true" />
      ) : (
        <Moon className="size-4 sm:size-5" aria-hidden="true" />
      )}
    </button>
  )
}
