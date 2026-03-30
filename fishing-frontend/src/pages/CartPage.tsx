import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Cart from '../components/Cart'

export default function CartPage() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <h1 className="font-display text-3xl font-bold text-white">{t('cart.title')}</h1>
      <p className="mt-2 text-slate-400">{t('cart.review')}</p>
      <div className="mt-8">
        <Cart variant="full" />
      </div>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
        <Link
          to="/"
          className="text-center text-sm font-medium text-brand-300 hover:text-brand-200 sm:text-left"
        >
          {t('cart.continue')}
        </Link>
        <Link
          to="/checkout"
          className="rounded-xl bg-amber-400 px-6 py-3 text-center text-sm font-bold text-slate-900 hover:brightness-110"
        >
          Завърши поръчката
        </Link>
      </div>
    </div>
  )
}
