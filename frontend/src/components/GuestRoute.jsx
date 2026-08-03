import { useQuery } from '@tanstack/react-query'
import { Navigate, Outlet } from 'react-router-dom'
import { getAuthuser } from '../lib/api'

function GuestRoute() {
  const { data: authUser, isPending } = useQuery({
    queryKey: ['authUser'],
    queryFn: getAuthuser,
    retry: false,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })

  if (isPending) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fbf8f2]">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-bookify-primary" />
          <p className="mt-3 text-sm font-semibold text-bookify-muted">
            Checking your account...
          </p>
        </div>
      </main>
    )
  }

  if (authUser) {
    return (
      <Navigate
        to={authUser.role === 'admin' ? '/admin' : '/dashboard'}
        replace
      />
    )
  }

  return <Outlet />
}

export default GuestRoute
