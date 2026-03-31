import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { formatCurrency } from '../utils/format'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { createOrder } from '../api/ordersApi'
import { useAuth } from '../hooks/useAuth'
import { http } from '../api/http'
import { getApiErrorMessage } from '../api/apiError'

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
  const [confirmHover, setConfirmHover] = useState(false)

  const [promoCodes, setPromoCodes] = useState<Record<string, number>>({ SD10: 0.1, SD20: 0.2 })
  const [promoInput, setPromoInput] = useState('')
  const [promo, setPromo] = useState<{ code: string; percent: number } | null>(null)
  const [promoMsg, setPromoMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const totalItems = useMemo(() => items.reduce((s, x) => s + x.quantity, 0), [items])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await http.get<
          Array<{ name?: string; Name?: string; value?: number; Value?: number; discountType?: string; DiscountType?: string }>
        >('/api/Promotions/active')

        if (cancelled) return

        const next: Record<string, number> = {}
        for (const row of data ?? []) {
          const name = (row.name ?? row.Name ?? '').trim().toUpperCase()
          const type = (row.discountType ?? row.DiscountType ?? '').trim().toLowerCase()
          const value = Number(row.value ?? row.Value)
          if (!name) continue
          if (type && type !== 'percentage') continue
          if (!Number.isFinite(value) || value <= 0) continue
          next[name] = value / 100
        }

        if (Object.keys(next).length > 0) setPromoCodes(next)
      } catch {
        // Fallback to local defaults (SD10/SD20)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const discount = promo ? subtotal * promo.percent : 0
  const total = subtotal - discount

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    const percent = promoCodes[code]

    if (!percent) {
      setPromo(null)
      setPromoMsg({ type: 'error', text: 'Невалиден код' })
      return
    }

    setPromo({ code, percent })
    setPromoMsg({ type: 'success', text: 'Кодът е приложен успешно!' })
  }

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
        setError(getApiErrorMessage(e, 'Неуспешно създаване на поръчка.'))
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
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <h1 className="font-display text-2xl font-bold text-white">Завършване на поръчка</h1>
        <p className="mt-3 text-slate-400">
          Трябва да сте влезли в профила си, за да завършите поръчката.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-900/30 transition hover:bg-brand-500"
          >
            Вход
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            Регистрация
          </Link>
        </div>
      </div>
    )
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
              onMouseEnter={() => setConfirmHover(true)}
              onMouseLeave={() => setConfirmHover(false)}
              style={{
                width: '100%',
                backgroundColor: confirmHover ? '#00a7bf' : '#00bcd4',
                color: '#ffffff',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid transparent',
                cursor: 'pointer',
                fontWeight: 800,
                transition: 'background-color 150ms ease, opacity 150ms ease',
                whiteSpace: 'nowrap',
              }}
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
            <div className="mt-4 rounded-xl border border-white/10 bg-slate-800/60 p-4">
              <p className="text-sm font-semibold text-white/80">Имате ли промо код?</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Промо код"
                  className="w-full flex-1 rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-turquoise/30"
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  className="ui-btn cursor-pointer rounded-lg bg-turquoise px-4 py-2 text-sm font-bold text-slate-950 hover:opacity-90"
                >
                  Приложи
                </button>
              </div>
              {promoMsg && (
                <p
                  className={[
                    'mt-2 text-sm font-semibold',
                    promoMsg.type === 'success' ? 'text-emerald-400' : 'text-red-400',
                  ].join(' ')}
                >
                  {promoMsg.text}
                </p>
              )}
            </div>

            {promo && (
              <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
                <span className="text-turquoise">Промо код ({promo.code}):</span>
                <span className="font-semibold text-turquoise">-{formatCurrency(discount, i18n.language)}</span>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
              <span>Общо</span>
              <span className="font-semibold text-white">{formatCurrency(total, i18n.language)}</span>
            </div>
            <p className="mt-3 text-xs text-slate-500">Доставката се изчислява на следващ етап.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
