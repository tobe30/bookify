import AdminDashboard from '../admin/pages/AdminDashboard'
import AdminBooks from '../admin/pages/AdminBooks'
import AdminOrders from '../admin/pages/AdminOrders'
import AdminUsers from '../admin/pages/AdminUsers'

const adminRoutes = [
  { index: true, element: <AdminDashboard /> },
  { path: 'books', element: <AdminBooks /> },
  { path: 'orders', element: <AdminOrders /> },
  { path: 'users', element: <AdminUsers /> },
]

export default adminRoutes
