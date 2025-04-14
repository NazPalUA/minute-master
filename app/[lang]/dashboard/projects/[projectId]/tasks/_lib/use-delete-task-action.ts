'use client'

import { useDictionary } from '@/hooks/use-dictionary'
import { deleteTask } from '@/server/actions/delete-task'
import { GetTasksReturn } from '@/server/data/get-tasks'
import { useOptimisticAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'

export function useDeleteTaskAction(tasks: GetTasksReturn['data']) {
  const { task: taskDict } = useDictionary()

  return useOptimisticAction(deleteTask, {
    currentState: tasks,
    updateFn: (state, input) => {
      return state.filter(task => task.id !== input.taskId)
    },
    // onSuccess: () => {
    //   toast.success(taskDict.actions.delete.success)
    // },
    onError: () => {
      toast.error(taskDict.actions.delete.failure)
    }
    // onSettled: () => {
    //   router.refresh()
    // }
  })
}
