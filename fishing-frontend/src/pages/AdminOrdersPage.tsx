import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import { fetchAllOrders } from '../api/ordersApi'
import type { OrderDTO } from '../api/types'
import { formatDate, formatCurrency } from '../utils/format'

export default function AdminOrdersPage() {
  const { user, loading } = useAuth()

  const [items, setItems] = useState<OrderDTO[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((o) => {
      const parts = [
        String(o.id),
        o.userEmail ?? '',
        o.userName ?? '',
        o.customerName ?? '',
        o.city ?? '',
      ]
      return parts.join(' ').toLowerCase().includes(q)
    })
  }, [items, query])

  async function load() {
    setError(null)
    const data = await fetchAllOrders()
    setItems(data)
  }

  useEffect(() => {
    if (!loading && user?.role === 'Admin') {
      setBusy(true)
      load()
        .catch((e) => setError(e instanceof Error ? e.message : 'Грешка при зареждане.'))
        .finally(() => setBusy(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user?.role])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <p className="text-slate-400" role="status">Loading…</p>
      </div>
    )
  }

  if (!user || user.role !== 'Admin') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <nav className="text-sm text-slate-500">
          <Link to="/" className="hover:text-brand-300">Начало</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-300">Админ</span>
        </nav>
        <h1 className="mt-3 font-display text-3xl font-bold text-white">Поръчки</h1>
        <p className="mt-2 text-slate-400">Нямате достъп до тази страница (изисква Admin).</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <nav className="text-sm text-slate-500">
            <Link to="/admin" className="hover:text-brand-300">
              Админ
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-300">Поръчки</span>
          </nav>
          <h1 className="mt-3 font-display text-3xl font-bold text-white">Поръчки</h1>
          <p className="mt-2 text-slate-400">Всички поръчки на потребителите.</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setBusy(true)
            load()
              .catch(() => {})
              .finally(() => setBusy(false))
          }}
          className="text-sm font-medium text-slate-300 hover:text-white"
          disabled={busy}
        >
          Обнови
        </button>
      </div>

      <div className="mt-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Търси по #, имейл, име, град…"
          className="w-full rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner shadow-black/20 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2 sm:max-w-xl"
        />
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="mt-8 space-y-4">
        {filtered.map((o) => (
          <div key={o.id} className="rounded-2xl border border-white/10 bg-surface-800/40 p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <p className="text-sm text-slate-400">Поръчка #{o.id}</p>
                <p className="mt-1 font-medium text-white">{formatDate(o.orderDateUtc, 'bg')}</p>
                <p className="mt-1 text-sm text-slate-400">Статус: {o.status}</p>
                <p className="mt-3 text-sm text-slate-300">
                  Потребител: <span className="text-white">{o.userEmail ?? `#${o.userId}`}</span>
                  {o.userName ? <span className="text-slate-400"> · {o.userName}</span> : null}
                </p>
                {(o.customerName || o.phone || o.city) && (
                  <p className="mt-1 text-sm text-slate-400">
                    Доставка: {o.customerName ?? '—'} · {o.phone ?? '—'} · {o.city ?? '—'}
                  </p>
                )}
              </div>

              <div className="text-left lg:text-right">
                <p className="text-xs uppercase tracking-wider text-slate-500">Общо</p>
                <p className="mt-1 text-xl font-bold text-white">{formatCurrency(o.totalAmount, 'bg')}</p>
              </div>
            </div>

            {o.items.length > 0 && (
              <ul className="mt-5 divide-y divide-white/10">
                {o.items.map((it) => (
                  <li key={it.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-100">{it.productName}</p>
                      <p className="text-sm text-slate-400">
                        {it.quantity} × {formatCurrency(it.unitPrice, 'bg')}
                      </p>
                    </div>
                    <p className="font-semibold text-white">{formatCurrency(it.unitPrice * it.quantity, 'bg')}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {!busy && !error && filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 bg-surface-800/40 p-10 text-center">
            <p className="text-slate-400">Няма поръчки.</p>
          </div>
        )}
      </div>
    </div>
  )
}
