import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { register } from '../api/authApi'
import { useAuth } from '../context/AuthProvider'

function toBgAuthError(e: unknown): string {
  if (axios.isAxiosError(e)) {
    const detail = (e.response?.data as { detail?: string } | undefined)?.detail

    if (e.response?.status === 400) {
      if (detail === 'Email is already registered.') return 'Имейлът вече е регистриран.'
      if (detail) return detail
      return 'Моля, проверете въведените данни.'
    }

    return 'Възникна грешка при връзката със сървъра.'
  }

  return 'Възникна неочаквана грешка.'
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { refresh } = useAuth()

  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !userName.trim() || !password.trim()) {
      setError('Полетата са задължителни.')
      return
    }

    if (userName.trim().length < 2) {
      setError('Потребителското име трябва да е поне 2 символа.')
      return
    }

    if (password.length < 6) {
      setError('Паролата трябва да е поне 6 символа.')
      return
    }

    setSubmitting(true)
    try {
      await register(email.trim(), userName.trim(), password)
      await refresh()
      navigate('/')
    } catch (err) {
      setError(toBgAuthError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border border-white/10 bg-surface-800/40 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">Регистрация</h1>
          <p className="mt-2 text-sm text-slate-400">Създайте профил в SD Fishing за по-бърза поръчка.</p>

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200">Имейл</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                className="mt-1 w-full rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 shadow-inner shadow-black/20 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200">Потребителско име</label>
              <input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                type="text"
                autoComplete="username"
                className="mt-1 w-full rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 shadow-inner shadow-black/20 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2"
                placeholder="Напр. Ivan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200">Парола</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="new-password"
                className="mt-1 w-full rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 shadow-inner shadow-black/20 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2"
                placeholder="Минимум 6 символа"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-900/30 transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Създаване…' : 'Регистрация'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            Имате профил?{' '}
            <Link to="/login" className="font-semibold text-brand-300 hover:text-brand-200">
              Влезте
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
