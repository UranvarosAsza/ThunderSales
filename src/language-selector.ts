import en from './assets/locales/en.json'
import hu from './assets/locales/hu.json'

export const translations = {
  en,
  hu
}

export type Locale = 'en' | 'hu'

export function getLocale(): Locale {
  const saved = document.cookie.match(/locale=([^;]+)/)?.[1]
  return saved === 'hu' || saved === 'en' ? saved : 'en'
}

export function setLocale(lang: Locale): void {
  document.cookie = `locale=${lang}; path=/; max-age=31536000`
}

export function t(key: string): string {
  const locale = getLocale()
  const keys = key.split('.')
  let value: any = translations[locale]

  for (const k of keys) {
    value = value?.[k]
  }

  return value || key
}
