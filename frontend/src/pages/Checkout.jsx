import { useState } from 'react'
import { Check, CreditCard, LockKeyhole, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import useCart from '../context/useCart'
import { createOrder, getAuthuser, initializePaystack } from '../lib/api'

function Checkout() {
  const queryClient = useQueryClient()
  const { items, placeOrder } = useCart()
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [saveAddress, setSaveAddress] = useState(true)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [orderNumber, setOrderNumber] = useState('')

  const { data: authUser } = useQuery({
    queryKey: ['authUser'],
    queryFn: getAuthuser,
    retry: false,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    initialData: queryClient.getQueryData(['authUser']),
  })

  const displayedFullName = fullName || authUser?.fullName || ''
  const displayedEmail = email || authUser?.email || ''
  const displayedPhone = phone || authUser?.savedAddress?.phone || ''
  const displayedAddress = address || authUser?.savedAddress?.address || ''

  const subtotal = items.reduce(
    (total, item) => total + item.book.price * item.quantity,
    0,
  )
  const shipping = subtotal === 0 || subtotal >= 25000 ? 0 : 2500
  const total = subtotal + shipping

  const handleSubmit = async (event) => {
    event.preventDefault()

    const customer = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
    }

    const payload = {
      deliveryInfo: customer,
      items: items.map(({ book, quantity }) => ({ bookId: book.id || book._id, quantity })),
      paymentMethod,
      saveAddress,
    }

    if (paymentMethod === 'CARD') {
      try {
        const data = await initializePaystack(payload)

        if (data?.success && data.authorization_url) {
          if (saveAddress) {
            const authUser = queryClient.getQueryData(['authUser'])
            if (authUser) {
              queryClient.setQueryData(['authUser'], {
                ...authUser,
                savedAddress: {
                  phone: customer.phone,
                  address: customer.address,
                },
              })
            }
          }

          const redirectUrl = data.authorization_url
          window.location.assign(redirectUrl)
          return
        }

        toast.error(data?.message || 'Unable to initialize Paystack payment')
      } catch (err) {
        console.error('Paystack initialization error:', err)
        toast.error('Unable to initialize Paystack payment')
      }

      return
    }

    try {
      const data = await createOrder(payload)

      if (data?.success) {
        if (saveAddress) {
          const authUser = queryClient.getQueryData(['authUser'])
          if (authUser) {
            queryClient.setQueryData(['authUser'], {
              ...authUser,
              savedAddress: {
                phone: customer.phone,
                address: customer.address,
              },
            })
          }
        }

        const localOrder = placeOrder({
          subtotal,
          shipping,
          total,
          paymentMethod,
          customer,
        })
        const backendOrder = data.order || {}
        setOrderNumber(backendOrder._id || backendOrder.id || localOrder.id)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        toast.success(data.message || 'Order placed successfully')
        return
      }

      toast.error(data?.message || 'Failed to place order — saved locally')
      const localOrder = placeOrder({
        subtotal,
        shipping,
        total,
        paymentMethod,
        customer,
      })
      setOrderNumber(localOrder.id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      console.error('Checkout error:', err)
      toast.error('Network error — order saved locally')
      const localOrder = placeOrder({
        subtotal,
        shipping,
        total,
        paymentMethod,
        customer,
      })
      setOrderNumber(localOrder.id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (orderNumber) {
    return (
      <main className="grid min-h-[65vh] place-items-center bg-[#fbf8f2] px-5 py-20 text-center">
        <div className="max-w-md">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-bookify-primary text-white">
            <Check size={36} strokeWidth={2.5} />
          </span>
          <p className="mt-6 text-xs font-bold tracking-[0.14em] text-bookify-primary uppercase">Order confirmed</p>
          <h1 className="mt-2 font-serif text-4xl font-bold tracking-[-0.035em] text-bookify-ink">
            Thank you for your order
          </h1>
          <p className="mt-3 text-sm leading-6 text-bookify-muted">
            Your simulated payment was successful. Your order number is{' '}
            <strong className="text-bookify-ink">{orderNumber}</strong>.
          </p>
          <Link
            to="/books"
            className="mt-7 inline-flex rounded-full bg-bookify-primary px-7 py-3 text-sm font-bold text-white transition hover:bg-bookify-primary-dark"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="grid min-h-[65vh] place-items-center bg-[#fbf8f2] px-5 py-20 text-center">
        <div className="max-w-md">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-bookify-primary/10 text-bookify-primary">
            <ShoppingBag size={34} />
          </span>
          <h1 className="mt-6 font-serif text-4xl font-bold text-bookify-ink">Nothing to checkout</h1>
          <p className="mt-3 text-sm text-bookify-muted">Add at least one book to your cart before checking out.</p>
          <Link to="/books" className="mt-7 inline-flex rounded-full bg-bookify-primary px-7 py-3 text-sm font-bold text-white">
            Browse books
          </Link>
        </div>
      </main>
    )
  }

  const inputClass =
    'mt-2 h-11 w-full rounded-xl border border-black/10 bg-[#fbf8f2] px-4 text-sm text-bookify-ink outline-none transition placeholder:text-bookify-muted/55 focus:border-bookify-primary/50 focus:ring-4 focus:ring-bookify-primary/5'

  return (
    <main className="min-h-[calc(100vh-110px)] bg-[#fbf8f2]">
      <section className="mx-auto max-w-245 px-5 py-10 sm:px-8 md:py-14 lg:px-5">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold tracking-[-0.035em] text-bookify-ink">Checkout</h1>
          <p className="mt-1 text-sm text-bookify-muted">Complete your purchase securely.</p>
        </div>

        <form id="checkout-form" onSubmit={handleSubmit} className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_324px]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_8px_25px_rgba(30,24,18,0.04)] sm:p-6">
              <h2 className="font-serif text-xl font-bold text-bookify-ink">1. Delivery information</h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-bookify-ink">
                  Full name
                  <input
                    type="text"
                    name="fullName"
                    required
                    autoComplete="name"
                    placeholder="Your full name"
                    className={inputClass}
                    value={displayedFullName}
                    onChange={(event) => setFullName(event.target.value)}
                  />
                </label>
                <label className="text-sm font-semibold text-bookify-ink">
                  Email
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={inputClass}
                    value={displayedEmail}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </label>
                <label className="text-sm font-semibold text-bookify-ink">
                  Phone
                  <input
                    type="tel"
                    name="phone"
                    required
                    autoComplete="tel"
                    placeholder="+234..."
                    className={inputClass}
                    value={displayedPhone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                </label>
                <label className="text-sm font-semibold text-bookify-ink sm:col-span-2">
                  Shipping address
                  <textarea
                    name="address"
                    required
                    autoComplete="street-address"
                    rows="3"
                    placeholder="Hostel, lodge, street, city and state"
                    className={`${inputClass} h-auto resize-none py-3`}
                    value={displayedAddress}
                    onChange={(event) => setAddress(event.target.value)}
                  />
                </label>
              </div>

              <label className="mt-4 flex items-center gap-3 text-sm font-semibold text-bookify-ink">
                <input
                  type="checkbox"
                  checked={saveAddress}
                  onChange={(event) => setSaveAddress(event.target.checked)}
                  className="h-4 w-4 rounded border-bookify-primary text-bookify-primary"
                />
                Save this address for next time
              </label>
            </section>

            <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_8px_25px_rgba(30,24,18,0.04)] sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-serif text-xl font-bold text-bookify-ink">2. Payment details</h2>
                <span className="inline-flex items-center gap-1.5 text-xs text-bookify-muted">
                  <LockKeyhole size={13} /> Secure simulated checkout
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <label className={`cursor-pointer rounded-xl border p-4 transition ${paymentMethod === 'COD' ? 'border-bookify-primary bg-bookify-primary/5' : 'border-black/10'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="sr-only"
                  />
                  <span className="text-sm font-bold text-bookify-ink">Cash on Delivery</span>
                </label>
                <label className={`cursor-pointer rounded-xl border p-4 transition ${paymentMethod === 'CARD' ? 'border-bookify-primary bg-bookify-primary/5' : 'border-black/10'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CARD"
                    checked={paymentMethod === 'CARD'}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="sr-only"
                  />
                  <span className="flex items-center gap-2 text-sm font-bold text-bookify-ink">
                    <CreditCard size={18} className="text-bookify-primary" /> Card payment
                  </span>
                </label>
              </div>

              {paymentMethod === 'CARD' ? (
                <div className="mt-5 rounded-xl bg-bookify-primary/7 p-4 text-sm leading-6 text-bookify-muted">
                  Pay securely online with your card after placing the order.
                </div>
              ) : (
                <div className="mt-5 rounded-xl bg-bookify-primary/7 p-4 text-sm leading-6 text-bookify-muted">
                  Cash on delivery payments will be collected when your books arrive.
                </div>
              )}
            </section>
          </div>

          <aside className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_35px_rgba(30,24,18,0.06)] lg:sticky lg:top-6">
            <h2 className="font-serif text-xl font-bold text-bookify-ink">Order summary</h2>

            <ul className="mt-5 space-y-3 border-b border-black/10 pb-5">
              {items.map(({ book, quantity }) => (
                <li key={book.id} className="flex justify-between gap-4 text-sm">
                  <span className="min-w-0 truncate text-bookify-ink">
                    {book.title} <span className="text-bookify-muted">× {quantity}</span>
                  </span>
                  <span className="shrink-0 font-semibold text-bookify-ink">
                    &#8358;{(book.price * quantity).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-bookify-muted">
                <dt>Subtotal</dt>
                <dd className="font-semibold text-bookify-ink">&#8358;{subtotal.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between text-bookify-muted">
                <dt>Shipping</dt>
                <dd className="font-semibold text-bookify-ink">
                  {shipping === 0 ? 'Free' : `₦${shipping.toLocaleString()}`}
                </dd>
              </div>
            </dl>

            <div className="my-4 border-t border-black/10" />

            <div className="flex items-center justify-between">
              <span className="font-bold text-bookify-ink">Total</span>
              <strong className="text-xl text-bookify-primary">&#8358;{total.toLocaleString()}</strong>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-bookify-primary-dark text-sm font-bold text-white transition hover:bg-bookify-primary"
            >
              <Check size={16} /> Pay &#8358;{total.toLocaleString()}
            </button>

            <p className="mt-3 text-center text-[11px] leading-4 text-bookify-muted">
              By placing this order you agree to our terms. No real card is charged.
            </p>
          </aside>
        </form>
      </section>
    </main>
  )
}

export default Checkout
