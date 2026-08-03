import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import useCart from '../context/useCart'

function Cart() {
  const { items, updateCartQuantity, cartCount } = useCart()

  const subtotal = items.reduce(
    (total, item) => total + item.book.price * item.quantity,
    0,
  )
  const shipping = subtotal === 0 || subtotal >= 25000 ? 0 : 2500
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <main className="grid min-h-[65vh] place-items-center bg-[#fbf8f2] px-5 py-20 text-center">
        <div className="max-w-md">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-bookify-primary/10 text-bookify-primary">
            <ShoppingBag size={34} />
          </span>
          <h1 className="mt-6 font-serif text-4xl font-bold tracking-[-0.03em] text-bookify-ink">
            Your cart is empty
          </h1>
          <p className="mt-3 text-sm leading-6 text-bookify-muted">
            Browse the Bookify catalogue and add the books you need for your studies.
          </p>
          <Link
            to="/books"
            className="mt-7 inline-flex rounded-full bg-bookify-primary px-7 py-3 text-sm font-bold text-white transition hover:bg-bookify-primary-dark"
          >
            Browse books
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-110px)] bg-[#fbf8f2]">
      <section className="mx-auto max-w-[980px] px-5 py-10 sm:px-8 md:py-14 lg:px-5">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-bold tracking-[0.14em] text-bookify-primary uppercase">
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </p>
            <h1 className="font-serif text-4xl font-bold tracking-[-0.035em] text-bookify-ink">
              Your cart
            </h1>
          </div>
          <Link to="/books" className="text-sm font-bold text-bookify-primary hover:text-bookify-primary-dark">
            Continue shopping
          </Link>
        </div>

        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_324px]">
          <div className="space-y-4">
            {items.map(({ book, quantity }) => (
              <article
                key={book.id}
                className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 rounded-2xl border border-black/10 bg-white p-3 shadow-[0_8px_25px_rgba(30,24,18,0.04)] sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:p-4"
              >
                <Link
                  to={`/books/${book.id}`}
                  className="aspect-[4/5] overflow-hidden rounded-xl bg-[#eeeae3]"
                >
                  <img
                    src={book.image}
                    alt={`${book.title} book cover`}
                    className="h-full w-full object-cover"
                  />
                </Link>

                <div className="min-w-0 py-1">
                  <p className="text-[10px] font-bold tracking-[0.08em] text-bookify-primary uppercase">
                    {book.category}
                  </p>
                  <Link to={`/books/${book.id}`}>
                    <h2 className="mt-1 truncate font-serif text-lg font-bold text-bookify-ink transition hover:text-bookify-primary">
                      {book.title}
                    </h2>
                  </Link>
                  <p className="mt-0.5 truncate text-xs text-bookify-muted">by {book.author}</p>
                  <p className="mt-2 text-sm font-bold text-bookify-ink">
                    &#8358;{book.price.toLocaleString()}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="flex h-8 items-center rounded-lg border border-black/10">
                      <button
                        type="button"
                        aria-label={`Decrease ${book.title} quantity`}
                        onClick={() => updateCartQuantity(book.id, quantity - 1)}
                        className="grid h-full w-8 place-items-center transition hover:text-bookify-primary"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-7 text-center text-xs font-bold">{quantity}</span>
                      <button
                        type="button"
                        aria-label={`Increase ${book.title} quantity`}
                        onClick={() => updateCartQuantity(book.id, quantity + 1)}
                        className="grid h-full w-8 place-items-center transition hover:text-bookify-primary"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        updateCartQuantity(book.id, 0)
                        toast.success(`${book.title} removed from cart`)
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 transition hover:text-red-700"
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                </div>

                <p className="col-start-2 row-start-2 self-end text-right text-base font-bold text-bookify-primary sm:col-start-3 sm:row-start-1 sm:pt-2">
                  &#8358;{(book.price * quantity).toLocaleString()}
                </p>
              </article>
            ))}
          </div>

          <aside className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_35px_rgba(30,24,18,0.06)] lg:sticky lg:top-6">
            <h2 className="font-serif text-xl font-bold text-bookify-ink">Order summary</h2>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4 text-bookify-muted">
                <dt>Subtotal</dt>
                <dd className="font-semibold text-bookify-ink">&#8358;{subtotal.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between gap-4 text-bookify-muted">
                <dt>Shipping</dt>
                <dd className="font-semibold text-bookify-ink">
                  {shipping === 0 ? 'Free' : `₦${shipping.toLocaleString()}`}
                </dd>
              </div>
            </dl>

            {shipping > 0 && (
              <p className="mt-3 rounded-lg bg-bookify-primary/7 px-3 py-2 text-xs leading-5 text-bookify-primary">
                Add &#8358;{(25000 - subtotal).toLocaleString()} more to qualify for free delivery.
              </p>
            )}

            <div className="my-5 border-t border-black/10" />

            <div className="flex items-center justify-between">
              <span className="font-bold text-bookify-ink">Total</span>
              <strong className="text-xl text-bookify-primary">&#8358;{total.toLocaleString()}</strong>
            </div>

            <Link
              to="/checkout"
              className="mt-6 grid h-11 w-full place-items-center rounded-xl bg-bookify-primary-dark text-sm font-bold text-white transition hover:bg-bookify-primary"
            >
              Proceed to checkout
            </Link>
            <Link
              to="/books"
              className="mt-3 grid h-11 w-full place-items-center rounded-xl border border-black/10 text-sm font-bold text-bookify-ink transition hover:border-bookify-primary hover:text-bookify-primary"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default Cart
