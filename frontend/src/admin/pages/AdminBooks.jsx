import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AdminBookModal from '../components/AdminBookModal'
import {
  addBook,
  deleteBook,
  getAdminBooks,
  updateBook,
} from '../../lib/api'

const naira = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
})

const getIsbn = (book) =>
  book.isbn ?? book.image?.match(/isbn\/([^-]+)-L/)?.[1] ?? 'Not available'

const getBookId = (book) => book._id ?? book.id

function AdminBooks() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [modal, setModal] = useState(null)

  const {
    data: fetchedBooks = [],
    isPending: isLoadingBooks,
    isError: hasBooksError,
    error: booksError,
  } = useQuery({
    queryKey: ['adminBooks'],
    queryFn: getAdminBooks,
    retry: 1,
  })

  const bookList = fetchedBooks

  const { mutate: addBookMutation, isPending: isAddingBook } = useMutation({
    mutationFn: addBook,
    onSuccess: (data) => {
      queryClient.setQueryData(
        ['adminBooks'],
        (current = []) => [data.book, ...current],
      )
      setModal(null)
      toast.success(data.message || 'Book added successfully')
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          'Unable to add the book. Please try again.',
      )
    },
  })

  const { mutate: updateBookMutation, isPending: isUpdatingBook } = useMutation({
    mutationFn: updateBook,
    onSuccess: (data) => {
      queryClient.setQueryData(
        ['adminBooks'],
        (current = []) =>
          current.map((book) =>
            getBookId(book) === getBookId(data.book) ? data.book : book,
          ),
      )
      setModal(null)
      toast.success(data.message || 'Book updated successfully')
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          'Unable to update the book. Please try again.',
      )
    },
  })

  const {
    mutate: deleteBookMutation,
    isPending: isDeletingBook,
    variables: deletingBookId,
  } = useMutation({
    mutationFn: deleteBook,
    onSuccess: (data, bookId) => {
      queryClient.setQueryData(
        ['adminBooks'],
        (current = []) =>
          current.filter((book) => getBookId(book) !== bookId),
      )
      toast.success(data.message || 'Book removed from inventory')
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          'Unable to delete the book. Please try again.',
      )
    },
  })

  const filteredBooks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return bookList

    return bookList.filter((book) =>
      [book.title, book.author, book.category, book.isbn ?? ''].some((value) =>
        value.toLowerCase().includes(query),
      ),
    )
  }, [bookList, searchTerm])

  const handleSave = (book) => {
    const bookData = {
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      description: book.description,
      price: book.price,
      stock: book.stock,
    }

    if (modal.mode === 'edit') {
      updateBookMutation({
        bookId: getBookId(book),
        bookData,
        image: book.imageFile,
      })
      return
    }

    if (!book.imageFile) {
      toast.error('Please select a cover image')
      return
    }

    addBookMutation({
      bookData,
      image: book.imageFile,
    })
  }

  const handleDelete = (book) => {
    const confirmed = window.confirm(`Delete "${book.title}" from inventory?`)
    if (!confirmed) return

    deleteBookMutation(getBookId(book))
  }

  if (isLoadingBooks) {
    return (
      <div className="grid min-h-[420px] place-items-center rounded-2xl border border-black/10 bg-white">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-bookify-primary" />
          <p className="mt-3 text-sm font-semibold text-bookify-muted">
            Loading books...
          </p>
        </div>
      </div>
    )
  }

  if (hasBooksError) {
    return (
      <div className="grid min-h-[320px] place-items-center rounded-2xl border border-red-200 bg-white px-5 text-center">
        <div>
          <p className="font-serif text-xl font-bold text-bookify-ink">
            Could not load books
          </p>
          <p className="mt-2 text-sm text-bookify-muted">
            {booksError.response?.data?.message ||
              'Please check your server connection and try again.'}
          </p>
          <button
            type="button"
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ['adminBooks'] })
            }
            className="mt-5 rounded-xl bg-bookify-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-bookify-primary-dark"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <section className="min-w-0 max-w-full pb-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-[346px]">
          <span className="sr-only">Search books</span>
          <Search
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-bookify-muted"
          />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search books..."
            className="h-11 w-full rounded-xl border border-black/10 bg-white pl-10 pr-4 text-sm text-bookify-ink outline-none transition placeholder:text-bookify-muted/80 focus:border-bookify-primary focus:ring-2 focus:ring-bookify-primary/15"
          />
        </label>

        <button
          type="button"
          onClick={() => setModal({ mode: 'add' })}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-bookify-primary px-5 text-sm font-bold text-white shadow-sm transition hover:bg-bookify-primary-dark"
        >
          <Plus size={18} />
          Add book
        </button>
      </div>

      <div className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
        <div className="hidden max-w-full overflow-x-auto md:block">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="bg-[#faf7f1]">
              <tr className="text-[11px] font-bold uppercase tracking-wide text-bookify-muted">
                <th className="px-4 py-3.5">Book</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Price</th>
                <th className="px-4 py-3.5">Stock</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr
                  key={getBookId(book)}
                  className="border-t border-black/10 transition hover:bg-bookify-primary/[0.025]"
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={book.image}
                        alt=""
                        className="h-12 w-9 shrink-0 rounded object-cover bg-[#eee9e0]"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold leading-tight text-bookify-ink">
                          {book.title}
                        </p>
                        <p className="mt-0.5 text-xs text-bookify-muted">
                          by {book.author}
                        </p>
                        <p className="mt-0.5 text-[11px] text-bookify-muted/80">
                          ISBN: {getIsbn(book)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-sm text-bookify-ink">
                    {book.category}
                  </td>
                  <td className="px-4 py-2.5 text-sm font-semibold text-bookify-ink">
                    {naira.format(book.price)}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                        book.stock <= 15
                          ? 'bg-red-50 text-red-600'
                          : 'bg-bookify-primary/10 text-bookify-primary'
                      }`}
                    >
                      {book.stock}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setModal({ mode: 'edit', book })}
                        className="grid size-9 place-items-center rounded-lg text-bookify-ink transition hover:bg-bookify-primary/10 hover:text-bookify-primary"
                        aria-label={`Edit ${book.title}`}
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(book)}
                        disabled={
                          isDeletingBook &&
                          deletingBookId === getBookId(book)
                        }
                        className="grid size-9 place-items-center rounded-lg text-red-500 transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-50"
                        aria-label={`Delete ${book.title}`}
                      >
                        {isDeletingBook &&
                        deletingBookId === getBookId(book) ? (
                          <span className="loading loading-spinner loading-xs" />
                        ) : (
                          <Trash2 size={17} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-black/10 md:hidden">
          {filteredBooks.map((book) => (
            <article key={getBookId(book)} className="p-4">
              <div className="flex items-start gap-3">
                <img
                  src={book.image}
                  alt=""
                  className="h-[76px] w-14 shrink-0 rounded-lg bg-[#eee9e0] object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold leading-tight text-bookify-ink">
                    {book.title}
                  </h2>
                  <p className="mt-1 truncate text-xs text-bookify-muted">
                    by {book.author}
                  </p>
                  <p className="mt-1 text-[11px] text-bookify-muted/80">
                    ISBN: {getIsbn(book)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => setModal({ mode: 'edit', book })}
                    className="grid size-9 place-items-center rounded-lg text-bookify-ink transition hover:bg-bookify-primary/10 hover:text-bookify-primary"
                    aria-label={`Edit ${book.title}`}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(book)}
                    disabled={
                      isDeletingBook &&
                      deletingBookId === getBookId(book)
                    }
                    className="grid size-9 place-items-center rounded-lg text-red-500 transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-50"
                    aria-label={`Delete ${book.title}`}
                  >
                    {isDeletingBook &&
                    deletingBookId === getBookId(book) ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-[#faf7f1] p-3">
                <div className="min-w-0">
                  <dt className="text-[10px] font-bold uppercase text-bookify-muted">
                    Category
                  </dt>
                  <dd className="mt-1 truncate text-xs font-semibold text-bookify-ink">
                    {book.category}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase text-bookify-muted">
                    Price
                  </dt>
                  <dd className="mt-1 text-xs font-semibold text-bookify-ink">
                    {naira.format(book.price)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase text-bookify-muted">
                    Stock
                  </dt>
                  <dd
                    className={`mt-1 text-xs font-bold ${
                      book.stock <= 15 ? 'text-red-600' : 'text-bookify-primary'
                    }`}
                  >
                    {book.stock}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="px-6 py-16 text-center">
            <p className="font-serif text-xl font-bold text-bookify-ink">
              No books found
            </p>
            <p className="mt-1 text-sm text-bookify-muted">
              Try a different title, author, or category.
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-black/10 bg-[#faf7f1] px-4 py-3 text-xs text-bookify-muted">
          <span>
            Showing {filteredBooks.length} of {bookList.length} books
          </span>
          <span>{bookList.reduce((total, book) => total + book.stock, 0)} items in stock</span>
        </div>
      </div>

      {modal && (
        <AdminBookModal
          key={modal.book ? getBookId(modal.book) : 'new-book'}
          book={modal.book}
          onClose={() => setModal(null)}
          onSave={handleSave}
          isSaving={isAddingBook || isUpdatingBook}
        />
      )}
    </section>
  )
}

export default AdminBooks
