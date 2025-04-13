import type { SearchParams } from '@/lib/types'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { CalendarClock, CheckCircle, Clock } from 'lucide-react'
import { ProgressMetric } from './_components/progress-metric'
import { getTaskCompletionData } from './_lib/get-task-completion-data'
import { getTimeTrackingData } from './_lib/get-time-tracking-data'
import { getTimelineData } from './_lib/get-timeline-data'

type Params = { lang: Language; projectId: string }

export default async function ProjectProgressPage(props: {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}) {
  const { lang, projectId } = await props.params
  const {
    project: {
      analytics: { progress }
    }
  } = await getDictionary(lang)

  const [taskCompletionData, timelineData, timeTrackingData] =
    await Promise.all([
      getTaskCompletionData(projectId),
      getTimelineData(projectId),
      getTimeTrackingData(projectId)
    ])

  return (
    <>
      <ProgressMetric
        icon={<CheckCircle className="h-4 w-4" />}
        title={progress.completedTasks}
        data={taskCompletionData}
      />
      <ProgressMetric
        icon={<CalendarClock className="h-4 w-4" />}
        title={progress.projectTimeline}
        data={timelineData}
      />
      <ProgressMetric
        icon={<Clock className="h-4 w-4" />}
        title={progress.timeTracking}
        data={timeTrackingData}
      />
    </>
  )
}
