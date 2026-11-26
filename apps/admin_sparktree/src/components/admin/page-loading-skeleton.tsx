import { cn } from '@/lib/utils'

const skeleton = 'animate-pulse rounded-lg bg-muted motion-reduce:animate-none'

export function PageLoadingSkeleton() {
  return (
    <div aria-hidden="true" className="min-h-[60vh] space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="w-full max-w-xl space-y-3">
          <div className={cn(skeleton, 'h-3 w-24')} />
          <div className={cn(skeleton, 'h-8 w-3/4 sm:w-96')} />
          <div className={cn(skeleton, 'h-3.5 w-full sm:w-4/5')} />
          <div className={cn(skeleton, 'hidden h-3.5 w-2/3 sm:block')} />
        </div>
        <div className={cn(skeleton, 'hidden h-10 w-36 shrink-0 sm:block')} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs"
          >
            <div className="flex items-center justify-between gap-3">
              <div className={cn(skeleton, 'h-3 w-28')} />
              <div className={cn(skeleton, 'size-9 rounded-xl')} />
            </div>
            <div className={cn(skeleton, 'mt-4 h-7 w-24')} />
            <div className={cn(skeleton, 'mt-2 h-3 w-4/5')} />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className={cn(skeleton, 'h-10 w-full sm:w-80')} />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className={cn(skeleton, index === 3 ? 'hidden h-7 w-24 sm:block' : 'h-7 w-20')}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
        <div className="flex items-center justify-between gap-4 border-b border-border/70 px-5 py-4">
          <div className="space-y-2">
            <div className={cn(skeleton, 'h-4 w-40')} />
            <div className={cn(skeleton, 'h-3 w-56 max-w-full')} />
          </div>
          <div className={cn(skeleton, 'hidden h-8 w-24 sm:block')} />
        </div>

        <div className="divide-y divide-border/70">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex items-center gap-3 px-5 py-3.5">
              <div className={cn(skeleton, 'size-9 shrink-0 rounded-xl')} />
              <div className="min-w-0 flex-1 space-y-2">
                <div
                  className={cn(skeleton, 'h-3.5', index % 2 === 0 ? 'w-2/5' : 'w-1/3')}
                />
                <div
                  className={cn(skeleton, 'h-2.5', index % 2 === 0 ? 'w-1/4' : 'w-1/3')}
                />
              </div>
              <div className={cn(skeleton, 'hidden h-6 w-20 shrink-0 rounded-full sm:block')} />
              <div className={cn(skeleton, 'size-7 shrink-0 rounded-lg')} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
