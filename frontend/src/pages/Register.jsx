import { useState } from 'react'
import {
  BookOpen,
  Eye,
  EyeOff,
  IdCard,
  LockKeyhole,
  Mail,
  UserRound,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import funaiLogo from '../assets/funai-logo.png'
import { signup } from '../lib/api'

function Register() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showPassword, setShowPassword] = useState(false)

  const { mutate: signupMutation, isPending } = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      queryClient.setQueryData(['authUser'], data.user)
      window.localStorage.setItem('bookifyUserName', data.user.fullName)
      toast.success(data.message || 'Your Bookify account has been created')
      navigate('/dashboard')
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          'Unable to create your account. Please try again.',
      )
    },
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const fullName = formData.get('fullName')?.toString().trim() || ''
    const regNumber = formData.get('regNumber')?.toString().trim() || ''
    const email = formData.get('email')?.toString().trim() || ''
    const password = formData.get('password')?.toString() || ''

    signupMutation({
      fullName,
      regNumber,
      email,
      password,
    })
  }

  const fieldClass =
    'h-12 w-full rounded-xl border border-black/10 bg-[#fbf8f2] pl-11 pr-4 text-sm text-bookify-ink outline-none transition placeholder:text-bookify-muted/55 focus:border-bookify-primary/50 focus:ring-4 focus:ring-bookify-primary/5'

  return (
    <main className="bg-[#fbf8f2] px-5 py-12 sm:px-8 sm:py-16">
      <section className="mx-auto grid max-w-[960px] overflow-hidden rounded-[28px] border border-black/8 bg-white shadow-[0_24px_65px_rgba(30,24,18,0.1)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden overflow-hidden bg-bookify-primary-dark p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-20 -top-20 size-64 rounded-full border-[45px] border-white/5" />
          <div className="absolute -bottom-24 -left-20 size-72 rounded-full bg-white/5" />

          <Link to="/" className="relative inline-flex items-center gap-3">
            <span className="size-14 overflow-hidden rounded-full border-2 border-white/25 bg-white">
              <img src={funaiLogo} alt="Alex Ekwueme Federal University logo" className="h-full w-full object-cover" />
            </span>
            <span className="font-serif text-2xl font-bold">Bookify.</span>
          </Link>

          <div className="relative py-16">
            <span className="grid size-12 place-items-center rounded-xl bg-white/10">
              <BookOpen size={23} />
            </span>
            <h1 className="mt-6 font-serif text-4xl font-bold leading-tight tracking-[-0.04em]">
              Your university bookshop, all in one place.
            </h1>
            <p className="mt-4 text-sm leading-6 text-white/70">
              Create your account to order books, manage your cart, and keep track of your purchases.
            </p>
          </div>

          <p className="relative text-xs text-white/50">
            Alex Ekwueme Federal University, Ndufu-Alike
          </p>
        </div>

        <div className="px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
          <div className="lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img src={funaiLogo} alt="FUNAI logo" className="size-11 rounded-full object-cover" />
              <span className="font-serif text-xl font-bold text-bookify-ink">
                Bookify<span className="text-bookify-primary">.</span>
              </span>
            </Link>
          </div>

          <p className="mt-8 text-xs font-bold tracking-[0.15em] text-bookify-primary uppercase lg:mt-0">
            Create an account
          </p>
          <h2 className="mt-2 font-serif text-4xl font-bold tracking-[-0.04em] text-bookify-ink">
            Register
          </h2>
          <p className="mt-2 text-sm text-bookify-muted">
            Enter your information to start using Bookify.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block text-sm font-semibold text-bookify-ink">
              Full Name
              <span className="relative mt-2 block">
                <UserRound size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-bookify-muted" />
                <input
                  type="text"
                  name="fullName"
                  required
                  minLength="3"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  className={fieldClass}
                />
              </span>
            </label>

            <label className="block text-sm font-semibold text-bookify-ink">
              Registration Number
              <span className="relative mt-2 block">
                <IdCard size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-bookify-muted" />
                <input
                  type="text"
                  name="regNumber"
                  required
                  minLength="5"
                  autoComplete="off"
                  placeholder="Enter your registration number"
                  className={fieldClass}
                />
              </span>
            </label>

            <label className="block text-sm font-semibold text-bookify-ink">
              Email
              <span className="relative mt-2 block">
                <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-bookify-muted" />
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="student@example.com"
                  className={fieldClass}
                />
              </span>
            </label>

            <label className="block text-sm font-semibold text-bookify-ink">
              Password
              <span className="relative mt-2 block">
                <LockKeyhole size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-bookify-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  minLength="6"
                  autoComplete="new-password"
                  placeholder="Minimum of 6 characters"
                  className={`${fieldClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-bookify-muted transition hover:text-bookify-primary"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 h-12 w-full rounded-xl bg-bookify-primary text-sm font-bold text-white shadow-[0_10px_25px_rgba(8,120,63,0.17)] transition hover:bg-bookify-primary-dark disabled:cursor-wait disabled:opacity-70"
            >
              {isPending ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-bookify-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-bookify-primary hover:text-bookify-primary-dark">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Register
