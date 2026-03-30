import { useMemo } from 'react'

type Props = {
  payload: string
  size?: number
}

function toSvgUrl(svg: string): string {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22')
  return `data:image/svg+xml;charset=utf-8,${encoded}`
}

export default function TicketQr({ payload, size = 180 }: Props) {
  const src = useMemo(() => {
    // Lightweight QR generator with no dependency:
    // Use a simple SVG placeholder when payload is empty.
    // Real QR generation is done via backend-safe library later if desired.
    // For now we render payload as a deterministic pattern (pseudo-QR) to keep zero deps.
    // NOTE: This is NOT a standards-compliant QR.
    const blocks = 29
    const cell = Math.floor(size / blocks)
    const pad = Math.floor((size - blocks * cell) / 2)

    let hash = 0
    for (let i = 0; i < payload.length; i++) hash = (hash * 31 + payload.charCodeAt(i)) >>> 0

    const rects: string[] = []
    for (let y = 0; y < blocks; y++) {
      for (let x = 0; x < blocks; x++) {
        // deterministic pseudo-random
        const v = (hash + x * 73856093 + y * 19349663) >>> 0
        const on = (v & 7) === 0 || (v & 11) === 0
        if (on) {
          const rx = pad + x * cell
          const ry = pad + y * cell
          rects.push(`<rect x="${rx}" y="${ry}" width="${cell}" height="${cell}" />`)
        }
      }
    }

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="100%" height="100%" fill="#0b1220"/>
  <g fill="#e5e7eb" opacity="0.95">
    ${rects.join('')}
  </g>
  <rect x="1" y="1" width="${size - 2}" height="${size - 2}" fill="none" stroke="rgba(255,255,255,0.12)"/>
</svg>`
    return toSvgUrl(svg)
  }, [payload, size])

  return (
    <img
      src={src}
      alt="Ticket QR"
      width={size}
      height={size}
      className="rounded-xl border border-white/10 bg-surface-900/40"
    />
  )
}
