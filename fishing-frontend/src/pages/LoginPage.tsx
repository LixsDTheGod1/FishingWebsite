import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { login } from '../api/authApi'
import { useAuth } from '../context/AuthProvider'

function toBgAuthError(e: unknown): string {
  if (axios.isAxiosError(e)) {
    const detail = (e.response?.data as { detail?: string } | undefined)?.detail

    if (e.response?.status === 401) {
      if (detail === 'Invalid email or password.') return 'Невалиден имейл или парола.'
      return 'Грешен имейл или парола.'
    }

    if (e.response?.status === 400) {
      if (detail === 'Email is already registered.') return 'Имейлът вече е регистриран.'
      if (detail) return detail
      return 'Моля, проверете въведените данни.'
    }

    return 'Възникна грешка при връзката със сървъра.'
  }

  return 'Възникна неочаквана грешка.'
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { refresh } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const from = (location.state as { from?: string } | null)?.from

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError('Полетата са задължителни.')
      return
    }

    setSubmitting(true)
    try {
      await login(email.trim(), password)
      const me = await refresh()
      if (!me) {
        setError('Входът беше успешен, но профилът не можа да се зареди. Моля, опитайте отново.')
        return
      }
      navigate(from ?? '/profile')
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
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">Вход</h1>
          <p className="mt-2 text-sm text-slate-400">
            Влезте в профила си, за да виждате поръчките и настройките.
          </p>

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
              <label className="block text-sm font-medium text-slate-200">Парола</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                className="mt-1 w-full rounded-xl border border-white/10 bg-surface-900/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 shadow-inner shadow-black/20 outline-none ring-brand-500/30 focus:border-brand-500/50 focus:ring-2"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="ui-btn-primary mt-2 w-full"
            >
              {submitting ? 'Влизане…' : 'Вход'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            Нямате профил?{' '}
            <Link to="/register" className="font-semibold text-brand-300 hover:text-brand-200">
              Регистрирайте се
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
