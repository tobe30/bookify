import { Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import funaiLogo from '../assets/funai-logo.png'

const footerLinks = {
  Shop: [
    { label: 'All books', href: '/books' },
    { label: 'Featured books', href: '/books?collection=featured' },
    { label: 'New arrivals', href: '/books?sort=newest' },
    { label: 'Categories', href: '/#categories' },
  ],
  Company: [
    { label: 'About us', href: '/about' },
    { label: 'Contact', href: '#contact' },
    { label: 'FAQs', href: '#faqs' },
    { label: 'Order support', href: '#support' },
  ],
  Account: [
    { label: 'Login', href: '/login' },
    { label: 'Register', href: '/register' },
    { label: 'My orders', href: '/orders' },
    { label: 'Admin', href: '/admin' },
  ],
}

function Footer() {
  return (
    <footer className="overflow-hidden rounded-t-[28px] bg-bookify-primary-dark text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.35fr_0.8fr_0.8fr_0.8fr] lg:px-10 lg:py-14">
        <div className="max-w-sm">
          <Link to="/" className="inline-flex items-center gap-3" aria-label="Bookify home">
            <span className="size-14 overflow-hidden rounded-full border-2 border-white/25 bg-white shadow-sm">
              <img
                src={funaiLogo}
                alt="Alex Ekwueme Federal University logo"
                className="h-full w-full object-cover"
              />
            </span>
            <span className="font-serif text-2xl font-bold">Bookify.</span>
          </Link>

          <p className="mt-5 max-w-xs text-sm leading-6 text-white/75">
            Your automated university bookshop. Discover textbooks, course materials, and past questions effortlessly.
          </p>

          <div className="mt-6 space-y-2.5 text-sm text-white/75">
            <p className="flex items-center gap-3">
              <MapPin size={16} className="shrink-0 text-white" />
              FUNAI, Ndufu-Alike, Ebonyi State
            </p>
            <a href="mailto:support@bookify.edu.ng" className="flex items-center gap-3 transition hover:text-white">
              <Mail size={16} className="shrink-0 text-white" />
              support@bookify.edu.ng
            </a>
            <a href="tel:+2348000000000" className="flex items-center gap-3 transition hover:text-white">
              <Phone size={16} className="shrink-0 text-white" />
              +234 800 000 0000
            </a>
          </div>
        </div>

        {Object.entries(footerLinks).map(([heading, links]) => (
          <div key={heading}>
            <h2 className="font-serif text-lg font-bold">{heading}</h2>
            <ul className="mt-5 space-y-3">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="inline-block text-sm text-white/70 transition hover:translate-x-1 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/12">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-center text-xs text-white/60 sm:px-8 md:flex-row md:items-center md:justify-between md:text-left lg:px-10">
          <p>&copy; 2026 Bookify by Marizu Inc. &mdash; Automated Bookshop Management System</p>
          <p>Alex Ekwueme Federal University, Ndufu-Alike</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
