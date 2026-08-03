import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Check, Minus, Plus, ShoppingCart } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getBookById } from '../lib/api'
import useCart from '../context/useCart'

function BookDetails() {
  const { bookId } = useParams()
  const { items, addToCart, updateCartQuantity } = useCart()

  const {
    data: book,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => getBookById(bookId),
    enabled: Boolean(bookId),
  })

  const bookIdKey = book?.id ?? book?._id
  const cartQuantity =
    items.find((item) => item.book.id === bookIdKey)?.quantity ?? 0

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [bookId])

  if (isLoading) {
    return (
      <main className="grid min-h-[65vh] place-items-center bg-[#fbf8f2] px-5 text-center">
        <p className="text-sm text-bookify-muted">Loading book...</p>
      </main>
    )
  }

  if (isError || !book) {
    return (
      <main className="grid min-h-[65vh] place-items-center bg-[#fbf8f2] px-5 text-center">
        <div>
          <p className="text-sm font-bold text-bookify-primary">404</p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-bookify-ink">Book not found</h1>
          <Link to="/books" className="mt-6 inline-flex rounded-full bg-bookify-primary px-6 py-3 text-sm font-bold text-white">
            Back to books
          </Link>
        </div>
      </main>
    )
  }

  const stock = book.stock ?? 0

  return (
    <main className="min-h-[calc(100vh-110px)] bg-[#fbf8f2]">
      <section className="mx-auto max-w-[1040px] px-5 py-8 sm:px-8 md:py-10 lg:px-5">
        <Link
          to="/books"
          className="mb-6 inline-flex items-center gap-2 text-sm text-bookify-muted transition hover:text-bookify-primary"
        >
          <ArrowLeft size={16} />
          Back to books
        </Link>

        <div className="grid items-start gap-8 md:grid-cols-2 md:gap-9">
          <div className="aspect-[1.05/1] overflow-hidden rounded-2xl bg-[#e9e5de]">
            <img
              src={book.image}
              alt={`${book.title} book cover`}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="pt-1">
            <p className="text-[11px] font-bold tracking-[0.08em] text-bookify-primary uppercase">
              {book.category}
            </p>

            <h1 className="mt-3 font-serif text-[clamp(2rem,3.1vw,2.55rem)] font-bold leading-[1.05] tracking-[-0.035em] text-bookify-ink">
              {book.title}
            </h1>

            <p className="mt-3 text-base text-bookify-ink">
              by <span className="font-semibold">{book.author}</span>
            </p>

            <div className="mt-6 flex items-center gap-4">
              <p className="text-3xl font-bold text-bookify-ink">
                &#8358;{book.price.toLocaleString()}
              </p>
              {stock > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-bookify-primary/10 px-2.5 py-1 text-[11px] font-bold text-bookify-primary">
                  <Check size={12} />
                  In stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-[11px] font-bold text-red-600">
                  Out of stock
                </span>
              )}
            </div>

            <p className="mt-6 text-sm leading-6 text-bookify-muted">
              {book.description || 'A carefully selected university title for study, revision, and independent learning.'}
            </p>

            <dl className="mt-6 grid grid-cols-2 border-y border-black/10 py-5">
              <div>
                <dt className="text-xs text-bookify-muted">ISBN</dt>
                <dd className="mt-1 text-sm font-semibold text-bookify-ink">{book.isbn || 'Not available'}</dd>
              </div>
              <div>
                <dt className="text-xs text-bookify-muted">Available</dt>
                <dd className="mt-1 text-sm font-semibold text-bookify-ink">
                  {stock > 0 ? `${stock} in stock` : '0 in stock'}
                </dd>
              </div>
            </dl>

            <div
              className={`mt-7 grid gap-3 ${
                cartQuantity > 0
                  ? 'grid-cols-[96px_minmax(0,1fr)] sm:grid-cols-[96px_minmax(0,1fr)_104px]'
                  : 'grid-cols-[minmax(0,1fr)_104px]'
              }`}
            >
              {cartQuantity > 0 && (
                <div className="flex h-11 items-center rounded-xl border border-black/10 bg-white">
                  <button
                    type="button"
                    aria-label="Decrease cart quantity"
                    onClick={() => updateCartQuantity(book.id, cartQuantity - 1)}
                    className="grid h-full flex-1 place-items-center transition hover:text-bookify-primary"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold">{cartQuantity}</span>
                  <button
                    type="button"
                    aria-label="Increase cart quantity"
                    disabled={cartQuantity === stock}
                    onClick={() => updateCartQuantity(book.id, Math.min(stock, cartQuantity + 1))}
                    className="grid h-full flex-1 place-items-center transition hover:text-bookify-primary disabled:opacity-30"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              )}

              <button
                type="button"
                disabled={cartQuantity > 0 || stock === 0}
                onClick={() => {
                  addToCart({ ...book, id: book.id ?? book._id })
                  toast.success(`${book.title} added to cart`)
                }}
                className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-xl bg-bookify-primary-dark px-4 text-sm font-bold text-white transition hover:bg-bookify-primary disabled:cursor-default disabled:bg-bookify-primary/85"
              >
                {cartQuantity > 0 ? <Check size={16} /> : <ShoppingCart size={16} />}
                {cartQuantity > 0 ? 'Added to cart' : stock === 0 ? 'Out of stock' : 'Add to cart'}
              </button>

              <button
                type="button"
                disabled={stock === 0}
                onClick={() => toast.success(`${book.title} is ready for checkout`)}
                className={`h-11 rounded-xl bg-bookify-primary px-4 text-sm font-bold text-white transition hover:bg-bookify-primary-dark disabled:cursor-default disabled:opacity-50 ${
                  cartQuantity > 0 ? 'col-span-2 sm:col-span-1' : ''
                }`}
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default BookDetails