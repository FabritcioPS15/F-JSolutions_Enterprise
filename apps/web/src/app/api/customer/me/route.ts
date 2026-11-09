import { getCustomerSession } from '@/lib/customer/session'
import { failure } from '@/lib/customer/http'
import { NextResponse } from 'next/server'

export async function GET() {
  const customer = await getCustomerSession()
  if (!customer) return failure('No hay una sesión activa.', 401)
  return NextResponse.json({ success: true, data: { customer } })
}
