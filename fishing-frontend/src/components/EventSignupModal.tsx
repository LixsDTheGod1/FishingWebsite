import { Link } from 'react-router-dom'
import type { FishingEventDTO } from '../api/types'
import { useTranslation } from 'react-i18next'
import { localizeDynamicText } from '../utils/localizeDynamicText'

type Props = {
  open: boolean
  event: FishingEventDTO | null
  busy: boolean
  onClose: () => void
  onConfirm: (eventId: number) => void
}

export default function EventSignupModal({ open, event, busy, onClose, onConfirm }: Props) {
  const { t, i18n } = useTranslation()

  if (!open || !event) return null

  const typeLabel = (type: FishingEventDTO['type']) => {
    if (type === 'Express') return t('events.type.express')
    return t('events.type.adventure')
  }

  const details = (event.description ?? event.fullDescription)?.trim()

  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={busy ? undefined : onClose} aria-hidden />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-surface-900/85 shadow-2xl">
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-wider text-white/60">{t('events.confirm.kicker')}</p>
              <h3 className="mt-2 font-display text-2xl font-bold text-white">{localizeDynamicText(event.title, i18n.language)}</h3>
              <p className="mt-2 text-white/70">
                {localizeDynamicText(event.location, i18n.language)} · {event.nights} {t('events.labels.nights').toLowerCase()} · {typeLabel(event.type)}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="rounded-xl p-2 text-slate-200 transition hover:bg-white/5 disabled:opacity-50"
              aria-label={t('common.close')}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-white">{t('events.confirm.details_title')}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              {details ? details : t('events.confirm.no_details')}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/profile"
              className="h-11 rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-bold text-white hover:bg-white/10 inline-flex items-center justify-center"
              onClick={busy ? (e) => e.preventDefault() : undefined}
            >
              {t('events.actions.view_my_events')}
            </Link>
            <button
              type="button"
              onClick={() => onConfirm(event.id)}
              disabled={busy}
              className="h-11 rounded-xl bg-turquoise px-4 text-sm font-bold text-slate-950 hover:opacity-90 disabled:opacity-60"
            >
              {busy ? t('events.actions.signing_up') : t('events.actions.sign_up')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
