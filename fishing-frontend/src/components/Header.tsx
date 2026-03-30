import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { useAuth } from '../context/AuthProvider'
import { setLanguage } from '../i18n'

const categories = [
  { label: 'Всички', query: null },
  { label: 'Въдици', query: 'Vudici' },
  { label: 'Макари', query: 'Makari' },
  { label: 'Примамки', query: 'Primamki' },
  { label: 'Аксесоари', query: 'Aksesoari' },
] as const

const navClass = ({ isActive }: { isActive: boolean }) =>
  [
    'px-4 py-2 text-sm font-medium transition-all duration-300',
    isActive
      ? 'text-white font-semibold'
      : 'text-white/60 hover:text-white',
  ].join(' ')

type Props = {
  onCartClick?: () => void
}

export default function Header({ onCartClick }: Props) {
  const { totalItems } = useCart()
  const { totalItems: wishlistCount } = useWishlist()
  const [open, setOpen] = useState(false)
  const [cartPulse, setCartPulse] = useState(false)
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuth()

  useEffect(() => {
    const handler = () => {
      setCartPulse(true)
      window.setTimeout(() => setCartPulse(false), 900)
    }

    window.addEventListener('cart:add', handler)
    return () => window.removeEventListener('cart:add', handler)
  }, [])

  return (
    <header className="sticky top-0 z-50 glass-dark animate-fade-in-up">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl transition-colors duration-300"
        >
          SD <span className="text-brand-400">Fishing</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" end className={navClass}>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/locations" className={navClass}>
            {t('nav.map')}
          </NavLink>
          <NavLink to="/blog" className={navClass}>
            {t('nav.blog')}
          </NavLink>
          <NavLink to="/events" className={navClass}>
            Събития
          </NavLink>
          <NavLink to="/about" className={navClass}>
            За нас
          </NavLink>
          {user ? (
            <button
              type="button"
              onClick={() => {
                logout().catch(() => {})
              }}
              className={[
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                'text-white/80 hover:text-white transition-colors duration-300',
              ].join(' ')}
              title={user.userName}
            >
              {user.userName} · Изход
            </button>
          ) : (
            <NavLink to="/login" className={navClass}>
              {t('nav.profile')}
            </NavLink>
          )}
          {user?.role === 'Admin' && (
            <NavLink to="/admin" className={navClass}>
              {t('nav.admin')}
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center rounded-full border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setLanguage('bg')}
              className={[
                'px-3 py-1 text-xs font-semibold rounded-full transition-colors',
                i18n.language === 'bg'
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5',
              ].join(' ')}
              aria-pressed={i18n.language === 'bg'}
            >
              BG
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={[
                'px-3 py-1 text-xs font-semibold rounded-full transition-colors',
                i18n.language === 'en'
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5',
              ].join(' ')}
              aria-pressed={i18n.language === 'en'}
            >
              EN
            </button>
          </div>

          <Link
            to="/wishlist"
            className="relative cursor-pointer p-2 text-white/70 hover:text-white transition-colors duration-300"
            aria-label="Любими"
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-turquoise text-xs font-bold text-midnight">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => {
              if (onCartClick) onCartClick()
            }}
            className={[
              'relative cursor-pointer p-2 text-white/70 hover:text-white transition-colors duration-300',
              cartPulse ? 'animate-bounce' : '',
            ].join(' ')}
            aria-label={t('cart.title')}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-turquoise text-xs font-bold text-midnight">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>

          <button
            type="button"
            className="inline-flex rounded-xl glass-dark p-2 text-white/80 md:hidden hover:text-white transition-colors duration-300"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div className="border-t border-white/10 glass-dark animate-fade-in-up">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto whitespace-nowrap">
            {categories.map((c) => (
              <Link
                key={c.label}
                to={c.query ? `/?category=${c.query}` : '/'}
                className="rounded-full px-4 py-2 text-xs font-medium text-white/80 border border-white/10 transition-all duration-300 hover:text-white hover:border-white/20"
                onClick={() => setOpen(false)}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {open && (
        <div className="glass-dark animate-fade-in-up">
          <div className="mb-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLanguage('bg')}
              className={
                i18n.language === 'bg'
                  ? 'px-3 py-1 text-xs font-semibold text-white'
                  : 'px-3 py-1 text-xs font-medium text-white/60 hover:text-white transition-colors duration-300'
              }
            >
              BG
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={
                i18n.language === 'en'
                  ? 'px-3 py-1 text-xs font-semibold text-white'
                  : 'px-3 py-1 text-xs font-medium text-white/60 hover:text-white transition-colors duration-300'
              }
            >
              EN
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            <NavLink to="/" end className={navClass} onClick={() => setOpen(false)}>
              {t('nav.home')}
            </NavLink>
            <NavLink to="/locations" className={navClass} onClick={() => setOpen(false)}>
              {t('nav.map')}
            </NavLink>
            <NavLink to="/blog" className={navClass} onClick={() => setOpen(false)}>
              {t('nav.blog')}
            </NavLink>
            <NavLink to="/events" className={navClass} onClick={() => setOpen(false)}>
              Събития
            </NavLink>
            <NavLink to="/about" className={navClass} onClick={() => setOpen(false)}>
              За нас
            </NavLink>
            {user ? (
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  logout().catch(() => {})
                }}
                className={navClass({ isActive: false })}
                title={user.userName}
              >
                {user.userName} · Изход
              </button>
            ) : (
              <NavLink to="/login" className={navClass} onClick={() => setOpen(false)}>
                {t('nav.profile')}
              </NavLink>
            )}
            {user?.role === 'Admin' && (
              <NavLink to="/admin" className={navClass} onClick={() => setOpen(false)}>
                {t('nav.admin')}
              </NavLink>
            )}
          </nav>

          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.label}
                to={c.query ? `/?category=${c.query}` : '/'}
                className="rounded-full px-4 py-2 text-xs font-medium text-white/80 border border-white/10 transition-all duration-300 hover:text-white hover:border-white/20"
                onClick={() => setOpen(false)}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
