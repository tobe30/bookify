import {
  CreditCard,
  Headphones,
  RotateCcw,
  ShoppingCart,
  Truck,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import readerHero from '../assets/library-funai.jpeg'
import BookCard from '../components/BookCard'
import { getBooks } from '../lib/api'

const services = [
  {
    title: 'Free Delivery',
    description: 'For all member community',
    icon: Truck,
  },
  {
    title: 'Secure payments',
    description: 'Supports various payment',
    icon: CreditCard,
  },
  {
    title: '24/7 support',
    description: 'Ready to serve you',
    icon: Headphones,
  },
  {
    title: '90 Days Return',
    description: '90 Days Return',
    icon: RotateCcw,
  },
]

const categories = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Geology',
  'Biotechnology',
  'Business Administration',
  'Accounting',
  'Economics',
  'English',
  'Education',
  'Law',
  'Nursing',
  'Medicine',
  'Engineering',
  'Agriculture',
  'GST Materials',
  'Past Questions',
]

function BookListing({ books, isLoading, isError, onRetry }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-black/8 bg-white"
          >
            <div className="skeleton aspect-[4/5] w-full rounded-none bg-black/5" />
            <div className="space-y-3 p-4 sm:p-5">
              <div className="skeleton h-3 w-2/5 bg-black/5" />
              <div className="skeleton h-5 w-4/5 bg-black/5" />
              <div className="skeleton h-3 w-3/5 bg-black/5" />
              <div className="skeleton h-6 w-2/5 bg-black/5" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-dashed border-red-200 bg-white px-6 py-14 text-center">
        <h3 className="font-serif text-xl font-bold text-bookify-ink">
          Could not load books
        </h3>
        <p className="mt-2 text-sm text-bookify-muted">
          Please check your connection and try again.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-full bg-bookify-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-bookify-primary-dark"
        >
          Try again
        </button>
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-bookify-primary/20 bg-white px-6 py-14 text-center">
        <h3 className="font-serif text-xl font-bold text-bookify-ink">
          No books available yet
        </h3>
        <p className="mt-2 text-sm text-bookify-muted">
          New books added by the bookshop will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}

function Home() {
  const {
    data: books = [],
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['books'],
    queryFn: getBooks,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  })

  const markedFeaturedBooks = books.filter((book) => book.featured)
  const featuredBooks = (
    markedFeaturedBooks.length > 0 ? markedFeaturedBooks : books
  ).slice(0, 4)
  const newArrivals = books.slice(0, 4)

  return (
    <main id="home" className="bg-[#f4f4f4]">
      <section className="relative pb-44 sm:pb-28 lg:pb-[60px]">
        <div className="relative min-h-[610px] overflow-hidden sm:min-h-[650px] lg:min-h-[570px]">
          <img
            src={readerHero}
            alt="A student enjoying a book in a field"
            className="absolute inset-0 h-full w-full object-cover object-[68%_center] sm:object-[64%_center] lg:object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(21,14,9,0.68)_0%,rgba(21,14,9,0.46)_34%,rgba(21,14,9,0.08)_68%,rgba(21,14,9,0.04)_100%)]" />

          <div className="relative z-10 mx-auto flex min-h-[610px] max-w-7xl items-center px-6 pb-24 pt-16 sm:min-h-[650px] sm:px-10 lg:min-h-[570px] lg:px-10 lg:pb-20">
            <div className="max-w-[550px] text-white lg:-translate-y-7">
              <p className="mb-5 text-xs font-semibold tracking-[0.22em] uppercase sm:text-sm">
                Sale up to 20% off
              </p>
              <h1 className="max-w-[520px] text-[clamp(3.25rem,5.35vw,4.5rem)] font-normal leading-[1.01] tracking-[-0.035em]">
                Grab your next<br />favorite book
              </h1>
              <p className="mt-5 max-w-[545px] text-sm font-semibold leading-[1.34] text-white/95 sm:text-base lg:text-[17px]">
                Books are the quietest and most constant of friends; they are the most accessible and wisest of counselors, and the most patient of teachers.
              </p>
              <a
                href="#books"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-bookify-primary px-8 py-[17px] text-sm font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-bookify-primary-dark sm:text-base"
              >
                <ShoppingCart size={17} strokeWidth={2.4} />
                GO TO SHOP
              </a>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-8 z-20 sm:bottom-4 lg:bottom-0">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:gap-5 lg:px-10">
            {services.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="flex min-h-[88px] items-center gap-4 rounded-[27px] bg-white/95 px-5 py-4 shadow-[0_16px_38px_rgba(30,24,18,0.12)] backdrop-blur"
              >
                <div className="grid size-12 shrink-0 place-items-center text-bookify-primary">
                  <Icon size={34} strokeWidth={1.65} />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold leading-tight text-[#111] sm:text-base">{title}</h2>
                  <p className="mt-1 text-xs leading-snug text-[#817b78] sm:text-sm">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="categories" className="border-y border-black/5 bg-[#fbf8f2]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14 lg:px-10">
          <div className="mb-7 flex items-end justify-between gap-5">
            <div>
              <p className="mb-2 text-xs font-bold tracking-[0.18em] text-bookify-primary uppercase">
                Find your course materials
              </p>
              <h2 className="font-serif text-3xl font-bold tracking-[-0.025em] text-bookify-ink sm:text-4xl">
                Browse by category
              </h2>
            </div>
            <Link
              to="/books"
              className="shrink-0 text-sm font-bold text-bookify-primary transition hover:text-bookify-primary-dark"
            >
              View all <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category}
                to={`/books?category=${encodeURIComponent(category)}`}
                className="group flex min-h-[58px] items-center justify-center rounded-2xl border border-black/10 bg-white px-3 py-3 text-center font-serif text-sm font-semibold leading-tight text-bookify-ink shadow-[0_3px_12px_rgba(30,24,18,0.025)] transition duration-200 hover:-translate-y-0.5 hover:border-bookify-primary hover:bg-bookify-primary hover:text-white hover:shadow-[0_10px_24px_rgba(8,120,63,0.14)] sm:px-4 sm:text-[15px]"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="books" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
          <div className="mb-7 flex items-end justify-between gap-5">
            <div>
              <h2 className="font-serif text-3xl font-bold tracking-[-0.025em] text-bookify-ink sm:text-4xl">
                Featured books
              </h2>
              <p className="mt-1 text-sm text-bookify-muted">Handpicked for FUNAI students</p>
            </div>
            <Link to="/books?collection=featured" className="shrink-0 text-sm font-bold text-bookify-primary transition hover:text-bookify-primary-dark">
              View all <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <BookListing
            books={featuredBooks}
            isLoading={isPending}
            isError={isError}
            onRetry={refetch}
          />
        </div>
      </section>

      <section className="border-y border-black/5 bg-[#fbf8f2]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
          <div className="mb-7 flex items-end justify-between gap-5">
            <div>
              <h2 className="font-serif text-3xl font-bold tracking-[-0.025em] text-bookify-ink sm:text-4xl">
                New arrivals
              </h2>
              <p className="mt-1 text-sm text-bookify-muted">Fresh additions to our collection</p>
            </div>
            <Link to="/books?sort=newest" className="shrink-0 text-sm font-bold text-bookify-primary transition hover:text-bookify-primary-dark">
              View all <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <BookListing
            books={newArrivals}
            isLoading={isPending}
            isError={isError}
            onRetry={refetch}
          />
        </div>
      </section>
    </main>
  )
}

export default Home
