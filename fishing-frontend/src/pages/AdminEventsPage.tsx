import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthProvider'
import {
  createFishingEvent,
  deleteFishingEvent,
  deleteEventRegistration,
  fetchEventParticipants,
  fetchEvents,
  updateFishingEvent,
  type UpsertFishingEventInput,
} from '../api/eventsApi'
import type { EventParticipantDTO, FishingEventDTO } from '../api/types'

type Mode = 'create' | 'edit'

type ParticipantsState = {
  open: boolean
  event: FishingEventDTO | null
  loading: boolean
  error: string | null
  users: EventParticipantDTO[]
}

function emptyForm(): UpsertFishingEventInput {
  return {
    title: '',
    description: null,
    fullDescription: null,
    imageUrl: null,
    type: 'Express',
    nights: 1,
    location: '',
    totalPrice: 0,
    capacity: 10,
    occupiedSeats: 0,
    guideRating: 4.5,
  }
}

export default function AdminEventsPage() {
  const { user, loading } = useAuth()

  const [items, setItems] = useState<FishingEventDTO[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState('')

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('create')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<UpsertFishingEventInput>(emptyForm)

  const [participants, setParticipants] = useState<ParticipantsState>({
    open: false,
    event: null,
    loading: false,
    error: null,
    users: [],
  })

  async function onRemoveParticipant(p: EventParticipantDTO) {
    const ok = window.confirm(`Премахване на "${p.userName}" от събитието?`)
    if (!ok) return

    setParticipants((s) => ({ ...s, loading: true, error: null }))
    try {
      await deleteEventRegistration(p.registrationId)

      setParticipants((s) => ({
        ...s,
        loading: false,
        users: s.users.filter((x) => x.registrationId !== p.registrationId),
      }))

      // update list counters in the table (optimistic)
      setItems((prev) =>
        prev.map((ev) =>
          ev.id === participants.event?.id
            ? {
                ...ev,
                occupiedSeats: Math.max(0, ev.occupiedSeats - 1),
                remainingSeats: Math.min(ev.capacity, ev.remainingSeats + 1),
              }
            : ev,
        ),
      )
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? String((err.response?.data as any)?.detail || (err.response?.data as any)?.title || err.message)
        : err instanceof Error
          ? err.message
          : 'Грешка при премахване.'
      setParticipants((s) => ({ ...s, loading: false, error: msg }))
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((e) => [e.title, e.location, e.type].join(' ').toLowerCase().includes(q))
  }, [items, query])

  async function load() {
    setError(null)
    const data = await fetchEvents()
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

  if (!user || user.role !== 'Admin') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <nav className="text-sm text-slate-500">
          <Link to="/" className="hover:text-brand-300">Начало</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-300">Админ</span>
        </nav>
        <h1 className="mt-3 font-display text-3xl font-bold text-white">Събития</h1>
        <p className="mt-2 text-slate-400">Нямате достъп до тази страница (изисква Admin).</p>
      </div>
    )
  }

  function openCreate() {
    setMode('create')
    setEditingId(null)
    setForm(emptyForm())
    setOpen(true)
  }

  function openEdit(e: FishingEventDTO) {
    setMode('edit')
    setEditingId(e.id)
    setForm({
      title: e.title,
      description: e.description,
      fullDescription: e.fullDescription,
      imageUrl: e.imageUrl,
      type: e.type,
      nights: e.nights,
      location: e.location,
      totalPrice: e.totalPrice,
      capacity: e.capacity,
      occupiedSeats: e.occupiedSeats,
      guideRating: e.guideRating,
    })
    setOpen(true)
  }

  async function onSave() {
    setBusy(true)
    setError(null)
    try {
      if (mode === 'create') {
        await createFishingEvent(form)
      } else if (editingId != null) {
        await updateFishingEvent(editingId, form)
      }
      setOpen(false)
      await load()
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const msg = (e.response?.data as any)?.detail || (e.response?.data as any)?.title || e.message
        setError(String(msg))
      } else {
        setError(e instanceof Error ? e.message : 'Неуспешна операция.')
      }
    } finally {
      setBusy(false)
    }
  }

  async function onDelete(e: FishingEventDTO) {
    const ok = window.confirm(`Изтриване на "${e.title}"?`)
    if (!ok) return

    setBusy(true)
    setError(null)
    try {
      await deleteFishingEvent(e.id)
      await load()
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = (err.response?.data as any)?.detail || (err.response?.data as any)?.title || err.message
        setError(String(msg))
      } else {
        setError(err instanceof Error ? err.message : 'Неуспешно изтриване.')
      }
    } finally {
      setBusy(false)
    }
  }

  async function openParticipants(e: FishingEventDTO) {
    setParticipants({ open: true, event: e, loading: true, error: null, users: [] })
    try {
      const users = await fetchEventParticipants(e.id)
      setParticipants({ open: true, event: e, loading: false, error: null, users })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Грешка при зареждане.'
      setParticipants({ open: true, event: e, loading: false, error: msg, users: [] })
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
            <span className="text-slate-300">Събития</span>
          </nav>
          <h1 className="mt-3 font-display text-3xl font-bold text-white">Събития</h1>
          <p className="mt-2 text-slate-400">Създавай, редактирай и премахвай риболовни събития.</p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <button
            type="button"
            onClick={openCreate}
            className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-900/30 transition hover:bg-brand-500"
          >
            Ново събитие
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Търси по заглавие/локация…"
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
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Събитие</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Тип</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Места</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Цена</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-surface-800/30">
            {filtered.map((e) => (
              <tr key={e.id} className="hover:bg-white/5">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={e.imageUrl ?? ''}
                      alt=""
                      className="h-10 w-14 rounded-lg object-contain bg-[#0b1b33]"
                      onError={(ev) => {
                        ;(ev.currentTarget as HTMLImageElement).style.display = 'none'
                      }}
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-100">{e.title}</p>
                      <p className="truncate text-xs text-slate-500">{e.location}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-300">{e.type}</td>
                <td className="px-4 py-3 text-sm text-slate-300">
                  {Math.max(0, e.remainingSeats)} / {e.capacity}
                </td>
                <td className="px-4 py-3 text-sm text-slate-300">{e.totalPrice.toFixed(2)} лв.</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => openParticipants(e)}
                      className="rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
                      disabled={busy}
                    >
                      Участници
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(e)}
                      className="rounded-lg border border-sky-400/30 bg-sky-500/10 px-3.5 py-2 text-sm font-semibold text-sky-100 shadow-sm shadow-black/20 transition hover:border-sky-300/50 hover:bg-sky-500/15"
                      disabled={busy}
                    >
                      Редакция
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(e)}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-sm font-semibold text-red-100 shadow-sm shadow-black/20 transition hover:bg-red-500/15 hover:border-red-400/50"
                      disabled={busy}
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
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => (!busy ? setOpen(false) : null)}
            aria-label="Close"
          />
          <div className="absolute left-1/2 top-1/2 w-[min(820px,calc(100%-2rem))] max-h-[calc(100vh-4rem)] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-3xl border border-white/10 bg-surface-900/95 p-6 shadow-2xl shadow-black/60 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-white">{mode === 'create' ? 'Ново събитие' : 'Редакция на събитие'}</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl p-2 text-slate-200 transition hover:bg-white/5"
                aria-label="Close"
                disabled={busy}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-200">Заглавие</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-black/20 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-200">Описание</label>
                <textarea
                  value={form.description ?? ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      description: e.target.value.trim() ? e.target.value : null,
                      fullDescription: e.target.value.trim() ? e.target.value : null,
                    }))
                  }
                  rows={5}
                  className="mt-1 w-full resize-none rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-black/20 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2"
                  placeholder="2-3 изречения за метод, стръв, препоръки…"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-200">Линк за снимка</label>
                <input
                  value={form.imageUrl ?? ''}
                  onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value.trim() ? e.target.value : null }))}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-black/20 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200">Тип</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as UpsertFishingEventInput['type'] }))}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-black/20 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2"
                >
                  <option value="Express">Express</option>
                  <option value="Adventure">Adventure</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200">Локация</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-black/20 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200">Нощувки</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={Number.isFinite(form.nights) ? form.nights : 0}
                  onChange={(e) => setForm((p) => ({ ...p, nights: Math.max(0, parseInt(e.target.value, 10) || 0) }))}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-black/20 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200">Цена (общо)</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={Number.isFinite(form.totalPrice) ? form.totalPrice : 0}
                  onChange={(e) => setForm((p) => ({ ...p, totalPrice: parseFloat(e.target.value) || 0 }))}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-black/20 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200">Капацитет</label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={Number.isFinite(form.capacity) ? form.capacity : 1}
                  onChange={(e) => setForm((p) => ({ ...p, capacity: Math.max(1, parseInt(e.target.value, 10) || 1) }))}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-black/20 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200">Заети места</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={Number.isFinite(form.occupiedSeats) ? form.occupiedSeats : 0}
                  onChange={(e) => setForm((p) => ({ ...p, occupiedSeats: Math.max(0, parseInt(e.target.value, 10) || 0) }))}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-black/20 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200">Рейтинг на водача</label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  step="0.1"
                  value={Number.isFinite(form.guideRating) ? form.guideRating : 0}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value)
                    setForm((p) => ({ ...p, guideRating: Number.isFinite(v) ? Math.max(0, Math.min(5, v)) : 0 }))
                  }}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-black/20 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2"
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
                disabled={busy || !form.title.trim() || !form.location.trim()}
              >
                {busy ? 'Запис…' : 'Запази'}
              </button>
            </div>
          </div>
        </div>
      )}

      {participants.open && (
        <div className="fixed inset-0 z-[80]">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setParticipants((p) => ({ ...p, open: false }))}
            aria-label="Close"
          />
          <div className="absolute left-1/2 top-1/2 w-[min(700px,calc(100%-2rem))] max-h-[calc(100vh-4rem)] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-3xl border border-white/10 bg-surface-900/95 p-6 shadow-2xl shadow-black/60 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-white">
                Участници: {participants.event?.title ?? ''}
              </h2>
              <button
                type="button"
                onClick={() => setParticipants((p) => ({ ...p, open: false }))}
                className="rounded-xl p-2 text-slate-200 transition hover:bg-white/5"
                aria-label="Close"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {participants.loading && (
              <p className="mt-6 text-slate-400" role="status">Зареждане…</p>
            )}

            {participants.error && (
              <p className="mt-6 text-sm text-red-300">{participants.error}</p>
            )}

            {!participants.loading && !participants.error && participants.users.length === 0 && (
              <div className="mt-6 rounded-xl border border-dashed border-white/15 bg-surface-800/40 p-6 text-center">
                <p className="text-slate-400">Няма записани участници.</p>
              </div>
            )}

            {!participants.loading && !participants.error && participants.users.length > 0 && (
              <ul className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10 bg-surface-800/30">
                {participants.users.map((u) => (
                  <li key={u.registrationId} className="flex items-center justify-between gap-4 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">{u.userName}</p>
                      <p className="mt-0.5 text-sm text-white/60">User #{u.userId} · Reg #{u.registrationId}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveParticipant(u).catch(() => {})}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-sm font-semibold text-red-100 shadow-sm shadow-black/20 transition hover:bg-red-500/15 hover:border-red-400/50 disabled:opacity-50"
                      disabled={participants.loading}
                    >
                      Премахни
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
