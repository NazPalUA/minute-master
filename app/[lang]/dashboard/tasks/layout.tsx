import { TaskDialog } from '@/components/task-dialog'
import { Button } from '@/components/ui/button'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { TasksTableProvider } from './_lib/tasks-table-context'

type Params = Promise<{ lang: Language }>

export default async function TasksLayout(props: {
  params: Params
  children: React.ReactNode
}) {
  const { lang } = await props.params
  const { task: taskDict } = await getDictionary(lang)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {taskDict.entity.plural}
        </h2>
        <TaskDialog>
          <Button>{taskDict.actions.create.title}</Button>
        </TaskDialog>
      </div>
      <TasksTableProvider>{props.children}</TasksTableProvider>
    </div>
  )
}
