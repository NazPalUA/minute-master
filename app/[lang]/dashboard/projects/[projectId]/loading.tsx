'use client'

import { LoadingSpinner } from '@/components/loading-spinner'
import { Selector } from '@/components/selector'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table } from '@/components/ui/table'
import { useDictionary } from '@/hooks'
import { CalendarClock, CheckCircle, Clock } from 'lucide-react'
import { ProgressMetricFallback } from './(details)/@progress/_components/progress-metric-fallback'
import { AddSectionButton } from './(details)/@sections/components/add-section-button'
import { SectionsTableBodyFallback } from './(details)/@sections/components/sections-table-body-fallback'
import { SectionsTableHeader } from './(details)/@sections/components/sections-table-header'

export default function Loading() {
  const dict = useDictionary()
  const { time: timeDict, project: projectDict } = dict

  return (
    <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
      {/* timeDistribution */}
      <Card>
        <CardHeader className="flex items-center justify-between space-y-0">
          <CardTitle className="text-xl font-semibold">
            {timeDict.metrics.timeDistribution}
          </CardTitle>
          <Selector
            placeholder={timeDict.metrics.timeDistribution}
            defaultValue={'loading'}
            value={'loading'}
            setValue={() => null}
            items={[]}
            isLoading={true}
          />
        </CardHeader>
        <CardContent className="h-full">
          <LoadingSpinner containerClassName="h-[300px]" size="xl" />
        </CardContent>
      </Card>

      {/* {props.trackedTime} */}
      <Card>
        <CardHeader className="flex items-center justify-between space-y-0">
          <CardTitle className="text-xl font-semibold">
            {timeDict.metrics.timeTracking}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Selector
              placeholder={timeDict.metrics.timeTracking}
              defaultValue={'loading'}
              value={'loading'}
              setValue={() => null}
              items={[]}
              isLoading={true}
            />
            <Selector
              placeholder={timeDict.metrics.timeTracking}
              defaultValue={'loading'}
              value={'loading'}
              setValue={() => null}
              items={[]}
              isLoading={true}
            />
          </div>
        </CardHeader>
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
