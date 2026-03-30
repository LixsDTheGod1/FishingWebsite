import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../hooks/useCart'
import { fetchProductById } from '../api/productsApi'
import { mapProductDto } from '../api/productMapper'
import type { Product } from '../types/product'
import { formatCurrency } from '../utils/format'

export default function ProductPage() {
  const { t, i18n } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const productId = Number(id)

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
  }, [productId])

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
        <span className="text-slate-300">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface-800/40">
          <img
            src={product.image}
            alt=""
            className="aspect-square w-full object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-brand-400">
            {product.category}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
            {product.name}
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
          <div className="mt-10 flex flex-wrap gap-4">
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
              className="cursor-pointer inline-flex items-center justify-center rounded-xl border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t('product.add')}
            </button>
            <Link
              to="/cart"
              className="cursor-pointer inline-flex items-center justify-center rounded-xl border border-white/20 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/5"
            >
              {t('product.view_cart')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
