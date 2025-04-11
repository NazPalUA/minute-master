import {
  defaultTimeRange,
  timeRanges
} from '@/server/data/get-chart-data-time-distribution/lib/consts'
import { parseAsStringLiteral, useQueryState } from 'nuqs'
import { useTransition } from 'react'
import { SEARCH_PARAM_KEY } from './consts'

export function useChartSettings() {
  const [isPending, startTransition] = useTransition()
  const [settings, setSettings] = useQueryState(
    SEARCH_PARAM_KEY,
    parseAsStringLiteral(timeRanges).withDefault(defaultTimeRange).withOptions({
      shallow: false,
      startTransition
    })
  )

  return {
    timeRange: settings,
    setTimeRange: setSettings,
    isPending
  }
}
