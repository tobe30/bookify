import { CreditCard, MapPin, Package, Phone, X } from 'lucide-react'

const naira = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
})

function AdminOrderModal({ order, onClose }) {
  const customer = order.customer ?? order.deliveryInfo ?? {}
  const items = order.items ?? order.orderItems?.map((orderItem) => ({
    book: {
      ...orderItem.bookId,
      id: orderItem.bookId._id || orderItem.bookId.id,
    },
    quantity: orderItem.quantity,
  })) ?? []

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-black/10 bg-[#fffdf9] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-details-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between border-b border-black/10 px-5 py-5 sm:px-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-bookify-primary">
              Order #{order.id}
            </p>
            <h2
              id="order-details-title"
              className="mt-1 font-serif text-2xl font-bold text-bookify-ink"
            >
              Order details
            </h2>
            <p className="mt-1 text-sm text-bookify-muted">
              {new Date(order.createdAt).toLocaleString('en-NG', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full text-bookify-muted transition hover:bg-black/5 hover:text-bookify-ink"
            aria-label="Close order details"
          >
            <X size={20} />
          </button>
        </header>

        <div className="grid gap-5 p-5 sm:p-7">
          <section className="rounded-xl border border-black/10 bg-white p-4">
            <h3 className="font-serif text-lg font-bold text-bookify-ink">
              Customer
            </h3>
            <p className="mt-3 font-semibold text-bookify-ink">
              {customer.fullName || 'Bookify customer'}
            </p>
            <p className="mt-1 text-sm text-bookify-muted">
              {customer.email || 'Email not provided'}
            </p>
            <div className="mt-3 grid gap-2 text-sm text-bookify-muted sm:grid-cols-2">
              <p className="flex items-start gap-2">
                <Phone size={15} className="mt-0.5 shrink-0 text-bookify-primary" />
                {customer.phone || 'Phone not provided'}
              </p>
              <p className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0 text-bookify-primary" />
                {customer.address || 'Address not provided'}
              </p>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-black/10 bg-white">
            <div className="flex items-center gap-2 border-b border-black/10 px-4 py-3">
              <Package size={17} className="text-bookify-primary" />
              <h3 className="font-serif text-lg font-bold text-bookify-ink">
                Books ordered
              </h3>
            </div>
            <ul className="divide-y divide-black/8">
              {order.items.map(({ book, quantity }) => (
                <li
                  key={book.id}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src={book.image}
                      alt=""
                      className="h-12 w-9 shrink-0 rounded object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-bookify-ink">
                        {book.title}
                      </p>
                      <p className="mt-0.5 text-xs text-bookify-muted">
                        Quantity: {quantity}
                      </p>
                    </div>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-bookify-ink">
                    {naira.format(book.price * quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl bg-bookify-primary/[0.06] p-4">
            <div className="flex items-center gap-2 text-sm text-bookify-muted">
              <CreditCard size={16} className="text-bookify-primary" />
              Payment: {order.paymentMethod === 'TRANSFER' ? 'Bank transfer' : 'Cash on Delivery'}
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-bookify-muted">
                <dt>Subtotal</dt>
                <dd>{naira.format(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-bookify-muted">
                <dt>Shipping</dt>
                <dd>{order.shipping === 0 ? 'Free' : naira.format(order.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-bookify-primary/15 pt-3 font-bold text-bookify-ink">
                <dt>Total</dt>
                <dd className="text-bookify-primary">{naira.format(order.total)}</dd>
              </div>
            </dl>
          </section>
        </div>
      </section>
    </div>
  )
}

export default AdminOrderModal
