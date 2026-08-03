import { useEffect, useState } from 'react'
import AdminPageLoader from './AdminPageLoader'

function AdminRouteContent({ children }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadingTimer = window.setTimeout(() => {
      setIsLoading(false)
    }, 450)

    return () => window.clearTimeout(loadingTimer)
  }, [])

  if (isLoading) {
    return <AdminPageLoader />
  }

  return children
}

export default AdminRouteContent
