import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from '../admin/layouts/AdminLayout'
import GuestRoute from '../components/GuestRoute'
import ProtectedRoute from '../components/ProtectedRoute'
import PublicLayout from '../layouts/PublicLayout'
import adminRoutes from './adminRoutes'
import authRoutes from './authRoutes'
import publicRoutes from './publicRoutes'
import userRoutes from './userRoutes'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      <Route element={<GuestRoute />}>
        <Route element={<PublicLayout />}>
          {authRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['user']} />}>
        <Route element={<PublicLayout />}>
          {userRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          {adminRoutes.map((route) =>
            route.index ? (
              <Route key="admin-index" index element={route.element} />
            ) : (
              <Route key={route.path} path={route.path} element={route.element} />
            ),
          )}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
