'use client'

import { StatusBadge } from '@/components/status-badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from '@/components/ui/select'
import { useDictionary } from '@/hooks'
import {
  type TaskStatus as TaskStatusType,
  taskStatuses
} from '@/lib/constants/task-statuses'
import { updateTaskStatus } from '@/server/actions/update-task-status'
import { ChevronDownIcon, Loader2 } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'

export function TaskStatusSelector({
  status,
  taskId
}: {
  status: TaskStatusType
  taskId: string
}) {
  const { task: taskDict, common: commonDict } = useDictionary()

  const { execute, isPending } = useAction(updateTaskStatus, {
    onSuccess: () => {
      toast.success(taskDict.actions.update.success)
    },
    onError: () => {
      toast.error(taskDict.actions.update.failure)
    }
  })

  const handleStatusChange = (newStatus: TaskStatusType) => {
    execute({
      query: {
        taskId
      },
      payload: {
        status: newStatus
      }
    })
  }

  return (
    <Select
      value={status}
      onValueChange={handleStatusChange}
      disabled={isPending}
    >
      <SelectTrigger
        showChevron={false}
        className="h-auto cursor-pointer border-none p-0 text-inherit hover:bg-inherit focus-visible:bg-inherit focus-visible:ring-0 data-[state=open]:bg-inherit dark:bg-inherit dark:hover:bg-inherit [&:not(:focus-visible)]:bg-inherit"
      >
        <StatusBadge
          status={status}
          dict={commonDict}
          className="flex items-center gap-2"
        >
          {commonDict.statuses[status]}
          {isPending ? (
            <Loader2 className="mt-1 size-4 animate-spin text-inherit opacity-50" />
          ) : (
            <ChevronDownIcon className="mt-1 size-4 text-inherit opacity-50" />
          )}
        </StatusBadge>
      </SelectTrigger>

      <SelectContent>
        {taskStatuses.map(statusOption => (
          <SelectItem key={statusOption} value={statusOption}>
            <StatusBadge status={statusOption} dict={commonDict} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
