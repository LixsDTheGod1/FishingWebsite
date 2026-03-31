import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { formatCurrency } from '../utils/format'
import QuickViewModal from './QuickViewModal'
import ErrorBoundary from './ErrorBoundary'
import { useWishlist } from '../hooks/useWishlist'
import type { Product } from '../types/product'
import { localizeDynamicText } from '../utils/localizeDynamicText'

type Props = {
  product: Product
  allProducts?: Product[]
}

export default function ProductCard({ product, allProducts }: Props) {
  const { t, i18n } = useTranslation()
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const { has, toggle } = useWishlist()

  const isWishlisted = has(product.id)

  const stockLabel = (() => {
    if (product.stockQuantity <= 0) return t('product_card.stock.out')
    if (product.stockQuantity <= 2) return t('product_card.stock.last', { count: product.stockQuantity })
    return t('product_card.stock.in')
  })()

  const stockClass = (() => {
    if (product.stockQuantity <= 0) return 'text-red-400'
    if (product.stockQuantity <= 2) return 'text-amber-400'
    return 'text-emerald-400'
  })()

  return (
    <>
      <article className="group flex flex-col overflow-hidden rounded-2xl glass transition-all duration-300 hover:shadow-lg animate-fade-in-up">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Link
            to={`/product/${product.id}`}
            className="absolute inset-0 z-0 cursor-pointer"
            aria-label={product.name}
          />
          <img
            src={product.image}
            alt=""
            className="relative z-10 h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <span className="absolute left-4 top-4 rounded-lg px-3 py-1 text-xs font-medium text-white/80 glass">
            {localizeDynamicText(product.category, i18n.language)}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggle(product)
            }}
            className={[
              'absolute right-4 top-4 z-20 cursor-pointer rounded-lg glass p-2 transition-all duration-200',
              'hover:glass-dark active:scale-95',
              isWishlisted ? 'text-turquoise' : 'text-white/70 hover:text-white',
            ].join(' ')}
            aria-label={t('nav.wishlist')}
          >
            <svg
              className={[
                'h-5 w-5 transition-transform duration-200',
                isWishlisted ? 'scale-110' : 'scale-100',
              ].join(' ')}
              viewBox="0 0 24 24"
              fill={isWishlisted ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
            </svg>
          </button>
          
          {/* Quick View Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsQuickViewOpen(true)
            }}
            className={[
              'absolute bottom-4 right-4 z-20 rounded-lg glass px-3 py-2 text-xs font-medium text-white',
              'cursor-pointer pointer-events-auto transition-colors duration-300 hover:glass-dark',
              'opacity-100 md:opacity-0 md:group-hover:opacity-100',
            ].join(' ')}
          >
            {t('product_card.quick_view')}
          </button>
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-display text-xl font-bold text-white transition-colors duration-300 group-hover:text-white">
              {localizeDynamicText(product.name, i18n.language)}
            </h3>
          </Link>
          <p className={['mt-2 text-xs font-medium', stockClass].join(' ')}>
            {stockLabel}
          </p>
          <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-white/70">
            {product.description}
          </p>
          <div className="mt-4 flex items-end justify-between gap-3">
            <p className="font-display text-xl font-bold text-white">
              {formatCurrency(product.price, i18n.language)}
            </p>
            <Link
              to={`/product/${product.id}`}
              className="cursor-pointer rounded-xl gradient-turquoise px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:gradient-turquoise-hover"
            >
              {t('cart.view')}
            </Link>
          </div>
        </div>
      </article>

      {/* Quick View Modal */}
      <ErrorBoundary fallback={null}>
        <QuickViewModal
          product={product}
          allProducts={allProducts}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
        />
      </ErrorBoundary>
    </>
  )
}
