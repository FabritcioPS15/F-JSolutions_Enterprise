'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  Shield,
  UserCheck,
  Users,
  X,
} from 'lucide-react'
import { useAdmin } from '@/components/admin/admin-provider'
import { Modal } from '@/components/admin/modal'
import { useToast } from '@/components/admin/toast'
import {
  EmptyState,
  PageHeader,
  SectionCard,
  StatCard,
  btnPrimary,
  btnSecondary,
  inputClass,
  textareaClass,
} from '@/components/admin/ui'
import { formatNumber } from '@/lib/admin/format'
import { cn } from '@/lib/utils'

export type OrgDepartment = {
  id: string
  code: string
  name: string
  description: string
  managerName: string
  managerEmail: string
  managerPhone: string
  memberCount: number
  modules: string[]
  status: 'active' | 'reorganizing'
}

const defaultDepartments: OrgDepartment[] = [
  {
    id: 'dep-1',
    code: 'GG-01',
    name: 'Gerencia General & Estrategia',
    description: 'Dirección ejecutiva, gobernanza corporativa, alianzas de alto nivel y finanzas maestras.',
    managerName: 'Fabritcio Peña',
    managerEmail: 'fabpsandoval@gmail.com',
    managerPhone: '+51 923 055 963',
    memberCount: 2,
    modules: ['General', 'Sistema', 'Seguridad', 'Auditoría'],
    status: 'active',
  },
  {
    id: 'dep-2',
    code: 'TI-02',
    name: 'Ingeniería TI & Infraestructura',
    description: 'Redes empresariales, servidores, cableado estructurado, cloud y soporte perimetral.',
    managerName: 'Ing. Sistemas SparkTree',
    managerEmail: 'soporte@fjsolutions.pe',
    managerPhone: '+51 923 055 963',
    memberCount: 5,
    modules: ['Servicios TI', 'Proyectos web', 'Linkeador'],
    status: 'active',
  },
  {
    id: 'dep-3',
    code: 'SW-03',
    name: 'Desarrollo de Software & Web',
    description: 'Arquitectura de software, aplicaciones multiplataforma, AllMyLinks y proyectos cloud.',
    managerName: 'Líder Desarrollo',
    managerEmail: 'dev@fjsolutions.pe',
    managerPhone: '+51 923 055 963',
    memberCount: 4,
    modules: ['Proyectos web', 'Linkeador', 'Integraciones'],
    status: 'active',
  },
  {
    id: 'dep-4',
    code: 'COM-04',
    name: 'Comercial & Ventas Corporativas',
    description: 'Atención a clientes empresariales, licitaciones de hardware, pedidos y cotizaciones.',
    managerName: 'Coordinador Comercial',
    managerEmail: 'ventas@fjsolutions.pe',
    managerPhone: '+51 923 055 963',
    memberCount: 6,
    modules: ['Cotizaciones', 'Pedidos', 'Directorio de clientes', 'Catálogo'],
    status: 'active',
  },
  {
    id: 'dep-5',
    code: 'SAT-05',
    name: 'Soporte Técnico & Mesa de Ayuda',
    description: 'Mesa de partes, atención posventa, garantías de hardware y libro de reclamaciones.',
    managerName: 'Jefe de Soporte',
    managerEmail: 'ayuda@fjsolutions.pe',
    managerPhone: '+51 923 055 963',
    memberCount: 3,
    modules: ['Mesa de ayuda', 'Reclamaciones', 'Servicios'],
    status: 'active',
  },
  {
    id: 'dep-6',
    code: 'LOG-06',
    name: 'Logística, Compras & Almacén',
    description: 'Gestión de existencias físicas, órdenes con proveedores mayoristas y control de stock.',
    managerName: 'Supervisor de Almacén',
    managerEmail: 'almacen@fjsolutions.pe',
    managerPhone: '+51 923 055 963',
    memberCount: 3,
    modules: ['Inventario y stock', 'Proveedores', 'Catálogo'],
    status: 'active',
  },
]

export function OrganizationAreasView() {
  const { users } = useAdmin()
  const toast = useToast()
  const [departments, setDepartments] = useState<OrgDepartment[]>(defaultDepartments)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDept, setEditingDept] = useState<OrgDepartment | null>(null)
  const [formName, setFormName] = useState('')
  const [formCode, setFormCode] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formManager, setFormManager] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPhone, setFormPhone] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return departments
    return departments.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.managerName.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
    )
  }, [departments, query])

  const totalMembers = useMemo(() => {
    return departments.reduce((acc, d) => acc + d.memberCount, 0)
  }, [departments])

  function handleOpenCreate() {
    setEditingDept(null)
    setFormName('')
    setFormCode(`DEP-0${departments.length + 1}`)
    setFormDesc('')
    setFormManager(users[0]?.name ?? '')
    setFormEmail(users[0]?.email ?? '')
    setFormPhone('')
    setModalOpen(true)
  }

  function handleOpenEdit(dept: OrgDepartment) {
    setEditingDept(dept)
    setFormName(dept.name)
    setFormCode(dept.code)
    setFormDesc(dept.description)
    setFormManager(dept.managerName)
    setFormEmail(dept.managerEmail)
    setFormPhone(dept.managerPhone)
    setModalOpen(true)
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!formName.trim() || !formManager.trim()) {
      toast.error('Campos incompletos', 'Indica el nombre del área y el responsable.')
      return
    }

    if (editingDept) {
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === editingDept.id
            ? {
                ...d,
                name: formName.trim(),
                code: formCode.trim(),
                description: formDesc.trim(),
                managerName: formManager.trim(),
                managerEmail: formEmail.trim(),
                managerPhone: formPhone.trim(),
              }
            : d
        )
      )
      toast.success('Área actualizada', formName)
    } else {
      const newD: OrgDepartment = {
        id: `dep-${Date.now()}`,
        code: formCode.trim() || `DEP-0${departments.length + 1}`,
        name: formName.trim(),
        description: formDesc.trim(),
        managerName: formManager.trim(),
        managerEmail: formEmail.trim(),
        managerPhone: formPhone.trim(),
        memberCount: 1,
        modules: ['General'],
        status: 'active',
      }
      setDepartments((prev) => [...prev, newD])
      toast.success('Área creada con éxito', formName)
    }
    setModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sistema"
        title="Áreas organizacionales"
        description="Estructura de departamentos, unidades funcionales y líderes de área de SparkTree Group."
        actions={
          <button type="button" className={btnPrimary} onClick={handleOpenCreate}>
            <Plus className="size-4" aria-hidden="true" />
            Nueva área
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Áreas corporativas"
          value={formatNumber(departments.length)}
          helper="Unidades operativas activas"
          icon={Building2}
        />
        <StatCard
          label="Líderes de departamento"
          value={formatNumber(departments.length)}
          helper="Con jefatura y cuenta asignada"
          icon={UserCheck}
        />
        <StatCard
          label="Colaboradores asignados"
          value={formatNumber(totalMembers)}
          helper="En plantilla y proyectos"
          icon={Users}
        />
        <StatCard
          label="Usuarios en el panel"
          value={formatNumber(users.length)}
          helper="Con acceso al sistema administrativo"
          icon={Shield}
          href="/usuarios"
        />
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por departamento o responsable…"
              className={cn(inputClass, 'pl-9 pr-8 text-xs')}
              aria-label="Buscar áreas"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 grid size-4 -translate-y-1/2 place-items-center text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          <p className="text-xs font-semibold text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? 'área listada' : 'áreas listadas'}
          </p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Sin áreas que coincidan"
          description="No se encontraron departamentos con el término de búsqueda ingresado."
          action={
            <button type="button" className={btnSecondary} onClick={() => setQuery('')}>
              Limpiar búsqueda
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((dept) => (
            <div
              key={dept.id}
              className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition hover:border-[#5946A6]/40 hover:shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-tint-brand text-brand-ink ring-1 ring-[#5946A6]/20">
                    <Building2 className="size-5" aria-hidden="true" />
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-md border border-border bg-muted/60 px-2 py-0.5 font-mono text-[10px] font-bold text-foreground">
                      {dept.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(dept)}
                      className="grid size-7 place-items-center rounded-lg text-slate-400 transition hover:bg-muted hover:text-foreground"
                      title="Editar departamento"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="mt-3.5 text-sm font-bold text-foreground">{dept.name}</h3>
                <p className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground">
                  {dept.description}
                </p>

                <div className="mt-4 rounded-xl border border-border/60 bg-muted/30 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Líder responsable
                  </p>
                  <p className="mt-0.5 text-xs font-bold text-foreground">{dept.managerName}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="size-3 text-slate-400" />
                      {dept.managerEmail}
                    </span>
                    {dept.managerPhone && (
                      <span className="inline-flex items-center gap-1">
                        <Phone className="size-3 text-slate-400" />
                        {dept.managerPhone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Módulos vinculados
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {dept.modules.map((m) => (
                      <span
                        key={m}
                        className="rounded-md bg-muted px-2 py-0.5 text-[10.5px] font-medium text-slate-300"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3 text-[11px]">
                <span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground">
                  <Users className="size-3.5 text-slate-400" />
                  {dept.memberCount} colaboradores
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                  <CheckCircle2 className="size-3" />
                  Área activa
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingDept ? 'Editar área organizacional' : 'Nueva área organizacional'}
          description="Define el departamento corporativo y designa al responsable a cargo."
        >
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-foreground">Nombre del área / departamento</label>
              <input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ej. Ciberseguridad & Redes"
                className={cn(inputClass, 'mt-1 text-xs')}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground">Código de área</label>
                <input
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  placeholder="Ej. SEC-07"
                  className={cn(inputClass, 'mt-1 font-mono text-xs')}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground">Responsable</label>
                <input
                  value={formManager}
                  onChange={(e) => setFormManager(e.target.value)}
                  placeholder="Nombre y apellido"
                  className={cn(inputClass, 'mt-1 text-xs')}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground">Correo de contacto</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="area@fjsolutions.pe"
                  className={cn(inputClass, 'mt-1 text-xs')}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground">Teléfono / Anexo</label>
                <input
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="+51 923 055 963"
                  className={cn(inputClass, 'mt-1 text-xs')}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground">Funciones principales</label>
              <textarea
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Descripción de tareas y alcance del departamento..."
                rows={3}
                className={cn(textareaClass, 'mt-1 text-xs')}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={btnSecondary} onClick={() => setModalOpen(false)}>
                Cancelar
              </button>
              <button type="submit" className={btnPrimary}>
                {editingDept ? 'Guardar cambios' : 'Crear área'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
