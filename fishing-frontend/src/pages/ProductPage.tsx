import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../hooks/useCart'
import { fetchProductById } from '../api/productsApi'
import { mapProductDto } from '../api/productMapper'
import type { Product } from '../types/product'
import { formatCurrency } from '../utils/format'
import { localizeDynamicText } from '../utils/localizeDynamicText'

export default function ProductPage() {
  const { t, i18n } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const productId = Number(id)

  const [addHover, setAddHover] = useState(false)
  const [viewHover, setViewHover] = useState(false)

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!Number.isFinite(productId)) {
      setLoading(false)
      setError(t('product.invalid_id'))
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const dto = await fetchProductById(productId)
        if (cancelled) return
        if (!dto) {
          setProduct(null)
          setError(null)
          return
        }
        setProduct(mapProductDto(dto))
        setError(null)
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : t('common.error_product'),
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [productId, t])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-slate-400" role="status">
          {t('product.loading')}
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-red-300">{error}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 cursor-pointer text-brand-400 hover:text-brand-300"
        >
          {t('product.back')}
        </button>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl font-bold text-white">{t('product.not_found')}</h1>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 cursor-pointer text-brand-400 hover:text-brand-300"
        >
          {t('product.back')}
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <nav className="text-sm text-slate-500">
        <Link to="/" className="cursor-pointer hover:text-brand-300">
          {t('nav.home')}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">{localizeDynamicText(product.name, i18n.language)}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1b33] max-h-[500px] aspect-square">
          <img
            src={product.image}
            alt=""
            className="h-full w-full object-contain"
          />
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-brand-400">
            {localizeDynamicText(product.category, i18n.language)}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
            {localizeDynamicText(product.name, i18n.language)}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-300">{product.description}</p>
          <div className="mt-8 flex flex-wrap items-baseline gap-4">
            <span className="font-display text-4xl font-bold text-brand-300">
              {formatCurrency(product.price, i18n.language)}
            </span>
            <span
              className={
                product.stockQuantity > 0 ? 'text-emerald-400/90' : 'text-red-400/90'
              }
            >
              {product.stockQuantity > 0
                ? t('product.in_stock', { count: product.stockQuantity })
                : t('product.out_of_stock')}
            </span>
          </div>
          <div className="mt-10 flex flex-wrap gap-[15px]">
            <button
              type="button"
              disabled={product.stockQuantity <= 0}
              onClick={() =>
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                })
              }
              onMouseEnter={() => setAddHover(true)}
              onMouseLeave={() => setAddHover(false)}
              style={{
                backgroundColor: addHover ? '#00a7bf' : '#00bcd4',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '14px',
                border: '1px solid transparent',
                cursor: product.stockQuantity <= 0 ? 'not-allowed' : 'pointer',
                position: 'relative',
                zIndex: 10,
                fontWeight: 700,
                transition: 'background-color 150ms ease, opacity 150ms ease',
                opacity: product.stockQuantity <= 0 ? 0.6 : 1,
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {t('product.add')}
            </button>
            <Link
              to="/cart"
              onMouseEnter={() => setViewHover(true)}
              onMouseLeave={() => setViewHover(false)}
              style={{
                backgroundColor: viewHover ? 'rgba(255,255,255,0.10)' : 'transparent',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.85)',
                cursor: 'pointer',
                position: 'relative',
                zIndex: 10,
                fontWeight: 700,
                transition: 'background-color 150ms ease, border-color 150ms ease',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textDecoration: 'none',
              }}
            >
              {t('product.view_cart')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
