import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ProductCard from '../components/ProductCard'
import FAQSection from '../components/FAQSection'
import { fetchProducts } from '../api/productsApi'
import { mapProductDto } from '../api/productMapper'
import type { Product } from '../types/product'

export default function Home() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name')

  const categoryParam = searchParams.get('category')
  const selectedCategory = useMemo(() => {
    if (!categoryParam) return null

    switch (categoryParam) {
      case 'Vudici':
        return 'Въдици'
      case 'Makari':
        return 'Макари'
      case 'Primamki':
        return 'Примамки'
      case 'Aksesoari':
        return 'Аксесоари'
      default:
        return null
    }
  }, [categoryParam])

  const filteredProducts = useMemo(() => {
    let filtered = products

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      )
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        return [...filtered].sort((a, b) => a.price - b.price)
      case 'price-desc':
        return [...filtered].sort((a, b) => b.price - a.price)
      case 'name':
      default:
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    }
  }, [products, selectedCategory, search, sortBy])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const dtos = await fetchProducts()
        if (!cancelled) {
          setProducts(dtos.map(mapProductDto))
          setError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : t('common.error_products'),
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="animate-fade-in-up">
      <section className="relative overflow-hidden border-b border-white/10 glass-dark">
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <p className="text-sm font-medium uppercase tracking-wider text-white/60">
            {t('home.kicker')}
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            {t('home.title_prefix')}{' '}
            <span className="text-white">{t('home.title_highlight')}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl font-medium leading-relaxed text-white/80 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {t('home.desc')}
          </p>
          <div className="mt-10 flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <a
              href="#products"
              className="inline-flex items-center justify-center rounded-xl gradient-turquoise px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:gradient-turquoise-hover"
            >
              {t('home.shop')}
            </a>
            <Link
              to="/blog"
              className="inline-flex items-center justify-center rounded-xl glass px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:glass-dark"
            >
              {t('home.read_blog')}
            </Link>
          </div>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              {t('home.featured')}
            </h2>
            <p className="mt-1 text-slate-400">{t('home.loaded')}</p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Категория
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                {selectedCategory ?? 'Всички'}
              </span>
            </div>
            <Link to="/cart" className="text-sm font-medium text-brand-300 hover:text-brand-200">
              {t('home.go_cart')}
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-md">
            <label className="sr-only" htmlFor="product-search">
              Търсене
            </label>
            <input
              id="product-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Търси по име…"
              className="w-full rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner shadow-black/20 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-white/70">
              Подредба:
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price-asc' | 'price-desc' | 'name')}
                className="appearance-none rounded-lg border border-white/10 bg-[#0B1120] px-8 py-2 pr-10 text-sm text-white outline-none focus:border-turquoise/50 cursor-pointer hover:border-white/20 transition-colors duration-300"
              >
                <option value="name" className="bg-[#0B1120] text-white">Име</option>
                <option value="price-asc" className="bg-[#0B1120] text-white">Цена (ниска → висока)</option>
                <option value="price-desc" className="bg-[#0B1120] text-white">Цена (висока → ниска)</option>
              </select>
              <svg
                className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-turquoise pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {selectedCategory && (
            <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white">
              Покажи всички
            </Link>
          )}
        </div>

        {loading && (
          <p className="mt-10 text-center text-slate-400" role="status">
            {t('home.loading')}
          </p>
        )}
        {error && (
          <p className="mt-10 rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-center text-red-200">
            {error}
          </p>
        )}
        {!loading && !error && filteredProducts.length === 0 && (
          <p className="mt-10 text-center text-slate-400">
            {t('home.no_products')}{' '}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm">/api/Products</code> or use
            {t('home.or')}
          </p>
        )}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} allProducts={products} />
              </div>
            ))}
          </div>
        )}
      </section>

      <FAQSection />
    </div>
  )
}
