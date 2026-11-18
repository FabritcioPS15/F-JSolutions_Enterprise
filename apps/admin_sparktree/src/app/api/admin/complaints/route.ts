import {
  complaintDeadlineDays,
  listComplaints,
} from '@fj-solutions/contracts/complaints-book'
import { NextResponse } from 'next/server'
import { complaintsFailure, guardComplaints } from '@/lib/complaints/http'

export const dynamic = 'force-dynamic'

// Reclamos registrados desde la tienda en /libro-de-reclamaciones. El panel solo
// los consulta y responde; la creación ocurre siempre en el sitio público.
export async function GET() {
  const guard = await guardComplaints('view')
  if (!guard.ok) return guard.response

  try {
    const complaints = await listComplaints()
    return NextResponse.json({
      success: true,
      data: { complaints, deadlineDays: complaintDeadlineDays() },
    })
  } catch (error) {
    return complaintsFailure(error)
  }
}
