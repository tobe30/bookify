import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import AppRoutes from './routes/AppRoutes'
import { getAuthuser } from './lib/api'

function App() {
  useQuery({
    queryKey: ['authUser'],
    queryFn: getAuthuser,
    retry: false,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })

  return (
    <>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: { borderRadius: '12px', color: '#201b1b' },
          success: { iconTheme: { primary: '#08783f', secondary: '#ffffff' } },
        }}
      />
    </>
  )
}

export default App
