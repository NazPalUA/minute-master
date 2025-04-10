import { ROUTES } from '@/lib/constants'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { Sparkles } from 'lucide-react'
import { PricingPlan } from './pricing-plan'

export async function SectionPricing({ lang }: { lang: Language }) {
  const {
    public: {
      home: { pricing: dict }
    }
  } = await getDictionary(lang)

  return (
    <section id={ROUTES.HOME.PRICING.ID} className="relative px-4 py-24">
      <div className="mb-12 text-center">
        <div className="bg-primary/10 text-primary mb-4 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium backdrop-blur-sm">
          <Sparkles className="mr-2 h-4 w-4" /> {dict.badge}
        </div>
        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
          {dict.title}
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
          {dict.subtitle}
        </p>
      </div>

      <PricingPlan />
    </section>
  )
}
