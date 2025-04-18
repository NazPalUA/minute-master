import { StatusBadge } from '@/components/status-badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { createDateFormatter, getProgress } from '@/lib/utils'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { countTotalRuntime } from '@/server/data/count-total-runtime'
import { getProjectInfo } from '@/server/data/get-project-info'
import { GetTasksReturn } from '@/server/data/get-tasks'
import { millisecondsToHours } from 'date-fns'
import { Calendar, Clock } from 'lucide-react'

export async function GridCard({
  lang,
  task
}: {
  lang: Language
  task: GetTasksReturn['data'][number]
}) {
  const {
    estimatedTime,
    status,
    name: taskName,
    description,
    dueDate,
    id,
    projectId,
    sectionId
  } = task

  const { name: projectName } = await getProjectInfo({
    projectId
  })

  const { common: dict } = await getDictionary(lang)

  const { total: totalRuntime } = await countTotalRuntime({
    taskId: id,
    sectionId: sectionId,
    projectId: projectId
  })

  const dateFormatter = createDateFormatter(lang)

  return (
    <Card className="relative flex h-full flex-col transition-shadow hover:shadow-md">
      <StatusBadge
        status={status}
        dict={dict}
        className="absolute top-2 right-2 px-2 py-1 text-xs"
      />
      <CardHeader>
        <CardTitle>{`${projectName} - ${taskName}`}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex flex-1 flex-col justify-end">
        <Progress
          value={getProgress(totalRuntime, estimatedTime)}
          className="mb-2 h-2"
        />
        <div className="text-muted-foreground flex justify-between text-sm">
          <span>
            {getProgress(totalRuntime, estimatedTime)}% {dict.status.completed}
          </span>
          <span>{millisecondsToHours(estimatedTime || 0)}</span>
        </div>
        <div className="text-muted-foreground mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            {dueDate && <span>{dateFormatter(new Date(dueDate))}</span>}
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span>{millisecondsToHours(totalRuntime)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
