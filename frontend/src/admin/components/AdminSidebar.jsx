import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  ShoppingCart,
  Users,
  X,
} from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import funaiLogo from '../../assets/funai-logo.png'
import { logout } from '../../lib/api'

const navigation = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Books', to: '/admin/books', icon: BookOpen },
  { label: 'Orders', to: '/admin/orders', icon: ShoppingCart },
  { label: 'Users', to: '/admin/users', icon: Users },
]

function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(['authUser'], null)
      navigate('/login')
    },
    onError: () => {
      navigate('/login')
    },
  })

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/35 lg:hidden"
          onClick={onClose}
          aria-label="Close admin navigation"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[224px] flex-col border-r border-black/10 bg-white transition-transform duration-200 lg:sticky lg:top-1.5 lg:h-[calc(100vh-12px)] lg:self-start lg:translate-x-0 lg:rounded-l-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[72px] items-center justify-between border-b border-black/8 px-5">
          <Link to="/admin" className="flex min-w-0 items-center gap-2.5" onClick={onClose}>
            <img
              src={funaiLogo}
              alt="FUNAI logo"
              className="size-9 shrink-0 rounded-full object-cover"
            />
            <span className="truncate font-serif text-lg font-bold text-bookify-ink">
              Bookify
            </span>
            <span className="rounded-full bg-bookify-primary/10 px-2 py-1 text-[9px] font-bold tracking-wide text-bookify-primary">
              ADMIN
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-lg text-bookify-muted hover:bg-bookify-cream lg:hidden"
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 px-3 py-4">
          {navigation.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={label}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-bookify-primary-dark text-white shadow-[0_8px_20px_rgba(5,92,49,0.16)]'
                    : 'text-bookify-ink hover:bg-bookify-cream hover:text-bookify-primary'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-black/8 p-3">
          <button
            type="button"
            onClick={() => {
              logoutMutation.mutate()
              onClose()
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-bookify-ink transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar
