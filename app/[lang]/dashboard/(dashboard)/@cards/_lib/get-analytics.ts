import { Dictionary } from '@/localization'
import { getMetricsTaskCompletion } from '@/server/data/get-metrics-task-completion'
import { getMetricsTimeTracking } from '@/server/data/get-metrics-time-tracking'
import { BarChart3, CheckCircle, Clock, Timer } from 'lucide-react'

const transformDuration = (duration: number) => {
  const hours = Math.floor(duration / (1000 * 60 * 60))
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${minutes}m`
}

export async function getAnalytics(dict: Dictionary) {
  const { time: timeDict, dashboard: dashboardDict } = dict

  const [
    metricsTimeTrackingMonth,
    metricsTimeTrackingWeek,
    metricsTaskCompletionMonth,
    metricsTaskCompletionWeek
  ] = await Promise.all([
    getMetricsTimeTracking({ period: 'month' })
      .then(data => {
        const value = data.value.total
        const change = data.change.total
        return { value, change }
      })
      .then(data => {
        const value = transformDuration(data.value)
        const change = transformDuration(data.change)
        return { value, change }
      }),
    getMetricsTimeTracking({ period: 'week' })
      .then(data => {
        const value = data.value.average
        const change = data.change.average
        return { value, change }
      })
      .then(data => {
        const value = transformDuration(data.value)
        const change = transformDuration(data.change)
        return { value, change }
      }),
    getMetricsTaskCompletion({ period: 'month' })
      .then(data => {
        const value = data.value.averageDuration
        const change = data.change.averageDuration
        return { value, change }
      })
      .then(data => {
        const value = transformDuration(data.value)
        const change = transformDuration(data.change)
        return { value, change }
      }),
    getMetricsTaskCompletion({ period: 'week' })
      .then(data => {
        const value = data.value.total
        const change = data.change.total
        return { value, change }
      })
      .then(data => {
        const value = String(data.value)
        const change = String(data.change)
        return { value, change }
      })
  ])
  return [
    {
      title: dashboardDict.cards.totalHoursThisMonth,
      data: metricsTimeTrackingMonth,
      description: timeDict.comparisons.fromLastMonth,
      icon: Clock
    },
    {
      title: dashboardDict.cards.avgDailyHours,
      data: metricsTimeTrackingWeek,
      description: timeDict.comparisons.fromLastWeek,
      icon: BarChart3
    },
    {
      title: dashboardDict.cards.avgTaskDuration,
      data: metricsTaskCompletionMonth,
      description: timeDict.comparisons.fromLastMonth,
      icon: Timer
    },
    {
      title: dashboardDict.cards.completedTasks,
      data: metricsTaskCompletionWeek,
      description: timeDict.comparisons.thisWeek,
      icon: CheckCircle
    }
  ]
}
