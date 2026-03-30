import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Cart from './Cart'
import { useCart } from '../hooks/useCart'
import { formatCurrency } from '../utils/format'

type Props = {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: Props) {
  const { t, i18n } = useTranslation()
  const { items, subtotal, totalItems } = useCart()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-label="Close cart"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-surface-900/95 backdrop-blur">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="font-display text-lg font-semibold text-white">
              {t('cart.title')} {totalItems > 0 ? `(${totalItems})` : ''}
            </p>
            <p className="text-xs text-slate-500">
              Междинна сума: <span className="font-semibold text-slate-200">{formatCurrency(subtotal, i18n.language)}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-200 hover:bg-white/5"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-auto p-5">
          <Cart variant="summary" />
        </div>

        <div className="border-t border-white/10 p-5">
          <div className="flex items-center justify-between gap-3">
            <Link
              to="/cart"
              onClick={onClose}
              className="ui-btn-outline whitespace-nowrap"
              style={{ width: '48%', padding: '10px' }}
            >
              {t('cart.view')}
            </Link>
            <Link
              to="/checkout"
              onClick={onClose}
              className={
                items.length === 0
                  ? 'ui-btn cursor-not-allowed bg-[#00bcd4]/30 font-bold text-white/60 whitespace-nowrap'
                  : 'ui-btn bg-[#00bcd4] font-bold text-white hover:opacity-90 whitespace-nowrap'
              }
              style={{ width: '48%', padding: '10px' }}
              aria-disabled={items.length === 0}
              tabIndex={items.length === 0 ? -1 : 0}
            >
              Завърши
            </Link>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {items.length === 0 ? 'Добавете продукти, за да продължите към поръчка.' : 'Данните за доставка се попълват на следващата стъпка.'}
          </p>
        </div>
      </aside>
    </div>
  )
}
