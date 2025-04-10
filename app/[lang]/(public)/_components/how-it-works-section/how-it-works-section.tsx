import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { HowItWorksStep } from './how-it-works-step'

export async function HowItWorksSection({ lang }: { lang: Language }) {
  const { public: dict } = await getDictionary(lang)

  return (
    <section className="bg-muted/50 relative overflow-hidden px-4 py-24">
      <div className="bg-grid-white/5 absolute inset-0 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
      <div className="relative container mx-auto">
        <h2 className="mb-16 text-center text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          {dict.home.howItWorks.title}
        </h2>
        <div className="flex flex-col items-center justify-center gap-10 md:flex-row md:gap-6 lg:gap-10">
          {dict.home.howItWorks.steps.map((step, index) => (
            <HowItWorksStep key={index} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
