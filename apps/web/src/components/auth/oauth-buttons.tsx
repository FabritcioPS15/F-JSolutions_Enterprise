import { FaFacebookF, FaGoogle } from 'react-icons/fa6'

// Los accesos sociales aparecen siempre, pero solo se pueden usar cuando el
// entorno tiene las credenciales del proveedor configuradas.
type Availability = { google: boolean; facebook: boolean }

const providers = [
  {
    id: 'google' as const,
    label: 'Continuar con Google',
    short: 'Google',
    Icon: FaGoogle,
    className: 'border-border text-foreground hover:border-[#2563EB]/40 hover:bg-muted',
  },
  {
    id: 'facebook' as const,
    label: 'Continuar con Facebook',
    short: 'Facebook',
    Icon: FaFacebookF,
    className: 'border-border text-[#1877F2] hover:border-[#1877F2]/40 hover:bg-muted',
  },
]

export function OAuthButtons({ availability, next }: { availability: Availability; next: string }) {
  const missing = providers.filter((provider) => !availability[provider.id])

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {providers.map(({ id, label, short, Icon, className }) =>
          availability[id] ? (
            <a
              key={id}
              href={`/api/customer/oauth/${id}/start?next=${encodeURIComponent(next)}`}
              aria-label={label}
              className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border bg-card px-2 text-[13px] font-semibold transition sm:px-3 sm:text-sm ${className}`}
            >
              <Icon aria-hidden="true" className="size-4" />
              <span className="sm:hidden">{short}</span>
              <span className="hidden sm:inline">{label}</span>
            </a>
          ) : (
            <span
              key={id}
              aria-disabled="true"
              title="Disponible cuando se configuren las credenciales del proveedor."
              className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted px-2 text-[13px] font-semibold text-muted-foreground sm:px-3 sm:text-sm"
            >
              <Icon aria-hidden="true" className="size-4 opacity-70" />
              <span className="sm:hidden">{short}</span>
              <span className="hidden sm:inline">{label}</span>
            </span>
          )
        )}
      </div>
      {missing.length > 0 && (
        <p className="hidden text-[11px] leading-4 text-muted-foreground sm:block">
          Google y Facebook se activan cuando se configuren las credenciales.
        </p>
      )}
    </div>
  )
}

export function AuthDivider({ label = 'o con tu correo' }: { label?: string }) {
  return (
    <div className="my-2 flex items-center gap-3 sm:my-3" role="separator" aria-label={label}>
      <span className="h-px flex-1 bg-border" />
      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}
