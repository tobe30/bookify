import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import BookCard from '../components/BookCard'
import { getBooks } from '../lib/api' // adjust path to match where your api.js actually lives
import { categories } from '../data/categories'

function AllBooks() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('search') ?? ''
  const category = searchParams.get('category') ?? 'All'
  const sortBy = searchParams.get('sort') ?? 'newest'
  const collection = searchParams.get('collection')

  const {
    data: books = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['books'],
    queryFn: getBooks,
  })

  const updateFilter = (name, value, defaultValue) => {
    const nextParams = new URLSearchParams(searchParams)

    if (!value || value === defaultValue) {
      nextParams.delete(name)
    } else {
      nextParams.set(name, value)
    }

    setSearchParams(nextParams, { replace: true })
  }

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return books
      .filter((book) => {
        const matchesSearch =
          !normalizedQuery ||
          book.title.toLowerCase().includes(normalizedQuery) ||
          book.author.toLowerCase().includes(normalizedQuery)
        const matchesCategory = category === 'All' || book.category === category
        const matchesCollection = collection !== 'featured' || book.featured

        return matchesSearch && matchesCategory && matchesCollection
      })
      .sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title)
        if (sortBy === 'price-low') return a.price - b.price
        if (sortBy === 'price-high') return b.price - a.price
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
  }, [books, category, collection, query, sortBy])

  const resetFilters = () => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('search')
    nextParams.delete('category')
    nextParams.delete('sort')
    setSearchParams(nextParams, { replace: true })
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#fbf8f2] px-5 py-24 text-center">
        <p className="text-sm text-bookify-muted">Loading books...</p>
      </main>
    )
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-[#fbf8f2] px-5 py-24 text-center">
        <p className="text-sm text-bookify-muted">
          Could not load books{error?.message ? `: ${error.message}` : '.'}
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fbf8f2]">
      <section className="border-b border-black/5 bg-bookify-cream">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14 lg:px-10">
          <p className="mb-2 text-xs font-bold tracking-[0.18em] text-bookify-primary uppercase">
            Bookify catalogue
          </p>
          <h1 className="font-serif text-4xl font-bold tracking-[-0.035em] text-bookify-ink sm:text-5xl">
            {collection === 'featured' ? 'Featured books' : 'All books'}
          </h1>
          <p className="mt-2 text-sm text-bookify-muted sm:text-base">
            Search, filter, and find the right book for your next course or study session.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-9 sm:px-8 lg:px-10 lg:py-12">
        <div className="mb-8 grid gap-3 rounded-2xl border border-black/7 bg-white p-3 shadow-[0_8px_25px_rgba(30,24,18,0.04)] md:grid-cols-[1fr_190px_180px]">
          <label className="flex min-h-12 items-center gap-3 rounded-xl border border-black/10 px-4 focus-within:border-bookify-primary/50 focus-within:ring-4 focus-within:ring-bookify-primary/5">
            <Search size={18} className="shrink-0 text-bookify-muted" />
            <span className="sr-only">Search books</span>
            <input
              type="search"
              value={query}
              onChange={(event) =>
                updateFilter('search', event.target.value, '')
              }
              placeholder="Search title or author..."
              className="min-w-0 flex-1 bg-transparent py-3 text-sm text-bookify-ink outline-none placeholder:text-bookify-muted/70"
            />
          </label>

          <label className="relative">
            <span className="sr-only">Filter by category</span>
            <select
              value={category}
              onChange={(event) =>
                updateFilter('category', event.target.value, 'All')
              }
              className="min-h-12 w-full appearance-none rounded-xl border border-black/10 bg-white px-4 pr-10 text-sm text-bookify-ink outline-none transition focus:border-bookify-primary/50 focus:ring-4 focus:ring-bookify-primary/5"
            >
              <option value="All">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <SlidersHorizontal size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-bookify-muted" />
          </label>

          <label>
            <span className="sr-only">Sort books</span>
            <select
              value={sortBy}
              onChange={(event) =>
                updateFilter('sort', event.target.value, 'newest')
              }
              className="min-h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-bookify-ink outline-none transition focus:border-bookify-primary/50 focus:ring-4 focus:ring-bookify-primary/5"
            >
              <option value="newest">Newest</option>
              <option value="title">Title A–Z</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
        </div>

        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-sm text-bookify-muted">
            Showing <strong className="text-bookify-ink">{filteredBooks.length}</strong> books
          </p>
          {(query || category !== 'All' || sortBy !== 'newest') && (
            <button type="button" onClick={resetFilters} className="text-sm font-bold text-bookify-primary hover:text-bookify-primary-dark">
              Clear filters
            </button>
          )}
        </div>

        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-bookify-primary/25 bg-white px-6 py-20 text-center">
            <h2 className="font-serif text-2xl font-bold text-bookify-ink">No books found</h2>
            <p className="mt-2 text-sm text-bookify-muted">Try a different title, author, or category.</p>
            <button type="button" onClick={resetFilters} className="mt-5 rounded-full bg-bookify-primary px-6 py-3 text-sm font-bold text-white hover:bg-bookify-primary-dark">
              Reset filters
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

export default AllBooks