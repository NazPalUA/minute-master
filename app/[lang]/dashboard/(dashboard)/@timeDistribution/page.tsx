import {
  ChartTimeDistribution,
  SEARCH_PARAM_KEY,
  timeRangesSchema
} from '@/components/chart-time-distribution'
import type { SearchParams } from '@/lib/types'
import { Language } from '@/localization'
import { getChartDataTimeDistribution } from '@/server/data/get-chart-data-time-distribution'

type Params = { lang: Language }

export default async function ProjectsTimeDistribution(props: {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}) {
  const searchParams = await props.searchParams

  const timeRange = timeRangesSchema.parse(searchParams[SEARCH_PARAM_KEY])

  const dataPromise = getChartDataTimeDistribution({ timeRange })

  return <ChartTimeDistribution dataPromise={dataPromise} />
}
