import { ROUTES } from '@/lib/constants'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { Sparkles } from 'lucide-react'
import { PricingPlan } from './pricing-plan'

export async function PricingSection({ lang }: { lang: Language }) {
  const { public: dict } = await getDictionary(lang)

  return (
    <section id={ROUTES.HOME.PRICING.ID} className="relative mx-auto max-w-5xl">
      <div className="mb-12 text-center">
        <div className="bg-primary/10 text-primary mb-4 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium backdrop-blur-sm">
          <Sparkles className="mr-2 h-4 w-4" /> {dict.home.pricing.badge}
        </div>
        <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          {dict.home.pricing.title}
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
          {dict.home.pricing.subtitle}
        </p>
      </div>

      <PricingPlan />
    </section>
  )
}
