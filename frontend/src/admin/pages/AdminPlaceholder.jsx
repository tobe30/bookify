import { Construction } from 'lucide-react'

function AdminPlaceholder({ title }) {
  return (
    <section className="grid min-h-[360px] place-items-center rounded-2xl border border-dashed border-black/15 bg-white px-6 py-12 text-center">
      <div className="max-w-sm">
        <span className="mx-auto grid size-14 place-items-center rounded-xl bg-bookify-primary/10 text-bookify-primary">
          <Construction size={25} />
        </span>
        <h2 className="mt-5 font-serif text-2xl font-bold text-bookify-ink">
          {title} management
        </h2>
        <p className="mt-2 text-sm leading-6 text-bookify-muted">
          This route is ready inside the admin layout and can be implemented as the next admin module.
        </p>
      </div>
    </section>
  )
}

export default AdminPlaceholder
