'use client'

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { useDictionary } from '@/hooks/use-dictionary'
import { cn } from '@/lib/utils'
import { GetChartDataTimeDistributionReturn } from '@/server/data/get-chart-data-time-distribution'
import { use } from 'react'
import { Label, Pie, PieChart } from 'recharts'
import { ChartNoDataFallback } from '../chart-no-data-fallback'
import { LoadingSpinner } from '../loading-spinner'
import { CenterLabel } from './center-label'
import { ChartSettingsContext } from './chart-time-distribution-provider'
import {
  createChartConfig,
  formatTooltipValue,
  prepareChartData
} from './lib/utils'

type Props = {
  dataPromise: Promise<GetChartDataTimeDistributionReturn>
  title?: string
}

export function ChartTimeDistribution({ dataPromise }: Props) {
  const { timeLogs, totalDuration } = use(dataPromise)
  const { time: dict } = useDictionary()

  const { isPending } = use(ChartSettingsContext)

  if (!timeLogs.length || !totalDuration) {
    return isPending ? (
      <LoadingSpinner containerClassName="h-[300px]" size="xl" />
    ) : (
      <ChartNoDataFallback />
    )
  }

  const chartData = prepareChartData(timeLogs)
  const chartConfig = createChartConfig(dict.common.totalTime, chartData)

  return (
    <ChartContainer
      config={chartConfig}
      className={cn('mx-auto h-[300px] w-full', isPending && 'opacity-30')}
    >
      <PieChart>
        <Pie
          data={chartData}
          dataKey="duration"
          nameKey="name"
          innerRadius={'60%'}
          outerRadius={'100%'}
        >
          <Label
            content={props => (
              <CenterLabel labelProps={props} durationMs={totalDuration} />
            )}
          />
        </Pie>
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelKey="name"
              formatter={value => formatTooltipValue(value, dict.units)}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
      </PieChart>
    </ChartContainer>
  )
}
