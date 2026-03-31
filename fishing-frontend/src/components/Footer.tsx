import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="glass-dark border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="font-display text-3xl font-bold text-white">
              SD <span className="text-white">Fishing</span>
            </p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/70">
              {t('footer.tagline')}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl glass px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:glass-dark hover:scale-105"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v3H8v3h3v6h3v-6h3l1-3h-4V9c0-.6.4-1 1-1z" />
                </svg>
                Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl glass px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:glass-dark hover:scale-105"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <path d="M17.5 6.5h.01" />
                </svg>
                Instagram
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl glass px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:glass-dark hover:scale-105"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2 1 1 0 100-2 2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
                  <path d="M12 12v4" />
                  <path d="M16 8v4" />
                </svg>
                TikTok
              </a>
            </div>
          </div>

          <div>
            <p className="text-base font-semibold uppercase tracking-wider text-white/80">{t('footer.contacts')}</p>
            <ul className="mt-3 space-y-2 text-base text-white/60">
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-turquoise" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +359 888 123 456
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-turquoise" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@sdfishing.bg
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-turquoise" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('footer.address')}
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-turquoise" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('footer.hours')}
              </li>
            </ul>
          </div>

          <div>
            <p className="text-base font-semibold uppercase tracking-wider text-white/80">{t('footer.quick_links')}</p>
            <ul className="mt-3 space-y-2 text-base text-white/60">
              <li>
                <Link to="/" className="hover:text-turquoise transition-colors duration-300">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/locations" className="hover:text-turquoise transition-colors duration-300">
                  {t('nav.map')}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-turquoise transition-colors duration-300">
                  {t('nav.blog')}
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-turquoise transition-colors duration-300">
                  {t('nav.events')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-turquoise transition-colors duration-300">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-turquoise transition-colors duration-300">
                  {t('footer.cart')}
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-turquoise transition-colors duration-300">
                  {t('nav.profile')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-base text-white/70">© {new Date().getFullYear()} SD Fishing. {t('footer.demo')}</p>
          <div className="flex gap-6 text-base text-white/70">
            <span>{t('footer.privacy')}</span>
            <span>{t('footer.terms')}</span>
            <span>{t('footer.contact')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
