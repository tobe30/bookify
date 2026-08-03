import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Search,
  ShieldCheck,
  ShoppingCart,
  Target,
  Users,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import funaiLibrary from '../assets/funai-library.jpg'
import funaiLogo from '../assets/funai-logo.png'

const values = [
  {
    icon: BookOpen,
    title: 'Accessible learning',
    description: 'We make textbooks, course materials, and past questions easier for students to discover.',
  },
  {
    icon: Zap,
    title: 'Simple experience',
    description: 'From searching to checkout, every part of Bookify is designed to be quick and straightforward.',
  },
  {
    icon: ShieldCheck,
    title: 'Reliable service',
    description: 'Clear book information, accurate orders, and secure simulated payments create a dependable system.',
  },
]

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Find your book',
    description: 'Search by title or author, or browse materials using your department.',
  },
  {
    number: '02',
    icon: ShoppingCart,
    title: 'Add to your cart',
    description: 'Review the book, choose the quantity you need, and add it to your cart.',
  },
  {
    number: '03',
    icon: CheckCircle2,
    title: 'Complete checkout',
    description: 'Enter delivery information and complete a safe simulated payment.',
  },
]

function About() {
  return (
    <main className="bg-[#fbf8f2]">
      <section className="overflow-hidden bg-bookify-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-bookify-primary uppercase">
              About Bookify
            </p>
            <h1 className="mt-4 max-w-xl font-serif text-[clamp(2.8rem,5.6vw,5rem)] font-bold leading-[0.98] tracking-[-0.05em] text-bookify-ink">
              Books made easier for every FUNAI student.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-bookify-muted sm:text-lg">
              Bookify is an automated university bookshop created to help students find, order, and manage the books they need without the stress of manual searching.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/books"
                className="inline-flex items-center gap-2 rounded-full bg-bookify-primary px-7 py-3.5 text-sm font-bold text-white transition hover:bg-bookify-primary-dark"
              >
                Browse books <ArrowRight size={17} />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center rounded-full border border-black/10 bg-white px-7 py-3.5 text-sm font-bold text-bookify-ink transition hover:border-bookify-primary hover:text-bookify-primary"
              >
                How it works
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-5 -top-5 size-32 rounded-full bg-bookify-primary/10" />
            <div className="absolute -bottom-6 -left-6 size-24 rounded-full border-[18px] border-bookify-primary/10" />
            <div className="relative overflow-hidden rounded-[28px] shadow-[0_24px_55px_rgba(30,24,18,0.14)]">
              <img
                src={funaiLibrary}
                alt="Alex Ekwueme Federal University library building"
                className="aspect-[4/3] h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bookify-primary-dark/35 to-transparent" />
              <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white/92 p-3 pr-5 shadow-lg backdrop-blur">
                <img src={funaiLogo} alt="" className="size-11 rounded-full object-cover" />
                <div>
                  <p className="text-xs text-bookify-muted">Built for students of</p>
                  <p className="text-sm font-bold text-bookify-ink">Alex Ekwueme Federal University</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
          <div>
            <span className="grid size-14 place-items-center rounded-2xl bg-bookify-primary/10 text-bookify-primary">
              <Target size={25} />
            </span>
            <p className="mt-5 text-xs font-bold tracking-[0.16em] text-bookify-primary uppercase">Our purpose</p>
            <h2 className="mt-2 font-serif text-3xl font-bold tracking-[-0.035em] text-bookify-ink sm:text-4xl">
              Making bookshop operations better.
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-serif text-xl font-bold text-bookify-ink">Our mission</h3>
              <p className="mt-3 text-sm leading-7 text-bookify-muted">
                To automate the daily operation of a university bookshop by providing a reliable platform for discovering books, placing orders, and managing purchases.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-bookify-ink">Our vision</h3>
              <p className="mt-3 text-sm leading-7 text-bookify-muted">
                To create a convenient digital bookshop where every student can quickly access the academic resources required for successful learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.16em] text-bookify-primary uppercase">What guides us</p>
          <h2 className="mt-2 font-serif text-3xl font-bold tracking-[-0.035em] text-bookify-ink sm:text-4xl">
            Designed around student needs
          </h2>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {values.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-2xl border border-black/8 bg-white p-6 shadow-[0_10px_30px_rgba(30,24,18,0.045)]"
            >
              <span className="grid size-12 place-items-center rounded-xl bg-bookify-primary/10 text-bookify-primary">
                <Icon size={22} />
              </span>
              <h3 className="mt-5 font-serif text-xl font-bold text-bookify-ink">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-bookify-muted">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="border-y border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-bookify-primary uppercase">The process</p>
              <h2 className="mt-2 font-serif text-3xl font-bold tracking-[-0.035em] text-bookify-ink sm:text-4xl">
                How Bookify works
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 text-sm text-bookify-muted">
              <Users size={18} className="text-bookify-primary" />
              Created for the university community
            </div>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {steps.map(({ number, icon: Icon, title, description }) => (
              <article key={number} className="relative overflow-hidden rounded-2xl bg-bookify-cream p-6">
                <span className="absolute right-4 top-2 font-serif text-6xl font-bold text-bookify-primary/8">
                  {number}
                </span>
                <span className="grid size-12 place-items-center rounded-xl bg-bookify-primary text-white">
                  <Icon size={21} />
                </span>
                <h3 className="mt-5 font-serif text-xl font-bold text-bookify-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-bookify-muted">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 overflow-hidden rounded-[28px] bg-bookify-primary-dark px-7 py-10 text-white sm:px-10 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.15em] text-white/65 uppercase">Start exploring</p>
            <h2 className="mt-2 max-w-xl font-serif text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              Find the right book for your next course.
            </h2>
          </div>
          <Link
            to="/books"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-bookify-primary-dark transition hover:-translate-y-0.5"
          >
            Visit the bookshop <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  )
}

export default About
