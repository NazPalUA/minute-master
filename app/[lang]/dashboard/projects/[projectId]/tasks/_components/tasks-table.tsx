'use client'

import { NotFount } from '@/components/not-fount'
import { TaskDialog } from '@/components/task-dialog'
import { TaskStatusSelector } from '@/components/task-status-selector'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useDictionary } from '@/hooks'
import { cn } from '@/lib/utils/cn'
import { formatTimeDuration } from '@/lib/utils/format-time-duration'
import { GetTasksReturn } from '@/server/data/get-tasks'
import { Pencil } from 'lucide-react'
import { use } from 'react'
import { TasksTableContext } from '../_lib/tasks-table-context'

type Props = {
  tasks: (GetTasksReturn['data'][number] & {
    statusLabel: string
  })[]
}

export function TasksTable(props: Props) {
  const { tasks } = props
  const { common: commonDict, task: taskDict, time: timeDict } = useDictionary()
  const { isPending } = use(TasksTableContext)

  if (tasks.length === 0) {
    return (
      <NotFount
        title={taskDict.emptyState.title}
        description={taskDict.emptyState.description}
      />
    )
  }

  return (
    <Table className={cn({ 'opacity-30': isPending })}>
      <TableHeader>
        <TableRow>
          <TableHead>{taskDict.fields.name.label}</TableHead>
          <TableHead>{taskDict.fields.description.label}</TableHead>
          <TableHead>{taskDict.fields.status.label}</TableHead>
          <TableHead>{taskDict.fields.estimatedTime.label}</TableHead>
          <TableHead>{taskDict.fields.section.label}</TableHead>
          <TableHead>{taskDict.fields.dueDate.label}</TableHead>
          <TableHead>{commonDict.common.actions}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map(task => (
          <TableRow key={task.id}>
            <TableCell>{task.name}</TableCell>
            <TableCell className="max-w-[200px] truncate">
              {task.description}
            </TableCell>
            <TableCell>
              <TaskStatusSelector status={task.status} taskId={task.id} />
            </TableCell>
            <TableCell>
              {formatTimeDuration(task.totalRuntime ?? 0, {
                hrs: timeDict.units.hour.shortPlural,
                mins: timeDict.units.minute.shortPlural
              })}
            </TableCell>
            <TableCell>{task.section}</TableCell>
            <TableCell>
              {task.dueDate ? new Date(task.dueDate).toDateString() : ''}
            </TableCell>
            <TableCell>
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
                  <span className="sr-only">
                    {taskDict.actions.update.title}
                  </span>
                  <Pencil className="h-4 w-4" />
                </Button>
              </TaskDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
