import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthProvider'
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
  type UpsertProductInput,
} from '../api/productsApi'
import type { ProductDTO } from '../api/types'

type Mode = 'create' | 'edit'

function emptyForm(): UpsertProductInput {
  return {
    name: '',
    category: 'Въдици',
    description: null,
    imageUrl: null,
    price: 0,
    stockQuantity: 0,
  }
}

export default function AdminProductsPage() {
  const { user, loading } = useAuth()

  const [items, setItems] = useState<ProductDTO[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState('')

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('create')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<UpsertProductInput>(emptyForm)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((p) => p.name.toLowerCase().includes(q))
  }, [items, query])

  async function load() {
    setError(null)
    const data = await fetchProducts()
    setItems(data)
  }

  useEffect(() => {
    if (!loading && user?.role === 'Admin') {
      load().catch((e) => setError(e instanceof Error ? e.message : 'Грешка при зареждане.'))
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

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'Admin') return <Navigate to="/" replace />

  function openCreate() {
    setMode('create')
    setEditingId(null)
    setForm(emptyForm())
    setOpen(true)
  }

  function openEdit(p: ProductDTO) {
    setMode('edit')
    setEditingId(p.id)
    setForm({
      name: p.name,
      category: p.category,
      description: p.description,
      imageUrl: p.imageUrl,
      price: p.price,
      stockQuantity: p.stockQuantity,
    })
    setOpen(true)
  }

  async function onSave() {
    setBusy(true)
    setError(null)
    try {
      if (mode === 'create') {
        await createProduct(form)
      } else if (editingId != null) {
        await updateProduct(editingId, form)
      }
      setOpen(false)
      await load()
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const msg =
          (e.response?.data as any)?.detail ||
          (e.response?.data as any)?.title ||
          e.message
        setError(String(msg))
      } else {
        setError(e instanceof Error ? e.message : 'Неуспешна операция.')
      }
    } finally {
      setBusy(false)
    }
  }

  async function onDelete(p: ProductDTO) {
    if (p.stockQuantity > 0) return

    const ok = window.confirm(`Изтриване на "${p.name}"?`)
    if (!ok) return

    setBusy(true)
    setError(null)
    try {
      await deleteProduct(p.id)
      await load()
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const msg =
          (e.response?.data as any)?.detail ||
          (e.response?.data as any)?.title ||
          e.message
        setError(String(msg))
      } else {
        setError(e instanceof Error ? e.message : 'Неуспешно изтриване.')
      }
    } finally {
      setBusy(false)
    }
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
            <span className="text-slate-300">Продукти</span>
          </nav>
          <h1 className="mt-3 font-display text-3xl font-bold text-white">Продукти</h1>
          <p className="mt-2 text-slate-400">Създавай, редактирай и премахвай продукти.</p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <button
            type="button"
            onClick={openCreate}
            className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-900/30 transition hover:bg-brand-500"
          >
            Нов продукт
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Търси по име…"
          className="w-full rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner shadow-black/20 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2 sm:max-w-md"
        />
        <button
          type="button"
          onClick={() => load().catch(() => {})}
          className="text-sm font-medium text-slate-300 hover:text-white"
          disabled={busy}
        >
          Обнови
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Продукт
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Категория
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Цена
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Наличност
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-surface-800/30">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-white/5">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.imageUrl ?? ''}
                      alt=""
                      className="h-10 w-14 rounded-lg object-cover"
                      onError={(e) => {
                        ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                      }}
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-100">{p.name}</p>
                      <p className="truncate text-xs text-slate-500">ID: {p.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-300">{p.category}</td>
                <td className="px-4 py-3 text-sm text-slate-300">{p.price.toFixed(2)} лв.</td>
                <td className="px-4 py-3 text-sm">
                  <span className={p.stockQuantity > 0 ? 'text-emerald-300' : 'text-amber-300'}>
                    {p.stockQuantity}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-slate-200 hover:bg-white/10"
                      disabled={busy}
                    >
                      Редакция
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(p)}
                      className={
                        p.stockQuantity > 0
                          ? 'rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-slate-500'
                          : 'rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-sm font-semibold text-red-200 hover:bg-red-500/15'
                      }
                      disabled={busy || p.stockQuantity > 0}
                      title={p.stockQuantity > 0 ? 'Може да се изтрие само при 0 наличност' : 'Изтрий'}
                    >
                      Изтрий
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-[70]">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => (!busy ? setOpen(false) : null)}
            aria-label="Close"
          />
          <div className="absolute left-1/2 top-1/2 w-[min(720px,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-surface-900 p-6 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-white">
                {mode === 'create' ? 'Нов продукт' : 'Редакция на продукт'}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-slate-200 hover:bg-white/5"
                aria-label="Close"
                disabled={busy}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-200">Име</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-sm text-slate-100 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200">Категория</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-sm text-slate-100 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2"
                >
                  <option>Въдици</option>
                  <option>Макари</option>
                  <option>Примамки</option>
                  <option>Аксесоари</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200">Цена</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={Number.isFinite(form.price) ? form.price : 0}
                  onChange={(e) => setForm((p) => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-sm text-slate-100 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200">Наличност</label>
                <input
                  type="number"
                  min={0}
                  step="1"
                  value={Number.isFinite(form.stockQuantity) ? form.stockQuantity : 0}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, stockQuantity: Math.max(0, parseInt(e.target.value, 10) || 0) }))
                  }
                  className="mt-1 w-full rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-sm text-slate-100 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-200">Линк за снимка</label>
                <input
                  value={form.imageUrl ?? ''}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, imageUrl: e.target.value.trim() ? e.target.value : null }))
                  }
                  className="mt-1 w-full rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-sm text-slate-100 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2"
                  placeholder="https://..."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-200">Описание</label>
                <textarea
                  value={form.description ?? ''}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value.trim() ? e.target.value : null }))
                  }
                  rows={4}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-sm text-slate-100 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/5"
                disabled={busy}
              >
                Отказ
              </button>
              <button
                type="button"
                onClick={() => onSave().catch(() => {})}
                className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-900/30 transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={busy || !form.name.trim()}
              >
                {busy ? 'Запис…' : 'Запази'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
