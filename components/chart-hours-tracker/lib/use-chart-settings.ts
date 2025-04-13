'use client'

import {
  type BarStep,
  type TimeRange,
  timeRangeStepConfig
} from '@/server/data/get-chart-data-hours-tracker/lib/consts'
import { createParser, useQueryState } from 'nuqs'
import { useTransition } from 'react'
import { SEARCH_PARAM_KEY } from './consts'
import { defaultSettings, settingsSchema } from './schemas'

export function useChartSettings() {
  const parseAsChartSettings = createParser({
    parse(value) {
      const settingsArr = JSON.parse(value)
      const { success, data: settings } = settingsSchema.safeParse(settingsArr)
      if (!success) return null
      return settings
    },
    serialize(value) {
      return JSON.stringify([value.timeRange, value.barStep])
    }
  })

  const [isPending, startTransition] = useTransition()
  const [{ timeRange, barStep }, setSettings] = useQueryState(
    SEARCH_PARAM_KEY,
    parseAsChartSettings.withDefault(defaultSettings).withOptions({
      shallow: false,
      startTransition
    })
  )

  function selectTimeRange(timeRange: TimeRange) {
    const { defaultStep, stepOptions } = timeRangeStepConfig[timeRange]

    setSettings(prev => ({
      timeRange,
      barStep: (stepOptions as BarStep[]).includes(prev.barStep)
        ? prev.barStep
        : defaultStep
    }))
  }

  function selectBarStep(barStep: BarStep) {
    setSettings(prev => ({
      ...prev,
      barStep
    }))
  }

  const { defaultStep, stepOptions } = timeRangeStepConfig[timeRange]

  return {
    timeRange,
    selectTimeRange,
    barStep,
    selectBarStep,
    barStepOptions: stepOptions,
    defaultBarStep: defaultStep,
    isPending
  }
}
