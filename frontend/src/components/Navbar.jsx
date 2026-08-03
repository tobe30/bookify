import { useState } from 'react'
import { Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import funaiLogo from '../assets/funai-logo.png'
import useCart from '../context/useCart'
import { getAuthuser, logout } from '../lib/api'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Books', href: '/books' },
  { label: 'Categories', href: '/#categories' },
  { label: 'About', href: '/about' },
]

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const { cartCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const authUserQuery = useQuery({
    queryKey: ['authUser'],
    queryFn: getAuthuser,
    retry: false,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(['authUser'], null)
      navigate('/login')
    },
  })

  const handleSearch = (event) => {
    event.preventDefault()
    const query = searchQuery.trim()

    if (query) {
      navigate(`/books?search=${encodeURIComponent(query)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <header className="relative z-50 bg-white">
      <div className="bg-bookify-primary px-4 py-2 text-center text-[11px] font-semibold tracking-[0.16em] text-white uppercase sm:text-xs">
        Free delivery on orders over &#8358;25,000
      </div>

      <nav className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link to="/" className="group flex items-center gap-2.5" aria-label="Bookify home">
          <span className="size-12 overflow-hidden rounded-full border-2 border-bookify-primary/15 bg-white shadow-sm transition-transform group-hover:-rotate-3">
            <img src={funaiLogo} alt="Alex Ekwueme Federal University logo" className="h-full w-full object-cover" />
          </span>
          <span className="font-serif text-2xl font-bold tracking-tight text-bookify-ink">Bookify<span className="text-bookify-primary">.</span></span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`nav-link ${
                (link.href === '/' && location.pathname === '/') ||
                (link.href === '/books' && location.pathname === '/books') ||
                (link.href === '/about' && location.pathname === '/about')
                  ? 'nav-link-active'
                  : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            className="nav-icon"
            onClick={() => {
              setSearchOpen(!searchOpen)
              setMenuOpen(false)
            }}
            aria-label={searchOpen ? 'Close search' : 'Search books'}
            aria-expanded={searchOpen}
          >
            {searchOpen ? <X size={19} /> : <Search size={19} />}
          </button>
          <Link to="/dashboard" className="nav-icon hidden sm:grid" aria-label="User dashboard"><UserRound size={19} /></Link>
          <Link to="/cart" className="nav-icon relative" aria-label={`Shopping cart with ${cartCount} items`}>
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="absolute right-0.5 top-0.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-bookify-primary px-1 text-[9px] font-bold text-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
          {authUserQuery.data ? (
            <>
              <Link to="/dashboard" className="ml-2 hidden rounded-full bg-bookify-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-bookify-primary-dark md:inline-flex">
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => logoutMutation.mutate()}
                className="ml-2 hidden rounded-full border border-bookify-primary bg-white px-5 py-2.5 text-sm font-semibold text-bookify-primary transition hover:bg-bookify-primary/10 md:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="ml-2 hidden rounded-full bg-bookify-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-bookify-primary md:inline-flex">
              Sign in
            </Link>
          )}
          <button
            className="nav-icon mobile-menu-trigger ml-1"
            onClick={() => {
              setMenuOpen(!menuOpen)
              setSearchOpen(false)
            }}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>

      {searchOpen && (
        <div className="absolute inset-x-0 top-full border-t border-black/5 bg-white px-5 py-4 shadow-xl">
          <form onSubmit={handleSearch} className="mx-auto flex max-w-3xl items-center gap-2 rounded-full border border-black/10 bg-[#f7f4ef] p-1.5 pl-5 focus-within:border-bookify-primary/40 focus-within:ring-4 focus-within:ring-bookify-primary/5">
            <Search size={19} className="shrink-0 text-bookify-muted" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by book title or author..."
              className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm text-bookify-ink outline-none placeholder:text-bookify-muted/70 sm:text-base"
              autoFocus
            />
            <button type="submit" className="rounded-full bg-bookify-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-bookify-primary-dark sm:px-7">
              Search
            </button>
          </form>
        </div>
      )}

      {menuOpen && (
        <div className="absolute inset-x-0 top-full border-t border-black/5 bg-white px-6 py-5 shadow-xl lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.href} onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 font-semibold text-bookify-ink hover:bg-bookify-cream hover:text-bookify-primary">
                {link.label}
              </Link>
            ))}
            {authUserQuery.data ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="mt-2 rounded-xl bg-bookify-primary px-4 py-3 text-center font-semibold text-white sm:hidden">Dashboard</Link>
                <button
                  type="button"
                  onClick={() => {
                    logoutMutation.mutate()
                    setMenuOpen(false)
                  }}
                  className="mt-2 rounded-xl border border-bookify-primary bg-white px-4 py-3 text-center font-semibold text-bookify-primary hover:bg-bookify-primary/10 sm:hidden"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="mt-2 rounded-xl bg-bookify-primary px-4 py-3 text-center font-semibold text-white sm:hidden">Sign in</Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
