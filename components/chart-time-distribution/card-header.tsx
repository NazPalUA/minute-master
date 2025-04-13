'use client'

import { CardHeader as CardHeaderUI, CardTitle } from '@/components/ui/card'
import { useDictionary } from '@/hooks'
import {
  defaultTimeRange,
  timeRanges
} from '@/server/data/get-chart-data-time-distribution/lib/consts'
import { use } from 'react'
import { Selector } from '../selector'
import { ChartSettingsContext } from './chart-time-distribution-provider'

type Props = {
  title: string
}

export function CardHeader({ title }: Props) {
  const { time: dict } = useDictionary()
  const { timeRange, setTimeRange, isPending } = use(ChartSettingsContext)

  return (
    <CardHeaderUI className="flex items-center justify-between space-y-0">
      <CardTitle>{title}</CardTitle>

      <Selector
        placeholder={dict.actions.selectTimeRange}
        defaultValue={defaultTimeRange}
        value={timeRange}
        setValue={setTimeRange}
        items={timeRanges.map(range => ({
          label: dict.periods[range],
          value: range
        }))}
        isLoading={isPending}
      />
    </CardHeaderUI>
  )
}
