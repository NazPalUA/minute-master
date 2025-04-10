import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { HowItWorksStep } from './how-it-works-step'

export async function HowItWorksSection({ lang }: { lang: Language }) {
  const dict = (await getDictionary(lang)).public

  return (
    <section className="bg-accent/70 px-4 py-20">
      <div className="container mx-auto">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
          {dict.home.howItWorks.title}
        </h2>
        <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
          {dict.home.howItWorks.steps.map((step, index) => (
            <HowItWorksStep key={index} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
