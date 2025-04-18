'use client'

import { AlertDialogDeleteEntity } from '@/components/alert-dialog-delete-entity'
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
import { cn, formatDuration } from '@/lib/utils'
import { GetTasksReturn } from '@/server/data/get-tasks'
import { Pencil } from 'lucide-react'
import { use } from 'react'
import { TasksTableContext } from '../_lib/tasks-table-context'
import { useDeleteTaskAction } from '../_lib/use-delete-task-action'
type Props = {
  tasks: (GetTasksReturn['data'][number] & {
    statusLabel: string
  })[]
}

export function TasksTable(props: Props) {
  const { tasks } = props
  const { common: commonDict, task: taskDict, time: timeDict } = useDictionary()
  const { isPending } = use(TasksTableContext)

  const { execute: executeDelete, optimisticState: optimisticTasks } =
    useDeleteTaskAction(tasks)

  if (optimisticTasks.length === 0) {
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
        {optimisticTasks.map(task => (
          <TableRow key={task.id}>
            <TableCell>{task.name}</TableCell>
            <TableCell className="max-w-[200px] truncate">
              {task.description}
            </TableCell>
            <TableCell>
              <TaskStatusSelector status={task.status} taskId={task.id} />
            </TableCell>
            <TableCell>
              {formatDuration(task.totalRuntime ?? 0, {
                hrs: timeDict.units.hour.shortPlural,
                mins: timeDict.units.minute.shortPlural
              })}
            </TableCell>
            <TableCell>{task.section}</TableCell>
            <TableCell>
              {task.dueDate ? new Date(task.dueDate).toDateString() : ''}
            </TableCell>
            <TableCell className="flex items-center justify-end gap-2">
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
              <AlertDialogDeleteEntity
                onConfirmAction={() => executeDelete({ taskId: task.id })}
                entity="task"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
