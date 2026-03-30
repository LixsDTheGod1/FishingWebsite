import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { formatCurrency } from '../utils/format'

export default function WishlistPage() {
  const { t, i18n } = useTranslation()
  const { items, remove, clear } = useWishlist()
  const { addItem } = useCart()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <h1 className="font-display text-3xl font-bold text-white">Любими</h1>
        <p className="mt-2 text-slate-400">Нямаш добавени любими продукти.</p>
        <Link to="/" className="mt-6 inline-block cursor-pointer text-brand-300 hover:text-brand-200">
          {t('cart.continue')}
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Любими</h1>
          <p className="mt-2 text-slate-400">Твоите запазени продукти.</p>
        </div>
        <button
          type="button"
          onClick={() => clear()}
          className="cursor-pointer text-sm font-semibold text-slate-400 hover:text-amber-300"
        >
          Изчисти
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <div key={p.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-surface-800/50">
            <Link to={`/product/${p.id}`} className="absolute inset-0 z-0 cursor-pointer" aria-label={p.name} />
            <img src={p.image} alt="" className="relative z-10 aspect-[4/3] w-full object-cover" loading="lazy" />
            <div className="relative z-10 p-4">
              <p className="truncate font-semibold text-white">{p.name}</p>
              <p className="mt-1 text-sm text-white/60">{p.category}</p>
              <p className="mt-3 font-display text-xl font-bold text-brand-300">
                {formatCurrency(p.price, i18n.language)}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    addItem({ id: p.id, name: p.name, price: p.price, image: p.image })
                    window.dispatchEvent(new Event('cart:add'))
                  }}
                  className="cursor-pointer flex h-11 flex-1 items-center justify-center rounded-xl bg-turquoise px-4 text-sm font-bold text-slate-950 hover:opacity-90"
                >
                  Добави
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    remove(p.id)
                  }}
                  className="cursor-pointer flex h-11 items-center justify-center rounded-xl border border-white/15 px-4 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Премахни
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
