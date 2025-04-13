import {
  ClerkProvider,
  DictionaryProvider,
  ThemeProvider
} from '@/components/providers'
import { APP_NAME } from '@/lib/constants'
import { availableLanguages, Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export async function generateStaticParams() {
  return availableLanguages.map(lang => ({ lang }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: Language }>
}): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const { title, description } = dict.public.meta
  return {
    title: APP_NAME + ' | ' + title,
    description: APP_NAME + ' | ' + description,
    icons: [{ rel: 'icon', url: '/favicon.ico' }]
  }
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ lang: Language }>
}>) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="o0Iz_k1Yocrxiu7HWTzsYsPJoGwJaWSpVzrgVRqQMN4"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        <DictionaryProvider dictionary={dict} lang={lang}>
          <ThemeProvider>
            <ClerkProvider>{children}</ClerkProvider>
          </ThemeProvider>
        </DictionaryProvider>
      </body>
    </html>
  )
}
