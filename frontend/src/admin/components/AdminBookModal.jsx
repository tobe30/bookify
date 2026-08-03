import { ImagePlus, Save, X } from 'lucide-react'
import { useState } from 'react'

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

function AdminBookModal({ book, onClose, onSave, isSaving = false }) {
  const inferredIsbn =
    book?.image?.match(/isbn\/([^-]+)-L/)?.[1] ?? ''

  const [form, setForm] = useState({
    title: book?.title ?? '',
    author: book?.author ?? '',
    isbn: book?.isbn ?? inferredIsbn,
    category: book?.category ?? 'Computer Science',
    price: book?.price ?? '',
    stock: book?.stock ?? '',
    description: book?.description ?? '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(book?.image ?? '')

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const updateImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImageFile(file)

    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSave({
      ...book,
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      image: imagePreview,
      imageFile,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4"
      role="presentation"
      onMouseDown={isSaving ? undefined : onClose}
    >
      <section
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-black/10 bg-[#fffdf9] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-form-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 sm:px-7">
          <div>
            <h2
              id="book-form-title"
              className="font-serif text-2xl font-bold text-bookify-ink"
            >
              {book ? 'Edit book' : 'Add a new book'}
            </h2>
            <p className="mt-0.5 text-sm text-bookify-muted">
              Enter the book and inventory information.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="grid size-9 place-items-center rounded-full text-bookify-muted transition hover:bg-black/5 hover:text-bookify-ink"
            aria-label="Close book form"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
          <label className="grid gap-2 text-sm font-semibold text-bookify-ink sm:col-span-2">
            Book title
            <input
              required
              name="title"
              value={form.title}
              onChange={updateField}
              placeholder="Enter the book title"
              className="h-11 rounded-xl border border-black/10 bg-white px-4 font-normal outline-none transition focus:border-bookify-primary focus:ring-2 focus:ring-bookify-primary/15"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-bookify-ink">
            Author
            <input
              required
              name="author"
              value={form.author}
              onChange={updateField}
              placeholder="Enter the author's name"
              className="h-11 rounded-xl border border-black/10 bg-white px-4 font-normal outline-none transition focus:border-bookify-primary focus:ring-2 focus:ring-bookify-primary/15"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-bookify-ink">
            ISBN
            <input
              required
              name="isbn"
              value={form.isbn}
              onChange={updateField}
              placeholder="e.g. 9780132350884"
              inputMode="numeric"
              className="h-11 rounded-xl border border-black/10 bg-white px-4 font-normal outline-none transition focus:border-bookify-primary focus:ring-2 focus:ring-bookify-primary/15"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-bookify-ink">
            Category
            <select
              name="category"
              value={form.category}
              onChange={updateField}
              className="h-11 rounded-xl border border-black/10 bg-white px-4 font-normal outline-none transition focus:border-bookify-primary focus:ring-2 focus:ring-bookify-primary/15"
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-bookify-ink">
            Price (NGN)
            <input
              required
              min="0"
              type="number"
              name="price"
              value={form.price}
              onChange={updateField}
              placeholder="0"
              className="h-11 rounded-xl border border-black/10 bg-white px-4 font-normal outline-none transition focus:border-bookify-primary focus:ring-2 focus:ring-bookify-primary/15"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-bookify-ink">
            Stock
            <input
              required
              min="0"
              type="number"
              name="stock"
              value={form.stock}
              onChange={updateField}
              placeholder="0"
              className="h-11 rounded-xl border border-black/10 bg-white px-4 font-normal outline-none transition focus:border-bookify-primary focus:ring-2 focus:ring-bookify-primary/15"
            />
          </label>

          <div className="grid gap-2 sm:col-span-2">
            <span className="text-sm font-semibold text-bookify-ink">
              Cover image
            </span>
            <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-black/20 bg-white p-3 transition hover:border-bookify-primary hover:bg-bookify-primary/[0.025]">
              <span className="grid h-20 w-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-[#f3efe7] text-bookify-primary">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Selected book cover preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlus size={25} />
                )}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-bookify-primary">
                  {imageFile ? 'Change cover image' : 'Choose cover image'}
                </span>
                <span className="mt-1 block truncate text-xs font-normal text-bookify-muted">
                  {imageFile?.name ?? 'JPG, PNG or WEBP'}
                </span>
              </span>
              <input
                required={!book}
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/webp"
                onChange={updateImage}
                className="sr-only"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-bookify-ink sm:col-span-2">
            Description
            <textarea
              required
              name="description"
              value={form.description}
              onChange={updateField}
              placeholder="Write a short description of the book..."
              rows="4"
              className="resize-y rounded-xl border border-black/10 bg-white px-4 py-3 font-normal leading-6 outline-none transition focus:border-bookify-primary focus:ring-2 focus:ring-bookify-primary/15"
            />
          </label>

          <div className="flex justify-end gap-3 pt-1 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="h-11 rounded-xl border border-black/10 bg-white px-5 text-sm font-bold text-bookify-ink transition hover:bg-black/[0.03] disabled:cursor-wait disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-bookify-primary px-5 text-sm font-bold text-white transition hover:bg-bookify-primary-dark disabled:cursor-wait disabled:opacity-70"
            >
              {isSaving ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <Save size={17} />
              )}
              {isSaving
                ? book
                  ? 'Saving changes...'
                  : 'Adding book...'
                : book
                  ? 'Save changes'
                  : 'Add book'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AdminBookModal
