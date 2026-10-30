'use client'

import { useEffect, useRef, useState } from 'react'
import { Download, FileWarning, LoaderCircle, Printer } from 'lucide-react'
import { Modal } from '@/components/admin/modal'
import { useToast } from '@/components/admin/toast'
import { btnPrimary, btnSecondary } from '@/components/admin/ui'
import { buildQuoteDocumentData } from '@/lib/admin/quote-document-data'
import type { AdminProduct, Client, Quote, StoreSettings } from '@/lib/admin/types'
import {
  createQuoteDocumentBlob,
  loadImageDataUrl,
  quoteDocumentFileName,
} from '@/lib/quote-document'

let logoPromise: Promise<string | null> | null = null

function loadLogo(): Promise<string | null> {
  if (!logoPromise) logoPromise = loadImageDataUrl('/logo.png')
  return logoPromise
}

export function QuoteDocumentPreview({
  open,
  quote,
  settings,
  clients,
  products,
  onClose,
}: {
  open: boolean
  quote: Quote
  settings: StoreSettings
  clients: Client[]
  products: AdminProduct[]
  onClose: () => void
}) {
  const toast = useToast()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    let objectUrl: string | null = null

    setPdfUrl(null)
    setError(null)

    void (async () => {
      try {
        const logoDataUrl = (await loadLogo()) ?? undefined
        if (cancelled) return

        const data = buildQuoteDocumentData({
          quote,
          settings,
          clients,
          products,
          logoDataUrl,
        })
        const blob = await createQuoteDocumentBlob(data)
        if (cancelled) return

        objectUrl = URL.createObjectURL(blob)
        setPdfUrl(objectUrl)
      } catch (cause) {
        console.error('Error generating quote document:', cause)
        if (!cancelled) setError('No se pudo generar el documento. Inténtalo nuevamente.')
      }
    })()

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [open, quote, settings, clients, products, attempt])

  const fileName = quoteDocumentFileName(quote.code)

  function handleDownload() {
    if (!pdfUrl) return
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
    toast.success('PDF generado', fileName)
  }

  function handlePrint() {
    if (!pdfUrl) return
    const frame = iframeRef.current
    const printWindow = frame?.contentWindow
    if (!printWindow) {
      window.open(pdfUrl, '_blank', 'noopener')
      return
    }
    printWindow.focus()
    printWindow.print()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Vista previa de la cotización"
      description={`${quote.code} · Documento A4 que se descarga y se imprime tal como se ve.`}
      size="xl"
      footer={
        <>
          <button type="button" className={btnSecondary} onClick={onClose}>
            Cerrar
          </button>
          <button
            type="button"
            className={btnSecondary}
            onClick={handlePrint}
            disabled={!pdfUrl}
          >
            <Printer className="size-4" aria-hidden="true" />
            Imprimir
          </button>
          <button
            type="button"
            className={btnPrimary}
            onClick={handleDownload}
            disabled={!pdfUrl}
          >
            <Download className="size-4" aria-hidden="true" />
            Descargar PDF
          </button>
        </>
      }
    >
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
        <div className="flex h-9 items-center gap-2 border-b border-slate-200 bg-slate-50 px-3">
          <span className="size-2.5 rounded-full bg-red-400" aria-hidden="true" />
          <span className="size-2.5 rounded-full bg-amber-400" aria-hidden="true" />
          <span className="size-2.5 rounded-full bg-emerald-400" aria-hidden="true" />
          <span className="ml-2 truncate font-mono text-[10px] text-slate-500">{fileName}</span>
        </div>

        {pdfUrl ? (
          <iframe
            ref={iframeRef}
            src={pdfUrl}
            title={`Documento de cotización ${quote.code}`}
            className="h-[68vh] min-h-[420px] w-full bg-white"
          />
        ) : (
          <div className="flex h-[68vh] min-h-[420px] flex-col items-center justify-center gap-3 px-6 text-center">
            {error ? (
              <>
                <FileWarning className="size-7 text-slate-400" aria-hidden="true" />
                <p className="max-w-xs text-xs leading-relaxed text-slate-500">{error}</p>
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() => setAttempt((value) => value + 1)}
                >
                  Reintentar
                </button>
              </>
            ) : (
              <>
                <LoaderCircle
                  className="size-6 animate-spin text-blue-600"
                  aria-hidden="true"
                />
                <p className="text-xs font-medium text-slate-500">Generando documento A4…</p>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}
