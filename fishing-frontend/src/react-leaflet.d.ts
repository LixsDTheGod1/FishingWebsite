declare module 'react-leaflet' {
  import type { ComponentType } from 'react'

  type Props = {
    children?: import('react').ReactNode
  } & Record<string, unknown>

  export const MapContainer: ComponentType<Props>
  export const TileLayer: ComponentType<Props>
  export const Marker: ComponentType<Props>
  export const Popup: ComponentType<Props>
}
