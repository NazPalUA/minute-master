import {
  AnalyticCardContainer,
  AnalyticCardContent
} from '@/components/analytics-card'
import type { SearchParams } from '@/lib/types'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { countTasks } from '@/server/data/count-tasks'
import { getAnalytics } from './_lib/get-analytics'
type Params = { lang: Language; projectId: string }

export default async function Cards(props: {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}) {
  const { lang, projectId } = await props.params
  const dict = await getDictionary(lang)

  const count = await countTasks({ projectId })

  const analytics = getAnalytics(dict, count)

  return analytics.map(data => {
    return (
      <AnalyticCardContainer
        key={data.title}
        Icon={data.icon}
        title={data.title}
      >
        <AnalyticCardContent data={{ value: data.data.toString() }} />
      </AnalyticCardContainer>
    )
  })
}
