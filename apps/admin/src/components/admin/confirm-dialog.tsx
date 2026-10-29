'use client'

import { AlertTriangle } from 'lucide-react'
import { Modal } from '@/components/admin/modal'
import { btnDanger, btnSecondary } from '@/components/admin/ui'

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = true,
  onConfirm,
  onClose,
}: {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button type="button" className={btnSecondary} onClick={onClose}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={destructive ? btnDanger : btnSecondary}
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600 ring-1 ring-red-100">
          <AlertTriangle className="size-5" aria-hidden="true" />
        </span>
        <p className="pt-1 text-sm leading-relaxed text-slate-600">{description}</p>
      </div>
    </Modal>
  )
}
