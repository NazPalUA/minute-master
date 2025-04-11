import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { GetChartDataTimeDistributionReturn } from '@/server/data/get-chart-data-time-distribution'
import { Suspense } from 'react'
import { LoadingSpinner } from '../loading-spinner'
import { CardHeader } from './card-header'
import { Chart } from './chart'
import { ChartSettingsProvider } from './lib/chart-settings-context'

type Props = {
  title: string
  className?: string
  dataPromise: Promise<GetChartDataTimeDistributionReturn>
}

export async function ChartTimeDistribution({
  className,
  dataPromise,
  title
}: Props) {
  return (
    <ChartSettingsProvider>
      <Card className={cn('', className)}>
        <CardHeader title={title} />
        <CardContent className="h-full">
          <Suspense
            fallback={
              <LoadingSpinner containerClassName="h-[300px]" size="xl" />
            }
          >
            <Chart dataPromise={dataPromise} />
          </Suspense>
        </CardContent>
      </Card>
    </ChartSettingsProvider>
  )
}
