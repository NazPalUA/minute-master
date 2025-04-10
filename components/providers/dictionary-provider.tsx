'use client'

import { Dictionary, Language } from '@/localization'
import { createContext } from 'react'

type Value = Dictionary & { lang: Language }

export const DictionaryContext = createContext<Value | null>(null)

export function DictionaryProvider({
  children,
  dictionary,
  lang
}: {
  children: React.ReactNode
  dictionary: Dictionary
  lang: Language
}) {
  return (
    <DictionaryContext.Provider value={{ ...dictionary, lang }}>
      {children}
    </DictionaryContext.Provider>
  )
}
