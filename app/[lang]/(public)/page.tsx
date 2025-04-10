import { Language } from '@/localization'
import {
  SectionFeatures,
  SectionHero,
  SectionHowItWorks,
  SectionPricing
} from './_components'

type Params = Promise<{ lang: Language }>

export default async function Home(props: { params: Params }) {
  const { lang } = await props.params

  return (
    <div className="flex flex-col gap-12">
      <SectionHero lang={lang} />
      <SectionFeatures lang={lang} />
      <SectionHowItWorks lang={lang} />
      <SectionPricing lang={lang} />
    </div>
  )
}
