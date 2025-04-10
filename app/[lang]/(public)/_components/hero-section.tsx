import { Button } from '@/components/ui/button'
import { APP_NAME, ROUTES } from '@/lib/constants'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export async function HeroSection({ lang }: { lang: Language }) {
  const { public: dict } = await getDictionary(lang)

  return (
    <section className="to-background bg-linear-to-b from-blue-50 px-4 pt-32 pb-20 dark:from-gray-800">
      <div className="container mx-auto text-center">
        <h1 className="from-primary mb-6 bg-linear-to-r to-blue-600 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
          {`${dict.home.hero.welcomeTo} ${APP_NAME}`}
        </h1>
        <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600 md:text-2xl dark:text-gray-300">
          {dict.home.hero.subtitle}
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg" className="group" asChild>
            <Link href={ROUTES.DASHBOARD.INDEX(lang)}>
              {dict.home.hero.tryForFree}
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button size="lg" className="cursor-pointer" variant="outline">
            {dict.home.hero.watchDemo}
          </Button>
        </div>
      </div>
    </section>
  )
}
