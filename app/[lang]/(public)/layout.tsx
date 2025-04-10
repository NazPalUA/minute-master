import { Language } from '@/localization'
import { Footer, Header } from './_components'

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ lang: Language }>
}>) {
  const { lang } = await params

  return (
    <div className="relative flex min-h-screen flex-col font-[family-name:var(--font-geist-sans)]">
      <Header lang={lang} />
      <main className="flex-1">{children}</main>
      <Footer lang={lang} />
    </div>
  )
}
