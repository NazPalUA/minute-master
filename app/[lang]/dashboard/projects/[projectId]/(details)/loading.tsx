'use client'

import { CardHeader as TrackerCardHeader } from '@/components/chart-hours-tracker/card-header'
import { CardHeader as TimeDistributionCardHeader } from '@/components/chart-time-distribution/card-header'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table } from '@/components/ui/table'
import { useDictionary } from '@/hooks'
import { CalendarClock, CheckCircle, Clock } from 'lucide-react'
import { ProgressMetricFallback } from './@progress/_components/progress-metric-fallback'
import { AddSectionButton } from './@sections/components/add-section-button'
import { SectionsTableBodyFallback } from './@sections/components/sections-table-body-fallback'
import { SectionsTableHeader } from './@sections/components/sections-table-header'

export default async function DetailsLayout() {
  const dict = useDictionary()
  const { time: timeDict, project: projectDict } = dict

  return (
    <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
      {/* timeDistribution */}
      <Card>
        <TimeDistributionCardHeader title={timeDict.metrics.timeDistribution} />
        <CardContent className="h-full">
          <LoadingSpinner containerClassName="h-[300px]" size="xl" />
        </CardContent>
      </Card>

      {/* {props.trackedTime} */}
      <Card>
        <TrackerCardHeader title={timeDict.metrics.timeTracking} />
        <CardContent className="h-full">
          <LoadingSpinner containerClassName="h-[300px]" size="xl" />
        </CardContent>
      </Card>

      {/* {props.progress} */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold">
            {projectDict.analytics.progress.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <ProgressMetricFallback
            icon={<CheckCircle className="h-4 w-4" />}
            title={projectDict.analytics.progress.completedTasks}
          />
          <ProgressMetricFallback
            icon={<CalendarClock className="h-4 w-4" />}
            title={projectDict.analytics.progress.projectTimeline}
          />
          <ProgressMetricFallback
            icon={<Clock className="h-4 w-4" />}
            title={projectDict.analytics.progress.timeTracking}
          />
        </CardContent>
      </Card>

      {/* {props.sections} */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>{dict.section.entity.plural}</CardTitle>
          <AddSectionButton>
            {dict.section.actions.create.trigger}
          </AddSectionButton>
        </CardHeader>
        <CardContent>
          <Table>
            <SectionsTableHeader dict={dict} />
            <SectionsTableBodyFallback />
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
