import {
  resendCustomerVerification,
  setCustomerStatus,
  verifyCustomerManually,
} from '@fj-solutions/contracts/customer-accounts'
import { NextRequest, NextResponse } from 'next/server'
import { customersFailure, requireCustomersEditor } from '@/lib/customers/http'
import { deliverVerificationEmail } from '@/lib/customers/mailer'

export const dynamic = 'force-dynamic'

type RouteContext = { params: Promise<{ id: string }> }

const actions = ['verify', 'resend', 'block', 'activate'] as const
type Action = (typeof actions)[number]

function isAction(value: unknown): value is Action {
  return typeof value === 'string' && (actions as readonly string[]).includes(value)
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const guard = await requireCustomersEditor()
  if ('response' in guard) return guard.response

  const { id } = await context.params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, message: 'La solicitud no tiene un formato válido.' },
      { status: 400 },
    )
  }

  const action = (body as { action?: unknown } | null)?.action
  if (!isAction(action)) {
    return NextResponse.json(
      { success: false, message: 'Acción no reconocida para la cuenta web.' },
      { status: 400 },
    )
  }

  try {
    if (action === 'verify') {
      return NextResponse.json({
        success: true,
        data: { account: await verifyCustomerManually(id) },
      })
    }

    if (action === 'block') {
      return NextResponse.json({
        success: true,
        data: { account: await setCustomerStatus(id, 'blocked') },
      })
    }

    if (action === 'activate') {
      return NextResponse.json({
        success: true,
        data: { account: await setCustomerStatus(id, 'active') },
      })
    }

    const { account, email } = await resendCustomerVerification(id)
    const delivery = await deliverVerificationEmail(email)
    return NextResponse.json({ success: true, data: { account, delivery } })
  } catch (error) {
    return customersFailure(error)
  }
}
