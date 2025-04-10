import { ROUTES } from '@/lib/constants/routes'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { PricingPlanCard } from './pricing-plan-card'

export async function PricingSection({ lang }: { lang: Language }) {
  const {public: dict} = await getDictionary(lang)
  

  const plansArray = Object.entries(dict.home.pricing.plans).map(([key, plan]) => ({
    ...plan,
    planKey: key
  }))

  return (
    <section id={ROUTES.HOME.PRICING.ID} className="px-4 py-20">
      <div className="container mx-auto">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
          {dict.home.pricing.title}
        </h2>
        <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-8 md:grid-cols-3">
          {plansArray.map((plan, index) => (
            <PricingPlanCard 
              key={index} 
              plan={plan} 
              planKey={plan.planKey as 'basic' | 'pro' | 'enterprise'} 
              dict={dict.home.pricing} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}
