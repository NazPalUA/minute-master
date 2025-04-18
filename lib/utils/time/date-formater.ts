import { Language } from '@/localization'
import type { DateArg, FormatOptions, Locale } from 'date-fns'
import { formatDate } from 'date-fns'
import { enUS, ru, uk } from 'date-fns/locale'

export const dateLocaleMap: Record<Language, Locale> = {
  uk: uk,
  ru: ru,
  en: enUS
}

export const createDateFormatter = (lang: Language) => {
  const locale = dateLocaleMap[lang]

  return (date: DateArg<Date>, formatStr?: string, options?: FormatOptions) =>
    formatDate(date, formatStr || 'PPP', { locale, ...options })
}
