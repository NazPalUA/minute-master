import { z } from 'zod'

export const languages = {
  en: 'English',
  uk: 'Українська',
  ru: 'Русский'
} as const

export const availableLanguages = Object.keys(languages) as Language[]

export type Language = keyof typeof languages

export const defaultLanguage: Language = 'en'

export const LanguageSchema = z.enum(availableLanguages as [Language])
