export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">
              Panel de Administración
            </h1>
            <p className="text-[var(--muted-foreground)]">
              Bienvenido al panel de administración de FJ Solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                  Productos
                </h2>
                <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <p className="text-[var(--muted-foreground)] text-sm mb-4">
                Gestiona el catálogo de productos
              </p>
              <div className="text-[var(--primary)] text-sm font-medium">
                Ver productos →
              </div>
            </div>

            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                  Categorías
                </h2>
                <div className="w-10 h-10 bg-[var(--accent)]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
              <p className="text-[var(--muted-foreground)] text-sm mb-4">
                Organiza tus productos por categorías
              </p>
              <div className="text-[var(--accent)] text-sm font-medium">
                Ver categorías →
              </div>
            </div>

            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                  Pedidos
                </h2>
                <div className="w-10 h-10 bg-[var(--teal-green)]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--teal-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
              <p className="text-[var(--muted-foreground)] text-sm mb-4">
                Gestiona los pedidos de clientes
              </p>
              <div className="text-[var(--teal-green)] text-sm font-medium">
                Ver pedidos →
              </div>
            </div>

            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                  Clientes
                </h2>
                <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-[var(--muted-foreground)] text-sm mb-4">
                Administra la base de clientes
              </p>
              <div className="text-[var(--primary)] text-sm font-medium">
                Ver clientes →
              </div>
            </div>

            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                  Cotizaciones
                </h2>
                <div className="w-10 h-10 bg-[var(--electric-cyan)]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--electric-cyan)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-[var(--muted-foreground)] text-sm mb-4">
                Revisa y gestiona las cotizaciones
              </p>
              <div className="text-[var(--electric-cyan)] text-sm font-medium">
                Ver cotizaciones →
              </div>
            </div>

            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                  Inventario
                </h2>
                <div className="w-10 h-10 bg-[var(--accent)]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <p className="text-[var(--muted-foreground)] text-sm mb-4">
                Controla el stock de productos
              </p>
              <div className="text-[var(--accent)] text-sm font-medium">
                Ver inventario →
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
