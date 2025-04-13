import {
  ChartHoursTracker,
  SEARCH_PARAM_KEY,
  settingsSchema
} from '@/components/chart-hours-tracker'
import type { SearchParams } from '@/lib/types'
import { Language } from '@/localization'
import { getChartDataHoursTracker } from '@/server/data/get-chart-data-hours-tracker'

type Params = { lang: Language }

export default async function TrackedTime(props: {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}) {
  const searchParams = await props.searchParams

  const settingsParamValue = String(searchParams[SEARCH_PARAM_KEY] || '')
  const settings = settingsSchema.parse(
    settingsParamValue ? JSON.parse(settingsParamValue) : null
  )

  const chartDataPromise = getChartDataHoursTracker({
    barStep: settings.barStep,
    timeRange: settings.timeRange
  })

  return <ChartHoursTracker dataPromise={chartDataPromise} />
}
