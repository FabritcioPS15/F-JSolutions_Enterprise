import { isEmail } from '@fj-solutions/contracts/domain'
import { NextRequest, NextResponse } from 'next/server'
import { authenticateLocalUser, createLocalSessionToken } from '@/lib/auth/local-auth'
import { applyLocalSessionCookie, isSecureRequest } from '@/lib/auth/session'
import { managedSessionUser, touchManagedUserLogin } from '@/lib/auth/user-store'

function isCrossOrigin(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (!origin) return false

  try {
    const originHost = new URL(origin).host
    // Detrás de un proxy el Host puede reescribirse; x-forwarded-host conserva
    // el nombre público con el que el navegador envió el formulario.
    const hosts = [request.headers.get('host'), request.headers.get('x-forwarded-host')]
      .flatMap((value) => value?.split(',') ?? [])
      .map((value) => value.trim())
      .filter(Boolean)

    return hosts.length > 0 && !hosts.includes(originHost)
  } catch {
    return true
  }
}

export async function POST(request: NextRequest) {
  if (isCrossOrigin(request)) {
    return NextResponse.json(
      { success: false, message: 'Origen no autorizado.' },
      { status: 403 },
    )
  }

  let payload: { email?: unknown; password?: unknown }

  try {
    payload = (await request.json()) as { email?: unknown; password?: unknown }
  } catch {
    return NextResponse.json(
      { success: false, message: 'La solicitud no tiene un formato válido.' },
      { status: 400 },
    )
  }

  const email = typeof payload.email === 'string' ? payload.email.trim().slice(0, 160) : ''
  const password = typeof payload.password === 'string' ? payload.password : ''

  if (!isEmail(email) || password.length === 0) {
    return NextResponse.json(
      { success: false, message: 'Ingresa tu correo y contraseña.' },
      { status: 400 },
    )
  }

  // Validación local: solo cuentas creadas por el superadministrador y la
  // cuenta base configurada con variables de entorno pueden ingresar.
  const auth = await authenticateLocalUser(email, password)
  if (!auth.ok) {
    return NextResponse.json(
      {
        success: false,
        message:
          auth.reason === 'disabled'
            ? 'Tu cuenta está desactivada. Contacta al superadministrador.'
            : 'Credenciales incorrectas.',
      },
      { status: auth.reason === 'disabled' ? 403 : 401 },
    )
  }

  const userId = auth.userId
  await touchManagedUserLogin(userId)
  const user = await managedSessionUser(userId)
  if (!user) {
    return NextResponse.json(
      { success: false, message: 'La cuenta no tiene acceso al panel.' },
      { status: 403 },
    )
  }

  const response = NextResponse.json({
    success: true,
    data: { user },
  })

  applyLocalSessionCookie(response, createLocalSessionToken(userId), {
    secure: isSecureRequest(request),
  })
  return response
}
