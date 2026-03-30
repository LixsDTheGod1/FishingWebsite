export function formatCurrency(amount: number, language: string): string {
  const isBg = language.toLowerCase().startsWith('bg')
  const locale = isBg ? 'bg-BG' : 'en-US'
  const currency = isBg ? 'BGN' : 'USD'

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return isBg ? `${amount.toFixed(2)} лв.` : `$${amount.toFixed(2)}`
  }
}

export function formatDate(iso: string | null, language: string): string {
  if (!iso) return ''
  const isBg = language.toLowerCase().startsWith('bg')
  const locale = isBg ? 'bg-BG' : 'en-US'

  try {
    return new Date(iso).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}
