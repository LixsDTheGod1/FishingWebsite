import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import bg from './locales/bg.json'

const STORAGE_KEY = 'lang'

function initialLanguage(): string {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'bg' || saved === 'en') return saved
  const nav = navigator.language.toLowerCase()
  if (nav.startsWith('bg')) return 'bg'
  return 'en'
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    bg: { translation: bg },
  },
  lng: initialLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export function setLanguage(lang: 'bg' | 'en') {
  localStorage.setItem(STORAGE_KEY, lang)
  void i18n.changeLanguage(lang)
}

export default i18n
