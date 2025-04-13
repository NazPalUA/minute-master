import { Dictionary } from '@/localization'
import {
  CheckCircle2,
  ClipboardList,
  PauseCircle,
  PlayCircle,
  Timer
} from 'lucide-react'

export function getAnalyticsFallback(dict: Dictionary) {
  const { task: taskDict } = dict

  return [
    {
      title: taskDict.metrics.total,
      icon: ClipboardList
    },
    {
      title: taskDict.metrics.inProgress,
      icon: PlayCircle
    },
    {
      title: taskDict.metrics.notStarted,
      icon: Timer
    },
    {
      title: taskDict.metrics.onHold,
      icon: PauseCircle
    },
    {
      title: taskDict.metrics.completed,
      icon: CheckCircle2
    }
  ]
}
