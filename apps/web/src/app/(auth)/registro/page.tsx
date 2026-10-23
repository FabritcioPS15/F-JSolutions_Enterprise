import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Registro | FJ Tech Solutions',
}

export default function RegistroPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
      <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-[#0F172A]">Crear cuenta</h1>
        <p className="mt-2 text-sm text-[#64748B]">Próximamente: formulario de registro.</p>
      </div>
    </main>
  )
}
