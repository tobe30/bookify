import { Menu, UserRound } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAuthuser } from '../../lib/api'

const pageDetails = {
  '/admin': {
    title: 'Dashboard',
    description: 'Overview of your bookshop.',
  },
  '/admin/books': {
    title: 'Books',
    description: 'Manage books and inventory.',
  },
  '/admin/orders': {
    title: 'Orders',
    description: 'Review and manage customer orders.',
  },
  '/admin/users': {
    title: 'Users',
    description: 'View registered Bookify users.',
  },
}

function AdminNavbar({ onMenuClick }) {
  const location = useLocation()
  const details = pageDetails[location.pathname] ?? pageDetails['/admin']
  const { data: authUser } = useQuery({
    queryKey: ['authUser'],
    queryFn: getAuthuser,
    retry: false,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })

  return (
    <header className="flex min-h-[112px] items-center justify-between gap-5 px-5 py-6 sm:px-8 lg:px-9">
      <div className="flex min-w-0 items-start gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl border border-black/10 bg-white text-bookify-ink lg:hidden"
          aria-label="Open admin navigation"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate font-serif text-3xl font-bold tracking-[-0.035em] text-bookify-ink sm:text-4xl">
            {details.title}
          </h1>
          <p className="mt-1 text-sm text-bookify-muted">{details.description}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="hidden items-center gap-2.5 rounded-full border border-black/8 bg-white py-1.5 pl-1.5 pr-4 sm:flex">
          <span className="grid size-8 place-items-center rounded-full bg-bookify-primary text-white">
            <UserRound size={16} />
          </span>
          <div>
            <p className="text-xs font-bold text-bookify-ink">{authUser?.fullName || 'Admin'}</p>
            <p className="text-[10px] text-bookify-muted">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminNavbar
