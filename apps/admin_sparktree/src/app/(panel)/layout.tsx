import { redirect } from 'next/navigation'
import { AdminProvider } from '@/components/admin/admin-provider'
import { AdminShell } from '@/components/admin/admin-shell'
import { ToastProvider } from '@/components/admin/toast'
import { getSessionUser } from '@/lib/auth/session'

export default async function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getSessionUser()
  if (!user) redirect('/login')

  return (
    // ToastProvider va por fuera: el provider de datos necesita el aviso para
    // explicar por qué el rol bloqueó una mutación.
    <ToastProvider>
      <AdminProvider session={user}>
        <AdminShell user={user}>{children}</AdminShell>
      </AdminProvider>
    </ToastProvider>
  )
}
