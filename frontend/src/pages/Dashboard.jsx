import { CalendarDays, Package, ShoppingBag, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAuthuser, getUserOrders } from '../lib/api'

function Dashboard() {
  const authUserQuery = useQuery({
    queryKey: ['authUser'],
    queryFn: getAuthuser,
    retry: false,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })

  const ordersQuery = useQuery({
    queryKey: ['userOrders'],
    queryFn: getUserOrders,
    retry: false,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })

  const orders = ordersQuery.data ?? []
  const displayName = authUserQuery.data?.fullName || 'Student'
  const totalSpent = orders.reduce((total, order) => total + (order.total || 0), 0)
  const memberSince = authUserQuery.data?.createdAt
    ? new Date(authUserQuery.data.createdAt).toLocaleDateString('en-NG')
    : '—'
  const stats = [
    {
      label: 'Orders',
      value: orders.length.toString(),
      icon: ShoppingBag,
    },
    {
      label: 'Total spent',
      value: `₦${totalSpent.toLocaleString()}`,
      icon: Package,
    },
    {
      label: 'Member since',
      value: memberSince,
      icon: CalendarDays,
    },
  ]

  return (
    <main className="min-h-[calc(100vh-110px)] bg-[#fbf8f2]">
      <section className="mx-auto max-w-[1040px] px-5 py-10 sm:px-8 md:py-14 lg:px-5">
        <div className="flex items-center justify-between gap-5">
          <div>
            <p className="text-sm text-bookify-muted">Welcome back,</p>
            <h1 className="mt-1 font-serif text-4xl font-bold tracking-[-0.04em] text-bookify-ink">
              {displayName}
            </h1>
          </div>
          <span className="hidden size-14 place-items-center rounded-full bg-bookify-primary/10 text-bookify-primary sm:grid">
            <UserRound size={25} />
          </span>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <article
              key={label}
              className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_8px_25px_rgba(30,24,18,0.045)] sm:p-6"
            >
              <span className="grid size-9 place-items-center rounded-lg bg-bookify-primary/10 text-bookify-primary">
                <Icon size={18} />
              </span>
              <p className="mt-4 text-[11px] font-semibold tracking-[0.06em] text-bookify-muted uppercase">
                {label}
              </p>
              <p className="mt-1 font-serif text-2xl font-bold text-bookify-ink">{value}</p>
            </article>
          ))}
        </div>

        <section id="orders" className="mt-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="font-serif text-2xl font-bold tracking-[-0.025em] text-bookify-ink">
              Recent orders
            </h2>
            <Link to="/orders" className="text-sm font-bold text-bookify-primary hover:text-bookify-primary-dark">
              View all
            </Link>
          </div>

          {ordersQuery.isLoading ? (
            <div className="grid min-h-[210px] place-items-center rounded-2xl border border-black/10 bg-white px-6 py-10 text-center">
              <span className="loading loading-spinner loading-lg text-bookify-primary" />
              <p className="mt-3 text-sm font-semibold text-bookify-muted">Loading your latest orders...</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => (
                <Link
                  key={order.id}
                  to="/orders"
                  className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white p-4 transition hover:border-bookify-primary/30"
                >
                  <div>
                    <p className="text-sm font-bold text-bookify-ink">#{order.id}</p>
                    <p className="mt-0.5 text-xs text-bookify-muted">
                      {new Date(order.createdAt).toLocaleDateString('en-NG')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-bookify-primary">
                      &#8358;{order.total.toLocaleString()}
                    </p>
                    <p className="mt-0.5 text-xs text-bookify-muted">{order.status}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid min-h-[210px] place-items-center rounded-2xl border border-dashed border-black/15 bg-white px-6 py-10 text-center">
              <div>
                <span className="mx-auto grid size-12 place-items-center rounded-xl bg-bookify-primary/10 text-bookify-primary">
                  <Package size={24} />
                </span>
                <h3 className="mt-4 font-serif text-lg font-bold text-bookify-ink">No orders yet</h3>
                <p className="mt-1 text-sm text-bookify-muted">
                  Books you purchase will appear here.
                </p>
                <Link
                  to="/books"
                  className="mt-5 inline-flex rounded-xl bg-bookify-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-bookify-primary-dark"
                >
                  Browse books
                </Link>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

export default Dashboard
