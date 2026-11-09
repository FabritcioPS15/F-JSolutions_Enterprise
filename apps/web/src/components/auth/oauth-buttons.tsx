import { FaFacebookF, FaGoogle } from 'react-icons/fa6'

// Los accesos sociales aparecen siempre, pero solo se pueden usar cuando el
// entorno tiene las credenciales del proveedor configuradas.
type Availability = { google: boolean; facebook: boolean }

const providers = [
  {
    id: 'google' as const,
    label: 'Continuar con Google',
    Icon: FaGoogle,
    className: 'border-[#E2E8F0] text-[#0F172A] hover:border-[#2563EB]/40 hover:bg-[#F8FAFC]',
  },
  {
    id: 'facebook' as const,
    label: 'Continuar con Facebook',
    Icon: FaFacebookF,
    className: 'border-[#E2E8F0] text-[#1877F2] hover:border-[#1877F2]/40 hover:bg-[#F8FAFC]',
  },
]

export function OAuthButtons({ availability, next }: { availability: Availability; next: string }) {
  const missing = providers.filter((provider) => !availability[provider.id])

  return (
    <div className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-2">
        {providers.map(({ id, label, Icon, className }) =>
          availability[id] ? (
            <a
              key={id}
              href={`/api/customer/oauth/${id}/start?next=${encodeURIComponent(next)}`}
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border bg-white px-3 text-sm font-semibold transition ${className}`}
            >
              <Icon aria-hidden="true" className="size-4" />
              {label}
            </a>
          ) : (
            <span
              key={id}
              aria-disabled="true"
              title="Disponible cuando se configuren las credenciales del proveedor."
              className="inline-flex h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] px-3 text-sm font-semibold text-[#94A3B8]"
            >
              <Icon aria-hidden="true" className="size-4 opacity-70" />
              {label}
            </span>
          )
        )}
      </div>
      {missing.length > 0 && (
        <p className="text-[11px] leading-4 text-[#94A3B8]">
          Los accesos con Google y Facebook se activan cuando la empresa configura sus
          credenciales. Mientras tanto, usa tu correo.
        </p>
      )}
    </div>
  )
}

export function AuthDivider({ label = 'o con tu correo' }: { label?: string }) {
  return (
    <div className="my-5 flex items-center gap-3" role="separator" aria-label={label}>
      <span className="h-px flex-1 bg-[#E2E8F0]" />
      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#94A3B8]">
        {label}
      </span>
      <span className="h-px flex-1 bg-[#E2E8F0]" />
    </div>
  )
}
