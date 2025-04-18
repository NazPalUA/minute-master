'use client'

import { ChartConfig } from '@/components/ui/chart'
import { formatDuration, getChartColorsArr } from '@/lib/utils'
import type { Dictionary } from '@/localization'
import { GetChartDataTimeDistributionReturn } from '@/server/data/get-chart-data-time-distribution'
import { ValueType } from 'recharts/types/component/DefaultTooltipContent'

type ChartDataItem = {
  name: string
  duration: number
  fill: string
}

export function prepareChartData(
  timeLogs: GetChartDataTimeDistributionReturn['timeLogs']
): ChartDataItem[] {
  return timeLogs.map(item => {
    const name = item.name.toLowerCase().replace(/\s+/g, '-')
    return {
      name,
      duration: item.duration,
      fill: `var(--color-${name})`
    }
  })
}

export function createChartConfig(
  title: string,
  chartData: ChartDataItem[]
): ChartConfig {
  const colors = getChartColorsArr(chartData.length)

  const config: ChartConfig = {
    duration: { label: title }
  }

  chartData.forEach((item, index) => {
    const key = item.name
    config[key] = {
      label: item.name,
      color: colors[index]
    }
  })

  return config
}

export function formatTooltipValue(
  duration: ValueType,
  dict: Dictionary['time']['units']
) {
  if (typeof duration !== 'number') return duration
  return formatDuration(duration, dict)
}
