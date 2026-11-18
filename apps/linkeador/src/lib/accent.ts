import type { CSSProperties } from 'react'

// El color de acento llega desde el panel como hex. Se derivan variantes una
// sola vez para que los componentes solo usen variables CSS.
export function accentVars(hex: string): CSSProperties {
  const safe = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex.toUpperCase() : '#7C3AED'
  const r = parseInt(safe.slice(1, 3), 16)
  const g = parseInt(safe.slice(3, 5), 16)
  const b = parseInt(safe.slice(5, 7), 16)
  const tint = (value: number, amount: number) => Math.round(value + (255 - value) * amount)

  return {
    '--accent': safe,
    '--accent-light': `rgb(${tint(r, 0.42)}, ${tint(g, 0.42)}, ${tint(b, 0.42)})`,
    '--accent-soft': `rgba(${r}, ${g}, ${b}, 0.16)`,
    '--accent-border': `rgba(${r}, ${g}, ${b}, 0.42)`,
    '--accent-glow': `rgba(${r}, ${g}, ${b}, 0.32)`,
  } as CSSProperties
}
