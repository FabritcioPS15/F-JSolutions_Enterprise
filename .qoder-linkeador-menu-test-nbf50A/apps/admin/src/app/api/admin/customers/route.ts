import { listCustomerAccounts, listOutboxEmails } from '@fj-solutions/contracts/customer-accounts'
import { NextResponse } from 'next/server'
import { customersFailure, requireCustomersViewer } from '@/lib/customers/http'

export const dynamic = 'force-dynamic'

// Cuentas creadas por los clientes en la tienda. El panel no las crea: solo
// las consulta, reenvía confirmaciones y controla el acceso.
export async function GET() {
  const guard = await requireCustomersViewer()
  if ('response' in guard) return guard.response

  try {
    const [accounts, outbox] = await Promise.all([listCustomerAccounts(), listOutboxEmails(40)])
    return NextResponse.json({ success: true, data: { accounts, outbox } })
  } catch (error) {
    return customersFailure(error)
  }
}
