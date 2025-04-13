import {
  AnalyticCardContainer,
  AnalyticCardContent
} from '@/components/analytics-card'
import type { SearchParams } from '@/lib/types'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { getAnalytics } from './_lib/get-analytics'
type Params = { lang: Language }

export default async function Cards(props: {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}) {
  const { lang } = await props.params
  const dict = await getDictionary(lang)

  const analytics = getAnalytics(dict)

  return analytics.map(data => {
    return (
      <AnalyticCardContainer
        key={data.title}
        Icon={data.icon}
        title={data.title}
      >
        <AnalyticCardContent
          dataPromise={data.dataPromise}
          description={data.description}
        />
      </AnalyticCardContainer>
    )
  })
}
