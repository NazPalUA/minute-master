import {
  AnalyticsCardProps,
  AnalyticsCards
} from '@/components/analytics-cards'
import { TASK_STATUSES } from '@/lib/constants/task-statuses'
import type { SearchParams } from '@/lib/types'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { countTasks } from '@/server/data/count-tasks'
import {
  CheckCircle2,
  ClipboardList,
  PauseCircle,
  PlayCircle,
  Timer
} from 'lucide-react'

type Params = { lang: Language; projectId: string }

export default async function Cards(props: {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}) {
  const { lang, projectId } = await props.params
  const { task: taskDict } = await getDictionary(lang)

  const analytics: AnalyticsCardProps[] = [
    {
      title: taskDict.metrics.total,
      dataPromise: countTasks({ projectId }).then(data => ({
        value: data.total.toString()
      })),
      icon: ClipboardList
    },
    {
      title: taskDict.metrics.inProgress,
      dataPromise: countTasks({ projectId }).then(data => ({
        value: data[TASK_STATUSES.IN_PROGRESS].toString()
      })),
      icon: PlayCircle
    },
    {
      title: taskDict.metrics.notStarted,
      dataPromise: countTasks({ projectId }).then(data => ({
        value: data[TASK_STATUSES.NOT_STARTED].toString()
      })),
      icon: Timer
    },
    {
      title: taskDict.metrics.onHold,
      dataPromise: countTasks({ projectId }).then(data => ({
        value: data[TASK_STATUSES.ON_HOLD].toString()
      })),
      icon: PauseCircle
    },
    {
      title: taskDict.metrics.completed,
      dataPromise: countTasks({ projectId }).then(data => ({
        value: data[TASK_STATUSES.COMPLETED].toString()
      })),
      icon: CheckCircle2
    }
  ]

  return (
    <AnalyticsCards
      analytics={analytics}
      className="md:grid-cols-3 lg:grid-cols-5"
    />
  )
}
