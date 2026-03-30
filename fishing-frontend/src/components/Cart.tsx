import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../hooks/useCart'
import { formatCurrency } from '../utils/format'

type Props = {
  /** Compact summary for sidebars; full layout on cart page */
  variant?: 'summary' | 'full'
}

export default function Cart({ variant = 'summary' }: Props) {
  const { items, subtotal, totalItems, setQuantity, removeItem, clear } = useCart()
  const { t, i18n } = useTranslation()

  const total = subtotal

  if (items.length === 0) {
    return (
      <div
        className={
          variant === 'full'
            ? 'rounded-2xl border border-dashed border-white/15 bg-surface-800/40 p-10 text-center'
            : 'rounded-xl border border-white/10 bg-surface-800/60 p-4'
        }
      >
        <p className="text-slate-400">{t('cart.empty')}</p>
        {variant === 'full' && (
          <Link
            to="/"
            className="mt-4 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
          >
            {t('cart.browse')}
          </Link>
        )}
      </div>
    )
  }

  const wrap =
    variant === 'full'
      ? 'rounded-2xl border border-white/10 bg-surface-800/50 p-4 sm:p-6'
      : 'rounded-xl border border-white/10 bg-surface-800/60 p-4'

  return (
    <div className={wrap}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-white">
          {t('cart.title')} {variant === 'summary' && `(${totalItems})`}
        </h2>
        {variant === 'full' && (
          <button
            type="button"
            onClick={() => clear()}
            className="ui-btn-ghost px-4 py-2 text-sm"
          >
            {t('cart.clear')}
          </button>
        )}
      </div>

      <ul className="divide-y divide-white/10">
        {items.map((line) => (
          <li key={line.id} className="flex gap-3 py-4 first:pt-0">
            <img
              src={line.image}
              alt=""
              className="h-16 w-20 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-slate-100">{line.name}</p>
              <p className="text-sm text-brand-300">
                {formatCurrency(line.price, i18n.language)} {t('cart.each')}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <label className="sr-only" htmlFor={`qty-${line.id}`}>
                  {t('cart.qty')}
                </label>
                <input
                  id={`qty-${line.id}`}
                  type="number"
                  min={1}
                  max={999}
                  value={line.quantity}
                  onChange={(e) =>
                    setQuantity(line.id, Math.max(1, parseInt(e.target.value, 10) || 1))
                  }
                  className="w-16 rounded border border-white/15 bg-surface-900 px-2 py-1 text-sm text-white"
                />
                <button
                  type="button"
                  onClick={() => removeItem(line.id)}
                  className="ui-btn-danger px-4 py-2 text-sm"
                >
                  {t('cart.remove')}
                </button>
              </div>
            </div>
            <p className="shrink-0 font-semibold text-white">
              {formatCurrency(line.price * line.quantity, i18n.language)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-4 border-t border-white/10 pt-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-400">
            <span>{t('cart.subtotal')}</span>
            <span className="font-semibold text-white">
              {formatCurrency(subtotal, i18n.language)}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Общо</span>
            <span className="font-semibold text-white">
              {formatCurrency(total, i18n.language)}
            </span>
          </div>
        </div>
        {variant === 'summary' && (
          <Link
            to="/cart"
            className="ui-btn-primary mt-4 block w-full text-center"
          >
            {t('cart.view')}
          </Link>
        )}
      </div>
    </div>
  )
}
