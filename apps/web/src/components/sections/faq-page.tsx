'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ChevronDown,
  FileQuestion,
  HelpCircle,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import { EnhancedHeader } from '@/components/layout/enhanced-header'
import { EditorialHero } from '@/components/heroes'
import { HeroAction } from '@/components/heroes/hero-primitives'
import { EMPRESA } from '@/lib/constants'

const CONTAINER = 'mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8'

type FAQCategory = 'todas' | 'general' | 'soporte' | 'software' | 'hardware' | 'facturacion'

interface FAQItem {
  id: string
  category: FAQCategory
  categoryLabel: string
  q: string
  a: string
}

const faqsData: FAQItem[] = [
  // General & Empresa
  {
    id: 'gen-1',
    category: 'general',
    categoryLabel: 'General y Empresa',
    q: '¿Cómo empieza un proyecto con F&J Systems?',
    a: 'Iniciamos con una conversación de diagnóstico sin costo. Escuchamos tus necesidades operativas, evaluamos tu infraestructura actual y preparamos una propuesta técnica y comercial con alcance, cronograma y presupuesto cerrado.',
  },
  {
    id: 'gen-2',
    category: 'general',
    categoryLabel: 'General y Empresa',
    q: '¿Atienden a empresas fuera de Lima o en provincias?',
    a: 'Sí. Brindamos soporte remoto a nivel nacional en todo el Perú. Para proyectos de cableado, servidores, redes y despliegues masivos de hardware coordinamos visitas técnicas presenciales en provincias según el cronograma acordado.',
  },
  {
    id: 'gen-3',
    category: 'general',
    categoryLabel: 'General y Empresa',
    q: '¿Tienen oficina o local de atención comercial?',
    a: 'Sí, nuestras oficinas centrales están ubicadas en Calle Los Claveles 404, San Juan de Miraflores, Lima. Coordinamos reuniones presenciales o virtuales previas para revisar proyectos corporativos.',
  },

  // Soporte TI & Redes
  {
    id: 'sop-1',
    category: 'soporte',
    categoryLabel: 'Soporte TI y Redes',
    q: '¿Pueden dar soporte a computadoras que no fueron compradas con ustedes?',
    a: 'Por supuesto. Nuestro servicio de mesa de ayuda y soporte técnico es totalmente independiente del proveedor donde compraste tus equipos. Inventariamos tu parque tecnológico actual y le damos mantenimiento preventivo y correctivo.',
  },
  {
    id: 'sop-2',
    category: 'soporte',
    categoryLabel: 'Soporte TI y Redes',
    q: '¿Cuáles son los tiempos de respuesta (SLA) para incidencias urgentes?',
    a: 'Para incidencias críticas que paralizan la operación (por ejemplo: caída del servidor central, fallo en router o cajas de cobro), nuestro SLA de atención remota es inferior a 35 minutos y coordinamos visita de emergencia en menos de 2 a 4 horas en Lima Metropolitana.',
  },
  {
    id: 'sop-3',
    category: 'soporte',
    categoryLabel: 'Soporte TI y Redes',
    q: '¿Qué incluye el mantenimiento preventivo de equipos y redes?',
    a: 'Incluye limpieza física interna (eliminación de polvo, cambio de pasta térmica), diagnóstico de salud de discos y memorias, depuración de software malicioso, actualización de parches de seguridad, verificación de respaldos y reporte técnico de vida útil.',
  },

  // Desarrollo de Software
  {
    id: 'soft-1',
    category: 'software',
    categoryLabel: 'Desarrollo de Software',
    q: '¿Desarrollan sistemas a medida o adaptan plataformas existentes?',
    a: 'Ambas opciones según tu necesidad y presupuesto. Desarrollamos aplicaciones web a medida desde cero para flujos específicos, o integramos herramientas open-source y APIs corporativas para acelerar tiempos de salida.',
  },
  {
    id: 'soft-2',
    category: 'software',
    categoryLabel: 'Desarrollo de Software',
    q: '¿Quién es dueño del código fuente y de la base de datos al terminar?',
    a: 'Tu empresa es 100% propietaria del código fuente, arquitectura y bases de datos una vez culminado el proyecto y liquidado el pago. No generamos dependencias cautivas ni penalidades de salida.',
  },
  {
    id: 'soft-3',
    category: 'software',
    categoryLabel: 'Desarrollo de Software',
    q: '¿Pueden integrar nuestro sistema con la facturación electrónica de SUNAT?',
    a: 'Sí. Contamos con amplia experiencia conectando sistemas de ventas, ERPs y plataformas de pedidos directamente con proveedores autorizados (PSE/OSE) o los web services oficiales de SUNAT para emisión automática de boletas, facturas y guías.',
  },

  // Suministro & Hardware
  {
    id: 'hard-1',
    category: 'hardware',
    categoryLabel: 'Suministro y Hardware',
    q: '¿Los equipos y componentes cuentan con garantía oficial?',
    a: 'Todos nuestros productos nuevos cuentan con garantía oficial de marca (HP, Lenovo, Dell, ASUS, Kingston, Epson, etc.) que va desde 12 hasta 36 meses. Nosotros canalizamos directamente la garantía para que no pierdas tiempo en trámites complejos.',
  },
  {
    id: 'hard-2',
    category: 'hardware',
    categoryLabel: 'Suministro y Hardware',
    q: '¿Los computadores se entregan configurados y listos para trabajar?',
    a: 'Sí. Nuestro servicio corporativo incluye preconfiguración básica: sistema operativo activado, paquetería de oficina, antivirus, configuración de usuario y conexión al dominio si tu empresa lo requiere.',
  },
  {
    id: 'hard-3',
    category: 'hardware',
    categoryLabel: 'Suministro y Hardware',
    q: '¿Realizan cotizaciones por volumen para equipar oficinas completas?',
    a: 'Sí. Preparamos cotizaciones corporativas con precios diferenciados por volumen para licitaciones, aperturas de sede o renovación total de parque informático.',
  },

  // Cotizaciones, Facturación & Pagos
  {
    id: 'fact-1',
    category: 'facturacion',
    categoryLabel: 'Facturación y Pagos',
    q: '¿Emiten factura comercial con RUC y crédito corporativo?',
    a: 'Emitimos Factura o Boleta Electrónica formal con RUC (incluye IGV detallado). Para clientes corporativos recurrentes evaluamos líneas de crédito a 15, 30 o 45 días previa aprobación de nuestro departamento financiero.',
  },
  {
    id: 'fact-2',
    category: 'facturacion',
    categoryLabel: 'Facturación y Pagos',
    q: '¿Cuánto tiempo de vigencia tiene una cotización recibida?',
    a: 'Las cotizaciones de servicios y proyectos tienen una vigencia estándar de 15 días calendario. Para componentes de hardware con precios en dólares o stock limitado, la vigencia puede ser de 3 a 7 días.',
  },
  {
    id: 'fact-3',
    category: 'facturacion',
    categoryLabel: 'Facturación y Pagos',
    q: '¿Cuáles son las formas de pago aceptadas?',
    a: 'Aceptamos transferencias bancarias directas (BCP, BBVA, Interbank en soles y dólares), cheques corporativos, tarjetas de crédito/débito y transferencias interbancarias (CCI).',
  },
]

const categories = [
  { id: 'todas', label: 'Todas las preguntas' },
  { id: 'general', label: 'General y Empresa' },
  { id: 'soporte', label: 'Soporte TI y Redes' },
  { id: 'software', label: 'Desarrollo de Software' },
  { id: 'hardware', label: 'Suministro y Hardware' },
  { id: 'facturacion', label: 'Facturación y Pagos' },
]

export function FaqPage() {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>('todas')
  const [searchQuery, setSearchQuery] = useState('')
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'gen-1': true,
    'sop-1': true,
  })

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const expandAll = () => {
    const next: Record<string, boolean> = {}
    filteredFaqs.forEach((faq) => {
      next[faq.id] = true
    })
    setOpenIds(next)
  }

  const collapseAll = () => {
    setOpenIds({})
  }

  const filteredFaqs = useMemo(() => {
    return faqsData.filter((item) => {
      const matchesCategory = selectedCategory === 'todas' || item.category === selectedCategory
      const query = searchQuery.trim().toLowerCase()
      const matchesQuery =
        query === '' ||
        item.q.toLowerCase().includes(query) ||
        item.a.toLowerCase().includes(query) ||
        item.categoryLabel.toLowerCase().includes(query)
      return matchesCategory && matchesQuery
    })
  }, [selectedCategory, searchQuery])

  return (
    <div className="min-h-screen bg-white text-[#0F172A] selection:bg-[#2563EB]/15 selection:text-[#2563EB]">
      <EnhancedHeader />

      <main>
        {/* Hero Editorial */}
        <EditorialHero
          id="hero-faq"
          eyebrow="Centro de Ayuda"
          title={
            <>
              Preguntas frecuentes y <span className="text-[#2563EB]">respuestas claras</span>
            </>
          }
          description="Resolvemos las dudas más comunes sobre nuestros servicios TI, metodología, condiciones comerciales, soporte técnico y garantías de suministro."
          meta={[
            'Sin costos ocultos',
            'Soporte remoto y en sitio',
            'Garantía directa de marca',
            'Facturación electrónica con RUC',
          ]}
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <HeroAction href="/contacto" variant="primary">
                Consultar otra duda
                <ArrowRight className="size-4" />
              </HeroAction>
              <HeroAction href="/como-trabajamos" variant="secondary">
                Conocer metodología
              </HeroAction>
            </div>
          }
        />

        {/* Buscador de preguntas */}
        <section className="border-y border-[#E2E8F0] bg-[#F8FAFC] py-8 sm:py-10" aria-label="Buscador de FAQs">
          <div className={CONTAINER}>
            <div className="mx-auto max-w-2xl text-center">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Escribe lo que necesitas saber (ej. SLA, SUNAT, garantía, visitas)..."
                  className="h-12 w-full rounded-2xl border border-[#CBD5E1] bg-white pl-12 pr-10 text-sm text-[#0F172A] shadow-xs outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#94A3B8] hover:text-[#0F172A]"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              {searchQuery && (
                <p className="mt-2.5 text-xs text-[#64748B]">
                  Mostrando {filteredFaqs.length} resultados para &quot;{searchQuery}&quot;
                </p>
              )}
            </div>

            {/* Categorías */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {categories.map((cat) => {
                const active = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id as FAQCategory)}
                    className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                      active
                        ? 'bg-[#2563EB] text-white shadow-sm'
                        : 'border border-[#E2E8F0] bg-white text-[#475569] hover:border-[#CBD5E1] hover:bg-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Listado de Acordeones */}
        <section className="py-12 sm:py-18" aria-label="Listado de preguntas frecuentes">
          <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
            {/* Control buttons */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <span className="text-xs font-semibold text-[#64748B]">
                {filteredFaqs.length} {filteredFaqs.length === 1 ? 'pregunta encontrada' : 'preguntas disponibles'}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={expandAll}
                  className="text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  Expandir todas
                </button>
                <span className="text-[#CBD5E1]">·</span>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A]"
                >
                  Colapsar todas
                </button>
              </div>
            </div>

            {/* Empty state */}
            {filteredFaqs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] py-16 text-center mt-6">
                <FileQuestion className="mx-auto size-10 text-[#94A3B8]" />
                <h3 className="mt-3 text-base font-semibold text-[#0F172A]">No encontramos preguntas con ese término</h3>
                <p className="mt-1 text-sm text-[#64748B]">Intenta con otra palabra clave o contáctanos directamente.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('todas')
                    setSearchQuery('')
                  }}
                  className="mt-4 rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1D4ED8]"
                >
                  Ver todas las preguntas
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {filteredFaqs.map((faq) => {
                  const isOpen = !!openIds[faq.id]
                  return (
                    <div
                      key={faq.id}
                      className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                        isOpen ? 'border-[#2563EB]/40 bg-white shadow-xs' : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.id)}
                        aria-expanded={isOpen}
                        className="flex w-full items-start justify-between gap-4 p-5 text-left transition-colors"
                      >
                        <div className="flex-1">
                          <span className="inline-block rounded-md bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-bold text-[#2563EB] uppercase tracking-wide">
                            {faq.categoryLabel}
                          </span>
                          <h3
                            className={`mt-2 font-heading text-sm sm:text-base font-bold transition-colors ${
                              isOpen ? 'text-[#2563EB]' : 'text-[#0F172A]'
                            }`}
                          >
                            {faq.q}
                          </h3>
                        </div>
                        <span
                          className={`flex size-7 shrink-0 items-center justify-center rounded-lg border transition-transform duration-200 ${
                            isOpen
                              ? 'rotate-180 border-[#2563EB]/25 bg-[#EFF6FF] text-[#2563EB]'
                              : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]'
                          }`}
                        >
                          <ChevronDown className="size-4" />
                        </span>
                      </button>

                      {isOpen && (
                        <div className="border-t border-[#F1F5F9] bg-[#F8FAFC]/50 px-5 pb-5 pt-3 animate-in fade-in-50 duration-150">
                          <p className="text-xs sm:text-sm leading-relaxed text-[#475569]">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* Tarjeta de ayuda directa */}
        <section className="border-t border-[#E2E8F0] bg-[#F8FAFC] py-16" aria-label="Ayuda personalizada">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
            <div className="rounded-3xl border border-[#DBEAFE] bg-gradient-to-br from-white to-[#EFF6FF] p-8 shadow-sm sm:p-10">
              <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2563EB]/10 px-3 py-1 text-xs font-bold text-[#2563EB]">
                    <Sparkles className="size-3.5" />
                    ¿Tu duda no está en la lista?
                  </span>
                  <h2 className="mt-3 font-heading text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl">
                    Habla directamente con nuestro equipo técnico
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#64748B]">
                    Escríbenos por WhatsApp o déjanos un mensaje. Te respondemos en menos de 2 horas en horario laboral.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`https://wa.me/${EMPRESA.telefono.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#2563EB] px-5 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
                  >
                    <MessageSquare className="size-4" />
                    WhatsApp directo
                  </Link>
                  <Link
                    href="/contacto"
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-5 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
                  >
                    <Mail className="size-4" />
                    Formulario de contacto
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
