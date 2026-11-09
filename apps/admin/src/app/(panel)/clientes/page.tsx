'use client'

import { useState } from 'react'
import { Building2, Globe } from 'lucide-react'
import { ClientsView } from '@/components/admin/clients-view'
import { WebAccountsView } from '@/components/admin/web-accounts-view'
import { cn } from '@/lib/utils'

type Tab = 'directorio' | 'cuentas'

const tabs: { id: Tab; label: string; icon: typeof Building2 }[] = [
  { id: 'directorio', label: 'Directorio', icon: Building2 },
  { id: 'cuentas', label: 'Cuentas web', icon: Globe },
]

export default function ClientesPage() {
  const [tab, setTab] = useState<Tab>('directorio')

  return (
    <div className="space-y-5">
      <div
        role="tablist"
        aria-label="Secciones de clientes"
        className="flex w-fit flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-xs"
      >
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = tab === id
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(id)}
              className={cn(
                'inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-sm font-semibold transition',
                active
                  ? 'bg-[#5B21B6] text-white shadow-sm shadow-[#5B21B6]/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </button>
          )
        })}
      </div>

      {tab === 'directorio' ? <ClientsView /> : <WebAccountsView />}
    </div>
  )
}
