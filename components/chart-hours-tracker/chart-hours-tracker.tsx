import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { GetChartDataHoursTrackerReturn } from '@/server/data/get-chart-data-hours-tracker'
import { Suspense } from 'react'
import { LoadingSpinner } from '../loading-spinner'
import { CardHeader } from './card-header'
import { Chart } from './chart'
import { ChartSettingsProvider } from './lib/chart-settings-context'

type Props = {
  className?: string
  dataPromise: Promise<GetChartDataHoursTrackerReturn>
  title: string
}

export async function ChartHoursTracker({
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
