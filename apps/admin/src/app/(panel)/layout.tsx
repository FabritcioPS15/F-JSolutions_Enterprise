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
    <AdminProvider>
      <ToastProvider>
        <AdminShell user={user}>{children}</AdminShell>
      </ToastProvider>
    </AdminProvider>
  )
}
