import {
  ChartTimeDistribution,
  SEARCH_PARAM_KEY,
  timeRangesSchema
} from '@/components/chart-time-distribution'
import type { SearchParams } from '@/lib/types'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { getChartDataTimeDistribution } from '@/server/data/get-chart-data-time-distribution'

type Params = { lang: Language; projectId: string }

export default async function SectionsTimeDistribution(props: {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}) {
  const { lang, projectId } = await props.params
  const searchParams = await props.searchParams
  const { time: dict } = await getDictionary(lang)

  const timeRange = timeRangesSchema.parse(searchParams[SEARCH_PARAM_KEY])
  const dataPromise = getChartDataTimeDistribution({ projectId, timeRange })

  return (
    <ChartTimeDistribution
      className="flex-1"
      title={dict.metrics.timeDistribution}
      dataPromise={dataPromise}
    />
  )
}
