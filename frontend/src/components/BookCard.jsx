import { ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import useCart from '../context/useCart'

function BookCard({ book }) {
  const { addToCart } = useCart()
  const {
    id,
    title = 'Untitled',
    author = 'Unknown author',
    category = 'Uncategorized',
    price,
    image,
    stock = 0,
    isNew = false,
  } = book

  const displayPrice = typeof price === 'number' ? price.toLocaleString() : '—'
  const isOutOfStock = stock === 0

  return (
    <article className="group overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_8px_24px_rgba(30,24,18,0.06)] transition duration-300 hover:-translate-y-1 hover:border-bookify-primary/30 hover:shadow-[0_18px_40px_rgba(8,120,63,0.12)]">
      <div className="relative block aspect-[4/5] overflow-hidden bg-[#eeeae3]">
        <Link to={`/books/${id}`} className="block h-full w-full" aria-label={`View ${title}`}>
          <img
            src={image || '/placeholder-book.png'}
            alt={`${title} book cover`}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = '/placeholder-book.png'
            }}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
          />
        </Link>

        {isNew && (
          <span className="absolute left-3 top-3 rounded-full bg-bookify-primary px-3 py-1 text-[10px] font-bold tracking-[0.12em] text-white uppercase shadow-sm">
            New
          </span>
        )}

        {isOutOfStock ? (
          <span className="absolute bottom-3 right-3 rounded-full bg-red-500 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-lg">
            Out of stock
          </span>
        ) : (
          <button
            type="button"
            aria-label={`Add ${title} to cart`}
            onClick={() => {
              addToCart(book)
              toast.success(`${title} added to cart`)
            }}
            className="absolute bottom-3 right-3 grid size-11 translate-y-2 place-items-center rounded-full bg-bookify-primary text-white opacity-0 shadow-lg transition duration-200 hover:bg-bookify-primary-dark group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100"
          >
            <ShoppingCart size={18} />
          </button>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <p className="text-[10px] font-bold tracking-[0.08em] text-bookify-primary uppercase sm:text-[11px]">
          {category}
        </p>
        <Link to={`/books/${id}`} className="mt-1.5 block">
          <h3 className="line-clamp-2 min-h-[2.75rem] font-serif text-base font-bold leading-snug text-bookify-ink transition group-hover:text-bookify-primary sm:text-lg">
            {title}
          </h3>
        </Link>
        <p className="mt-1 truncate text-xs text-bookify-muted sm:text-sm">by {author}</p>
        <p className="mt-4 text-lg font-bold text-bookify-primary sm:text-xl">
          &#8358;{displayPrice}
        </p>
      </div>
    </article>
  )
}

export default BookCard