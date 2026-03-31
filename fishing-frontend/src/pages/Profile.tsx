import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchCurrentUser } from '../api/usersApi'
import type { OrderDTO, UserDTO } from '../api/types'
import { formatDate } from '../utils/format'
import { formatCurrency } from '../utils/format'
import { fetchMyOrders } from '../api/ordersApi'
import { fetchMyRegistrations } from '../api/eventsApi'
import type { MyEventRegistrationDTO } from '../api/types'
import { QRCodeCanvas } from 'qrcode.react'

export default function Profile() {
  const { t, i18n } = useTranslation()
  const [user, setUser] = useState<UserDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [orders, setOrders] = useState<OrderDTO[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  const [registrations, setRegistrations] = useState<MyEventRegistrationDTO[]>([])
  const [eventsLoading, setEventsLoading] = useState(false)
  const [eventsError, setEventsError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const me = await fetchCurrentUser()
        if (!cancelled) {
          setUser(me)
          setError(null)

          if (me) {
            setOrdersLoading(true)
            setOrdersError(null)
            try {
              const list = await fetchMyOrders()
              if (!cancelled) setOrders(list)
            } catch (e) {
              if (!cancelled) {
                setOrdersError(e instanceof Error ? e.message : t('profile.errors.orders'))
              }
            } finally {
              if (!cancelled) setOrdersLoading(false)
            }

            setEventsLoading(true)
            setEventsError(null)
            try {
              const list = await fetchMyRegistrations()
              if (!cancelled) setRegistrations(list)
            } catch (e) {
              if (!cancelled) {
                setEventsError(e instanceof Error ? e.message : t('profile.errors.events'))
              }
            } finally {
              if (!cancelled) setEventsLoading(false)
            }
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : t('common.error_profile'))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [t])

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <p className="text-slate-400" role="status">
          {t('profile.title')}…
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <p className="text-red-300">{error}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <h1 className="font-display text-3xl font-bold text-white">{t('profile.title')}</h1>
      <p className="mt-2 text-slate-400">
        {user ? t('profile.loaded') : t('profile.signin_hint')}
      </p>

      <div className="mt-10 rounded-2xl border border-white/10 bg-surface-800/50 p-6 sm:p-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600/30 text-2xl font-bold text-brand-200">
            {(user?.userName ?? user?.email ?? 'A').slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-white">
              {user?.userName ?? t('profile.guest')}
            </p>
            <p className="text-sm text-slate-400">{user?.email ?? t('profile.not_signed')}</p>
          </div>
        </div>
        {user && (
          <dl className="mt-8 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {t('profile.user_id')}
              </dt>
              <dd className="mt-1 text-slate-200">{user.id}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {t('profile.member_since')}
              </dt>
              <dd className="mt-1 text-slate-200">
                {formatDate(user.createdAtUtc, i18n.language)}
              </dd>
            </div>
          </dl>
        )}
      </div>

      {user && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-surface-800/50 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-white">Моите поръчки</h2>
          <p className="mt-2 text-sm text-slate-400">История на направените поръчки.</p>

          {ordersLoading && (
            <p className="mt-6 text-slate-400" role="status">
              Зареждане…
            </p>
          )}

          {ordersError && (
            <p className="mt-6 text-sm text-red-300">{ordersError}</p>
          )}

          {!ordersLoading && !ordersError && orders.length === 0 && (
            <div className="mt-6 rounded-xl border border-dashed border-white/15 bg-surface-800/40 p-6 text-center">
              <p className="text-slate-400">Нямате поръчки.</p>
            </div>
          )}

          <div className="mt-6 space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="rounded-2xl border border-white/10 bg-surface-900/40 p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Поръчка #{o.id}</p>
                    <p className="mt-1 font-medium text-white">
                      {formatDate(o.orderDateUtc, i18n.language)}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">Статус: {o.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider text-slate-500">Общо</p>
                    <p className="mt-1 text-lg font-bold text-white">
                      {formatCurrency(o.totalAmount, i18n.language)}
                    </p>
                  </div>
                </div>

                {o.items.length > 0 && (
                  <ul className="mt-4 divide-y divide-white/10">
                    {o.items.map((it) => (
                      <li key={it.id} className="flex items-center justify-between gap-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-100">{it.productName}</p>
                          <p className="text-sm text-slate-400">
                            {it.quantity} × {formatCurrency(it.unitPrice, i18n.language)}
                          </p>
                        </div>
                        <p className="font-semibold text-white">
                          {formatCurrency(it.unitPrice * it.quantity, i18n.language)}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {user && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-surface-800/50 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-white">Моите събития</h2>
          <p className="mt-2 text-sm text-slate-400">Списък със записванията ви за риболовни събития.</p>

          {eventsLoading && (
            <p className="mt-6 text-slate-400" role="status">
              Зареждане…
            </p>
          )}

          {eventsError && (
            <p className="mt-6 text-sm text-red-300">{eventsError}</p>
          )}

          {!eventsLoading && !eventsError && registrations.length === 0 && (
            <div className="mt-6 rounded-xl border border-dashed border-white/15 bg-surface-800/40 p-6 text-center">
              <p className="text-slate-400">Нямате записвания за събития.</p>
            </div>
          )}

          <div className="mt-6 space-y-4">
            {registrations.map((r) => {
              const e = r.event

              const payload = JSON.stringify({
                registrationId: r.registrationId,
                eventTitle: e.title,
                userId: user?.id,
                userName: user?.userName,
              })

              const onDownload = () => {
                const canvas = document.getElementById(`qr-profile-${r.registrationId}`) as HTMLCanvasElement | null
                if (!canvas) return

                const url = canvas.toDataURL('image/png')
                const a = document.createElement('a')
                a.href = url
                a.download = `ticket-${r.registrationId}.png`
                document.body.appendChild(a)
                a.click()
                a.remove()
              }

              return (
                <div key={r.registrationId} className="rounded-2xl border border-white/10 bg-surface-900/40 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm text-slate-400">{e.type === 'Express' ? 'Експрес' : 'Приключение'}</p>
                      <p className="mt-1 font-display text-lg font-bold text-white">{e.title}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {e.location} · {e.nights} нощувки · Водач {e.guideRating.toFixed(1)} / 5
                      </p>
                      <p className="mt-2 text-xs text-white/60">Регистрация #{r.registrationId}</p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xs uppercase tracking-wider text-slate-500">Места</p>
                      <p className="mt-1 text-sm font-bold text-white">
                        {Math.max(0, e.remainingSeats)} от {e.capacity}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-brand-300">
                        {formatCurrency(e.totalPrice, i18n.language)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row">
                    <div className="rounded-2xl border border-white/10 bg-surface-900/40 p-3">
                      <QRCodeCanvas
                        id={`qr-profile-${r.registrationId}`}
                        value={payload}
                        size={156}
                        bgColor="#0b1220"
                        fgColor="#e5e7eb"
                        includeMargin
                      />
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:items-end">
                      <button
                        type="button"
                        onClick={onDownload}
                        className="h-11 w-full rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-bold text-white hover:bg-white/10 sm:w-auto"
                      >
                        Свали билет
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
