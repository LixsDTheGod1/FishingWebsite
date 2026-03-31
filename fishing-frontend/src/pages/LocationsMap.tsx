import { useEffect, useMemo, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import { useTranslation } from 'react-i18next'
import { fetchLocations } from '../api/locationsApi'
import type { FishingLocationDTO } from '../api/types'

const DEFAULT_CENTER: [number, number] = [42.7339, 25.4858]
const DEFAULT_ZOOM = 7

type StoreLocation = {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
}

const STORE_LOCATIONS: StoreLocation[] = [
  {
    id: 'store-sofia',
    name: 'София',
    address: 'Център, бул. Витоша 15',
    latitude: 42.697,
    longitude: 23.321,
  },
  {
    id: 'store-plovdiv',
    name: 'Пловдив',
    address: 'ул. Райко Даскалов 5',
    latitude: 42.149,
    longitude: 24.748,
  },
  {
    id: 'store-varna',
    name: 'Варна',
    address: 'бул. Княз Борис I',
    latitude: 43.204,
    longitude: 27.91,
  },
  {
    id: 'store-burgas',
    name: 'Бургас',
    address: 'ул. Александровска',
    latitude: 42.504,
    longitude: 27.472,
  },
]

const FALLBACK_LOCATIONS: FishingLocationDTO[] = [
  {
    id: 1,
    name: 'Язовир Искър',
    description: 'Сом, Платика, Костур',
    latitude: 42.435,
    longitude: 23.551,
    region: 'Софийска област',
    locationType: 'Язовир',
    createdAtUtc: new Date(0).toISOString(),
  },
  {
    id: 2,
    name: 'Язовир Доспат',
    description: 'Пъстърва',
    latitude: 41.658,
    longitude: 24.133,
    region: 'Смолян',
    locationType: 'Язовир',
    createdAtUtc: new Date(0).toISOString(),
  },
  {
    id: 3,
    name: 'Язовир Копринка',
    description: 'Бяла риба, Шаран',
    latitude: 42.612,
    longitude: 25.318,
    region: 'Стара Загора',
    locationType: 'Язовир',
    createdAtUtc: new Date(0).toISOString(),
  },
  {
    id: 4,
    name: 'Река Струма',
    description: 'Мряна, Кефал',
    latitude: 41.767,
    longitude: 23.155,
    region: 'Благоевград',
    locationType: 'Река',
    createdAtUtc: new Date(0).toISOString(),
  },
  {
    id: 5,
    name: 'Язовир Жеребчево',
    description: 'Щука, Сом',
    latitude: 42.615,
    longitude: 25.867,
    region: 'Сливен',
    locationType: 'Язовир',
    createdAtUtc: new Date(0).toISOString(),
  },
  {
    id: 6,
    name: 'Язовир Батак',
    description: 'Костур',
    latitude: 41.97,
    longitude: 24.168,
    region: 'Пазарджик',
    locationType: 'Язовир',
    createdAtUtc: new Date(0).toISOString(),
  },
  {
    id: 7,
    name: 'Язовир Въча',
    description: 'Сом, Бяла риба',
    latitude: 41.905,
    longitude: 24.444,
    region: 'Смолян',
    locationType: 'Язовир',
    createdAtUtc: new Date(0).toISOString(),
  },
  {
    id: 8,
    name: 'Река Дунав',
    description: 'Хищници',
    latitude: 43.85,
    longitude: 25.955,
    region: 'Русе',
    locationType: 'Река',
    createdAtUtc: new Date(0).toISOString(),
  },
]

const blueIcon = new L.Icon({
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).toString(),
  iconRetinaUrl: new URL(
    'leaflet/dist/images/marker-icon-2x.png',
    import.meta.url,
  ).toString(),
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).toString(),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const redIcon = L.divIcon({
  className: '',
  html: '<div style="width:18px;height:18px;border-radius:9999px;background:#ef4444;border:2px solid rgba(255,255,255,.9);box-shadow:0 6px 16px rgba(0,0,0,.45);"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -10],
})

export default function LocationsMap() {
  const { t } = useTranslation()
  const [locations, setLocations] = useState<FishingLocationDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [map, setMap] = useState<L.Map | null>(null)
  const [filter, setFilter] = useState<'all' | 'fishing' | 'stores'>('all')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchLocations()
        if (!cancelled) {
          setLocations(data.length > 0 ? data : FALLBACK_LOCATIONS)
          setError(null)
        }
      } catch {
        if (!cancelled) {
          setLocations(FALLBACK_LOCATIONS)
          setError(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const center = useMemo<[number, number]>(() => {
    const first = locations[0]
    if (!first) return DEFAULT_CENTER
    return [Number(first.latitude), Number(first.longitude)]
  }, [locations])

  const visible = useMemo(() => {
    const fishing = locations.map((l) => ({ kind: 'fishing' as const, data: l }))
    const stores = STORE_LOCATIONS.map((s) => ({ kind: 'store' as const, data: s }))
    if (filter === 'fishing') return fishing
    if (filter === 'stores') return stores
    return [...fishing, ...stores]
  }, [locations, filter])

  useEffect(() => {
    if (!map) return
    if (visible.length === 0) return

    const bounds = L.latLngBounds(
      visible.map((x) =>
        x.kind === 'fishing'
          ? ([Number(x.data.latitude), Number(x.data.longitude)] as [number, number])
          : ([Number(x.data.latitude), Number(x.data.longitude)] as [number, number]),
      ),
    )

    map.fitBounds(bounds, { padding: [30, 30] })
  }, [map, visible])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">{t('locations.title')}</h1>
          <p className="mt-2 text-slate-400">{t('locations.subtitle')}</p>
        </div>
        <p className="text-sm text-slate-500">{t('locations.loaded')}</p>
      </div>

      {loading && (
        <p className="mt-8 text-slate-400" role="status">
          {t('locations.loading')}
        </p>
      )}
      {error && (
        <p className="mt-8 rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-red-200">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-surface-800/40">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-900/30 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-2 text-white/70">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500" />
                Риболовни локации
              </span>
              <span className="inline-flex items-center gap-2 text-white/70">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
                Магазини
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={[
                  'cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
                  filter === 'all'
                    ? 'border-white/20 bg-white/10 text-white'
                    : 'border-white/10 text-white/70 hover:bg-white/10 hover:text-white',
                ].join(' ')}
              >
                Покажи всички
              </button>
              <button
                type="button"
                onClick={() => setFilter('fishing')}
                className={[
                  'cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
                  filter === 'fishing'
                    ? 'border-white/20 bg-white/10 text-white'
                    : 'border-white/10 text-white/70 hover:bg-white/10 hover:text-white',
                ].join(' ')}
              >
                Само язовири
              </button>
              <button
                type="button"
                onClick={() => setFilter('stores')}
                className={[
                  'cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
                  filter === 'stores'
                    ? 'border-white/20 bg-white/10 text-white'
                    : 'border-white/10 text-white/70 hover:bg-white/10 hover:text-white',
                ].join(' ')}
              >
                Само магазини
              </button>
            </div>
          </div>
          <MapContainer
            center={center}
            zoom={DEFAULT_ZOOM}
            scrollWheelZoom
            whenCreated={setMap}
            className="h-[520px] w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {visible.map((x) =>
              x.kind === 'fishing' ? (
                <Marker
                  key={`f-${x.data.id}`}
                  position={[Number(x.data.latitude), Number(x.data.longitude)]}
                  icon={blueIcon}
                >
                  <Popup>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">{x.data.name}</p>
                      {x.data.region && <p className="text-xs text-slate-600">Region: {x.data.region}</p>}
                      {x.data.locationType && (
                        <p className="text-xs text-slate-600">Type: {x.data.locationType}</p>
                      )}
                      {x.data.description && <p className="text-xs">{x.data.description}</p>}
                    </div>
                  </Popup>
                </Marker>
              ) : (
                <Marker
                  key={`s-${x.data.id}`}
                  position={[Number(x.data.latitude), Number(x.data.longitude)]}
                  icon={redIcon}
                >
                  <Popup>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">Магазин SD Fishing</p>
                      <p className="text-xs text-slate-600">{x.data.name}</p>
                      <p className="text-xs">{x.data.address}</p>
                      <p className="text-xs">Работно време: 09:00 - 19:00</p>
                    </div>
                  </Popup>
                </Marker>
              ),
            )}
          </MapContainer>
        </div>
      )}

      {!loading && !error && locations.length === 0 && (
        <p className="mt-8 text-slate-400">
          {t('locations.none')}{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5">POST /api/Locations</code> (JWT required).
        </p>
      )}
    </div>
  )
}
