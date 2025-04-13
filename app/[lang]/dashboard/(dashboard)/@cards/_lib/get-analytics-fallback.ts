import { Dictionary } from '@/localization'
import { BarChart3, CheckCircle, Clock, Timer } from 'lucide-react'

export function getAnalyticsFallback(dict: Dictionary) {
  const { time: timeDict, dashboard: dashboardDict } = dict

  return [
    {
      title: dashboardDict.cards.totalHoursThisMonth,
      description: timeDict.comparisons.fromLastMonth,
      icon: Clock
    },
    {
      title: dashboardDict.cards.avgDailyHours,
      description: timeDict.comparisons.fromLastWeek,
      icon: BarChart3
    },
    {
      title: dashboardDict.cards.avgTaskDuration,
      description: timeDict.comparisons.fromLastMonth,
      icon: Timer
    },
    {
      title: dashboardDict.cards.completedTasks,
      description: timeDict.comparisons.thisWeek,
      icon: CheckCircle
    }
  ]
}
