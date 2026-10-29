'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Archive,
  ArrowLeft,
  Barcode,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleDollarSign,
  Eye,
  FolderTree,
  Globe,
  Image as ImageIcon,
  ImagePlus,
  Info,
  Link2,
  ListChecks,
  Minus,
  Plus,
  Save,
  Sparkles,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { useAdmin } from '@/components/admin/admin-provider'
import { CategoryGlyph } from '@/components/admin/category-icon'
import { Modal } from '@/components/admin/modal'
import { ProductThumb } from '@/components/admin/product-thumb'
import { useToast } from '@/components/admin/toast'
import {
  Field,
  PageHeader,
  SectionCard,
  Select,
  StatusBadge,
  StockBadge,
  btnPrimary,
  btnSecondary,
  inputClass,
  textareaClass,
} from '@/components/admin/ui'
import {
  availabilityDescriptions,
  availabilityLabels,
  formatCurrency,
  formatDateTime,
  getMargin,
  slugify,
} from '@/lib/admin/format'
import type {
  AdminProduct,
  ProductAvailability,
  ProductInput,
  ProductStatus,
} from '@/lib/admin/types'
import { cn } from '@/lib/utils'

type Draft = {
  name: string
  slug: string
  shortDescription: string
  description: string
  category: string
  subcategory: string
  subSubcategory: string
  brand: string
  model: string
  sku: string
  internalCode: string
  price: string
  cost: string
  showPrice: boolean
  commercialMessage: string
  stock: string
  minStock: string
  availability: ProductAvailability
  status: ProductStatus
  featured: boolean
  specs: string[]
  image: string
  imageAlt: string
  images: string[]
  seoTitle: string
  seoDescription: string
}

function createDraft(product: AdminProduct | undefined, defaultMinStock: number): Draft {
  if (product) {
    return {
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      description: product.description,
      category: product.category,
      subcategory: product.subcategory ?? '',
      subSubcategory: product.subSubcategory ?? '',
      brand: product.brand,
      model: product.model ?? '',
      sku: product.sku,
      internalCode: product.internalCode ?? '',
      price: String(product.price),
      cost: product.cost != null ? String(product.cost) : '',
      showPrice: product.showPrice,
      commercialMessage: product.commercialMessage,
      stock: String(product.stock),
      minStock: String(product.minStock),
      availability: product.availability,
      status: product.status,
      featured: product.featured,
      specs: product.specs.length ? product.specs : [''],
      image: product.image,
      imageAlt: product.imageAlt,
      images: product.images,
      seoTitle: product.seoTitle,
      seoDescription: product.seoDescription,
    }
  }

  return {
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    category: '',
    subcategory: '',
    subSubcategory: '',
    brand: '',
    model: '',
    sku: '',
    internalCode: '',
    price: '',
    cost: '',
    showPrice: true,
    commercialMessage: '',
    stock: '0',
    minStock: String(defaultMinStock),
    availability: 'available',
    status: 'active',
    featured: false,
    specs: [''],
    image: '',
    imageAlt: '',
    images: [],
    seoTitle: '',
    seoDescription: '',
  }
}

const MAX_UPLOAD_BYTES = 1_500_000

const quickAddLabels = {
  category: { title: 'Nueva categoría', placeholder: 'Ej. Cámaras de seguridad' },
  subcategory: { title: 'Nueva subcategoría', placeholder: 'Ej. Winsurf' },
  type: { title: 'Nuevo tipo', placeholder: 'Ej. Modelos 4K' },
  brand: { title: 'Nueva marca', placeholder: 'Ej. Logitech' },
} as const

export function ProductForm({
  mode,
  product,
}: {
  mode: 'create' | 'edit'
  product?: AdminProduct
}) {
  const {
    products,
    categories,
    brands,
    settings,
    createProduct,
    updateProduct,
    addCategory,
    addSubcategory,
    addSubSubcategory,
    addBrand,
  } = useAdmin()
  const router = useRouter()
  const toast = useToast()

  const [draft, setDraft] = useState<Draft>(() =>
    createDraft(product, settings.lowStockThreshold)
  )
  const [slugTouched, setSlugTouched] = useState(mode === 'edit')
  const [galleryInput, setGalleryInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [quickAdd, setQuickAdd] = useState<'category' | 'subcategory' | 'type' | 'brand' | null>(
    null
  )
  const [quickName, setQuickName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [initialSnapshot] = useState(() =>
    JSON.stringify(createDraft(product, settings.lowStockThreshold))
  )
  const dirty = JSON.stringify(draft) !== initialSnapshot

  useEffect(() => {
    if (!dirty) return
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [dirty])

  function handleCancel(event: React.MouseEvent<HTMLAnchorElement>) {
    if (
      dirty &&
      !window.confirm('Hay cambios sin guardar. ¿Quieres salir de todos modos?')
    ) {
      event.preventDefault()
    }
  }

  const selectedCategory = categories.find((category) => category.label === draft.category)
  const subcategories = selectedCategory?.subcategories ?? []
  const selectedSubcategory = subcategories.find((sub) => sub.label === draft.subcategory)
  const subSubcategories = selectedSubcategory?.subSubcategories ?? []

  const priceNumber = Number(draft.price) || 0
  const costNumber = draft.cost === '' ? undefined : Number(draft.cost) || 0
  const stockNumber = Number(draft.stock) || 0
  const minStockNumber = Number(draft.minStock) || 0
  const margin = getMargin({ price: priceNumber, cost: costNumber })

  const completeness = useMemo(() => {
    const checks = [
      { label: 'Nombre', done: draft.name.trim().length > 2 },
      { label: 'Resumen', done: draft.shortDescription.trim().length >= 20 },
      { label: 'Descripción', done: draft.description.trim().length >= 40 },
      { label: 'Categoría', done: Boolean(draft.category) },
      { label: 'Marca', done: Boolean(draft.brand) },
      { label: 'SKU', done: Boolean(draft.sku.trim()) },
      { label: 'Imagen', done: Boolean(draft.image.trim()) },
      { label: 'Especificaciones', done: draft.specs.some((spec) => spec.trim()) },
      { label: 'SEO', done: Boolean(draft.seoTitle.trim() || draft.seoDescription.trim()) },
    ]
    const done = checks.filter((check) => check.done).length
    return { checks, done, percent: Math.round((done / checks.length) * 100) }
  }, [draft])

  function setField<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
    if (errors[key as string]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key as string]
        return next
      })
    }
  }

  function handleNameChange(value: string) {
    setDraft((prev) => ({
      ...prev,
      name: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }))
    if (errors.name) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next.name
        return next
      })
    }
  }

  function regenerateSlug() {
    setSlugTouched(true)
    setField('slug', slugify(draft.name))
  }

  function handleCategoryChange(value: string) {
    setDraft((prev) => ({
      ...prev,
      category: value,
      subcategory: '',
      subSubcategory: '',
    }))
  }

  function handleSubcategoryChange(value: string) {
    setDraft((prev) => ({ ...prev, subcategory: value, subSubcategory: '' }))
  }

  function updateSpec(index: number, value: string) {
    setDraft((prev) => ({
      ...prev,
      specs: prev.specs.map((spec, idx) => (idx === index ? value : spec)),
    }))
  }

  function addSpec() {
    setDraft((prev) => ({ ...prev, specs: [...prev.specs, ''] }))
  }

  function removeSpec(index: number) {
    setDraft((prev) => ({
      ...prev,
      specs: prev.specs.length === 1 ? [''] : prev.specs.filter((_, idx) => idx !== index),
    }))
  }

  function moveSpec(index: number, direction: -1 | 1) {
    const target = index + direction
    setDraft((prev) => {
      if (target < 0 || target >= prev.specs.length) return prev
      const specs = [...prev.specs]
      const [item] = specs.splice(index, 1)
      specs.splice(target, 0, item)
      return { ...prev, specs }
    })
  }

  function moveGalleryImage(index: number, direction: -1 | 1) {
    const target = index + direction
    setDraft((prev) => {
      if (target < 0 || target >= prev.images.length) return prev
      const images = [...prev.images]
      const [item] = images.splice(index, 1)
      images.splice(target, 0, item)
      return { ...prev, images }
    })
  }

  function addGalleryUrl() {
    const value = galleryInput.trim()
    if (!value) return
    if (!/^(https?:\/\/|data:image\/)/i.test(value)) {
      toast.error('URL no válida', 'La imagen debe empezar con http(s):// o ser un archivo subido.')
      return
    }
    setDraft((prev) => ({ ...prev, images: [...prev.images, value] }))
    setGalleryInput('')
  }

  function removeGalleryImage(index: number) {
    setDraft((prev) => ({ ...prev, images: prev.images.filter((_, idx) => idx !== index) }))
  }

  function openQuickAdd(kind: NonNullable<typeof quickAdd>) {
    setQuickName('')
    setQuickAdd(kind)
  }

  function handleQuickAdd() {
    if (!quickAdd) return
    const clean = quickName.trim()
    if (!clean) {
      toast.error('Escribe un nombre')
      return
    }

    if (quickAdd === 'category') {
      if (!addCategory(clean)) {
        toast.error('No se pudo crear', 'Ya existe una categoría con ese nombre.')
        return
      }
      setDraft((prev) => ({ ...prev, category: clean, subcategory: '', subSubcategory: '' }))
    } else if (quickAdd === 'subcategory') {
      if (!selectedCategory) return
      if (!addSubcategory(selectedCategory.id, clean)) {
        toast.error('No se pudo crear', 'Ya existe una subcategoría con ese nombre.')
        return
      }
      setDraft((prev) => ({ ...prev, subcategory: clean, subSubcategory: '' }))
    } else if (quickAdd === 'type') {
      if (!selectedCategory || !selectedSubcategory) return
      if (!addSubSubcategory(selectedCategory.id, selectedSubcategory.id, clean)) {
        toast.error('No se pudo crear', 'Ya existe un tipo con ese nombre.')
        return
      }
      setDraft((prev) => ({ ...prev, subSubcategory: clean }))
    } else if (!addBrand(clean)) {
      toast.error('No se pudo crear', 'Ya existe una marca con ese nombre.')
      return
    } else {
      setDraft((prev) => ({ ...prev, brand: clean }))
    }

    setErrors((prev) => {
      const next = { ...prev }
      delete next[quickAdd]
      return next
    })
    toast.success('Elemento creado', clean)
    setQuickAdd(null)
    setQuickName('')
  }

  function readImage(file: File, onLoad: (dataUrl: string) => void) {
    if (!file.type.startsWith('image/')) {
      toast.error('Archivo no compatible', 'Selecciona un archivo de imagen.')
      return
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error('Imagen demasiado pesada', 'Usa una URL para archivos mayores a 1.5 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => onLoad(String(reader.result))
    reader.onerror = () => toast.error('No se pudo leer la imagen')
    reader.readAsDataURL(file)
  }

  function validate() {
    const next: Record<string, string> = {}
    if (draft.name.trim().length < 3) next.name = 'Escribe un nombre de al menos 3 caracteres.'
    if (!draft.sku.trim()) next.sku = 'El SKU es obligatorio.'
    else if (
      products.some(
        (item) =>
          item.id !== product?.id &&
          item.sku.trim().toLowerCase() === draft.sku.trim().toLowerCase()
      )
    ) {
      next.sku = 'Ya existe un producto con este SKU.'
    }
    if (!draft.category) next.category = 'Selecciona una categoría.'
    if (!draft.brand) next.brand = 'Selecciona una marca.'
    if (draft.price !== '' && Number.isNaN(Number(draft.price))) next.price = 'Ingresa un número válido.'
    if (Number(draft.price) < 0) next.price = 'El precio no puede ser negativo.'
    if (draft.stock === '' || Number.isNaN(Number(draft.stock))) next.stock = 'Ingresa el stock disponible.'
    if (Number(draft.stock) < 0) next.stock = 'El stock no puede ser negativo.'
    if (draft.minStock === '' || Number.isNaN(Number(draft.minStock))) {
      next.minStock = 'Define el stock mínimo.'
    }
    if (draft.cost !== '' && (Number.isNaN(Number(draft.cost)) || Number(draft.cost) < 0)) {
      next.cost = 'El costo debe ser un número positivo.'
    }
    setErrors(next)

    const firstKey = Object.keys(next)[0]
    if (firstKey) {
      const element = document.getElementById(`product-${firstKey}`)
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      ;(element as HTMLInputElement | null)?.focus()
    }

    return Object.keys(next).length === 0
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    if (!validate()) {
      toast.error('Revisa el formulario', 'Hay campos obligatorios sin completar.')
      return
    }

    setSubmitting(true)
    const input: ProductInput = {
      name: draft.name.trim(),
      slug: slugify(draft.slug || draft.name),
      shortDescription: draft.shortDescription.trim(),
      description: draft.description.trim(),
      category: draft.category,
      subcategory: draft.subcategory || undefined,
      subSubcategory: draft.subSubcategory || undefined,
      brand: draft.brand,
      model: draft.model.trim() || undefined,
      sku: draft.sku.trim(),
      internalCode: draft.internalCode.trim() || undefined,
      price: Math.max(0, Number(draft.price) || 0),
      cost: costNumber,
      showPrice: draft.showPrice,
      commercialMessage: draft.commercialMessage.trim(),
      stock: Math.max(0, Math.round(stockNumber)),
      minStock: Math.max(0, Math.round(minStockNumber)),
      availability: draft.availability,
      status: draft.status,
      featured: draft.featured,
      specs: draft.specs.map((spec) => spec.trim()).filter(Boolean),
      image: draft.image.trim(),
      imageAlt: draft.imageAlt.trim() || draft.name.trim(),
      images: draft.images.map((image) => image.trim()).filter(Boolean),
      seoTitle: draft.seoTitle.trim(),
      seoDescription: draft.seoDescription.trim(),
    }

    if (mode === 'edit' && product) {
      updateProduct(product.id, input)
      toast.success('Producto actualizado', `${input.name} se guardó correctamente.`)
    } else {
      createProduct(input)
      toast.success('Producto creado', `${input.name} ya forma parte del catálogo.`)
    }

    router.push('/productos')
  }

  const isEdit = mode === 'edit'

  return (
    <div className="space-y-5">
      <nav aria-label="Migas de pan" className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/productos" className="inline-flex items-center gap-1.5 font-semibold text-slate-500 transition hover:text-blue-600">
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Productos
        </Link>
        <ChevronRight className="size-3.5 text-slate-300" aria-hidden="true" />
        <span className="font-semibold text-slate-900">{isEdit ? 'Editar producto' : 'Nuevo producto'}</span>
      </nav>

      <PageHeader
        eyebrow="Catálogo"
        title={isEdit ? 'Editar producto' : 'Nuevo producto'}
        description={
          isEdit
            ? 'Actualiza la información comercial, el inventario y la publicación.'
            : 'Completa la información para agregar un producto al catálogo local.'
        }
        actions={
          <>
            <Link href="/productos" className={btnSecondary} onClick={handleCancel}>
              Cancelar
            </Link>
            <button type="submit" form="product-form" className={btnPrimary} disabled={submitting}>
              <Save className="size-4" aria-hidden="true" />
              {submitting ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </>
        }
      />

      <form
        id="product-form"
        onSubmit={handleSubmit}
        noValidate
        className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]"
      >
        <div className="space-y-5">
          <SectionCard
            title="Información general"
            description="Datos visibles en la ficha del producto."
            icon={Info}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Nombre del producto"
                htmlFor="product-name"
                required
                error={errors.name}
                className="sm:col-span-2"
              >
                <input
                  id="product-name"
                  value={draft.name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  placeholder="Ej. Laptop Lenovo IdeaPad Slim 3 15.6&quot;"
                  className={inputClass}
                  autoComplete="off"
                />
              </Field>

              <Field
                label="Slug / URL"
                htmlFor="product-slug"
                hint="Identificador para la URL pública. Se genera desde el nombre."
                className="sm:col-span-2"
              >
                <div className="flex gap-2">
                  <input
                    id="product-slug"
                    value={draft.slug}
                    onChange={(event) => {
                      setSlugTouched(true)
                      setField('slug', slugify(event.target.value))
                    }}
                    placeholder="laptop-lenovo-ideapad-slim-3"
                    className={cn(inputClass, 'font-mono text-xs')}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={regenerateSlug}
                    className={cn(btnSecondary, 'shrink-0 px-3')}
                    title="Regenerar desde el nombre"
                  >
                    <Sparkles className="size-3.5" aria-hidden="true" />
                    Generar
                  </button>
                </div>
              </Field>

              <div className="grid gap-4 sm:col-span-2 sm:grid-cols-3">
                <Field label="SKU" htmlFor="product-sku" required error={errors.sku}>
                  <div className="relative">
                    <Barcode className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="product-sku"
                      value={draft.sku}
                      onChange={(event) => setField('sku', event.target.value.toUpperCase())}
                      placeholder="FJ-0001"
                      className={cn(inputClass, 'pl-9 font-mono text-xs uppercase')}
                      autoComplete="off"
                    />
                  </div>
                </Field>

                <Field
                  label="Código interno"
                  htmlFor="product-internalCode"
                  hint="Opcional, uso interno."
                >
                  <input
                    id="product-internalCode"
                    value={draft.internalCode}
                    onChange={(event) => setField('internalCode', event.target.value)}
                    placeholder="ALM-0042"
                    className={cn(inputClass, 'font-mono text-xs')}
                    autoComplete="off"
                  />
                </Field>

                <Field label="Modelo" htmlFor="product-model" hint="Código del fabricante.">
                  <input
                    id="product-model"
                    value={draft.model}
                    onChange={(event) => setField('model', event.target.value)}
                    placeholder="Ej. 82R80005PE"
                    className={cn(inputClass, 'font-mono text-xs')}
                    autoComplete="off"
                  />
                </Field>
              </div>

              <Field
                label="Descripción corta"
                htmlFor="product-shortDescription"
                hint="Resumen de una frase para listados y tarjetas."
                className="sm:col-span-2"
              >
                <textarea
                  id="product-shortDescription"
                  value={draft.shortDescription}
                  onChange={(event) => setField('shortDescription', event.target.value)}
                  placeholder="Equipo compacto para oficina con impresión Wi-Fi y bajo costo por página."
                  className={cn(textareaClass, 'min-h-20')}
                  rows={2}
                  maxLength={180}
                />
              </Field>

              <Field
                label="Descripción completa"
                htmlFor="product-description"
                hint="Detalla características, alcance y condiciones del producto."
                className="sm:col-span-2"
              >
                <textarea
                  id="product-description"
                  value={draft.description}
                  onChange={(event) => setField('description', event.target.value)}
                  placeholder="Laptop ligera y eficiente para trabajo y estudio diario…"
                  className={textareaClass}
                  rows={5}
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            title="Categorización"
            description="Organiza el producto dentro de la taxonomía del catálogo."
            icon={FolderTree}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Categoría" htmlFor="product-category" required error={errors.category}>
                <div className="flex gap-2">
                  <div className="min-w-0 flex-1">
                    <Select
                      id="product-category"
                      value={draft.category}
                      onChange={(event) => handleCategoryChange(event.target.value)}
                    >
                      <option value="">Seleccionar categoría</option>
                      {[...categories]
                        .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label))
                        .map((category) => (
                          <option key={category.id} value={category.label}>
                            {category.label}
                            {category.status === 'inactive' ? ' · Inactiva' : ''}
                          </option>
                        ))}
                    </Select>
                  </div>
                  <button
                    type="button"
                    onClick={() => openQuickAdd('category')}
                    className={cn(btnSecondary, 'w-10 shrink-0 px-0')}
                    title="Crear nueva categoría"
                    aria-label="Crear nueva categoría"
                  >
                    <Plus className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </Field>

              <Field label="Marca" htmlFor="product-brand" required error={errors.brand}>
                <div className="flex gap-2">
                  <div className="min-w-0 flex-1">
                    <Select
                      id="product-brand"
                      value={draft.brand}
                      onChange={(event) => setField('brand', event.target.value)}
                    >
                      <option value="">Seleccionar marca</option>
                      {brands
                        .filter((brand) => brand.status === 'active' || brand.name === draft.brand)
                        .map((brand) => (
                          <option key={brand.id} value={brand.name}>
                            {brand.name}
                            {brand.status === 'inactive' ? ' · Inactiva' : ''}
                          </option>
                        ))}
                    </Select>
                  </div>
                  <button
                    type="button"
                    onClick={() => openQuickAdd('brand')}
                    className={cn(btnSecondary, 'w-10 shrink-0 px-0')}
                    title="Crear nueva marca"
                    aria-label="Crear nueva marca"
                  >
                    <Plus className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </Field>

              <Field
                label="Subcategoría"
                htmlFor="product-subcategory"
                hint={!draft.category ? 'Selecciona primero una categoría.' : undefined}
              >
                <div className="flex gap-2">
                  <div className="min-w-0 flex-1">
                    <Select
                      id="product-subcategory"
                      value={draft.subcategory}
                      onChange={(event) => handleSubcategoryChange(event.target.value)}
                      disabled={!subcategories.length}
                    >
                      <option value="">Sin subcategoría</option>
                      {subcategories.map((sub) => (
                        <option key={sub.id} value={sub.label}>
                          {sub.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <button
                    type="button"
                    onClick={() => openQuickAdd('subcategory')}
                    disabled={!selectedCategory}
                    className={cn(btnSecondary, 'w-10 shrink-0 px-0')}
                    title="Crear nueva subcategoría en la categoría seleccionada"
                    aria-label="Crear nueva subcategoría"
                  >
                    <Plus className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </Field>

              <Field
                label="Tipo"
                htmlFor="product-subSubcategory"
                hint={!draft.subcategory ? 'Selecciona primero una subcategoría.' : undefined}
              >
                <div className="flex gap-2">
                  <div className="min-w-0 flex-1">
                    <Select
                      id="product-subSubcategory"
                      value={draft.subSubcategory}
                      onChange={(event) => setField('subSubcategory', event.target.value)}
                      disabled={!subSubcategories.length}
                    >
                      <option value="">Sin tipo</option>
                      {subSubcategories.map((type) => (
                        <option key={type.id} value={type.label}>
                          {type.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <button
                    type="button"
                    onClick={() => openQuickAdd('type')}
                    disabled={!selectedSubcategory}
                    className={cn(btnSecondary, 'w-10 shrink-0 px-0')}
                    title="Crear nuevo tipo en la subcategoría seleccionada"
                    aria-label="Crear nuevo tipo"
                  >
                    <Plus className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </Field>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:col-span-2">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                  <FolderTree className="size-3.5 text-slate-400" aria-hidden="true" />
                  Crea la taxonomía sin salir del formulario
                </p>
                <p className="mt-1 text-[10.5px] leading-relaxed text-slate-500">
                  Usa el botón <span className="font-semibold text-slate-700">+</span> junto a
                  categoría, marca, subcategoría o tipo para agregarlos al instante y quedarán
                  seleccionados. También puedes administrarlos desde{' '}
                  <Link href="/categorias" target="_blank" className="font-semibold underline underline-offset-2">
                    Categorías
                  </Link>{' '}
                  y{' '}
                  <Link href="/marcas" target="_blank" className="font-semibold underline underline-offset-2">
                    Marcas
                  </Link>
                  .
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Información comercial"
            description="Precio referencial, visibilidad y control de stock."
            icon={CircleDollarSign}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label={`Precio referencial (${settings.currency})`}
                htmlFor="product-price"
                error={errors.price}
                hint="Opcional. Déjalo vacío o en 0 si el producto se cotiza."
              >
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    {settings.currency === 'PEN' ? 'S/' : '$'}
                  </span>
                  <input
                    id="product-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={draft.price}
                    onChange={(event) => setField('price', event.target.value)}
                    placeholder="0.00"
                    className={cn(inputClass, 'pl-9 tabular-nums')}
                  />
                </div>
              </Field>

              <Field
                label={`Costo interno (${settings.currency})`}
                htmlFor="product-cost"
                error={errors.cost}
                hint="Opcional. Solo visible en el panel."
              >
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    {settings.currency === 'PEN' ? 'S/' : '$'}
                  </span>
                  <input
                    id="product-cost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={draft.cost}
                    onChange={(event) => setField('cost', event.target.value)}
                    placeholder="0.00"
                    className={cn(inputClass, 'pl-9 tabular-nums')}
                  />
                </div>
              </Field>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-slate-300 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={draft.showPrice}
                  onChange={(event) => setField('showPrice', event.target.checked)}
                  className="mt-0.5 size-4 rounded border-slate-300 accent-blue-600"
                />
                <span>
                  <span className="block text-xs font-bold text-slate-900">
                    Mostrar precio en el catálogo público
                  </span>
                  <span className="mt-0.5 block text-[10.5px] leading-relaxed text-slate-500">
                    Si lo desactivas, la tienda mostrará “A cotizar” y el botón para solicitar una
                    cotización, sin exponer el precio referencial.
                  </span>
                </span>
              </label>

              <Field
                label="Mensaje comercial"
                htmlFor="product-commercialMessage"
                hint="Opcional. Se muestra junto al precio o al botón de cotización."
                className="sm:col-span-2"
              >
                <input
                  id="product-commercialMessage"
                  value={draft.commercialMessage}
                  onChange={(event) => setField('commercialMessage', event.target.value)}
                  placeholder="Ej. Precio corporativo sujeto a volumen de compra."
                  className={inputClass}
                  autoComplete="off"
                  maxLength={160}
                />
              </Field>

              <Field
                label="Stock disponible"
                htmlFor="product-stock"
                required
                error={errors.stock}
                hint="Unidades listas para entrega."
              >
                <input
                  id="product-stock"
                  type="number"
                  min="0"
                  step="1"
                  value={draft.stock}
                  onChange={(event) => setField('stock', event.target.value)}
                  className={cn(inputClass, 'tabular-nums')}
                />
              </Field>

              <Field
                label="Stock mínimo"
                htmlFor="product-minStock"
                required
                error={errors.minStock}
                hint="Se alertará cuando el stock llegue a este valor."
              >
                <input
                  id="product-minStock"
                  type="number"
                  min="0"
                  step="1"
                  value={draft.minStock}
                  onChange={(event) => setField('minStock', event.target.value)}
                  className={cn(inputClass, 'tabular-nums')}
                />
              </Field>

              <Field
                label="Disponibilidad"
                htmlFor="product-availability"
                hint="Se muestra en la tarjeta del producto en la tienda."
                className="sm:col-span-2"
              >
                <Select
                  id="product-availability"
                  value={draft.availability}
                  onChange={(event) =>
                    setField('availability', event.target.value as ProductAvailability)
                  }
                >
                  <option value="available">Disponible · entrega inmediata</option>
                  <option value="limited">Stock limitado</option>
                  <option value="consult">A pedido corporativo</option>
                </Select>
              </Field>

              {margin !== null && (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 sm:col-span-2">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-600">Margen estimado</p>
                    <p className="mt-0.5 text-[10.5px] text-slate-400">
                      {formatCurrency(priceNumber - (costNumber ?? 0), settings.currency)} de utilidad por unidad
                    </p>
                  </div>
                  <span
                    className={cn(
                      'rounded-lg px-2.5 py-1 text-sm font-bold tabular-nums',
                      margin >= 20
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    )}
                  >
                    {margin.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard
            title="Especificaciones"
            description="Puntos clave que se muestran en la ficha pública."
            icon={ListChecks}
            action={
              <button type="button" onClick={addSpec} className={cn(btnSecondary, 'h-8 px-2.5 text-xs')}>
                <Plus className="size-3.5" aria-hidden="true" />
                Añadir
              </button>
            }
          >
            <div className="space-y-2.5">
              {draft.specs.map((spec, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-slate-50 text-[10px] font-bold text-slate-400 ring-1 ring-slate-100">
                    {index + 1}
                  </span>
                  <input
                    value={spec}
                    onChange={(event) => updateSpec(index, event.target.value)}
                    placeholder="Ej. 16 GB RAM · 512 GB SSD NVMe"
                    className={inputClass}
                  />
                  <div className="flex shrink-0 items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => moveSpec(index, -1)}
                      disabled={index === 0}
                      className="grid size-7 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                      aria-label={`Mover especificación ${index + 1} hacia arriba`}
                    >
                      <ChevronUp className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSpec(index, 1)}
                      disabled={index === draft.specs.length - 1}
                      className="grid size-7 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                      aria-label={`Mover especificación ${index + 1} hacia abajo`}
                    >
                      <ChevronDown className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSpec(index)}
                      className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      aria-label={`Eliminar especificación ${index + 1}`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              <p className="text-[10.5px] leading-relaxed text-slate-400">
                Consejo: usa viñetas cortas, por ejemplo “AMD Ryzen 5 7520U” o “16 GB RAM · 512 GB SSD”.
              </p>
            </div>
          </SectionCard>

          <SectionCard
            title="Imágenes"
            description="Imagen principal y galería del producto."
            icon={ImageIcon}
          >
            <div className="grid gap-5 sm:grid-cols-[200px_minmax(0,1fr)]">
              <div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <ProductThumb src={draft.image} alt={draft.name || 'Producto'} className="size-full object-contain" />
                  {draft.image && (
                    <button
                      type="button"
                      onClick={() => setField('image', '')}
                      className="absolute right-2 top-2 grid size-7 place-items-center rounded-lg bg-white/90 text-slate-500 shadow-sm transition hover:text-red-600"
                      aria-label="Quitar imagen principal"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
                <p className="mt-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Imagen principal
                </p>
              </div>

              <div className="space-y-3">
                <Field label="URL de la imagen" htmlFor="product-image" hint="Pega una URL pública de imagen.">
                  <div className="relative">
                    <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="product-image"
                      value={draft.image.startsWith('data:') ? '' : draft.image}
                      onChange={(event) => setField('image', event.target.value)}
                      placeholder="https://…"
                      className={cn(inputClass, 'pl-9 text-xs')}
                      autoComplete="off"
                    />
                  </div>
                </Field>

                <div className="flex flex-wrap items-center gap-2">
                  <label className={cn(btnSecondary, 'cursor-pointer')}>
                    <Upload className="size-3.5" aria-hidden="true" />
                    Subir archivo
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        if (file) readImage(file, (dataUrl) => setField('image', dataUrl))
                        event.currentTarget.value = ''
                      }}
                    />
                  </label>
                  <span className="text-[10px] text-slate-400">JPG/PNG · hasta 1.5 MB</span>
                </div>

                <Field
                  label="Texto alternativo de la imagen"
                  htmlFor="product-imageAlt"
                  hint="Describe la imagen para accesibilidad y SEO."
                >
                  <input
                    id="product-imageAlt"
                    value={draft.imageAlt}
                    onChange={(event) => setField('imageAlt', event.target.value)}
                    placeholder="Ej. Impresora HP Smart Tank 580 sobre un escritorio"
                    className={inputClass}
                    autoComplete="off"
                  />
                </Field>

                <div className="border-t border-slate-100 pt-3">
                  <p className="mb-2 text-[11px] font-semibold text-slate-700">
                    Galería ({draft.images.length})
                  </p>
                  {draft.images.length > 0 && (
                    <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {draft.images.map((image, index) => (
                        <div
                          key={`${image.slice(0, 24)}-${index}`}
                          className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                        >
                          <ProductThumb src={image} alt={`Imagen ${index + 1}`} className="size-full object-contain" />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute right-1 top-1 grid size-6 place-items-center rounded-md bg-white/90 text-slate-500 shadow-sm transition hover:text-red-600"
                            aria-label={`Quitar imagen ${index + 1}`}
                          >
                            <X className="size-3" />
                          </button>
                          <div className="absolute inset-x-1 bottom-1 flex justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveGalleryImage(index, -1)}
                              disabled={index === 0}
                              className="grid size-6 place-items-center rounded-md bg-white/90 text-slate-500 shadow-sm transition hover:text-slate-900 disabled:opacity-40"
                              aria-label={`Mover imagen ${index + 1} a la izquierda`}
                            >
                              <ChevronLeft className="size-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveGalleryImage(index, 1)}
                              disabled={index === draft.images.length - 1}
                              className="grid size-6 place-items-center rounded-md bg-white/90 text-slate-500 shadow-sm transition hover:text-slate-900 disabled:opacity-40"
                              aria-label={`Mover imagen ${index + 1} a la derecha`}
                            >
                              <ChevronRight className="size-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      value={galleryInput}
                      onChange={(event) => setGalleryInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault()
                          addGalleryUrl()
                        }
                      }}
                      placeholder="Añadir URL a la galería…"
                      className={cn(inputClass, 'h-9 text-xs')}
                    />
                    <button
                      type="button"
                      onClick={addGalleryUrl}
                      className={cn(btnSecondary, 'h-9 shrink-0 px-2.5')}
                      aria-label="Añadir imagen a la galería"
                    >
                      <Plus className="size-4" />
                    </button>
                    <label className={cn(btnSecondary, 'h-9 shrink-0 cursor-pointer px-2.5')} aria-label="Subir imágenes">
                      <ImagePlus className="size-4" aria-hidden="true" />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="sr-only"
                        onChange={(event) => {
                          const files = Array.from(event.target.files ?? [])
                          files.forEach((file) =>
                            readImage(file, (dataUrl) =>
                              setDraft((prev) => ({ ...prev, images: [...prev.images, dataUrl] }))
                            )
                          )
                          event.currentTarget.value = ''
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="SEO y buscadores"
            description="Metadatos para la ficha pública y resultados de búsqueda."
            icon={Globe}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Título SEO"
                htmlFor="product-seoTitle"
                hint={`${draft.seoTitle.length}/60 caracteres recomendados.`}
                className="sm:col-span-2"
              >
                <input
                  id="product-seoTitle"
                  value={draft.seoTitle}
                  onChange={(event) => setField('seoTitle', event.target.value)}
                  placeholder={draft.name || 'Título para buscadores'}
                  className={inputClass}
                  autoComplete="off"
                  maxLength={70}
                />
              </Field>

              <Field
                label="Meta descripción"
                htmlFor="product-seoDescription"
                hint={`${draft.seoDescription.length}/160 caracteres recomendados.`}
                className="sm:col-span-2"
              >
                <textarea
                  id="product-seoDescription"
                  value={draft.seoDescription}
                  onChange={(event) => setField('seoDescription', event.target.value)}
                  placeholder={draft.shortDescription || 'Resumen que aparecerá en los resultados de búsqueda.'}
                  className={cn(textareaClass, 'min-h-24')}
                  rows={3}
                  maxLength={180}
                />
              </Field>

              <div className="rounded-xl border border-slate-200 bg-white p-4 sm:col-span-2">
                <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Vista previa en buscadores
                </p>
                <p className="mt-2.5 truncate text-[11px] text-emerald-700">
                  fjsystems.pe › productos › {draft.slug || 'slug-del-producto'}
                </p>
                <p className="mt-1 line-clamp-2 text-[15px] font-medium leading-snug text-blue-700">
                  {draft.seoTitle || draft.name || 'Título SEO del producto'}
                </p>
                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
                  {draft.seoDescription ||
                    draft.shortDescription ||
                    draft.description ||
                    'La meta descripción aparecerá aquí.'}
                </p>
              </div>

              <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-slate-400 sm:col-span-2">
                <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                El slug se edita en la sección Información general. Los datos estructurados de
                producto se generarán desde este contenido al conectar la tienda.
              </p>
            </div>
          </SectionCard>

          <SectionCard
            title="Publicación"
            description="Controla la visibilidad del producto en la tienda."
            icon={Eye}
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {(
                [
                  {
                    value: 'active',
                    title: 'Publicado',
                    text: 'Visible en la tienda y disponible para cotizar.',
                    icon: Eye,
                  },
                  {
                    value: 'draft',
                    title: 'Borrador',
                    text: 'Oculto al público mientras terminas de editarlo.',
                    icon: Info,
                  },
                  {
                    value: 'archived',
                    title: 'Archivado',
                    text: 'Fuera del catálogo activo. Puedes restaurarlo después.',
                    icon: Archive,
                  },
                ] as const
              ).map((option) => {
                const Icon = option.icon
                const selected = draft.status === option.value
                const archived = option.value === 'archived'
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setField('status', option.value)}
                    aria-pressed={selected}
                    className={cn(
                      'flex items-start gap-3 rounded-xl border p-4 text-left transition',
                      selected
                        ? archived
                          ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/15'
                          : 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/15'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-8 shrink-0 place-items-center rounded-lg ring-1',
                        selected
                          ? archived
                            ? 'bg-amber-500 text-white ring-amber-500'
                            : 'bg-blue-600 text-white ring-blue-600'
                          : 'bg-slate-50 text-slate-500 ring-slate-200'
                      )}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-xs font-bold text-slate-900">
                        {option.title}
                        {selected && (
                          <Check
                            className={cn(
                              'size-3.5',
                              archived ? 'text-amber-600' : 'text-blue-600'
                            )}
                            aria-hidden="true"
                          />
                        )}
                      </span>
                      <span className="mt-1 block text-[10.5px] leading-relaxed text-slate-500">
                        {option.text}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>

            <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(event) => setField('featured', event.target.checked)}
                className="mt-0.5 size-4 rounded border-slate-300 accent-blue-600"
              />
              <span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Star className="size-3.5 text-slate-400" aria-hidden="true" />
                  Producto destacado
                </span>
                <span className="mt-0.5 block text-[10.5px] leading-relaxed text-slate-500">
                  Resalta este producto en el catálogo y en el panel.
                </span>
              </span>
            </label>
          </SectionCard>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <p className="text-xs text-slate-500">
              {dirty ? (
                <span className="font-semibold text-amber-600">Cambios sin guardar.</span>
              ) : (
                'Todos los cambios están guardados.'
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/productos" className={btnSecondary} onClick={handleCancel}>
                Cancelar
              </Link>
              <button type="submit" form="product-form" className={btnPrimary} disabled={submitting}>
                <Save className="size-4" aria-hidden="true" />
                {submitting ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear producto'}
              </button>
            </div>
          </div>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Vista previa
              </p>
              <StatusBadge status={draft.status} />
            </div>

            <div className="p-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-50 ring-1 ring-inset ring-slate-200/70">
                <ProductThumb
                  src={draft.image}
                  alt={draft.name || 'Producto'}
                  className="size-full object-contain"
                />
                <span className="absolute left-2 top-2">
                  <StockBadge stock={stockNumber} minStock={minStockNumber} compact />
                </span>
              </div>

              <div className="mt-3 flex items-center gap-1.5">
                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-slate-600">
                  {draft.brand || 'Marca'}
                </span>
                <span className="truncate text-[10.5px] font-medium text-slate-500">
                  {draft.category || 'Categoría'}
                </span>
              </div>

              <h3 className="mt-2 line-clamp-2 min-h-[38px] font-heading text-sm font-bold leading-snug text-slate-900">
                {draft.name || 'Nombre del producto'}
              </h3>
              <p className="mt-1 line-clamp-2 text-[10.5px] leading-relaxed text-slate-400">
                {draft.shortDescription ||
                  draft.description ||
                  'El resumen del producto aparecerá aquí.'}
              </p>

              <div className="mt-3 flex items-end justify-between gap-2">
                <p className="font-heading text-lg font-bold text-slate-900">
                  {draft.showPrice && priceNumber > 0
                    ? formatCurrency(priceNumber, settings.currency)
                    : 'A cotizar'}
                </p>
                {priceNumber > 0 && !draft.showPrice ? (
                  <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[9.5px] font-semibold text-amber-700">
                    Precio no visible
                  </span>
                ) : margin !== null ? (
                  <span
                    className={cn(
                      'text-[10px] font-semibold',
                      margin >= 20 ? 'text-emerald-600' : 'text-amber-600'
                    )}
                  >
                    {margin.toFixed(0)}% margen
                  </span>
                ) : null}
              </div>

              {draft.specs.filter(Boolean).length > 0 && (
                <ul className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
                  {draft.specs
                    .filter((spec) => spec.trim())
                    .slice(0, 3)
                    .map((spec, index) => (
                      <li key={`${spec}-${index}`} className="flex items-start gap-2 text-[10.5px] text-slate-500">
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-slate-400" />
                        <span className="line-clamp-1">{spec}</span>
                      </li>
                    ))}
                </ul>
              )}

              <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-2 text-[10px] text-slate-500">
                <span className="size-1.5 rounded-full bg-slate-400" />
                {availabilityLabels[draft.availability]} · {availabilityDescriptions[draft.availability]}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Calidad del registro
              </p>
              <span className="text-xs font-bold tabular-nums text-slate-900">
                {completeness.percent}%
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-300',
                  completeness.percent >= 80
                    ? 'bg-emerald-500'
                    : completeness.percent >= 50
                      ? 'bg-amber-500'
                      : 'bg-slate-400'
                )}
                style={{ width: `${Math.max(4, completeness.percent)}%` }}
              />
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-1.5">
              {completeness.checks.map((check) => (
                <li
                  key={check.label}
                  className={cn(
                    'flex items-center gap-1.5 text-[10px]',
                    check.done ? 'text-emerald-600' : 'text-slate-400'
                  )}
                >
                  {check.done ? (
                    <Check className="size-3" aria-hidden="true" />
                  ) : (
                    <Minus className="size-3" aria-hidden="true" />
                  )}
                  {check.label}
                </li>
              ))}
            </ul>
          </div>

          {isEdit && product && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Registro
              </p>
              <dl className="mt-2.5 space-y-2 text-[10.5px]">
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-slate-400">ID</dt>
                  <dd className="truncate font-mono text-slate-600">{product.id}</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-slate-400">Creado</dt>
                  <dd className="text-slate-600">{formatDateTime(product.createdAt)}</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-slate-400">Actualizado</dt>
                  <dd className="text-slate-600">{formatDateTime(product.updatedAt)}</dd>
                </div>
              </dl>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-2.5">
              <CategoryGlyph label={draft.category || 'Catálogo'} className="mt-0.5 size-4 text-slate-400" />
              <div>
                <p className="text-[11px] font-bold text-slate-700">Guardado local</p>
                <p className="mt-0.5 text-[10.5px] leading-relaxed text-slate-500">
                  Este producto se almacena en este navegador. Cuando conectemos la base de datos,
                  el mismo formulario seguirá funcionando.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </form>

      <Modal
        open={Boolean(quickAdd)}
        onClose={() => setQuickAdd(null)}
        title={quickAdd ? quickAddLabels[quickAdd].title : ''}
        description={
          quickAdd === 'subcategory'
            ? `Se agregará dentro de “${draft.category}” y quedará seleccionada.`
            : quickAdd === 'type'
              ? `Se agregará en “${draft.category} › ${draft.subcategory}” y quedará seleccionado.`
              : quickAdd === 'category'
                ? 'Se agregará a la taxonomía y quedará seleccionada en este producto.'
                : 'Se agregará a la lista de marcas y quedará seleccionada en este producto.'
        }
        size="sm"
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => setQuickAdd(null)}>
              Cancelar
            </button>
            <button type="button" className={btnPrimary} onClick={handleQuickAdd}>
              Crear y seleccionar
            </button>
          </>
        }
      >
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-slate-700">Nombre</span>
          <input
            value={quickName}
            onChange={(event) => setQuickName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleQuickAdd()
              }
            }}
            placeholder={quickAdd ? quickAddLabels[quickAdd].placeholder : ''}
            className={inputClass}
            autoFocus
          />
        </label>
      </Modal>
    </div>
  )
}
