'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  DatabaseBackup,
  Download,
  HardDrive,
  Info,
  RotateCcw,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Store,
  Upload,
} from 'lucide-react'
import {
  ADMIN_STORAGE_KEY,
  useAdmin,
} from '@/components/admin/admin-provider'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { useToast } from '@/components/admin/toast'
import {
  Field,
  LoadingState,
  PageHeader,
  SectionCard,
  Select,
  btnPrimary,
  btnSecondary,
  inputClass,
  textareaClass,
} from '@/components/admin/ui'
import { downloadFile, formatNumber, storageSizeInKb } from '@/lib/admin/format'
import type { StoreSettings } from '@/lib/admin/types'
import { cn } from '@/lib/utils'

type SettingsDraft = Omit<StoreSettings, 'igv' | 'lowStockThreshold'> & {
  igv: string
  lowStockThreshold: string
}

type SettingsErrors = Partial<Record<keyof SettingsDraft, string>>

function toDraft(settings: StoreSettings): SettingsDraft {
  return {
    ...settings,
    igv: String(settings.igv),
    lowStockThreshold: String(settings.lowStockThreshold),
  }
}

function formatStorage(kb: number): string {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`
  return `${kb} KB`
}

export default function ConfiguracionPage() {
  const {
    hydrated,
    products,
    categories,
    brands,
    settings,
    updateSettings,
    exportData,
    importData,
    resetData,
  } = useAdmin()
  const toast = useToast()

  const [draft, setDraft] = useState<SettingsDraft>(() => toDraft(settings))
  const [errors, setErrors] = useState<SettingsErrors>({})
  const [pendingImport, setPendingImport] = useState<{ name: string; raw: string } | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDraft(toDraft(settings))
    setErrors({})
  }, [settings])

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(toDraft(settings)),
    [draft, settings]
  )

  const usageKb = useMemo(
    () => storageSizeInKb({ products, categories, brands, settings }),
    [products, categories, brands, settings]
  )
  const usagePercent = Math.min(100, Math.max(1, Math.round((usageKb / 5120) * 100)))

  function update<K extends keyof SettingsDraft>(key: K, value: SettingsDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function validate(value: SettingsDraft): SettingsErrors {
    const next: SettingsErrors = {}
    if (!value.storeName.trim()) next.storeName = 'El nombre comercial es obligatorio.'
    if (!value.email.trim()) {
      next.email = 'El correo de contacto es obligatorio.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim())) {
      next.email = 'Escribe un correo válido.'
    }
    if (value.ruc.trim() && !/^\d{11}$/.test(value.ruc.trim())) {
      next.ruc = 'El RUC debe tener 11 dígitos.'
    }
    const igv = Number(value.igv)
    if (!Number.isFinite(igv) || igv < 0 || igv > 100) {
      next.igv = 'El IGV debe estar entre 0 y 100.'
    }
    const threshold = Number(value.lowStockThreshold)
    if (!Number.isInteger(threshold) || threshold < 0) {
      next.lowStockThreshold = 'Usa un número entero mayor o igual a 0.'
    }
    return next
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const nextErrors = validate(draft)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      toast.error('Revisa los datos', 'Hay campos con información inválida.')
      return
    }
    updateSettings({
      ...draft,
      storeName: draft.storeName.trim(),
      legalName: draft.legalName.trim(),
      ruc: draft.ruc.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      address: draft.address.trim(),
      igv: Number(draft.igv),
      lowStockThreshold: Math.trunc(Number(draft.lowStockThreshold)),
    })
    toast.success('Configuración guardada', 'Los cambios se aplicaron al panel.')
  }

  function handleExport() {
    downloadFile(
      `fj-systems-respaldo-${new Date().toISOString().slice(0, 10)}.json`,
      exportData(),
      'application/json'
    )
    toast.success('Respaldo descargado', 'Guarda el archivo en un lugar seguro.')
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const raw = await file.text()
      setPendingImport({ name: file.name, raw })
    } catch {
      toast.error('No se pudo leer el archivo', 'Intenta nuevamente con otro respaldo.')
    }
  }

  function handleConfirmImport() {
    if (!pendingImport) return
    try {
      importData(pendingImport.raw)
      toast.success('Respaldo restaurado', pendingImport.name)
      setPendingImport(null)
    } catch (error) {
      toast.error(
        'Respaldo inválido',
        error instanceof Error ? error.message : 'El archivo no tiene el formato esperado.'
      )
      setPendingImport(null)
    }
  }

  function handleReset() {
    resetData()
    toast.success('Catálogo restaurado', 'Se cargaron nuevamente los datos de demostración.')
  }

  if (!hydrated) {
    return <LoadingState label="Cargando configuración…" />
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Sistema"
        title="Configuración"
        description="Datos del negocio, preferencias del catálogo y respaldo de la información local."
        actions={
          <button type="submit" form="settings-form" className={btnPrimary} disabled={!dirty}>
            <Save className="size-4" aria-hidden="true" />
            Guardar cambios
          </button>
        }
      />

      <form
        id="settings-form"
        onSubmit={handleSubmit}
        noValidate
        className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start"
      >
        <div className="space-y-5">
          <SectionCard
            title="Datos del negocio"
            description="Se usan en cotizaciones, comprobantes y comunicaciones."
            icon={Store}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre comercial" htmlFor="storeName" required error={errors.storeName}>
                <input
                  id="storeName"
                  value={draft.storeName}
                  onChange={(event) => update('storeName', event.target.value)}
                  className={inputClass}
                  placeholder="FJ Systems"
                  aria-invalid={Boolean(errors.storeName)}
                />
              </Field>
              <Field label="Razón social" htmlFor="legalName" hint="Nombre legal para facturación.">
                <input
                  id="legalName"
                  value={draft.legalName}
                  onChange={(event) => update('legalName', event.target.value)}
                  className={inputClass}
                  placeholder="FJ Systems S.A.C."
                />
              </Field>
              <Field label="RUC" htmlFor="ruc" error={errors.ruc} hint="11 dígitos, sin espacios.">
                <input
                  id="ruc"
                  value={draft.ruc}
                  onChange={(event) => update('ruc', event.target.value)}
                  className={cn(inputClass, 'font-mono')}
                  placeholder="20601234567"
                  inputMode="numeric"
                  aria-invalid={Boolean(errors.ruc)}
                />
              </Field>
              <Field label="Correo de contacto" htmlFor="email" required error={errors.email}>
                <input
                  id="email"
                  type="email"
                  value={draft.email}
                  onChange={(event) => update('email', event.target.value)}
                  className={inputClass}
                  placeholder="ventas@fjsystems.pe"
                  aria-invalid={Boolean(errors.email)}
                />
              </Field>
              <Field label="Teléfono / WhatsApp" htmlFor="phone">
                <input
                  id="phone"
                  value={draft.phone}
                  onChange={(event) => update('phone', event.target.value)}
                  className={inputClass}
                  placeholder="+51 999 888 777"
                  inputMode="tel"
                />
              </Field>
              <Field label="Dirección" htmlFor="address" className="sm:col-span-2">
                <textarea
                  id="address"
                  value={draft.address}
                  onChange={(event) => update('address', event.target.value)}
                  className={cn(textareaClass, 'min-h-20')}
                  placeholder="Av. Javier Prado Este 1234, San Isidro, Lima"
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            title="Preferencias del catálogo"
            description="Valores por defecto para precios y control de inventario."
            icon={SlidersHorizontal}
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Moneda" htmlFor="currency" hint="Se aplica a todo el catálogo.">
                <Select
                  id="currency"
                  value={draft.currency}
                  onChange={(event) =>
                    update('currency', event.target.value as SettingsDraft['currency'])
                  }
                >
                  <option value="PEN">Soles (PEN · S/)</option>
                  <option value="USD">Dólares (USD · $)</option>
                </Select>
              </Field>
              <Field label="IGV (%)" htmlFor="igv" error={errors.igv} hint="Impuesto aplicado a las ventas.">
                <input
                  id="igv"
                  value={draft.igv}
                  onChange={(event) => update('igv', event.target.value)}
                  className={inputClass}
                  inputMode="decimal"
                  aria-invalid={Boolean(errors.igv)}
                />
              </Field>
              <Field
                label="Umbral de stock bajo"
                htmlFor="lowStockThreshold"
                error={errors.lowStockThreshold}
                hint="Unidades mínimas antes de alertar."
              >
                <input
                  id="lowStockThreshold"
                  value={draft.lowStockThreshold}
                  onChange={(event) => update('lowStockThreshold', event.target.value)}
                  className={inputClass}
                  inputMode="numeric"
                  aria-invalid={Boolean(errors.lowStockThreshold)}
                />
              </Field>
            </div>
          </SectionCard>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <p className="text-xs text-slate-500">
              {dirty ? (
                <>
                  <span className="font-semibold text-amber-600">Cambios sin guardar.</span> Aplica
                  para actualizar el panel.
                </>
              ) : (
                'Todos los cambios están guardados.'
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={btnSecondary}
                onClick={() => {
                  setDraft(toDraft(settings))
                  setErrors({})
                  toast.info('Cambios descartados')
                }}
                disabled={!dirty}
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Descartar
              </button>
              <button type="submit" className={btnPrimary} disabled={!dirty}>
                <Save className="size-4" aria-hidden="true" />
                Guardar cambios
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <SectionCard title="Almacenamiento local" icon={HardDrive}>
            <div className="space-y-4">
              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-heading text-2xl font-bold leading-none text-slate-900">
                    {formatStorage(usageKb)}
                  </p>
                  <p className="text-[10.5px] text-slate-400">de ~5 MB disponibles</p>
                </div>
                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>

              <dl className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Productos', value: products.length },
                  { label: 'Categorías', value: categories.length },
                  { label: 'Marcas', value: brands.length },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-slate-50 px-2 py-2.5">
                    <dd className="font-heading text-sm font-bold text-slate-900">
                      {formatNumber(item.value)}
                    </dd>
                    <dt className="mt-0.5 text-[9.5px] font-medium text-slate-500">{item.label}</dt>
                  </div>
                ))}
              </dl>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5">
                <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Clave de almacenamiento
                </p>
                <p className="mt-1 truncate font-mono text-[10.5px] text-slate-600">
                  {ADMIN_STORAGE_KEY}
                </p>
              </div>

              <p className="flex gap-2 text-[10.5px] leading-relaxed text-slate-500">
                <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                Los datos viven solo en este navegador. Descarga un respaldo antes de limpiar la
                caché o cambiar de equipo.
              </p>
            </div>
          </SectionCard>

          <SectionCard
            title="Respaldo y restauración"
            description="Exporta o recupera el catálogo completo en JSON."
            icon={DatabaseBackup}
          >
            <div className="space-y-2.5">
              <button type="button" className={cn(btnSecondary, 'w-full justify-start')} onClick={handleExport}>
                <Download className="size-4 text-slate-500" aria-hidden="true" />
                Descargar respaldo
              </button>
              <button
                type="button"
                className={cn(btnSecondary, 'w-full justify-start')}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="size-4 text-slate-500" aria-hidden="true" />
                Restaurar desde archivo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                onChange={handleFileChange}
                className="hidden"
                aria-hidden="true"
                tabIndex={-1}
              />
              <p className="pt-1 text-[10px] leading-relaxed text-slate-400">
                Restaurar reemplaza el catálogo actual con el contenido del archivo.
              </p>
            </div>
          </SectionCard>

          <SectionCard title="Datos de demostración" icon={RotateCcw}>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Vuelve al catálogo de ejemplo para probar el panel desde cero.
            </p>
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Restaurar catálogo demo
            </button>
          </SectionCard>

          <SectionCard title="Seguridad" icon={ShieldCheck}>
            <div className="space-y-2">
              <p className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-amber-700">
                Sin autenticación en esta versión
              </p>
              <p className="text-[10.5px] leading-relaxed text-slate-500">
                El panel funciona solo en este navegador y no valida usuarios ni permisos. Antes de
                publicarlo, conecta la autenticación del servidor, protege las rutas de
                administración y aplica permisos por rol en la base de datos.
              </p>
            </div>
          </SectionCard>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="flex items-center gap-2 text-[11px] font-bold text-slate-700">
              <Info className="size-3.5 text-slate-400" aria-hidden="true" />
              Preparado para la nube
            </p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-slate-500">
              Esta versión guarda la información en el navegador. La estructura ya está lista para
              conectarse a la API y la base de datos sin cambiar las pantallas.
            </p>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={Boolean(pendingImport)}
        title="Restaurar respaldo"
        description={`Se reemplazará el catálogo actual con el contenido de “${pendingImport?.name ?? ''}”. Esta acción no se puede deshacer.`}
        confirmLabel="Restaurar"
        onConfirm={handleConfirmImport}
        onClose={() => setPendingImport(null)}
      />

      <ConfirmDialog
        open={confirmReset}
        title="Restaurar catálogo demo"
        description="Se eliminarán todos los productos, categorías y marcas actuales, y se cargarán nuevamente los datos de ejemplo. Esta acción no se puede deshacer."
        confirmLabel="Restaurar demo"
        onConfirm={handleReset}
        onClose={() => setConfirmReset(false)}
      />
    </div>
  )
}
