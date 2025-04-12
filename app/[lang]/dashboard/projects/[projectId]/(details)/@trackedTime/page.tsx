import {
  ChartHoursTracker,
  SEARCH_PARAM_KEY,
  settingsSchema
} from '@/components/chart-hours-tracker'
import type { SearchParams } from '@/lib/types'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { getChartDataHoursTracker } from '@/server/data/get-chart-data-hours-tracker'

type Params = { lang: Language; projectId: string }

export default async function TrackedTime(props: {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}) {
  const { lang, projectId } = await props.params
  const searchParams = await props.searchParams
  const { time: dict } = await getDictionary(lang)

  const settingsParamValue = String(searchParams[SEARCH_PARAM_KEY] || '')
  const settings = settingsSchema.parse(
    settingsParamValue ? JSON.parse(settingsParamValue) : null
  )

  const chartDataPromise = getChartDataHoursTracker({
    projectId: projectId,
    barStep: settings.barStep,
    timeRange: settings.timeRange
  })

  return (
    <ChartHoursTracker
      className="flex-1"
      title={dict.metrics.timeTracking}
      dataPromise={chartDataPromise}
    />
  )
}
