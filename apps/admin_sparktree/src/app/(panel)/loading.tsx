import { PageLoadingSkeleton } from '@/components/admin/page-loading-skeleton'

export default function PanelLoading() {
  return (
    <div role="status" aria-live="polite" aria-busy="true" aria-atomic="true">
      <span className="sr-only">Cargando página…</span>
      <div className="min-h-[60vh] animate-in fade-in-0 duration-200 delay-200 fill-mode-both motion-reduce:duration-0">
        <PageLoadingSkeleton />
      </div>
    </div>
  )
}
