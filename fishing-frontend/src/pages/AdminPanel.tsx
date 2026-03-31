import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useEffect, useState } from 'react'

export default function AdminPanel() {
  const { t } = useTranslation()
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [active, setActive] = useState<'products' | 'orders' | 'events' | null>(null)

  useEffect(() => {
    if (active === 'products') {
      navigate('/admin/products')
    }
    if (active === 'orders') {
      navigate('/admin/orders')
    }
    if (active === 'events') {
      navigate('/admin/events')
    }
  }, [active, navigate])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <p className="text-slate-400" role="status">Loading…</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <h1 className="font-display text-3xl font-bold text-white">{t('admin.title')}</h1>
        <p className="mt-3 text-slate-400">{t('admin.auth_required')}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link to="/login" className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-500">
            {t('auth.login')}
          </Link>
          <Link to="/" className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5">
            {t('nav.home')}
          </Link>
        </div>
      </div>
    )
  }

  if (user.role !== 'Admin') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <h1 className="font-display text-3xl font-bold text-white">{t('admin.title')}</h1>
        <p className="mt-3 text-slate-400">{t('admin.forbidden')}</p>
        <div className="mt-6">
          <Link to="/" className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5">
            {t('nav.home')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <h1 className="font-display text-3xl font-bold text-white">{t('admin.title')}</h1>
      <p className="mt-2 max-w-2xl text-slate-400">
        {t('admin.desc')}
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[{
          key: 'products',
          title: t('admin.cards.products'),
          desc: t('admin.cards_desc.products'),
          enabled: true,
          onSelect: () => setActive('products'),
        },
        {
          key: 'orders',
          title: t('admin.cards.orders'),
          desc: t('admin.cards_desc.orders'),
          enabled: true,
          onSelect: () => setActive('orders'),
        },
        {
          key: 'events',
          title: t('admin.cards.events'),
          desc: t('admin.cards_desc.events'),
          enabled: true,
          onSelect: () => setActive('events'),
        },
        {
          key: 'posts',
          title: t('admin.cards.posts'),
          desc: t('admin.coming'),
          enabled: false,
          onSelect: () => {},
        },
        {
          key: 'users',
          title: t('admin.cards.users'),
          desc: t('admin.coming'),
          enabled: false,
          onSelect: () => {},
        },
        {
          key: 'analytics',
          title: t('admin.cards.analytics'),
          desc: t('admin.coming'),
          enabled: false,
          onSelect: () => {},
        }].map((item) =>
          item.enabled ? (
            <div
              key={item.key}
              role="button"
              tabIndex={0}
              onClick={item.onSelect}
              onKeyDown={(e) => {
                if (e.key === 'Enter') item.onSelect()
              }}
              className="cursor-pointer rounded-2xl border border-dashed border-white/20 bg-surface-800/40 p-6 text-center transition hover:border-brand-500/40 hover:bg-white/5"
            >
              <p className="font-display font-semibold text-white break-words">{item.title}</p>
              <p className="mt-2 text-xs text-slate-500">{item.desc}</p>
            </div>
          ) : (
            <div
              key={item.key}
              className="select-none rounded-2xl border border-dashed border-white/10 bg-surface-800/20 p-6 text-center opacity-60"
            >
              <p className="font-display font-semibold text-white break-words">{item.title}</p>
              <p className="mt-2 text-xs text-slate-500">{item.desc}</p>
            </div>
          ),
        )}
      </div>
    </div>
  )
}
