const bar = 'animate-pulse rounded-full bg-[#0F172A]/10 motion-reduce:animate-none'

export function PageSkeleton({ showBody = true }: { showBody?: boolean }) {
  return (
    <main aria-busy="true" className="min-h-screen bg-card text-foreground">
      <p className="sr-only" role="status">
        Cargando la página…
      </p>

      <div className="sticky top-0 z-50 w-full border-b border-border bg-card">
        <div className="mx-auto flex h-[calc(var(--site-header-height)-1px)] max-w-[1400px] items-center gap-3 px-3 sm:px-4 lg:px-8">
          <div className={`${bar} h-9 w-36 rounded-lg`} />
          <div className="ml-auto hidden items-center gap-5 lg:flex">
            <div className={`${bar} h-3 w-14`} />
            <div className={`${bar} h-3 w-20`} />
            <div className={`${bar} h-3 w-24`} />
            <div className={`${bar} h-3 w-28`} />
            <div className={`${bar} h-3 w-24`} />
          </div>
          <div className={`${bar} ml-auto h-10 w-32 rounded-xl lg:ml-6`} />
        </div>
      </div>

      {showBody && (
        <>
          <section className="border-b border-border bg-gradient-to-br from-[#F1F6FA] via-white to-[#E7F4FB]">
        <div className="mx-auto flex min-h-[calc(100svh-var(--site-header-height))] max-w-[1280px] items-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className={`${bar} h-3 w-40`} />
              <div className={`${bar} mt-5 h-10 w-full max-w-xl rounded-xl`} />
              <div className={`${bar} mt-3 h-10 w-3/4 max-w-md rounded-xl`} />
              <div className={`${bar} mt-6 h-4 w-full max-w-lg`} />
              <div className={`${bar} mt-3 h-4 w-2/3 max-w-md`} />
              <div className="mt-8 flex flex-wrap gap-3">
                <div className={`${bar} h-11 w-40 rounded-xl bg-[#1769AA]/25`} />
                <div className={`${bar} h-11 w-32 rounded-xl`} />
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                <div className={`${bar} h-6 w-32 rounded-full`} />
                <div className={`${bar} h-6 w-40 rounded-full`} />
                <div className={`${bar} h-6 w-28 rounded-full`} />
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="aspect-[4/3] animate-pulse rounded-[28px] border border-border bg-card/80 motion-reduce:animate-none" />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className={`${bar} h-3 w-36`} />
          <div className={`${bar} mt-4 h-8 w-80 max-w-full rounded-xl`} />
          <div className={`${bar} mt-4 h-4 w-full max-w-xl`} />
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-2xl border border-border bg-muted p-6">
                <div className={`${bar} size-10 rounded-xl`} />
                <div className={`${bar} mt-5 h-4 w-3/4`} />
                <div className={`${bar} mt-3 h-3 w-full`} />
                <div className={`${bar} mt-2 h-3 w-5/6`} />
                <div className={`${bar} mt-5 h-3 w-24`} />
              </div>
            ))}
          </div>
        </div>
      </section>
        </>
      )}
    </main>
  )
}
