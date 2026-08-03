import { Package, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import AdminOrderModal from '../components/AdminOrderModal'
import { getAdminOrders, updateOrderStatus } from '../../lib/api'

const statuses = ['Pending', 'Processing', 'Delivered', 'Cancelled']

const naira = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
})

const statusStyle = {
  Pending: 'bg-amber-50 text-amber-700',
  Processing: 'bg-blue-50 text-blue-700',
  Delivered: 'bg-bookify-primary/10 text-bookify-primary',
  Cancelled: 'bg-red-50 text-red-600',
}

function AdminOrders() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const ordersQuery = useQuery({
    queryKey: ['adminOrders'],
    queryFn: getAdminOrders,
    retry: false,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })

  const statusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      toast.success('Order status updated successfully')
      queryClient.invalidateQueries(['adminOrders'])
    },
    onError: () => {
      toast.error('Could not update order status')
    },
  })

  const orders = ordersQuery.data ?? []

  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return orders

    return orders.filter((order) => {
      const customer = order.customer ?? {}
      return [order.id, customer.fullName ?? '', customer.email ?? ''].some(
        (value) => value.toLowerCase().includes(query),
      )
    })
  }, [orders, searchTerm])

  const changeStatus = (orderId, status) => {
    statusMutation.mutate({ orderId, status })
  }

  const renderStatus = (order) => (
    <select
      value={order.status}
      onChange={(event) => changeStatus(order.id, event.target.value)}
      className={`h-9 rounded-xl border border-black/10 px-3 text-xs font-bold outline-none focus:border-bookify-primary ${statusStyle[order.status]}`}
      aria-label={`Update status for order ${order.id}`}
    >
      {statuses.map((status) => (
        <option key={status} value={status} className="bg-white text-bookify-ink">
          {status}
        </option>
      ))}
    </select>
  )

  return (
    <section className="min-w-0 max-w-full pb-8">
      <label className="relative mb-5 block w-full sm:max-w-[346px]">
        <span className="sr-only">Search orders</span>
        <Search
          size={17}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-bookify-muted"
        />
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by customer or ID..."
          className="h-11 w-full rounded-xl border border-black/10 bg-white pl-10 pr-4 text-sm text-bookify-ink outline-none transition placeholder:text-bookify-muted/80 focus:border-bookify-primary focus:ring-2 focus:ring-bookify-primary/15"
        />
      </label>

      <div className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
        <div className="hidden max-w-full overflow-x-auto md:block">
          <table className="w-full min-w-[800px] border-collapse text-left">
            <thead className="bg-[#faf7f1]">
              <tr className="text-[11px] font-bold uppercase tracking-wide text-bookify-muted">
                <th className="px-4 py-3.5">Order</th>
                <th className="px-4 py-3.5">Customer</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Total</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-black/10 transition hover:bg-bookify-primary/[0.025]"
                >
                  <td className="px-4 py-3.5 text-sm font-bold text-bookify-ink">
                    #{order.id}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-semibold text-bookify-ink">
                      {order.customer?.fullName || 'Bookify customer'}
                    </p>
                    <p className="mt-0.5 text-xs text-bookify-muted">
                      {order.customer?.email || 'Email not provided'}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-bookify-ink">
                    {new Date(order.createdAt).toLocaleDateString('en-NG')}
                  </td>
                  <td className="px-4 py-3.5 text-sm font-bold text-bookify-ink">
                    {naira.format(order.total)}
                  </td>
                  <td className="px-4 py-3.5">{renderStatus(order)}</td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="text-sm font-bold text-bookify-primary transition hover:text-bookify-primary-dark"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-black/10 md:hidden">
          {filteredOrders.map((order) => (
            <article key={order.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-bookify-ink">#{order.id}</p>
                  <p className="mt-1 truncate text-sm font-semibold text-bookify-ink">
                    {order.customer?.fullName || 'Bookify customer'}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-bookify-muted">
                    {order.customer?.email || 'Email not provided'}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-bold text-bookify-ink">
                  {naira.format(order.total)}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#faf7f1] p-3">
                <p className="text-xs text-bookify-muted">
                  {new Date(order.createdAt).toLocaleDateString('en-NG')}
                </p>
                {renderStatus(order)}
                <button
                  type="button"
                  onClick={() => setSelectedOrder(order)}
                  className="text-xs font-bold text-bookify-primary"
                >
                  View details
                </button>
              </div>
            </article>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="grid min-h-[260px] place-items-center px-5 py-12 text-center">
            <div>
              <span className="mx-auto grid size-14 place-items-center rounded-xl bg-bookify-primary/10 text-bookify-primary">
                <Package size={25} />
              </span>
              <h2 className="mt-4 font-serif text-xl font-bold text-bookify-ink">
                {orders.length === 0 ? 'No orders yet' : 'No matching orders'}
              </h2>
              <p className="mt-1 text-sm text-bookify-muted">
                {orders.length === 0
                  ? 'Completed customer checkouts will appear here.'
                  : 'Try another customer name, email, or order ID.'}
              </p>
            </div>
          </div>
        )}

        {orders.length > 0 && (
          <div className="border-t border-black/10 bg-[#faf7f1] px-4 py-3 text-xs text-bookify-muted">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        )}
      </div>

      {selectedOrder && (
        <AdminOrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </section>
  )
}

export default AdminOrders
