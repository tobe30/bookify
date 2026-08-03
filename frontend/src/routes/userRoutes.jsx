import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import Dashboard from '../pages/Dashboard'
import Orders from '../pages/Orders'
import PaymentCallback from '../pages/PaymentCallback'

const userRoutes = [
  { path: '/cart', element: <Cart /> },
  { path: '/checkout', element: <Checkout /> },
  { path: '/payment/callback', element: <PaymentCallback /> },
  { path: '/checkout/payment-callback', element: <PaymentCallback /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/orders', element: <Orders /> },
]

export default userRoutes
