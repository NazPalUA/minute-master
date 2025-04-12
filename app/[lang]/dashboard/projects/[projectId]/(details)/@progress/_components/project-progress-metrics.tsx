import { Dictionary } from '@/localization'
import { countTasks } from '@/server/data/count-tasks'
import { countTotalRuntime } from '@/server/data/count-total-runtime'
import { getProjectInfo } from '@/server/data/get-project-info'
import { CalendarClock, CheckCircle, Clock } from 'lucide-react'
import { Suspense } from 'react'
import { ProgressMetric } from './progress-metric'
import { ProgressMetricFallback } from './progress-metric-fallback'

type Props = {
  dict: Dictionary['project']
  projectId: string
}

export function ProjectProgressMetrics({ dict, projectId }: Props) {
  const progressDict = dict.analytics.progress

  // Task completion progress
  async function getTaskCompletionData() {
    const taskData = await countTasks({ projectId })

    // Don't show progress if there are no tasks
    if (taskData.total === 0) {
      return {
        value: 0,
        leftLabel: '0 / 0',
        rightLabel: '0%',
        message: 'No tasks created yet'
      }
    }

    const taskCompletionPercentage = (taskData.completed / taskData.total) * 100

    return {
      value: taskCompletionPercentage,
      leftLabel: `${taskData.completed} / ${taskData.total}`,
      rightLabel: `${Math.round(taskCompletionPercentage)}%`
    }
  }

  // Timeline progress
  async function getTimelineData() {
    const projectInfo = await getProjectInfo({ projectId })
    const { startDate, dueDate } = projectInfo

    // Handle missing dates
    if (!startDate && !dueDate) {
      return {
        value: 0,
        leftLabel: 'No start date',
        rightLabel: 'No due date',
        message: 'Missing timeline information'
      }
    }

    if (!startDate) {
      return {
        value: 0,
        leftLabel: 'No start date',
        rightLabel: dueDate ? new Date(dueDate).toLocaleDateString() : 'N/A',
        message: 'Missing start date'
      }
    }

    if (!dueDate) {
      return {
        value: 0,
        leftLabel: new Date(startDate).toLocaleDateString(),
        rightLabel: 'No due date',
        message: 'Missing due date'
      }
    }

    // Both dates are available
    const now = new Date().getTime()
    const start = new Date(startDate).getTime()
    const end = new Date(dueDate).getTime()

    // Calculate percentage of time elapsed
    const timelinePercentage = ((now - start) / (end - start)) * 100
    // Cap at 100%
    const cappedPercentage = Math.min(100, Math.max(0, timelinePercentage))

    // Add message if project is overdue
    const message = timelinePercentage > 100 ? 'Project is overdue' : undefined

    return {
      value: cappedPercentage,
      leftLabel: new Date(startDate).toLocaleDateString(),
      rightLabel: new Date(dueDate).toLocaleDateString(),
      message
    }
  }

  // Time tracking progress
  async function getTimeTrackingData() {
    const projectInfo = await getProjectInfo({ projectId })
    const estimatedTime = projectInfo.estimatedTime || 0
    const { total: actualTime } = await countTotalRuntime({ projectId })

    // Don't show progress if there's no estimated time or no actual time tracked
    if (estimatedTime <= 0 && actualTime <= 0) {
      return {
        value: 0,
        leftLabel: '0h',
        rightLabel: 'No estimate',
        message: 'No time data available'
      }
    }

    if (estimatedTime <= 0) {
      return {
        value: 0,
        leftLabel:
          actualTime > 0
            ? `${Math.round(actualTime / (1000 * 60 * 60))}h`
            : '0h',
        rightLabel: 'No estimate',
        message: 'Missing time estimate'
      }
    }

    if (actualTime <= 0) {
      return {
        value: 0,
        leftLabel: '0h',
        rightLabel: `${Math.round(estimatedTime / (1000 * 60 * 60))}h`,
        message: 'No time tracked yet'
      }
    }

    const timeTrackingPercentage = (actualTime / estimatedTime) * 100

    // Add message if time tracking exceeds estimate
    const message =
      timeTrackingPercentage > 100 ? 'Exceeds estimated time' : undefined

    return {
      value: timeTrackingPercentage,
      leftLabel: `${Math.round(actualTime / (1000 * 60 * 60))}h`,
      rightLabel: `${Math.round(estimatedTime / (1000 * 60 * 60))}h`,
      message
    }
  }

  return (
    <>
      <Suspense
        fallback={
          <ProgressMetricFallback
            icon={<CheckCircle className="h-4 w-4" />}
            title={progressDict.completedTasks}
          />
        }
      >
        <ProgressMetric
          icon={<CheckCircle className="h-4 w-4" />}
          title={progressDict.completedTasks}
          dataPromise={getTaskCompletionData()}
        />
      </Suspense>
      <Suspense
        fallback={
          <ProgressMetricFallback
            icon={<CalendarClock className="h-4 w-4" />}
            title={progressDict.projectTimeline}
          />
        }
      >
        <ProgressMetric
          icon={<CalendarClock className="h-4 w-4" />}
          title={progressDict.projectTimeline}
          dataPromise={getTimelineData()}
        />
      </Suspense>
      <Suspense
        fallback={
          <ProgressMetricFallback
            icon={<Clock className="h-4 w-4" />}
            title={progressDict.timeTracking}
          />
        }
      >
        <ProgressMetric
          icon={<Clock className="h-4 w-4" />}
          title={progressDict.timeTracking}
          dataPromise={getTimeTrackingData()}
        />
      </Suspense>
    </>
  )
}
