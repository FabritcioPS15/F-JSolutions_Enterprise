'use client'

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import {
  AlertTriangle,
  Check,
  Loader2,
  Minus,
  Plus,
  RefreshCw,
  RotateCcw,
  RotateCw,
} from 'lucide-react'
import { Modal } from '@/components/admin/modal'
import { btnPrimary, btnSecondary } from '@/components/admin/ui'
import { cn } from '@/lib/utils'

const OUTPUT_WIDTH = 1200
const OUTPUT_HEIGHT = 900
const MIN_ZOOM = 1
const MAX_ZOOM = 4

type Offset = { x: number; y: number }

function getGeometry(image: HTMLImageElement, zoom: number, rotation: number) {
  const rotated = rotation % 180 !== 0
  const rotatedWidth = rotated ? image.naturalHeight : image.naturalWidth
  const rotatedHeight = rotated ? image.naturalWidth : image.naturalHeight
  const cover = Math.max(OUTPUT_WIDTH / rotatedWidth, OUTPUT_HEIGHT / rotatedHeight)
  const scale = cover * zoom
  const drawWidth = image.naturalWidth * scale
  const drawHeight = image.naturalHeight * scale
  return {
    drawWidth,
    drawHeight,
    boundsX: Math.max(0, ((rotated ? drawHeight : drawWidth) - OUTPUT_WIDTH) / 2),
    boundsY: Math.max(0, ((rotated ? drawWidth : drawHeight) - OUTPUT_HEIGHT) / 2),
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function ImageCropDialog({
  open,
  source,
  title = 'Ajustar encuadre',
  description = 'Arrastra la imagen para moverla y usa el zoom para encuadrarla. La salida se guarda en formato 4:3.',
  onClose,
  onApply,
}: {
  open: boolean
  source: string
  title?: string
  description?: string
  onClose: () => void
  onApply: (dataUrl: string) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    origin: Offset
  } | null>(null)

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [locked, setLocked] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 })

  useEffect(() => {
    if (!open || !source) return
    imageRef.current = null
    setStatus('loading')
    setLocked(false)
    setZoom(1)
    setRotation(0)
    setOffset({ x: 0, y: 0 })

    let cancelled = false
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      if (cancelled) return
      imageRef.current = image
      setStatus('ready')
    }
    image.onerror = () => {
      if (cancelled) return
      // Algunos servidores bloquean CORS: permitimos verla, pero no exportarla.
      const fallback = new Image()
      fallback.onload = () => {
        if (cancelled) return
        imageRef.current = fallback
        setLocked(true)
        setStatus('ready')
      }
      fallback.onerror = () => {
        if (cancelled) return
        setStatus('error')
      }
      fallback.src = source
    }
    image.src = source

    return () => {
      cancelled = true
    }
  }, [open, source])

  useEffect(() => {
    const image = imageRef.current
    if (status !== 'ready' || !image) return
    const { boundsX, boundsY } = getGeometry(image, zoom, rotation)
    setOffset((prev) => {
      const x = clamp(prev.x, -boundsX, boundsX)
      const y = clamp(prev.y, -boundsY, boundsY)
      return x === prev.x && y === prev.y ? prev : { x, y }
    })
  }, [status, zoom, rotation])

  useEffect(() => {
    const canvas = canvasRef.current
    const image = imageRef.current
    if (!open || status !== 'ready' || !canvas || !image) return
    const context = canvas.getContext('2d')
    if (!context) return

    const { drawWidth, drawHeight } = getGeometry(image, zoom, rotation)
    context.clearRect(0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT)
    context.save()
    context.translate(OUTPUT_WIDTH / 2 + offset.x, OUTPUT_HEIGHT / 2 + offset.y)
    context.rotate((rotation * Math.PI) / 180)
    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'
    context.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
    context.restore()
  }, [open, status, zoom, rotation, offset])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!open || status !== 'ready' || !canvas) return
    function handleWheel(event: WheelEvent) {
      event.preventDefault()
      setZoom((prev) => clamp(prev - event.deltaY * 0.0015, MIN_ZOOM, MAX_ZOOM))
    }
    canvas.addEventListener('wheel', handleWheel, { passive: false })
    return () => canvas.removeEventListener('wheel', handleWheel)
  }, [open, status])

  function updateZoom(next: number) {
    setZoom(clamp(Number(next.toFixed(3)), MIN_ZOOM, MAX_ZOOM))
  }

  function rotate(direction: 1 | -1) {
    setRotation((prev) => (prev + direction * 90 + 360) % 360)
    setOffset({ x: 0, y: 0 })
  }

  function reset() {
    setZoom(1)
    setRotation(0)
    setOffset({ x: 0, y: 0 })
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (status !== 'ready' || locked) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: offset,
    }
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLCanvasElement>) {
    const drag = dragRef.current
    const image = imageRef.current
    const canvas = canvasRef.current
    if (!drag || drag.pointerId !== event.pointerId || !image || !canvas) return
    const rect = canvas.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const { boundsX, boundsY } = getGeometry(image, zoom, rotation)
    setOffset({
      x: clamp(
        drag.origin.x + ((event.clientX - drag.startX) * OUTPUT_WIDTH) / rect.width,
        -boundsX,
        boundsX
      ),
      y: clamp(
        drag.origin.y + ((event.clientY - drag.startY) * OUTPUT_HEIGHT) / rect.height,
        -boundsY,
        boundsY
      ),
    })
  }

  function handlePointerEnd(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  function handleApply() {
    const canvas = canvasRef.current
    if (!canvas || status !== 'ready' || locked) return
    let dataUrl: string
    try {
      dataUrl = canvas.toDataURL('image/webp', 0.9)
      if (!dataUrl.startsWith('data:image/webp')) {
        dataUrl = canvas.toDataURL('image/jpeg', 0.9)
      }
      if (dataUrl.length > 1_400_000) {
        dataUrl = canvas.toDataURL('image/webp', 0.72)
      }
    } catch {
      setLocked(true)
      return
    }
    onApply(dataUrl)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="xl"
      footer={
        <>
          <button type="button" className={btnSecondary} onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className={btnPrimary}
            onClick={handleApply}
            disabled={status !== 'ready' || locked}
          >
            <Check className="size-4" aria-hidden="true" />
            Usar esta imagen
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-inset ring-slate-200">
          <canvas
            ref={canvasRef}
            width={OUTPUT_WIDTH}
            height={OUTPUT_HEIGHT}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            className={cn(
              'block w-full touch-none',
              status === 'ready' && !locked && 'cursor-grab active:cursor-grabbing',
              status !== 'ready' && 'invisible'
            )}
            role="img"
            aria-label="Área de encuadre de la imagen"
          />

          {status === 'ready' && (
            <>
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute inset-y-0 left-1/3 w-px bg-white/40" />
                <div className="absolute inset-y-0 left-2/3 w-px bg-white/40" />
                <div className="absolute inset-x-0 top-1/3 h-px bg-white/40" />
                <div className="absolute inset-x-0 top-2/3 h-px bg-white/40" />
              </div>
              <span className="pointer-events-none absolute left-2.5 top-2.5 rounded-md bg-slate-950/55 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
                4:3 · {OUTPUT_WIDTH} × {OUTPUT_HEIGHT} px
              </span>
              <span className="pointer-events-none absolute bottom-2.5 left-1/2 -translate-x-1/2 rounded-full bg-slate-950/55 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur">
                Arrastra para mover · rueda para zoom
              </span>
            </>
          )}

          {status === 'loading' && (
            <div className="absolute inset-0 grid place-items-center bg-slate-100">
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <Loader2 className="size-6 animate-spin" aria-hidden="true" />
                <p className="text-[11px] font-medium">Cargando imagen…</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="absolute inset-0 grid place-items-center bg-slate-100 px-6">
              <div className="flex max-w-sm flex-col items-center gap-2 text-center text-slate-500">
                <AlertTriangle className="size-6 text-amber-500" aria-hidden="true" />
                <p className="text-xs font-semibold text-slate-700">No se pudo cargar la imagen</p>
                <p className="text-[11px] leading-relaxed">
                  Revisa que la URL sea accesible o descarga el archivo y súbelo desde el panel.
                </p>
              </div>
            </div>
          )}
        </div>

        {locked && (
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-[11px] leading-relaxed text-amber-800">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p>
              Esta imagen está alojada en otro sitio y no permite procesarse en el navegador.
              Descárgala y súbela como archivo para poder encuadrarla.
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => rotate(-1)}
              disabled={status !== 'ready' || locked}
              className="grid size-8 place-items-center rounded-lg text-slate-500 transition hover:bg-white hover:text-slate-900 hover:shadow-xs disabled:opacity-30"
              aria-label="Rotar 90 grados a la izquierda"
            >
              <RotateCcw className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => rotate(1)}
              disabled={status !== 'ready' || locked}
              className="grid size-8 place-items-center rounded-lg text-slate-500 transition hover:bg-white hover:text-slate-900 hover:shadow-xs disabled:opacity-30"
              aria-label="Rotar 90 grados a la derecha"
            >
              <RotateCw className="size-4" />
            </button>
          </div>

          <span className="hidden h-5 w-px bg-slate-200 sm:block" aria-hidden="true" />

          <div className="flex min-w-[190px] flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => updateZoom(zoom - 0.1)}
              disabled={status !== 'ready' || locked || zoom <= MIN_ZOOM}
              className="grid size-7 place-items-center rounded-lg text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:opacity-30"
              aria-label="Reducir zoom"
            >
              <Minus className="size-3.5" />
            </button>
            <input
              type="range"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={0.01}
              value={zoom}
              onChange={(event) => updateZoom(Number(event.target.value))}
              disabled={status !== 'ready' || locked}
              className="h-1.5 flex-1 cursor-pointer accent-blue-600 disabled:opacity-40"
              aria-label="Zoom de la imagen"
            />
            <button
              type="button"
              onClick={() => updateZoom(zoom + 0.1)}
              disabled={status !== 'ready' || locked || zoom >= MAX_ZOOM}
              className="grid size-7 place-items-center rounded-lg text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:opacity-30"
              aria-label="Aumentar zoom"
            >
              <Plus className="size-3.5" />
            </button>
            <span className="w-10 text-right text-[11px] font-semibold tabular-nums text-slate-500">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          <button
            type="button"
            onClick={reset}
            disabled={status !== 'ready' || locked}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold text-slate-500 transition hover:bg-white hover:text-slate-900 hover:shadow-xs disabled:opacity-30"
          >
            <RefreshCw className="size-3.5" aria-hidden="true" />
            Restablecer
          </button>
        </div>
      </div>
    </Modal>
  )
}
