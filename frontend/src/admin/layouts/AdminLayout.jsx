import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AdminNavbar from '../components/AdminNavbar'
import AdminRouteContent from '../components/AdminRouteContent'
import AdminSidebar from '../components/AdminSidebar'

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#f1f2ef] p-0 lg:p-1.5">
      <div className="min-h-screen overflow-hidden bg-[#faf6ef] lg:grid lg:min-h-[calc(100vh-12px)] lg:grid-cols-[224px_minmax(0,1fr)] lg:items-start lg:overflow-visible lg:rounded-2xl lg:border lg:border-black/10 lg:shadow-sm">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="min-w-0 max-w-full overflow-hidden">
          <AdminNavbar onMenuClick={() => setSidebarOpen(true)} />
          <div className="min-w-0 max-w-full px-4 pb-10 sm:px-8 lg:px-9">
            <AdminRouteContent key={location.pathname}>
              <Outlet />
            </AdminRouteContent>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
