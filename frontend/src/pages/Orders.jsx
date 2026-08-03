import { ChevronDown, Package, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getUserOrders } from '../lib/api'
import useCart from '../context/useCart'

function Orders() {
  const { orders: localOrders } = useCart()
  const ordersQuery = useQuery({
    queryKey: ['userOrders'],
    queryFn: getUserOrders
  })

  const orders = ordersQuery.data ?? localOrders

  return (
    <main className="min-h-[calc(100vh-110px)] bg-[#fbf8f2]">
      <section className="mx-auto max-w-[800px] px-5 py-10 sm:px-8 md:py-14 lg:px-5">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-[0.15em] text-bookify-primary uppercase">
            Your purchases
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold tracking-[-0.035em] text-bookify-ink">
            Order history
          </h1>
        </div>

        {ordersQuery.isLoading ? (
          <div className="grid min-h-[260px] place-items-center rounded-2xl border border-black/10 bg-white px-6 py-12 text-center">
            <span className="loading loading-spinner loading-lg text-bookify-primary" />
            <p className="mt-3 text-sm font-semibold text-bookify-muted">Loading your orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const itemCount = order.items.reduce(
                (total, item) => total + item.quantity,
                0,
              )

              return (
                <details
                  key={order.id}
                  className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_8px_25px_rgba(30,24,18,0.04)]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 p-4 sm:p-5">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="hidden size-10 shrink-0 place-items-center rounded-xl bg-bookify-primary/10 text-bookify-primary sm:grid">
                        <ShoppingBag size={18} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-bookify-ink">
                          #{order.id}
                        </p>
                        <p className="mt-0.5 text-xs text-bookify-muted">
                          {new Date(order.createdAt).toLocaleDateString('en-NG')} ·{' '}
                          {itemCount} {itemCount === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-4 text-right">
                      <div>
                        <p className="text-sm font-bold text-bookify-ink">
                          &#8358;{order.total.toLocaleString()}
                        </p>
                        <span className="mt-1 inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                          {order.status}
                        </span>
                      </div>
                      <ChevronDown
                        size={17}
                        className="text-bookify-muted transition group-open:rotate-180"
                      />
                    </div>
                  </summary>

                  <div className="border-t border-black/8 bg-[#fbf8f2] px-4 py-4 sm:px-5">
                    <ul className="space-y-3">
                      {order.items.map(({ book, quantity }) => (
                        <li key={book.id} className="flex items-center justify-between gap-4 text-sm">
                          <div className="min-w-0">
                            <Link
                              to={`/books/${book.id}`}
                              className="truncate font-semibold text-bookify-ink hover:text-bookify-primary"
                            >
                              {book.title}
                            </Link>
                            <p className="text-xs text-bookify-muted">Quantity: {quantity}</p>
                          </div>
                          <span className="shrink-0 font-semibold text-bookify-ink">
                            &#8358;{(book.price * quantity).toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex justify-between border-t border-black/8 pt-4 text-xs text-bookify-muted">
                      <span>Payment: {order.paymentMethod === 'TRANSFER' ? 'Bank transfer' : 'Cash on Delivery'}</span>
                      <span>{(order.shipping ?? 0) === 0 ? 'Free delivery' : `Delivery ₦${order.shipping.toLocaleString()}`}</span>
                    </div>
                  </div>
                </details>
              )
            })}
          </div>
        ) : (
          <div className="grid min-h-[260px] place-items-center rounded-2xl border border-dashed border-black/15 bg-white px-6 py-12 text-center">
            <div>
              <span className="mx-auto grid size-14 place-items-center rounded-xl bg-bookify-primary/10 text-bookify-primary">
                <Package size={27} />
              </span>
              <h2 className="mt-5 font-serif text-2xl font-bold text-bookify-ink">
                No orders yet
              </h2>
              <p className="mt-2 text-sm text-bookify-muted">
                Your completed Bookify orders will appear here.
              </p>
              <Link
                to="/books"
                className="mt-6 inline-flex rounded-xl bg-bookify-primary px-6 py-3 text-sm font-bold text-white hover:bg-bookify-primary-dark"
              >
                Browse books
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default Orders
