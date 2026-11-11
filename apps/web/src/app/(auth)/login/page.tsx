import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/auth/login-form'
import { devAccessEnabled } from '@/lib/customer/dev-access'
import { safeNextPath } from '@/lib/customer/http'
import { oauthAvailability } from '@/lib/customer/oauth'
import { getCustomerSession } from '@/lib/customer/session'

export const metadata: Metadata = {
  title: 'Iniciar sesión | F&J Systems',
  description: 'Accede a tu cuenta de cliente para revisar tus cotizaciones y favoritos.',
  robots: { index: false, follow: true },
}

type Notice = { tone: 'success' | 'error'; title: string; message?: string }

function readParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key]
  return typeof value === 'string' ? value : ''
}

function buildNotice(params: Record<string, string | string[] | undefined>): Notice | null {
  if (readParam(params, 'verificado') === '1') {
    return {
      tone: 'success',
      title: 'Correo confirmado',
      message: 'Tu cuenta está activa. Ingresa con tu correo y contraseña.',
    }
  }

  const verification = readParam(params, 'verificacion')
  if (verification === 'expirada') {
    return {
      tone: 'error',
      title: 'El enlace venció',
      message: 'Pide un enlace nuevo desde "Reenviar enlace de confirmación" o regístrate otra vez.',
    }
  }
  if (verification === 'invalida' || verification === 'error') {
    return {
      tone: 'error',
      title: 'No pudimos confirmar el correo',
      message: 'El enlace no es válido o ya fue usado. Solicita uno nuevo desde tu cuenta.',
    }
  }

  const devAccess = readParam(params, 'acceso')
  if (devAccess === 'error' || devAccess === 'invalido') {
    return {
      tone: 'error',
      title: 'No pudimos abrir el acceso de prueba',
      message: 'Revisa la consola del servidor e inténtalo otra vez.',
    }
  }

  return null
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const next = safeNextPath(readParam(params, 'next'))
  const email = readParam(params, 'correo').slice(0, 160)
  const oauthError = readParam(params, 'oauth') === 'error' ? readParam(params, 'motivo') || 'fallo' : null

  const session = await getCustomerSession()
  if (session) redirect(next)

  return (
    <LoginForm
      next={next}
      initialEmail={email}
      notice={buildNotice(params)}
      availability={oauthAvailability()}
      oauthError={oauthError}
      devAccess={devAccessEnabled()}
    />
  )
}
