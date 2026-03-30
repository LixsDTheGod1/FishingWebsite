import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { formatCurrency } from '../utils/format'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { createOrder } from '../api/ordersApi'
import { useAuth } from '../context/AuthProvider'

export default function CheckoutPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { items, subtotal, clear } = useCart()
  const { user, loading } = useAuth()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const totalItems = useMemo(() => items.reduce((s, x) => s + x.quantity, 0), [items])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!user) {
      setError('Моля, влезте в профила си, за да завършите поръчката.')
      return
    }

    if (items.length === 0) {
      setError('Кошницата е празна.')
      return
    }

    if (!name.trim() || !phone.trim() || !city.trim()) {
      setError('Моля, попълнете всички полета за доставка.')
      return
    }

    try {
      await createOrder({
        items: items.map((x) => ({ productId: x.id, quantity: x.quantity })),
        customerName: name,
        phone,
        city,
      })
      setSubmitted(true)
      clear()
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const msg = (e.response?.data as any)?.detail || (e.response?.data as any)?.title || e.message
        setError(String(msg))
        return
      }
      setError(e instanceof Error ? e.message : 'Неуспешно създаване на поръчка.')
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <p className="text-slate-400" role="status">Loading…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <h1 className="font-display text-3xl font-bold text-white">Поръчката е приета</h1>
        <p className="mt-2 text-slate-400">
          Благодарим! Ще се свържем с вас при нужда.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-900/30 transition hover:bg-brand-500"
          >
            Обратно към магазина
          </Link>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            Профил
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <nav className="text-sm text-slate-500">
        <Link to="/cart" className="hover:text-brand-300">
          {t('cart.title')}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">Завършване</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-surface-800/50 p-6 sm:p-8">
          <h1 className="font-display text-2xl font-bold text-white">Доставка</h1>
          <p className="mt-2 text-sm text-slate-400">Въведете данни за доставка (демо).</p>

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200">Име</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 shadow-inner shadow-black/20 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2"
                placeholder="Напр. Иван Иванов"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200">Телефон</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 shadow-inner shadow-black/20 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2"
                placeholder="0888 123 456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200">Град</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 shadow-inner shadow-black/20 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2"
                placeholder="София"
              />
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-900/30 transition hover:bg-brand-500"
            >
              Потвърди поръчката
            </button>
          </form>
        </section>

        <aside className="rounded-2xl border border-white/10 bg-surface-800/50 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-white">Обобщение</h2>
          <p className="mt-2 text-sm text-slate-400">{totalItems} продукта в кошницата.</p>

          <ul className="mt-6 divide-y divide-white/10">
            {items.map((line) => (
              <li key={line.id} className="flex items-center gap-3 py-4">
                <img src={line.image} alt="" className="h-12 w-16 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-100">{line.name}</p>
                  <p className="text-sm text-slate-400">
                    {line.quantity} × {formatCurrency(line.price, i18n.language)}
                  </p>
                </div>
                <p className="font-semibold text-white">
                  {formatCurrency(line.price * line.quantity, i18n.language)}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-white/10 pt-6">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>{t('cart.subtotal')}</span>
              <span className="font-semibold text-white">{formatCurrency(subtotal, i18n.language)}</span>
            </div>
            <p className="mt-3 text-xs text-slate-500">Доставката се изчислява на следващ етап.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
