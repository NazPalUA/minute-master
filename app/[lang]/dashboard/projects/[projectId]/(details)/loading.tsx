'use client'

import { useDictionary } from '@/hooks/use-dictionary'
import { CalendarClock, CheckCircle, Clock } from 'lucide-react'
import { ProgressMetricFallback } from './_components/progress-metric-fallback'

export default function Loading() {
  const {
    project: {
      analytics: { progress }
    }
  } = useDictionary()

  return (
    <>
      <ProgressMetricFallback
        icon={<CheckCircle className="h-4 w-4" />}
        title={progress.completedTasks}
      />
      <ProgressMetricFallback
        icon={<CalendarClock className="h-4 w-4" />}
        title={progress.projectTimeline}
      />
      <ProgressMetricFallback
        icon={<Clock className="h-4 w-4" />}
        title={progress.timeTracking}
      />
    </>
  )
}
