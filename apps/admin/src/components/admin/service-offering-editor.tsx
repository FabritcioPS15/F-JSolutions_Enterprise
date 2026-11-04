'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { useToast } from '@/components/admin/toast'
import {
  EmptyState,
  Field,
  LoadingState,
  PageHeader,
  SectionCard,
  Select,
  btnPrimary,
  btnSecondary,
  iconButton,
  inputClass,
  textareaClass,
} from '@/components/admin/ui'
import { slugify } from '@/lib/admin/format'
import {
  ServiceOfferingApiError,
  createServiceOffering,
  fetchServiceOffering,
  fetchServiceOfferings,
  updateServiceOffering,
} from '@/lib/services/service-offerings'
import type {
  ServiceFaq,
  ServiceInclude,
  ServiceOfferingCategory,
  ServiceOfferingInput,
  ServiceOfferingStatus,
} from '@fj-solutions/contracts/admin'
import { cn } from '@/lib/utils'

const categories: ServiceOfferingCategory[] = [
  'Soporte TI',
  'Infraestructura TI',
  'Desarrollo de software',
]

const statusOptions: Array<{ value: ServiceOfferingStatus; label: string }> = [
  { value: 'draft', label: 'Borrador' },
  { value: 'published', label: 'Publicado' },
  { value: 'archived', label: 'Archivado' },
]

type Draft = {
  slug: string
  title: string
  category: ServiceOfferingCategory
  summary: string
  intro: string
  heroSrc: string
  heroAlt: string
  includes: ServiceInclude[]
  faq: ServiceFaq[]
  related: string[]
  status: ServiceOfferingStatus
  position: number
}

const emptyDraft: Draft = {
  slug: '',
  title: '',
  category: 'Soporte TI',
  summary: '',
  intro: '',
  heroSrc: '',
  heroAlt: '',
  includes: [{ title: '', copy: '' }],
  faq: [{ question: '', answer: '' }],
  related: [],
  status: 'draft',
  position: 0,
}

type RelatedOption = {
  id: string
  slug: string
  title: string
  category: ServiceOfferingCategory
  status: ServiceOfferingStatus
}

export function ServiceOfferingEditor({ serviceId }: { serviceId?: string }) {
  const router = useRouter()
  const toast = useToast()
  const editing = Boolean(serviceId)
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [slugTouched, setSlugTouched] = useState(false)
  const [relatedOptions, setRelatedOptions] = useState<RelatedOption[]>([])
  const [loading, setLoading] = useState(editing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const [services, current] = await Promise.all([
          fetchServiceOfferings(),
          serviceId ? fetchServiceOffering(serviceId) : Promise.resolve(null),
        ])
        if (!active) return
        setRelatedOptions(
          services
            .filter((service) => service.id !== serviceId)
            .map(({ id, slug, title, category, status }) => ({
              id,
              slug,
              title,
              category,
              status,
            }))
        )
        if (current) {
          setDraft({
            slug: current.slug,
            title: current.title,
            category: current.category,
            summary: current.summary,
            intro: current.intro,
            heroSrc: current.heroImage?.src ?? '',
            heroAlt: current.heroImage?.alt ?? '',
            includes: current.includes.length > 0 ? current.includes : [{ title: '', copy: '' }],
            faq: current.faq.length > 0 ? current.faq : [{ question: '', answer: '' }],
            related: current.related,
            status: current.status,
            position: current.position,
          })
          setSlugTouched(true)
        }
        setError(null)
      } catch (err) {
        if (!active) return
        setError(
          err instanceof ServiceOfferingApiError
            ? err.message
            : 'No se pudo cargar el servicio.'
        )
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => {
      active = false
    }
  }, [serviceId])

  const otherServices = useMemo(
    () => relatedOptions.slice().sort((a, b) => a.title.localeCompare(b.title)),
    [relatedOptions]
  )

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  function handleTitle(value: string) {
    setDraft((prev) => ({
      ...prev,
      title: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }))
  }

  function handleSlug(value: string) {
    setSlugTouched(true)
    setDraft((prev) => ({ ...prev, slug: slugify(value) }))
  }

  function updateInclude(index: number, patch: Partial<ServiceInclude>) {
    setDraft((prev) => ({
      ...prev,
      includes: prev.includes.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      ),
    }))
  }

  function updateFaq(index: number, patch: Partial<ServiceFaq>) {
    setDraft((prev) => ({
      ...prev,
      faq: prev.faq.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      ),
    }))
  }

  function toggleRelated(slug: string) {
    setDraft((prev) => ({
      ...prev,
      related: prev.related.includes(slug)
        ? prev.related.filter((item) => item !== slug)
        : [...prev.related, slug],
    }))
  }

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug)) {
      next.slug = 'Usa minúsculas, números y guiones simples. Ejemplo: soporte-tecnico.'
    }
    if (draft.title.trim().length < 2) next.title = 'Ingresa el título del servicio.'
    if (draft.summary.trim().length < 10) {
      next.summary = 'El resumen debe tener al menos 10 caracteres.'
    }
    if (draft.intro.trim().length < 10) {
      next.intro = 'La introducción debe tener al menos 10 caracteres.'
    }
    if (draft.status === 'published' && draft.includes.every((item) => !item.title.trim())) {
      next.includes = 'Agrega al menos un alcance antes de publicar.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function buildPayload(): ServiceOfferingInput {
    const includes = draft.includes
      .map((item) => ({ title: item.title.trim(), copy: item.copy.trim() }))
      .filter((item) => item.title && item.copy)
    const faq = draft.faq
      .map((item) => ({ question: item.question.trim(), answer: item.answer.trim() }))
      .filter((item) => item.question && item.answer)
    const heroSrc = draft.heroSrc.trim()
    const heroAlt = draft.heroAlt.trim()

    return {
      slug: draft.slug.trim(),
      title: draft.title.trim(),
      category: draft.category,
      summary: draft.summary.trim(),
      intro: draft.intro.trim(),
      heroImage: heroSrc && heroAlt ? { src: heroSrc, alt: heroAlt } : undefined,
      includes,
      faq,
      related: draft.related,
      status: draft.status,
      position: Math.max(0, Math.trunc(Number(draft.position) || 0)),
    }
  }

  async function save() {
    if (!validate()) {
      toast.error('Revisa los campos marcados', 'Hay datos obligatorios pendientes.')
      return
    }
    setSaving(true)
    setErrors({})
    try {
      const payload = buildPayload()
      const saved =
        editing && serviceId
          ? await updateServiceOffering(serviceId, payload)
          : await createServiceOffering(payload)
      toast.success(
        editing ? 'Servicio actualizado' : 'Servicio creado',
        `${saved.title} · ${saved.status === 'published' ? 'publicado' : 'en borrador'}`
      )
      router.push('/servicios')
      router.refresh()
    } catch (err) {
      const message =
        err instanceof ServiceOfferingApiError
          ? err.message
          : 'No se pudo guardar el servicio.'
      setError(message)
      toast.error('No se pudo guardar', message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingState label={editing ? 'Cargando servicio…' : 'Preparando editor…'} />
  }

  if (error && editing && !draft.title) {
    return (
      <div className="space-y-5">
        <PageHeader
          eyebrow="Servicios TI"
          title="Editar servicio"
          description="No se pudo cargar el servicio solicitado."
        />
        <EmptyState
          icon={RefreshCw}
          title="Servicio no disponible"
          description={error}
          action={
            <Link href="/servicios" className={btnSecondary}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Volver al catálogo
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Servicios TI"
        title={editing ? 'Editar servicio' : 'Nuevo servicio'}
        description="El contenido se publica en la tienda cuando el estado es Publicado. Los borradores quedan solo en el panel."
        actions={
          <>
            <Link href="/servicios" className={btnSecondary}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Volver
            </Link>
            <button type="button" className={btnPrimary} onClick={() => void save()} disabled={saving}>
              {saving ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="size-4" aria-hidden="true" />
              )}
              {editing ? 'Guardar cambios' : 'Crear servicio'}
            </button>
          </>
        }
      />

      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      <SectionCard
        title="Identidad del servicio"
        description="Nombre, ruta pública y categoría editorial."
        icon={Sparkles}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Título" htmlFor="service-title" required error={errors.title}>
            <input
              id="service-title"
              value={draft.title}
              onChange={(event) => handleTitle(event.target.value)}
              className={inputClass}
              placeholder="Soporte técnico remoto y presencial"
            />
          </Field>
          <Field
            label="Slug"
            htmlFor="service-slug"
            required
            error={errors.slug}
            hint="Ruta pública: /servicios/<slug> o /sistemas/<slug>."
          >
            <input
              id="service-slug"
              value={draft.slug}
              onChange={(event) => handleSlug(event.target.value)}
              className={inputClass}
              placeholder="soporte-tecnico"
            />
          </Field>
          <Field label="Categoría" htmlFor="service-category" required>
            <Select
              id="service-category"
              value={draft.category}
              onChange={(event) =>
                update('category', event.target.value as ServiceOfferingCategory)
              }
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Orden"
            htmlFor="service-position"
            hint="Menor número aparece primero dentro de su categoría."
          >
            <input
              id="service-position"
              type="number"
              min={0}
              max={9999}
              value={draft.position}
              onChange={(event) => update('position', Number(event.target.value))}
              className={inputClass}
            />
          </Field>
          <Field
            label="Resumen"
            htmlFor="service-summary"
            required
            error={errors.summary}
            hint="Se muestra en las tarjetas y resultados de búsqueda (máx. 400 caracteres)."
            className="sm:col-span-2"
          >
            <textarea
              id="service-summary"
              value={draft.summary}
              onChange={(event) => update('summary', event.target.value)}
              className={cn(textareaClass, 'min-h-20')}
              maxLength={400}
            />
          </Field>
          <Field
            label="Introducción"
            htmlFor="service-intro"
            required
            error={errors.intro}
            hint="Texto principal de la página del servicio."
            className="sm:col-span-2"
          >
            <textarea
              id="service-intro"
              value={draft.intro}
              onChange={(event) => update('intro', event.target.value)}
              className={textareaClass}
              maxLength={5000}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Imagen destacada"
        description="Opcional. Si defines imagen y texto alternativo, se usará en la cabecera del servicio."
        icon={ImageIcon}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Ruta o URL de la imagen"
            htmlFor="service-hero-src"
            hint="Ejemplo: /images/heroes/servicio.webp"
          >
            <input
              id="service-hero-src"
              value={draft.heroSrc}
              onChange={(event) => update('heroSrc', event.target.value)}
              className={inputClass}
              placeholder="/images/heroes/servicio.webp"
            />
          </Field>
          <Field
            label="Texto alternativo"
            htmlFor="service-hero-alt"
            hint="Describe la imagen para accesibilidad."
          >
            <input
              id="service-hero-alt"
              value={draft.heroAlt}
              onChange={(event) => update('heroAlt', event.target.value)}
              className={inputClass}
              placeholder="Equipo técnico trabajando en una red empresarial"
            />
          </Field>
        </div>
        {draft.heroSrc.trim() && draft.heroAlt.trim() && (
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={draft.heroSrc}
              alt={draft.heroAlt}
              className="h-48 w-full object-cover"
            />
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Alcances del servicio"
        description="Bloques que explican qué incluye el servicio."
        icon={Sparkles}
        action={
          <button
            type="button"
            className={btnSecondary}
            onClick={() => update('includes', [...draft.includes, { title: '', copy: '' }])}
          >
            <Plus className="size-4" aria-hidden="true" />
            Agregar alcance
          </button>
        }
      >
        {errors.includes && (
          <p className="mb-3 text-[11px] font-medium text-red-600">{errors.includes}</p>
        )}
        <div className="space-y-3">
          {draft.includes.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-slate-50/40 p-3"
            >
              <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
                <Field label={`Título ${index + 1}`}>
                  <input
                    value={item.title}
                    onChange={(event) => updateInclude(index, { title: event.target.value })}
                    className={inputClass}
                    placeholder="Diagnóstico de incidencias"
                  />
                </Field>
                <Field label="Descripción">
                  <textarea
                    value={item.copy}
                    onChange={(event) => updateInclude(index, { copy: event.target.value })}
                    className={cn(textareaClass, 'min-h-20')}
                    placeholder="Identificamos la causa raíz antes de aplicar una solución definitiva."
                  />
                </Field>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  className={cn(iconButton, 'hover:bg-red-50 hover:text-red-600')}
                  onClick={() =>
                    update(
                      'includes',
                      draft.includes.filter((_, itemIndex) => itemIndex !== index)
                    )
                  }
                  aria-label={`Quitar alcance ${index + 1}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
          {draft.includes.length === 0 && (
            <p className="text-xs text-slate-500">
              Sin alcances. Agrega al menos uno para publicar el servicio.
            </p>
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Preguntas frecuentes"
        description="Responden las dudas más comunes antes de solicitar una cotización."
        icon={Sparkles}
        action={
          <button
            type="button"
            className={btnSecondary}
            onClick={() => update('faq', [...draft.faq, { question: '', answer: '' }])}
          >
            <Plus className="size-4" aria-hidden="true" />
            Agregar pregunta
          </button>
        }
      >
        <div className="space-y-3">
          {draft.faq.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-slate-50/40 p-3"
            >
              <div className="space-y-3">
                <Field label={`Pregunta ${index + 1}`}>
                  <input
                    value={item.question}
                    onChange={(event) => updateFaq(index, { question: event.target.value })}
                    className={inputClass}
                    placeholder="¿Atienden urgencias fuera del horario de oficina?"
                  />
                </Field>
                <Field label="Respuesta">
                  <textarea
                    value={item.answer}
                    onChange={(event) => updateFaq(index, { answer: event.target.value })}
                    className={cn(textareaClass, 'min-h-20')}
                    placeholder="Coordinamos cobertura extendida según el plan contratado."
                  />
                </Field>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  className={cn(iconButton, 'hover:bg-red-50 hover:text-red-600')}
                  onClick={() =>
                    update('faq', draft.faq.filter((_, itemIndex) => itemIndex !== index))
                  }
                  aria-label={`Quitar pregunta ${index + 1}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
          {draft.faq.length === 0 && (
            <p className="text-xs text-slate-500">Sin preguntas frecuentes.</p>
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Relacionados y publicación"
        description="Servicios que se sugerirán al final de la página y estado visible en la tienda."
        icon={Sparkles}
      >
        <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
          <div>
            <p className="mb-2 text-xs font-semibold text-slate-700">Servicios relacionados</p>
            {otherServices.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-4 py-6 text-center text-xs text-slate-500">
                Aún no hay otros servicios para relacionar.
              </p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {otherServices.map((service) => {
                  const checked = draft.related.includes(service.slug)
                  return (
                    <label
                      key={service.id}
                      className={cn(
                        'flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-xs transition',
                        checked
                          ? 'border-[#C4B5FD] bg-[#F5F3FF]'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRelated(service.slug)}
                        className="mt-0.5 size-4 accent-[#5B21B6]"
                      />
                      <span>
                        <span className="block font-semibold text-slate-900">
                          {service.title}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-slate-500">
                          {service.category}
                          {service.status !== 'published' ? ' · no publicado' : ''}
                        </span>
                      </span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>
          <div className="space-y-4">
            <Field
              label="Estado"
              htmlFor="service-status"
              hint="Publicado lo muestra en la tienda."
            >
              <Select
                id="service-status"
                value={draft.status}
                onChange={(event) =>
                  update('status', event.target.value as ServiceOfferingStatus)
                }
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <p className="text-[11px] leading-relaxed text-slate-400">
              La ruta pública se calcula según la categoría: Desarrollo de software usa
              <span className="font-semibold text-slate-600"> /sistemas/</span>; el resto usa
              <span className="font-semibold text-slate-600"> /servicios/</span>.
            </p>
          </div>
        </div>
      </SectionCard>

      <div className="flex flex-wrap items-center justify-end gap-2 pb-2">
        <Link href="/servicios" className={btnSecondary}>
          Cancelar
        </Link>
        <button type="button" className={btnPrimary} onClick={() => void save()} disabled={saving}>
          {saving ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="size-4" aria-hidden="true" />
          )}
          {editing ? 'Guardar cambios' : 'Crear servicio'}
        </button>
      </div>
    </div>
  )
}
