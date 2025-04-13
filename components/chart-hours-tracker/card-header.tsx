'use client'

import { CardHeader as CardHeaderUI, CardTitle } from '@/components/ui/card'
import { useDictionary } from '@/hooks'
import { timeRanges } from '@/server/data/get-chart-data-hours-tracker/lib/consts'
import { use } from 'react'
import { Selector } from '../selector'
import { ChartSettingsContext } from './chart-hours-tracker-provider'
import { defaultSettings } from './lib/schemas'

type Props = {
  title: string
}

export function CardHeader({ title }: Props) {
  const { time: dict } = useDictionary()

  const {
    timeRange,
    selectTimeRange,
    barStep,
    selectBarStep,
    barStepOptions,
    defaultBarStep,
    isPending
  } = use(ChartSettingsContext)

  return (
    <CardHeaderUI className="flex items-center justify-between space-y-0">
      <CardTitle>{title}</CardTitle>

      <div className="flex items-center space-x-2">
        <Selector
          placeholder="Select bar step"
          value={barStep}
          setValue={selectBarStep}
          defaultValue={defaultBarStep}
          items={barStepOptions.map(range => ({
            label: dict.units[range].singular,
            value: range
          }))}
          isLoading={isPending}
        />

        <Selector
          placeholder="Select time range"
          value={timeRange}
          setValue={selectTimeRange}
          defaultValue={defaultSettings.timeRange}
          items={timeRanges.map(range => ({
            label: dict.periods[range],
            value: range
          }))}
          isLoading={isPending}
        />
      </div>
    </CardHeaderUI>
  )
}
