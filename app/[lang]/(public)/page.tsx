import { Language } from '@/localization'
import {
  FeaturesSection,
  HeroSection,
  HowItWorksSection,
  PricingSection
} from './_components'

type Params = Promise<{ lang: Language }>

export default async function Home(props: { params: Params }) {
  const { lang } = await props.params

  return (
    <div className="flex flex-col gap-12">
      <HeroSection lang={lang} />
      <FeaturesSection lang={lang} />
      <HowItWorksSection lang={lang} />
      <PricingSection lang={lang} />
    </div>
  )
}
