import { TaskDialog } from '@/components/task-dialog'
import { TaskStatusSelector } from '@/components/task-status-selector'
import { Button } from '@/components/ui/button'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { GetTasksReturn } from '@/server/data/get-tasks'
import { Calendar, Pencil } from 'lucide-react'

export async function ListCard({
  lang,
  task,
  index,
  length
}: {
  lang: Language
  task: GetTasksReturn['data'][number]
  index: number
  length: number
}) {
  const { common: dict, task: taskDict } = await getDictionary(lang)

  return (
    <div
      key={task.id}
      className={`flex items-center justify-between p-4 ${index !== length - 1 ? 'border-b' : ''}`}
    >
      <div>
        <p className="font-medium hover:underline">{task.name}</p>
        {task.description && (
          <p className="text-muted-foreground text-sm">{task.description}</p>
        )}
        <div className="text-muted-foreground mt-1 text-xs">
          <span className="font-medium">{task.project}</span>
          <span> &bull; {task.section}</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {task.dueDate && (
          <div className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            <span className="text-sm">{`${new Date(task.dueDate).toDateString()} ${new Date(task.dueDate).getHours().toString().padStart(2, '0')}:${new Date(task.dueDate).getMinutes().toString().padStart(2, '0')}`}</span>
          </div>
        )}
        <TaskStatusSelector status={task.status} taskId={task.id} />

        <Button variant="outline" size="sm">
          {dict.view.label}
        </Button>

        <TaskDialog
          updateTask={{
            projectId: task.projectId,
            projectName: task.project,
            sectionId: task.sectionId,
            sectionName: task.section,
            taskId: task.id,
            taskName: task.name,
            taskDescription: task.description,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            estimatedTime: task.estimatedTime
          }}
        >
          <Button variant="outline" size="sm">
            <span className="sr-only">{taskDict.actions.update.title}</span>
            <Pencil className="h-4 w-4" />
          </Button>
        </TaskDialog>
      </div>
    </div>
  )
}
