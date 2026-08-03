function AdminPageLoader() {
  return (
    <div
      className="animate-pulse pb-8"
      role="status"
      aria-live="polite"
      aria-label="Loading admin page"
    >
      <span className="sr-only">Loading admin page...</span>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-11 w-full rounded-xl bg-black/[0.07] sm:max-w-[346px]" />
        <div className="h-11 w-32 rounded-xl bg-bookify-primary/15" />
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
        <div className="h-11 bg-black/[0.045]" />
        <div className="divide-y divide-black/[0.06]">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="flex min-h-[66px] items-center gap-4 px-4 py-3"
            >
              <div className="size-10 shrink-0 rounded-lg bg-black/[0.07]" />
              <div className="min-w-0 flex-1">
                <div className="h-3 w-2/5 rounded-full bg-black/[0.08]" />
                <div className="mt-2 h-2.5 w-1/4 rounded-full bg-black/[0.055]" />
              </div>
              <div className="hidden h-3 w-24 rounded-full bg-black/[0.07] sm:block" />
              <div className="hidden h-8 w-20 rounded-lg bg-black/[0.055] md:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminPageLoader
