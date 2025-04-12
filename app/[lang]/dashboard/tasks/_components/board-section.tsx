import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TaskStatus } from '@/lib/constants/task-statuses'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { GetTasksReturn } from '@/server/data/get-tasks'
import { BoardCard } from './board-card'

export async function BoardSection({
  lang,
  status,
  tasks
}: {
  lang: Language
  status: TaskStatus
  tasks: GetTasksReturn['data']
}) {
  const { common: dict } = await getDictionary(lang)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.statuses[status]}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map(task => (
          <BoardCard key={task.id} lang={lang} task={task} />
        ))}
      </CardContent>
    </Card>
  )
}
