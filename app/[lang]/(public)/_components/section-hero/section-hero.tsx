import { APP_NAME } from '@/lib/constants'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { ActionButtons } from './action-buttons'

export async function SectionHero({ lang }: { lang: Language }) {
  const {
    public: {
      home: { hero: dict }
    }
  } = await getDictionary(lang)

  return (
    <section className="to-background relative overflow-hidden bg-gradient-to-b from-blue-50 px-4 py-24 dark:from-gray-800">
      <div className="bg-grid-white/10 absolute inset-0 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
      <div className="relative container mx-auto text-center">
        <h1 className="from-primary mb-6 bg-gradient-to-r to-blue-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl lg:text-6xl">
          {`${dict.welcomeTo} ${APP_NAME}`}
        </h1>
        <p className="text-muted-foreground mx-auto mb-12 max-w-3xl text-lg md:text-xl lg:text-2xl">
          {dict.subtitle}
        </p>
        <ActionButtons lang={lang} />
      </div>
    </section>
  )
}
