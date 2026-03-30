import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import { useEffect, useState } from 'react'

export default function AdminPanel() {
  const { t } = useTranslation()
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [active, setActive] = useState<'products' | 'orders' | null>(null)

  useEffect(() => {
    if (active === 'products') {
      navigate('/admin/products')
    }
    if (active === 'orders') {
      navigate('/admin/orders')
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
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'Admin') {
    return <Navigate to="/" replace />
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
        },
        {
          key: 'orders',
          title: t('admin.cards.orders'),
        },
        {
          key: 'posts',
          title: t('admin.cards.posts'),
        },
        {
          key: 'users',
          title: t('admin.cards.users'),
        },
        {
          key: 'analytics',
          title: t('admin.cards.analytics'),
        }].map((item) => (
          <div
            key={item.key}
            role="button"
            tabIndex={0}
            onClick={() => {
              if (item.key === 'products') setActive('products')
              if (item.key === 'orders') setActive('orders')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && item.key === 'products') setActive('products')
              if (e.key === 'Enter' && item.key === 'orders') setActive('orders')
            }}
            className="cursor-pointer rounded-2xl border border-dashed border-white/20 bg-surface-800/40 p-6 text-center transition hover:border-brand-500/40 hover:bg-white/5"
          >
            <p className="font-display font-semibold text-white">{item.title}</p>
            <p className="mt-2 text-xs text-slate-500">
              {item.key === 'products'
                ? 'Управление на продукти'
                : item.key === 'orders'
                  ? 'Всички поръчки'
                  : t('admin.coming')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
