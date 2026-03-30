import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Cart from '../components/Cart'

export default function CartPage() {
  const { t } = useTranslation()
  const [checkoutHover, setCheckoutHover] = useState(false)

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
          onMouseEnter={() => setCheckoutHover(true)}
          onMouseLeave={() => setCheckoutHover(false)}
          style={{
            backgroundColor: checkoutHover ? '#00a7bf' : '#00bcd4',
            color: '#ffffff',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid transparent',
            cursor: 'pointer',
            fontWeight: 800,
            transition: 'background-color 150ms ease, opacity 150ms ease',
            whiteSpace: 'nowrap',
            textAlign: 'center',
          }}
        >
          Завърши поръчката
        </Link>
      </div>
    </div>
  )
}
