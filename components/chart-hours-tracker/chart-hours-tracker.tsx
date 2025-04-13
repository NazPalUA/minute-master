'use client'

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { useDictionary } from '@/hooks'
import { cn } from '@/lib/utils'
import { GetChartDataHoursTrackerReturn } from '@/server/data/get-chart-data-hours-tracker'
import { use } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { ChartNoDataFallback } from '../chart-no-data-fallback'
import { LoadingSpinner } from '../loading-spinner'
import { ChartSettingsContext } from './chart-hours-tracker-provider'
import {
  createChartConfig,
  formatTimeRangeLabel,
  formatTooltipValue,
  prepareChartData
} from './lib/utils'

type Props = {
  dataPromise: Promise<GetChartDataHoursTrackerReturn>
}

export function ChartHoursTracker({ dataPromise }: Props) {
  const data = use(dataPromise)
  const { time: dict, lang } = useDictionary()
  const { isPending } = use(ChartSettingsContext)

  if (!data.data.length) {
    return isPending ? (
      <LoadingSpinner containerClassName="h-[300px]" size="xl" />
    ) : (
      <ChartNoDataFallback />
    )
  }

  const uniqueNames = Array.from(
    new Set(
      data.data.flatMap(item =>
        item.analysisArray.map(analysis => analysis.name)
      )
    )
  )
    .sort()
    .map(name => name.toLowerCase().replace(/\s+/g, '-'))

  const chartData = prepareChartData(data.data)
  const chartConfig = createChartConfig(uniqueNames)

  const formatLabel = (value: string, variant: 'short' | 'long') =>
    formatTimeRangeLabel({
      value,
      lang,
      barStep: data.barStep,
      timeRange: data.timeRange,
      variant
    })

  return (
    <ChartContainer
      config={chartConfig}
      className={cn('mx-auto h-[300px] w-full', isPending && 'opacity-30')}
    >
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} horizontal={false} />
        <XAxis
          dataKey="dateLabel"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={value => formatLabel(value, 'short')}
        />

        {!isPending && (
          <ChartTooltip
            content={
              <ChartTooltipContent
                // hideLabel
                formatter={value => formatTooltipValue(value, dict.units)}
                labelFormatter={label => formatLabel(label, 'long')}
              />
            }
          />
        )}
        {uniqueNames.map(projectName => (
          <Bar
            key={projectName}
            dataKey={projectName.toLowerCase().replace(/\s+/g, '-')}
            stackId="a"
            fill={`var(--color-${projectName.toLowerCase().replace(/\s+/g, '-')})`}
          />
        ))}
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  )
}
