'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ChevronDown,
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  Loader2,
  Table2,
  type LucideIcon,
} from 'lucide-react'
import { useToast } from '@/components/admin/toast'
import { btnSecondary } from '@/components/admin/ui'
import {
  downloadDataset,
  exportFormatLabels,
  type DatasetExport,
  type ExportFormat,
} from '@/lib/admin/dataset-export'
import { cn } from '@/lib/utils'

const formatMeta: Record<
  ExportFormat,
  { description: string; icon: LucideIcon; tone: string }
> = {
  excel: {
    description: 'Libro .xlsx con formato',
    icon: FileSpreadsheet,
    tone: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  },
  csv: {
    description: 'Texto separado por comas',
    icon: Table2,
    tone: 'bg-sky-50 text-sky-600 ring-sky-100',
  },
  pdf: {
    description: 'Documento listo para imprimir',
    icon: FileText,
    tone: 'bg-red-50 text-red-600 ring-red-100',
  },
  json: {
    description: 'Respaldo para restaurar',
    icon: FileJson,
    tone: 'bg-amber-50 text-amber-600 ring-amber-100',
  },
}

const defaultFormats: ExportFormat[] = ['excel', 'csv', 'pdf']

export function ExportMenu({
  build,
  nouns,
  formats = defaultFormats,
  label = 'Exportar',
  disabled,
  className,
}: {
  build: () => DatasetExport
  nouns?: [one: string, other: string]
  formats?: ExportFormat[]
  label?: string
  disabled?: boolean
  className?: string
}) {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [align, setAlign] = useState<'left' | 'right'>('right')
  const [pending, setPending] = useState<ExportFormat | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handlePointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
    }, 20)
    return () => window.clearTimeout(timer)
  }, [open])

  function close(focusTrigger = false) {
    setOpen(false)
    if (focusTrigger) {
      window.setTimeout(() => triggerRef.current?.focus(), 0)
    }
  }

  async function run(format: ExportFormat) {
    close()
    setPending(format)
    try {
      const dataset = build()
      await downloadDataset(dataset, format)
      const count = dataset.sheets[0]?.rows.length ?? 0
      const noun = nouns ? (count === 1 ? nouns[0] : nouns[1]) : null
      toast.success(
        'Exportación descargada',
        noun
          ? `Archivo ${exportFormatLabels[format]} con ${count} ${noun}.`
          : `El archivo se descargó en formato ${exportFormatLabels[format]}.`
      )
    } catch {
      toast.error('No se pudo exportar', 'Vuelve a intentarlo.')
    } finally {
      setPending(null)
    }
  }

  return (
    <div
      ref={rootRef}
      className={cn('relative', className)}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.preventDefault()
          close(true)
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={disabled || pending !== null}
        onClick={() => {
          if (!open) {
            const rect = triggerRef.current?.getBoundingClientRect()
            if (rect) {
              const fitsRight = rect.left + 264 <= window.innerWidth - 8
              setAlign(fitsRight ? 'left' : 'right')
            }
          }
          setOpen((prev) => !prev)
        }}
        className={cn(btnSecondary, open && 'border-slate-300 bg-slate-50')}
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Download className="size-4" aria-hidden="true" />
        )}
        {pending ? 'Generando…' : label}
        <ChevronDown
          className={cn(
            'size-4 text-slate-400 transition-transform duration-200',
            open && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          ref={panelRef}
          role="menu"
          aria-label={label}
          className={cn(
            'absolute top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 animate-in fade-in-0 zoom-in-95 duration-150',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          <p className="px-2.5 pb-1 pt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Formato de descarga
          </p>
          {formats.map((format) => {
            const meta = formatMeta[format]
            const Icon = meta.icon
            return (
              <button
                key={format}
                type="button"
                role="menuitem"
                onClick={() => void run(format)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none"
              >
                <span
                  className={cn(
                    'grid size-8 shrink-0 place-items-center rounded-lg ring-1 ring-inset',
                    meta.tone
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold text-slate-800">
                    {exportFormatLabels[format]}
                  </span>
                  <span className="block truncate text-[10.5px] text-slate-400">
                    {meta.description}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
