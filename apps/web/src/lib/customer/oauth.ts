import type { ProviderProfile } from '@fj-solutions/contracts/customer-accounts'

// OAuth 2.0 sin SDK: el flujo de autorización y el intercambio de código se
// hacen a mano contra Google y Facebook. Los botones de la tienda se activan
// solo cuando las credenciales existen en el entorno.
export type OAuthProvider = 'google' | 'facebook'

export const OAUTH_STATE_COOKIE = 'fj_oauth_state'
export const OAUTH_STATE_PATH = '/api/customer/oauth'

export class OAuthError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

function googleConfig() {
  return {
    clientId: process.env.GOOGLE_CLIENT_ID ?? '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  }
}

function facebookConfig() {
  return {
    clientId: process.env.FACEBOOK_APP_ID ?? '',
    clientSecret: process.env.FACEBOOK_APP_SECRET ?? '',
  }
}

export function isProviderConfigured(provider: OAuthProvider) {
  const config = provider === 'google' ? googleConfig() : facebookConfig()
  return Boolean(config.clientId && config.clientSecret)
}

export function oauthAvailability(): Record<OAuthProvider, boolean> {
  return {
    google: isProviderConfigured('google'),
    facebook: isProviderConfigured('facebook'),
  }
}

function baseUrl(origin: string) {
  const configured = process.env.CUSTOMER_OAUTH_BASE_URL ?? process.env.NEXT_PUBLIC_STORE_URL
  return (configured || origin).replace(/\/+$/, '')
}

export function oauthRedirectUri(provider: OAuthProvider, origin: string) {
  return `${baseUrl(origin)}/api/customer/oauth/${provider}/callback`
}

export function buildAuthorizeUrl(provider: OAuthProvider, origin: string, state: string) {
  if (!isProviderConfigured(provider)) {
    throw new OAuthError(
      provider === 'google'
        ? 'El acceso con Google aún no está configurado.'
        : 'El acceso con Facebook aún no está configurado.',
      503
    )
  }
  const redirectUri = oauthRedirectUri(provider, origin)

  if (provider === 'google') {
    const params = new URLSearchParams({
      client_id: googleConfig().clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      prompt: 'select_account',
      access_type: 'online',
    })
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  const params = new URLSearchParams({
    client_id: facebookConfig().clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'email,public_profile',
    state,
  })
  return `https://www.facebook.com/v21.0/dialog/oauth?${params.toString()}`
}

export async function exchangeCode(
  provider: OAuthProvider,
  code: string,
  origin: string
): Promise<ProviderProfile> {
  if (provider === 'google') return exchangeGoogle(code, origin)
  return exchangeFacebook(code, origin)
}

async function exchangeGoogle(code: string, origin: string): Promise<ProviderProfile> {
  const { clientId, clientSecret } = googleConfig()
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: oauthRedirectUri('google', origin),
      grant_type: 'authorization_code',
    }),
    cache: 'no-store',
  })

  if (!tokenResponse.ok) throw new OAuthError('Google rechazó la autorización.', 401)
  const tokens = (await tokenResponse.json()) as { access_token?: string }
  if (!tokens.access_token) throw new OAuthError('Google no devolvió un token de acceso.', 401)

  const profileResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
    cache: 'no-store',
  })
  if (!profileResponse.ok) throw new OAuthError('No se pudo leer tu perfil de Google.', 401)

  const profile = (await profileResponse.json()) as {
    sub?: string
    email?: string
    email_verified?: boolean
    name?: string
  }

  if (!profile.sub || !profile.email) {
    throw new OAuthError('Tu cuenta de Google no comparte un correo electrónico.', 422)
  }
  if (profile.email_verified === false) {
    throw new OAuthError('Confirma el correo de tu cuenta de Google antes de continuar.', 422)
  }

  return {
    provider: 'google',
    providerId: profile.sub,
    email: profile.email,
    name: profile.name ?? '',
  }
}

async function exchangeFacebook(code: string, origin: string): Promise<ProviderProfile> {
  const { clientId, clientSecret } = facebookConfig()
  const tokenParams = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: oauthRedirectUri('facebook', origin),
    code,
  })
  const tokenResponse = await fetch(
    `https://graph.facebook.com/v21.0/oauth/access_token?${tokenParams.toString()}`,
    { cache: 'no-store' }
  )
  if (!tokenResponse.ok) throw new OAuthError('Facebook rechazó la autorización.', 401)
  const tokens = (await tokenResponse.json()) as { access_token?: string }
  if (!tokens.access_token) throw new OAuthError('Facebook no devolvió un token de acceso.', 401)

  const profileParams = new URLSearchParams({
    fields: 'id,name,email',
    access_token: tokens.access_token,
  })
  const profileResponse = await fetch(
    `https://graph.facebook.com/me?${profileParams.toString()}`,
    { cache: 'no-store' }
  )
  if (!profileResponse.ok) throw new OAuthError('No se pudo leer tu perfil de Facebook.', 401)

  const profile = (await profileResponse.json()) as {
    id?: string
    email?: string
    name?: string
  }

  if (!profile.id || !profile.email) {
    throw new OAuthError(
      'Tu cuenta de Facebook no comparte un correo electrónico verificado.',
      422
    )
  }

  return {
    provider: 'facebook',
    providerId: profile.id,
    email: profile.email,
    name: profile.name ?? '',
  }
}

export function providerLabel(provider: OAuthProvider) {
  return provider === 'google' ? 'Google' : 'Facebook'
}
