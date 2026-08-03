import { useEffect, useState } from 'react'
import { Check, XCircle } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { verifyPayment } from '../lib/api'

function PaymentCallback() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('Verifying payment, please wait...')
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    const reference = searchParams.get('reference')

    if (!reference) {
      setStatus('error')
      setMessage('No payment reference was provided.')
      return
    }

    const verify = async () => {
      try {
        const data = await verifyPayment(reference)

        if (data?.success) {
          setStatus('success')
          setOrderId(data.order?._id || data.order?.id || '')
          setMessage(data.message || 'Payment verified successfully.')
          toast.success(data.message || 'Payment verified successfully')
        } else {
          setStatus('error')
          setMessage(data?.message || 'Payment verification failed.')
          toast.error(data?.message || 'Payment verification failed')
        }
      } catch (err) {
        console.error('Payment verification failed:', err)
        setStatus('error')
        setMessage('Unable to verify payment. Please try again later.')
        toast.error('Unable to verify payment. Please try again later.')
      }
    }

    verify()
  }, [searchParams])

  return (
    <main className="grid min-h-[65vh] place-items-center bg-[#fbf8f2] px-5 py-20 text-center">
      <div className="max-w-md rounded-3xl border border-black/10 bg-white p-8 shadow-[0_18px_40px_rgba(30,24,18,0.06)]">
        {status === 'loading' ? (
          <div className="space-y-4">
            <span className="loading loading-spinner loading-lg text-bookify-primary mx-auto" />
            <p className="text-sm font-semibold text-bookify-muted">{message}</p>
          </div>
        ) : status === 'success' ? (
          <>
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-bookify-primary text-white">
              <Check size={36} strokeWidth={2.5} />
            </span>
            <h1 className="mt-6 font-serif text-3xl font-bold text-bookify-ink">Payment successful</h1>
            <p className="mt-3 text-sm leading-6 text-bookify-muted">{message}</p>
            {orderId && (
              <p className="mt-2 text-sm font-semibold text-bookify-ink">
                Order number: <span className="text-bookify-primary">{orderId}</span>
              </p>
            )}
            <Link to="/orders" className="mt-7 inline-flex rounded-full bg-bookify-primary px-7 py-3 text-sm font-bold text-white transition hover:bg-bookify-primary-dark">
              View your order
            </Link>
          </>
        ) : (
          <>
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-red-500 text-white">
              <XCircle size={36} />
            </span>
            <h1 className="mt-6 font-serif text-3xl font-bold text-bookify-ink">Payment failed</h1>
            <p className="mt-3 text-sm leading-6 text-bookify-muted">{message}</p>
            <Link to="/checkout" className="mt-7 inline-flex rounded-full bg-bookify-primary px-7 py-3 text-sm font-bold text-white transition hover:bg-bookify-primary-dark">
              Return to checkout
            </Link>
          </>
        )}
      </div>
    </main>
  )
}

export default PaymentCallback
