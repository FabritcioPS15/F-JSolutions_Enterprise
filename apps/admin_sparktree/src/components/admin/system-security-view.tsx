'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  CheckCircle2,
  Globe2,
  KeyRound,
  Laptop,
  Lock,
  LogOut,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  UserCheck,
  Users,
} from 'lucide-react'
import { useAdmin } from '@/components/admin/admin-provider'
import { useToast } from '@/components/admin/toast'
import {
  EmptyState,
  PageHeader,
  SectionCard,
  StatCard,
  StatusToggle,
  btnPrimary,
  btnSecondary,
} from '@/components/admin/ui'
import { formatDateTime, formatNumber } from '@/lib/admin/format'
import { cn } from '@/lib/utils'

type ActiveSession = {
  id: string
  device: string
  type: 'desktop' | 'mobile'
  browser: string
  ip: string
  location: string
  lastActive: string
  current: boolean
  userEmail: string
  userName: string
}

const initialSessions: ActiveSession[] = [
  {
    id: 'sess-1',
    device: 'Windows 11 PC (Principal)',
    type: 'desktop',
    browser: 'Chrome 131',
    ip: '190.235.14.82',
    location: 'Lima, Perú',
    lastActive: 'Ahora mismo',
    current: true,
    userEmail: 'fabpsandoval@gmail.com',
    userName: 'Fabritcio Peña',
  },
  {
    id: 'sess-2',
    device: 'iPhone 15 Pro',
    type: 'mobile',
    browser: 'Safari Mobile',
    ip: '190.235.14.82',
    location: 'Lima, Perú',
    lastActive: 'Hace 45 minutos',
    current: false,
    userEmail: 'fabpsandoval@gmail.com',
    userName: 'Fabritcio Peña',
  },
  {
    id: 'sess-3',
    device: 'MacBook Air M2',
    type: 'desktop',
    browser: 'Edge 128',
    ip: '190.235.88.19',
    location: 'Arequipa, Perú',
    lastActive: 'Hace 3 horas',
    current: false,
    userEmail: 'ventas@fjsolutions.pe',
    userName: 'Ventas Corporativas',
  },
]

export function SystemSecurityView() {
  const { users } = useAdmin()
  const toast = useToast()
  const [sessions, setSessions] = useState<ActiveSession[]>(initialSessions)
  const [require2FAAdmins, setRequire2FAAdmins] = useState(true)
  const [lockoutAfter5, setLockoutAfter5] = useState(true)
  const [sessionTimeout30m, setSessionTimeout30m] = useState(true)
  const [minPasswordLength10, setMinPasswordLength10] = useState(true)

  const usersWith2FA = useMemo(() => {
    return users.filter((u) => u.twoFactorEnabled).length
  }, [users])

  const coveragePercent = useMemo(() => {
    if (users.length === 0) return 100
    return Math.round((usersWith2FA / users.length) * 100)
  }, [users, usersWith2FA])

  function handleRevokeSession(id: string, name: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id))
    toast.success('Sesión revocada', `Se cerró el acceso en ${name}.`)
  }

  function handleRevokeAllOthers() {
    setSessions((prev) => prev.filter((s) => s.current))
    toast.success('Sesiones finalizadas', 'Todas las demás sesiones remotas fueron cerradas.')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sistema"
        title="Seguridad y control de acceso"
        description="Gestión de sesiones activas, autenticación de dos factores (2FA), políticas de contraseñas y auditoría de accesos."
        actions={
          <button type="button" className={btnSecondary} onClick={handleRevokeAllOthers}>
            <LogOut className="size-4" aria-hidden="true" />
            Cerrar otras sesiones
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Sesiones activas"
          value={formatNumber(sessions.length)}
          helper="En dispositivos verificados"
          icon={Laptop}
        />
        <StatCard
          label="Cobertura 2FA"
          value={`${coveragePercent}%`}
          helper={`${usersWith2FA} de ${users.length} cuentas protegidas`}
          icon={ShieldCheck}
        />
        <StatCard
          label="Intentos bloqueados"
          value="0 hoy"
          helper="Protección anti-fuerza bruta activa"
          icon={ShieldAlert}
        />
        <StatCard
          label="Puntuación de seguridad"
          value="95 / 100"
          helper="Políticas de acceso óptimas"
          icon={Shield}
        />
      </div>

      <SectionCard
        title="Sesiones activas en el panel"
        description="Dispositivos y navegadores que tienen acceso actualmente con las credenciales de los usuarios."
        icon={Laptop}
        action={
          <span className="text-[11px] font-semibold text-muted-foreground">
            {sessions.length} dispositivos conectados
          </span>
        }
      >
        <div className="divide-y divide-border -mx-4 -my-2">
          {sessions.map((sess) => (
            <div key={sess.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-tint-brand text-brand-ink ring-1 ring-[#5946A6]/20">
                  {sess.type === 'mobile' ? (
                    <Smartphone className="size-4" />
                  ) : (
                    <Laptop className="size-4" />
                  )}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-foreground">{sess.device}</p>
                    {sess.current && (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9.5px] font-bold text-success-ink ring-1 ring-emerald-500/20">
                        Sesión actual
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {sess.userName} ({sess.userEmail}) · <span className="font-mono">{sess.browser}</span>
                  </p>
                  <p className="mt-0.5 text-[10.5px] text-slate-400">
                    IP {sess.ip} · {sess.location} · {sess.lastActive}
                  </p>
                </div>
              </div>

              {!sess.current && (
                <button
                  type="button"
                  onClick={() => handleRevokeSession(sess.id, sess.device)}
                  className="inline-flex self-start sm:self-auto items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-danger-ink transition hover:bg-red-500/15"
                >
                  <LogOut className="size-3" />
                  Revocar sesión
                </button>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-5 md:grid-cols-2">
        <SectionCard
          title="Políticas de acceso y credenciales"
          description="Normativas de seguridad aplicadas a todos los usuarios del sistema."
          icon={KeyRound}
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3">
              <div>
                <p className="text-xs font-bold text-foreground">Exigir 2FA a Administradores</p>
                <p className="text-[11px] text-muted-foreground">
                  Obliga a usar código de verificación por correo o app en cuentas clave.
                </p>
              </div>
              <StatusToggle
                active={require2FAAdmins}
                onToggle={() => setRequire2FAAdmins((prev) => !prev)}
                label="Exigir 2FA a Administradores"
              />
            </div>

            <div className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3">
              <div>
                <p className="text-xs font-bold text-foreground">Bloqueo tras 5 intentos erróneos</p>
                <p className="text-[11px] text-muted-foreground">
                  Suspende temporalmente el acceso por 15 minutos ante ataques de fuerza bruta.
                </p>
              </div>
              <StatusToggle
                active={lockoutAfter5}
                onToggle={() => setLockoutAfter5((prev) => !prev)}
                label="Bloqueo tras 5 intentos erróneos"
              />
            </div>

            <div className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3">
              <div>
                <p className="text-xs font-bold text-foreground">Cierre de sesión por inactividad</p>
                <p className="text-[11px] text-muted-foreground">
                  Finaliza la sesión del panel tras 30 minutos sin interacción.
                </p>
              </div>
              <StatusToggle
                active={sessionTimeout30m}
                onToggle={() => setSessionTimeout30m((prev) => !prev)}
                label="Cierre de sesión por inactividad"
              />
            </div>

            <div className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3">
              <div>
                <p className="text-xs font-bold text-foreground">Contraseña mínima de 10 caracteres</p>
                <p className="text-[11px] text-muted-foreground">
                  Exige combinación de mayúsculas, minúsculas, números y símbolos.
                </p>
              </div>
              <StatusToggle
                active={minPasswordLength10}
                onToggle={() => setMinPasswordLength10((prev) => !prev)}
                label="Contraseña mínima de 10 caracteres"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Autenticación en dos factores (2FA)"
          description="Monitoreo del estado de protección por cada miembro del equipo."
          icon={ShieldCheck}
          action={
            <Link href="/usuarios" className={btnSecondary}>
              Gestionar usuarios
            </Link>
          }
        >
          <div className="space-y-3">
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-400" />
                <p className="text-xs font-bold text-success-ink">Protección perimetral activada</p>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                Las sesiones del panel se validan con tokens de autenticación firmados y cookies seguras HttpOnly con SameSite=Lax.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-3">
              <p className="text-xs font-bold text-foreground">Resumen de usuarios con 2FA</p>
              <div className="mt-2.5 space-y-2">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center justify-between text-xs">
                    <span className="truncate text-foreground font-medium">{u.name}</span>
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-2 py-0.5 text-[9.5px] font-bold',
                        u.twoFactorEnabled
                          ? 'bg-emerald-500/10 text-success-ink'
                          : 'bg-amber-500/10 text-warning-ink'
                      )}
                    >
                      {u.twoFactorEnabled ? '2FA Activo' : 'Sin 2FA'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
