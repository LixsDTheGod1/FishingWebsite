import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { fetchEvents, signupForEvent } from '../api/eventsApi'
import type { FishingEventDTO, SignupTicketDTO } from '../api/types'
import { useToast } from '../hooks/useToast'
import { QRCodeCanvas } from 'qrcode.react'
import axios from 'axios'
import EventSignupModal from '../components/EventSignupModal'

type Status = 'idle' | 'loading' | 'error'

export default function EventsPage() {
  const { i18n } = useTranslation()
  const { showToast } = useToast()

  const [status, setStatus] = useState<Status>('loading')
  const [items, setItems] = useState<FishingEventDTO[]>([])
  const [actionId, setActionId] = useState<number | null>(null)
  const [successEvent, setSuccessEvent] = useState<FishingEventDTO | null>(null)
  const [successTicket, setSuccessTicket] = useState<SignupTicketDTO | null>(null)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmEvent, setConfirmEvent] = useState<FishingEventDTO | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setStatus('loading')
        const data = await fetchEvents()
        if (!cancelled) {
          setItems(data)
          setStatus('idle')
        }
      } catch {
        if (!cancelled) setStatus('error')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const formatter = useMemo(() => {
    try {
      return new Intl.NumberFormat(i18n.language, {
        style: 'currency',
        currency: 'BGN',
        maximumFractionDigits: 2,
      })
    } catch {
      return new Intl.NumberFormat('bg-BG', {
        style: 'currency',
        currency: 'BGN',
        maximumFractionDigits: 2,
      })
    }
  }, [i18n.language])

  const typeLabel = (type: FishingEventDTO['type']) => {
    if (type === 'Express') return 'Експрес'
    return 'Приключение'
  }

  const handleSignup = async (eventId: number) => {
    try {
      setActionId(eventId)
      const ticket = await signupForEvent(eventId)

      const signed = items.find((x) => x.id === eventId) ?? null

      setItems((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? {
                ...e,
                occupiedSeats: e.occupiedSeats + 1,
                remainingSeats: Math.max(0, e.remainingSeats - 1),
              }
            : e,
        ),
      )

      if (signed) {
        setSuccessEvent(signed)
        setSuccessTicket(ticket)
      }
      else showToast('Успешно записване!')
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const msg =
          (e.response?.data as any)?.detail ||
          (e.response?.data as any)?.title ||
          (e.response?.status === 401 ? 'Моля, влезте в профила си.' : e.message)
        showToast(String(msg))
      } else {
        showToast('Неуспешно записване.')
      }
    } finally {
      setActionId(null)
    }
  }

  const openConfirm = (e: FishingEventDTO) => {
    setConfirmEvent(e)
    setConfirmOpen(true)
  }

  const qrValue = useMemo(() => {
    if (!successTicket) return ''
    return JSON.stringify({
      registrationId: successTicket.registrationId,
      userName: successTicket.userName,
      eventTitle: successTicket.eventTitle,
    })
  }, [successTicket])

  const downloadTicketPng = () => {
    if (!successTicket) return
    const canvas = document.getElementById(`qr-ticket-${successTicket.registrationId}`) as HTMLCanvasElement | null
    if (!canvas) return

    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `ticket-${successTicket.registrationId}.png`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white/60">Обяви</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">Риболовни събития</h1>
          <p className="mt-3 max-w-2xl text-white/70">
            Избери пакет, провери наличните места и се запиши директно.
          </p>
        </div>
      </div>

      {status === 'loading' && (
        <div className="mt-10 rounded-2xl border border-white/10 bg-surface-800/40 p-8 text-white/70">
          Зареждане...
        </div>
      )}

      {status === 'error' && (
        <div className="mt-10 rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-red-100">
          Грешка при зареждане на събитията.
        </div>
      )}

      {status === 'idle' && items.length === 0 && (
        <div className="mt-10 rounded-2xl border border-white/10 bg-surface-800/40 p-8 text-white/70">
          Няма активни събития.
        </div>
      )}

      {status === 'idle' && items.length > 0 && (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((e) => {
            const remaining = Math.max(0, e.remainingSeats)
            const isFull = remaining <= 0
            return (
              <div
                key={e.id}
                className="group rounded-2xl border border-white/10 bg-surface-800/40 p-6 transition-all duration-300 hover:border-white/20 hover:bg-surface-800/60"
              >
                {e.imageUrl && (
                  <div className="-mx-6 -mt-6 mb-5 overflow-hidden rounded-t-2xl border-b border-white/10 bg-[#0b1b33] aspect-[16/9]">
                    <img src={e.imageUrl} alt="" className="h-full w-full object-contain" loading="lazy" />
                  </div>
                )}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="inline-flex items-center rounded-full border border-turquoise/30 bg-turquoise/10 px-3 py-1 text-xs font-semibold text-turquoise">
                      {typeLabel(e.type)}
                    </p>
                    <h2 className="mt-4 truncate font-display text-xl font-bold text-white">{e.title}</h2>
                    <p className="mt-2 text-sm text-white/60">{e.location}</p>
                    {(e.description ?? e.fullDescription) && (
                      <p className="mt-3 text-sm leading-relaxed text-white/70">
                        {(e.description ?? e.fullDescription ?? '').slice(0, 100)}
                        {(e.description ?? e.fullDescription ?? '').length > 100 ? '…' : ''}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center">
                    <p className="text-xs font-semibold text-white/60">Места</p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {remaining} от {e.capacity}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs font-semibold text-white/60">Нощувки</p>
                    <p className="mt-1 text-sm font-bold text-white">{e.nights}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs font-semibold text-white/60">Водач</p>
                    <p className="mt-1 text-sm font-bold text-white">{e.guideRating.toFixed(1)} / 5</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <p className="font-display text-2xl font-bold text-brand-300">
                    {formatter.format(e.totalPrice)}
                  </p>
                  <button
                    type="button"
                    disabled={isFull || actionId === e.id}
                    onClick={() => openConfirm(e)}
                    className={[
                      'h-11 rounded-xl px-4 text-sm font-bold transition-all duration-200',
                      isFull
                        ? 'cursor-not-allowed border border-white/10 bg-white/5 text-white/40'
                        : 'cursor-pointer bg-turquoise text-slate-950 hover:opacity-90',
                      actionId === e.id ? 'opacity-70' : '',
                    ].join(' ')}
                  >
                    {isFull ? 'Пълно' : actionId === e.id ? 'Записване...' : 'Запиши се'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <EventSignupModal
        open={confirmOpen}
        event={confirmEvent}
        busy={confirmEvent ? actionId === confirmEvent.id : false}
        onClose={() => {
          if (actionId != null) return
          setConfirmOpen(false)
          setConfirmEvent(null)
        }}
        onConfirm={(eventId) => {
          setConfirmOpen(false)
          setConfirmEvent(null)
          handleSignup(eventId).catch(() => {})
        }}
      />

      {successEvent && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => {
              setSuccessEvent(null)
              setSuccessTicket(null)
            }}
            aria-hidden
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-surface-900/80 shadow-2xl">
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-turquoise/15 text-turquoise">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold uppercase tracking-wider text-white/60">Успешно записване</p>
                  <h3 className="mt-2 font-display text-2xl font-bold text-white">Поздравления!</h3>
                  <p className="mt-2 text-white/70">
                    Вече сте част от групата за <span className="font-semibold text-white">{successEvent.title}</span>.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-white/60">Оставащи места</p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {Math.max(0, successEvent.remainingSeats - 1)} от {successEvent.capacity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-white/60">Тип</p>
                    <p className="mt-1 text-sm font-bold text-white">{typeLabel(successEvent.type)}</p>
                  </div>
                </div>
              </div>

              {successTicket && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white/60">QR билет</p>
                      <p className="mt-1 text-sm text-white/70">Регистрация #{successTicket.registrationId}</p>
                      <p className="mt-1 text-sm text-white/70">Потребител: {successTicket.userName}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-surface-900/40 p-3">
                      <QRCodeCanvas
                        id={`qr-ticket-${successTicket.registrationId}`}
                        value={qrValue}
                        size={164}
                        bgColor="#0b1220"
                        fgColor="#e5e7eb"
                        includeMargin
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setSuccessEvent(null)
                    setSuccessTicket(null)
                  }}
                  className="h-11 rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-bold text-white hover:bg-white/10"
                >
                  Затвори
                </button>

                {successTicket && (
                  <button
                    type="button"
                    onClick={downloadTicketPng}
                    className="h-11 rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-bold text-white hover:bg-white/10"
                  >
                    Свали билет
                  </button>
                )}
                <Link
                  to="/profile"
                  onClick={() => {
                    setSuccessEvent(null)
                    setSuccessTicket(null)
                  }}
                  className="h-11 rounded-xl bg-turquoise px-4 text-sm font-bold text-slate-950 hover:opacity-90 inline-flex items-center justify-center"
                >
                  Виж моите събития
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
