import translations from '@/assets/translations.json'

export function translate(key, language) {
  const translation = translations.find((item) => item.key === key)
  return translation ? translation[language] || translation.en : key
}
