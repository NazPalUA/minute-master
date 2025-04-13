import { TASK_STATUSES } from '@/lib/constants/task-statuses'
import { Dictionary } from '@/localization'
import { CountTasksReturn } from '@/server/data/count-tasks'
import {
  CheckCircle2,
  ClipboardList,
  PauseCircle,
  PlayCircle,
  Timer
} from 'lucide-react'

export function getAnalytics(dict: Dictionary, count: CountTasksReturn) {
  const { task: taskDict } = dict

  return [
    {
      title: taskDict.metrics.total,
      data: count.total,
      icon: ClipboardList
    },
    {
      title: taskDict.metrics.inProgress,
      data: count[TASK_STATUSES.IN_PROGRESS],
      icon: PlayCircle
    },
    {
      title: taskDict.metrics.notStarted,
      data: count[TASK_STATUSES.NOT_STARTED],
      icon: Timer
    },
    {
      title: taskDict.metrics.onHold,
      data: count[TASK_STATUSES.ON_HOLD],
      icon: PauseCircle
    },
    {
      title: taskDict.metrics.completed,
      data: count[TASK_STATUSES.COMPLETED],
      icon: CheckCircle2
    }
  ]
}
