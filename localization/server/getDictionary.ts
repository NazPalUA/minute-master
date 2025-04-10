import 'server-only'

import { cache } from 'react'
import type { Dictionary } from '../dict-type'
import {
  availableLanguages,
  defaultLanguage,
  LanguageSchema,
  type Language
} from '../languages'

const importDict = (lang: Language, subDict: keyof Dictionary) =>
  import(`../dictionaries/${subDict}/${lang}.json`).then(m => m.default)

const DICT_SECTIONS: Array<keyof Dictionary> = [
  'common',
  'dashboard',
  'project',
  'public',
  'section',
  'task',
  'time',
  'time-log'
] as const

const dictionaries = Object.fromEntries(
  availableLanguages.map(lang => [
    lang,
    Object.fromEntries(
      DICT_SECTIONS.map(section => [
        section,
        () => importDict(lang, section) as Promise<Dictionary[typeof section]>
      ])
    )
  ])
)

export const getDictionary = cache(async (locale: string) => {
  const lang = LanguageSchema.catch(defaultLanguage).parse(locale)

  const entries = await Promise.all(
    DICT_SECTIONS.map(async section => [
      section,
      await dictionaries[lang][section]()
    ])
  )

  return Object.fromEntries(entries) as Dictionary
})
