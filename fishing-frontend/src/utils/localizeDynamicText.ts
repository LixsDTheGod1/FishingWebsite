export function transliterateBgToEn(input: string): string {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y',
    к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
    ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sht', ъ: 'a', ь: '', ю: 'yu', я: 'ya',
  }

  let out = ''
  for (const ch of input) {
    const lower = ch.toLowerCase()
    const repl = map[lower]
    if (repl == null) {
      out += ch
      continue
    }

    const isUpper = ch !== lower
    if (!isUpper) {
      out += repl
    } else {
      out += repl.length > 0 ? repl[0].toUpperCase() + repl.slice(1) : repl
    }
  }
  return out
}

export function localizeDynamicText(text: string, lang: string): string {
  const trimmed = text.trim()
  if (!trimmed) return text

  if (!lang.toLowerCase().startsWith('en')) return text

  // Known replacements for seeded/typical values.
  const known: Array<[RegExp, string]> = [
    [/\bЕкспрес\b/gi, 'Express'],
    [/\bПриключение\b/gi, 'Adventure'],
  ]

  let next = text
  for (const [re, repl] of known) {
    next = next.replace(re, repl)
  }

  // If there is still Cyrillic, transliterate it.
  if (/[\u0400-\u04FF]/.test(next)) {
    next = transliterateBgToEn(next)
  }

  return next
}
