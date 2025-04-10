'use client'

import { useDictionary } from '@/hooks'
import { enUS, ruRU, ukUA } from '@clerk/localizations'
import { ClerkProvider as ClerkProviderBase } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useTheme } from 'next-themes'

const clerkLocales = {
  en: enUS,
  uk: ukUA,
  ru: ruRU
}

export function ClerkProvider({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const { lang } = useDictionary()
  const { resolvedTheme } = useTheme()
  return (
    <ClerkProviderBase
      localization={clerkLocales[lang]}
      appearance={{
        baseTheme: resolvedTheme === 'dark' ? dark : undefined
      }}
    >
      {children}
    </ClerkProviderBase>
  )
}
