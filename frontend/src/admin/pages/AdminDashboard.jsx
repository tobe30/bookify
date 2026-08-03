import {
  ArrowRight,
  Banknote,
  BookOpen,
  Package,
  ShoppingCart,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAdminBooks, getAdminOrders, getAdminUsers } from '../../lib/api'

function AdminDashboard() {
  const booksQuery = useQuery({
    queryKey: ['adminBooks'],
    queryFn: getAdminBooks,
    retry: false,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })

  const usersQuery = useQuery({
    queryKey: ['adminUsers'],
    queryFn: getAdminUsers,
    retry: false,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })

  const ordersQuery = useQuery({
    queryKey: ['adminOrders'],
    queryFn: getAdminOrders,
    retry: false,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })

  const books = booksQuery.data ?? []
  const users = usersQuery.data ?? []
  const orders = ordersQuery.data ?? []
  const revenue = orders.reduce((total, order) => total + (order.total || 0), 0)

  const stats = [
    {
      label: 'Total books',
      value: books.length.toLocaleString(),
      icon: BookOpen,
      accent: 'text-bookify-primary',
      background: 'bg-bookify-primary/10',
    },
    {
      label: 'Users',
      value: users.length.toLocaleString(),
      icon: Users,
      accent: 'text-blue-600',
      background: 'bg-blue-50',
    },
    {
      label: 'Orders',
      value: orders.length.toLocaleString(),
      icon: ShoppingCart,
      accent: 'text-violet-600',
      background: 'bg-violet-50',
    },
    {
      label: 'Revenue',
      value: `₦${revenue.toLocaleString()}`,
      icon: Banknote,
      accent: 'text-emerald-700',
      background: 'bg-emerald-50',
    },
  ]

  const quickActions = [
    { label: 'Add a new book', to: '/admin/books' },
    { label: 'Manage inventory', to: '/admin/books' },
    { label: 'Update order statuses', to: '/admin/orders' },
  ]

  return (
    <div>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, accent, background }) => (
          <article
            key={label}
            className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_8px_24px_rgba(30,24,18,0.045)]"
          >
            <span className={`grid size-10 place-items-center rounded-xl ${background} ${accent}`}>
              <Icon size={20} />
            </span>
            <p className="mt-4 text-[11px] font-semibold tracking-[0.06em] text-bookify-muted uppercase">
              {label}
            </p>
            <p className="mt-1 font-serif text-2xl font-bold text-bookify-ink sm:text-3xl">
              {value}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-7 grid items-start gap-5 xl:grid-cols-2">
        <article className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_8px_24px_rgba(30,24,18,0.045)] sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-serif text-xl font-bold text-bookify-ink">
              Recent orders
            </h2>
            <Link
              to="/admin/orders"
              className="text-sm font-bold text-bookify-primary hover:text-bookify-primary-dark"
            >
              View all <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {ordersQuery.isLoading ? (
            <div className="mt-5 grid min-h-[150px] place-items-center rounded-xl border border-dashed border-black/12 bg-[#fbf8f2] text-center">
              <p className="text-sm font-semibold text-bookify-muted">Loading recent orders…</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="mt-5 divide-y divide-black/8">
              {orders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-bookify-ink">
                      #{order.id}
                    </p>
                    <p className="mt-0.5 text-xs text-bookify-muted">
                      {order.customer?.fullName || order.deliveryInfo?.fullName || 'Bookify customer'}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-bookify-ink">
                      &#8358;{(order.total ?? 0).toLocaleString()}
                    </p>
                    <p className="mt-0.5 text-xs text-amber-700">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 grid min-h-[150px] place-items-center rounded-xl border border-dashed border-black/12 bg-[#fbf8f2] text-center">
              <div>
                <Package size={23} className="mx-auto text-bookify-primary" />
                <p className="mt-2 text-sm font-semibold text-bookify-ink">
                  No orders yet
                </p>
                <p className="mt-1 text-xs text-bookify-muted">
                  New customer orders will appear here.
                </p>
              </div>
            </div>
          )}
        </article>

        <article className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_8px_24px_rgba(30,24,18,0.045)] sm:p-6">
          <h2 className="font-serif text-xl font-bold text-bookify-ink">
            Quick actions
          </h2>
          <div className="mt-5 space-y-2.5">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="group flex min-h-11 items-center justify-between gap-4 rounded-xl border border-black/10 px-4 text-sm font-semibold text-bookify-ink transition hover:border-bookify-primary/40 hover:bg-bookify-primary/5 hover:text-bookify-primary"
              >
                {action.label}
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}

export default AdminDashboard
